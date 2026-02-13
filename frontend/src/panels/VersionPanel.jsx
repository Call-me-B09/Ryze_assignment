import React, { useEffect, useRef } from 'react';

export function VersionPanel({ versions, currentVersionId, onRestore }) {
    const scrollRef = useRef(null);

    // Auto-scroll to latest version on change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [versions.length]);

    return (
        <div className="w-full h-full bg-[#1e1e1e] border-t border-gray-800 flex flex-col">
            <div className="px-4 py-2 border-b border-gray-800 bg-black/20 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Version History</span>
                <span className="text-[10px] text-gray-600">Click a card to restore</span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-x-auto flex items-center px-4 gap-6 custom-scrollbar pb-2"
            >
                {versions.map((v, i) => {
                    const isCurrent = currentVersionId === v.id;
                    const isBranched = v.parentVersionId && v.parentVersionId !== (versions[i - 1]?.id);

                    return (
                        <div key={v.id} className="relative group shrink-0">
                            {/* Connector Line */}
                            {i > 0 && (
                                <div className={`absolute top-1/2 -left-6 w-6 h-0.5 ${isCurrent ? 'bg-blue-900/50' : 'bg-gray-800'}`}></div>
                            )}

                            {/* Branch Indicator (if applicable) */}
                            {isBranched && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 bg-gray-900 px-1 rounded border border-gray-800 whitespace-nowrap">
                                    Branched from v{versions.findIndex(ver => ver.id === v.parentVersionId) + 1}
                                </div>
                            )}

                            <button
                                onClick={() => onRestore(v.id)}
                                className={`
                                    relative w-48 p-3 rounded-xl border text-left transition-all duration-200
                                    flex flex-col gap-1
                                    ${isCurrent
                                        ? 'bg-blue-950/30 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${isCurrent ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-500'}`}>
                                        v{i + 1}
                                    </span>
                                    <span className="text-[10px] text-gray-600">{v.timestamp}</span>
                                </div>

                                <p className="text-xs text-gray-300 font-medium truncate w-full mt-1" title={v.description || "No description"}>
                                    {v.description || "System Update"}
                                </p>

                                {isCurrent && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,1)]"></div>
                                )}
                            </button>
                        </div>
                    );
                })}

                {versions.length === 0 && (
                    <div className="text-gray-600 text-sm italic px-4">Start generating to see versions...</div>
                )}
            </div>
        </div>
    );
}
