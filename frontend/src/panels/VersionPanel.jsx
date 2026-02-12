import React from 'react';

export function VersionPanel({ versions, currentVersionId, onRestore }) {
    return (
        <div className="w-full bg-[#1e1e1e] border-t border-gray-800 flex items-center px-4 py-2 overflow-x-auto gap-4 custom-scrollbar">
            <span className="text-xs font-semibold text-gray-500 uppercase shrink-0">History</span>
            {versions.map((v, i) => (
                <button
                    key={v.id}
                    onClick={() => onRestore(v.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${currentVersionId === v.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        }`}
                >
                    <span className="font-mono opacity-50">v{i + 1}</span>
                    <span>{v.timestamp}</span>
                </button>
            ))}
        </div>
    );
}
