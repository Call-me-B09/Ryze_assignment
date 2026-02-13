import React, { useState } from 'react';
import { ChatPanel } from './panels/ChatPanel';
import { CodePanel } from './panels/CodePanel';
import { PreviewPanel } from './panels/PreviewPanel';
import { VersionPanel } from './panels/VersionPanel';
// import { mockGenerate } from './mock/mockAgent';

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm your AI UI Architect. Describe the interface you want to build, and I'll generate the React code for you." }
  ]);
  const [code, setCode] = useState("");
  const [versions, setVersions] = useState([]);
  const [currentVersionId, setCurrentVersionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Panel State
  const [panels, setPanels] = useState({
    chat: { visible: true, width: 30 },
    code: { visible: true, width: 35 },
    preview: { visible: true, width: 35 }
  });

  const containerRef = React.useRef(null);
  const resizingRef = React.useRef(null);

  // Load versions on mount
  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/versions`)
      .then(res => res.json())
      .then(data => {
        const formattedVersions = data.map(v => ({
          id: v._id,
          version: v.version,
          timestamp: new Date(v.createdAt).toLocaleTimeString(),
          code: v.code,
          messages: [{ role: 'user', content: v.prompt }, { role: 'ai', content: v.explanation }], // Reconstruct chat history roughly
          description: v.prompt
        }));
        setVersions(formattedVersions);
        // Do not auto-load the latest version code/messages
        // if (formattedVersions.length > 0) {
        //   const lastVersion = formattedVersions[formattedVersions.length - 1];
        //   setCurrentVersionId(lastVersion.id);
        //   setCode(lastVersion.code);
        //   setMessages(prev => [...prev, ...lastVersion.messages]);
        // }
      })
      .catch(err => console.error("Failed to load versions:", err));
  }, []);

  const handleSendMessage = async (prompt) => {
    // Add user message
    const userMsg = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          parentVersion: currentVersionId ? versions.find(v => v.id === currentVersionId)?.version : null
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();

      // Update state
      const newCode = data.code;
      const aiMsg = { role: 'ai', content: data.explanation };

      setCode(newCode);
      setMessages(prev => [...prev, aiMsg]);

      // Save version
      const newVersion = {
        id: data._id, // Use MongoDB ID
        version: data.version,
        timestamp: new Date(data.createdAt).toLocaleTimeString(),
        code: newCode,
        messages: [...messages, userMsg, aiMsg],
        description: prompt,
        parentVersionId: data.parentVersion // Store parent version for branching UI?
      };

      setVersions(prev => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);

    } catch (error) {
      console.error("Error generating UI:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error generating the UI. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRestoreVersion = (versionId) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setCode(version.code);
      setMessages(version.messages);
      setCurrentVersionId(versionId);
    }
  };

  // Resize Logic
  const startResize = (e, leftPanelKey, rightPanelKey) => {
    e.preventDefault();
    resizingRef.current = {
      startX: e.clientX,
      leftKey: leftPanelKey,
      rightKey: rightPanelKey,
      startLeftWidth: panels[leftPanelKey].width,
      startRightWidth: panels[rightPanelKey].width
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!resizingRef.current || !containerRef.current) return;

    const { startX, leftKey, rightKey, startLeftWidth, startRightWidth } = resizingRef.current;

    const containerWidth = containerRef.current.clientWidth;
    const deltaPixels = e.clientX - startX;
    const deltaPercent = (deltaPixels / containerWidth) * 100;

    // Calculate new widths
    let newLeftWidth = startLeftWidth + deltaPercent;
    let newRightWidth = startRightWidth - deltaPercent;

    // Min width constraints (e.g., 10%)
    if (newLeftWidth < 10) {
      newLeftWidth = 10;
      newRightWidth = startLeftWidth + startRightWidth - 10;
    }
    if (newRightWidth < 10) {
      newRightWidth = 10;
      newLeftWidth = startLeftWidth + startRightWidth - 10;
    }

    setPanels(prev => ({
      ...prev,
      [leftKey]: { ...prev[leftKey], width: newLeftWidth },
      [rightKey]: { ...prev[rightKey], width: newRightWidth }
    }));
  };

  const stopResize = () => {
    resizingRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  const togglePanel = (key) => {
    setPanels(prev => {
      const isVisible = prev[key].visible;
      const otherKeys = Object.keys(prev).filter(k => k !== key && prev[k].visible);

      // Don't hide the last visible panel
      if (isVisible && otherKeys.length === 0) return prev;

      if (!isVisible) {
        // Show panel: take space from others
        const share = prev[key].width > 0 ? prev[key].width : 20; // Default restore width
        const totalVisWidth = otherKeys.reduce((sum, k) => sum + prev[k].width, 0);

        const newPanels = { ...prev };
        newPanels[key] = { ...prev[key], visible: true, width: share };

        const currentTotal = totalVisWidth + share;
        const scale = 100 / currentTotal;

        // Apply scale to ALL visible panels including the new one
        [...otherKeys, key].forEach(k => {
          newPanels[k].width = newPanels[k].width * scale;
        });

        return newPanels;
      } else {
        // Hide panel: distribute space to others
        const widthToDistribute = prev[key].width;
        const totalVisWidth = otherKeys.reduce((sum, k) => sum + prev[k].width, 0);

        const newPanels = { ...prev };
        newPanels[key] = { ...prev[key], visible: false };

        otherKeys.forEach(k => {
          const ratio = prev[k].width / totalVisWidth;
          newPanels[k] = { ...prev[k], width: prev[k].width + widthToDistribute * ratio }; // Add proportional share
        });

        return newPanels;
      }
    });
  };

  const handleNewProject = async () => {
    if (window.confirm("Are you sure? This will delete all history and start a new project.")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/generations`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to delete history on backend");

        setVersions([]);
        setCurrentVersionId(null);
        setCode("");
        setMessages([{ role: 'ai', content: "Hi! I'm your AI UI Architect. Describe the interface you want to build, and I'll generate the React code for you." }]);
      } catch (error) {
        console.error("Failed to clear history:", error);
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-14 border-b border-zinc-800 flex items-center px-4 justify-between bg-zinc-950/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">AI</div>
          <h1 className="font-semibold tracking-tight text-sm text-zinc-200">Ryze UI Generator</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50">
            <button
              onClick={() => togglePanel('chat')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${panels.chat.visible ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
              Chat
            </button>
            <button
              onClick={() => togglePanel('code')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${panels.code.visible ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
              Code
            </button>
            <button
              onClick={() => togglePanel('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${panels.preview.visible ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={handleNewProject}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-xs font-medium border border-red-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            New Project
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main ref={containerRef} className="flex-1 flex overflow-hidden w-full relative">

        {panels.chat.visible && (
          <div style={{ width: `${panels.chat.width}%` }} className="flex flex-col h-full min-w-[200px] z-10 shadow-xl relative group">
            <ChatPanel messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} />
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <button onClick={() => togglePanel('chat')} className="bg-black/50 hover:bg-red-500/80 text-white rounded-md p-1 backdrop-blur-sm transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        )}

        {/* Resizer Chat-Code (only if chat is visible AND (code OR preview is visible)) */}
        {panels.chat.visible && (panels.code.visible || panels.preview.visible) && (
          <div
            className="w-1 bg-gray-900 hover:bg-blue-500 cursor-col-resize z-20 transition-colors flex items-center justify-center group"
            onMouseDown={(e) => startResize(e, 'chat', panels.code.visible ? 'code' : 'preview')}
          >
            <div className="h-8 w-0.5 bg-gray-700 group-hover:bg-blue-200 rounded-full"></div>
          </div>
        )}

        {panels.code.visible && (
          <div style={{ width: `${panels.code.width}%` }} className="flex flex-col h-full min-w-[200px] border-r border-gray-800 z-0 relative group">
            <CodePanel code={code} onChange={(newCode) => setCode(newCode)} />
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <button onClick={() => togglePanel('code')} className="bg-black/50 hover:bg-red-500/80 text-white rounded-md p-1 backdrop-blur-sm transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        )}

        {/* Resizer Code-Preview (only if code is visible AND preview is visible) */}
        {panels.code.visible && panels.preview.visible && (
          <div
            className="w-1 bg-gray-900 hover:bg-blue-500 cursor-col-resize z-20 transition-colors flex items-center justify-center group"
            onMouseDown={(e) => startResize(e, 'code', 'preview')}
          >
            <div className="h-8 w-0.5 bg-gray-700 group-hover:bg-blue-200 rounded-full"></div>
          </div>
        )}

        {panels.preview.visible && (
          <div style={{ width: `${panels.preview.width}%` }} className="flex flex-col h-full min-w-[200px] bg-white text-gray-900 overflow-hidden relative group">
            <PreviewPanel code={code} />
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <button onClick={() => togglePanel('preview')} className="bg-gray-200/50 hover:bg-red-500/80 text-gray-900 hover:text-white rounded-md p-1 backdrop-blur-sm transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer: Versions */}
      <footer className="h-40 border-t border-zinc-800 bg-zinc-950 z-20">
        <VersionPanel
          versions={versions.map(v => ({
            ...v,
            timestamp: v.createdAt ? v.createdAt.toLocaleTimeString() : (v.timestamp || "Just now")
          }))}
          currentVersionId={currentVersionId}
          onRestore={handleRestoreVersion}
        />
      </footer>
    </div>
  );
}

export default App;
