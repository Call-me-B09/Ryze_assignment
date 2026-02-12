import React, { useState } from 'react';
import { ChatPanel } from './panels/ChatPanel';
import { CodePanel } from './panels/CodePanel';
import { PreviewPanel } from './panels/PreviewPanel';
import { VersionPanel } from './panels/VersionPanel';
import { mockGenerate } from './mock/mockAgent';

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

  const handleSendMessage = async (prompt) => {
    // Add user message
    const userMsg = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate network delay
    setTimeout(() => {
      const response = mockGenerate(prompt);

      // Update state
      const newCode = response.code;
      const aiMsg = { role: 'ai', content: response.explanation };

      setCode(newCode);
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      // Save version
      const newVersion = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        code: newCode,
        messages: [...messages, userMsg, aiMsg],
        description: prompt
      };

      setVersions(prev => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);
    }, 1500);
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

    // Ensure we are operating with updated values if needed, but refs/state sync is tricky here.
    // We rely on startLeftWidth captured at mouse down + delta.

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

        // If totalVisWidth is 0 (shouldn't happen if we strictly maintain widths), handle it
        // Or simplified: just normalize everything after insertion

        // Simpler approach: give it 'share', scale others down
        // If others sum to 100, and we add 20, we need to normalize (others become 80).
        // scale = (100 - share) / 100 (if total was 100)

        // Actually, we should just normalize everything to 100% at the end.

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

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-gray-800 flex items-center px-6 justify-between bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white">AI</div>
          <h1 className="font-semibold tracking-tight">UI Generator</h1>
        </div>

        <div className="flex gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => togglePanel('chat')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${panels.chat.visible ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            Chat
          </button>
          <button
            onClick={() => togglePanel('code')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${panels.code.visible ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            Code
          </button>
          <button
            onClick={() => togglePanel('preview')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${panels.preview.visible ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            Preview
          </button>
        </div>

        <div className="text-xs text-gray-500 font-mono">Mock Mode</div>
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
            <CodePanel code={code} onChange={setCode} />
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
      <footer className="h-12 border-t border-gray-800 bg-gray-950 z-20">
        <VersionPanel
          versions={versions}
          currentVersionId={currentVersionId}
          onRestore={handleRestoreVersion}
        />
      </footer>
    </div>
  );
}

export default App;
