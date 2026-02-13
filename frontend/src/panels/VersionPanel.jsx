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
        <div className="w-full h-full bg-zinc-950 border-t border-zinc-800 flex flex-col">
            <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-950 flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    Execution History
                </span>
                <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                    {versions.length} versions
                </span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-x-auto flex items-center px-4 gap-6 custom-scrollbar pb-2 pt-2 bg-gradient-to-b from-zinc-950 to-zinc-900/50"
            >
                {versions.map((v, i) => {
                    const isCurrent = currentVersionId === v.id;
                    const isBranched = v.parentVersionId && v.parentVersionId !== (versions[i - 1]?.id);

                    return (
                        <div key={v.id} className="relative group shrink-0">
                            {/* Connector Line */}
                            {i > 0 && (
                                <div className={`absolute top-1/2 -left-6 w-6 h-[1px] ${isCurrent ? 'bg-indigo-900/50' : 'bg-zinc-800'}`}></div>
                            )}

                            {/* Branch Indicator (if applicable) */}
                            {isBranched && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 whitespace-nowrap opacity-75">
                                    Branched v{versions.findIndex(ver => ver.id === v.parentVersionId) + 1}
                                </div>
                            )}

                            <button
                                onClick={() => onRestore(v.id)}
                                className={`
                                    relative w-40 p-2.5 rounded-xl border text-left transition-all duration-300
                                    flex flex-col gap-1.5 group-hover:-translate-y-1
                                    ${isCurrent
                                        ? 'bg-indigo-950/20 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20'
                                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-950/50'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${isCurrent ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                                        v{i + 1}
                                    </span>
                                    <span className="text-[9px] text-zinc-600">{v.timestamp}</span>
                                </div>

                                <p className="text-[10px] text-zinc-400 font-medium truncate w-full" title={v.description || "No description"}>
                                    {v.description || "System Update"}
                                </p>

                                {isCurrent && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,1)]"></div>
                                )}
                            </button>
                        </div>
                    );
                })}

                {versions.length === 0 && (
                    <div className="text-zinc-600 text-xs italic px-4 flex items-center gap-2 opacity-50">
                        <span>Waiting for input...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
