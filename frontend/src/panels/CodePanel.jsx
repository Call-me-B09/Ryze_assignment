import React from 'react';

export function CodePanel({ code, onChange }) {
    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1e1e1e]">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Generated Code</h2>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
            </div>
            <div className="flex-1 overflow-auto relative">
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none text-blue-300 leading-relaxed"
                    spellCheck="false"
                />
            </div>
        </div>
    );
}
