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

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-gray-800 flex items-center px-6 justify-between bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white">AI</div>
          <h1 className="font-semibold tracking-tight">UI Generator</h1>
        </div>
        <div className="text-xs text-gray-500 font-mono">Mock Mode</div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="w-[30%] min-w-[300px] flex flex-col h-full z-10 shadow-xl">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>

        {/* Middle: Code */}
        <div className="w-[35%] flex flex-col h-full border-r border-gray-800 z-0">
          <CodePanel code={code} onChange={setCode} />
        </div>

        {/* Right: Preview */}
        <div className="w-[35%] flex flex-col h-full bg-white text-gray-900 overflow-hidden">
          <PreviewPanel code={code} />
        </div>
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
