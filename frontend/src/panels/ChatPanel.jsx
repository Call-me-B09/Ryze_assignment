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
        <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Chat</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[90%] rounded-lg p-3 ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-200'
                            }`}>
                            <p className="text-sm border-b border-gray-100/10 pb-1 mb-1 font-bold text-xs opacity-75">
                                {msg.role === 'user' ? 'YOU' : 'AI'}
                            </p>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-start">
                        <div className="bg-gray-800 rounded-lg p-3">
                            <span className="animate-pulse text-gray-400 text-sm">AI is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-gray-900">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your UI..."
                        className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
