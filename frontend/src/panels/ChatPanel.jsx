import React, { useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';

export function ChatPanel({ messages, onSendMessage, isTyping }) {
    const [input, setInput] = React.useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Architect Chat
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div
                            className={`max-w-[90%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700/50'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1.5 opacity-70">
                                {msg.role === 'user' ? (
                                    <span className="text-[10px] font-bold tracking-wide uppercase">You</span>
                                ) : (
                                    <>
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">AI</div>
                                        <span className="text-[10px] font-bold tracking-wide uppercase">Architect</span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-start animate-pulse">
                        <div className="bg-zinc-800/50 rounded-2xl p-4 rounded-bl-none border border-zinc-800">
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your interface..."
                        className="w-full bg-zinc-950 text-zinc-100 rounded-xl pl-4 pr-12 py-3.5 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-zinc-600 text-sm transition-all shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-0 disabled:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
                <p className="text-[10px] text-zinc-600 text-center mt-2">
                    AI generated content may be inaccurate.
                </p>
            </form>
        </div>
    );
}
