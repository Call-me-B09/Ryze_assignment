import React, { useMemo } from 'react';
import * as UI from '../components/ui';
import * as Babel from '@babel/standalone';

const LiveRenderer = ({ code }) => {
    const Component = useMemo(() => {
        if (!code) return null;

        try {
            // 1. Transform JSX to JS using Babel
            const transformedCode = Babel.transform(code, {
                presets: ['react'],
                filename: 'preview.jsx',
            }).code;

            // 2. Prepare scope
            const scope = { ...UI, React };
            const scopeKeys = Object.keys(scope);
            const scopeValues = Object.values(scope);

            // 3. Wrap in a function that returns the component
            // Note: Babel transform adds "use strict"; and often converts to 
            // strict mode code. We need to handle the return statement.

            // A simple way is to wrap the original code in a function component structure
            // before transforming, OR handle the transformed output.

            // Let's try wrapping the raw code in a functional component string first
            // This is safer because Babel handles the return logic naturally
            const wrappedCode = `
        const GeneratedComponent = () => {
           return (
             <>
               ${code}
             </>
           );
        };
      `;

            const transformedWrapped = Babel.transform(wrappedCode, {
                presets: ['react'],
                filename: 'preview.jsx',
            }).code;

            // 4. Execute
            const finalCode = `${transformedWrapped}; return GeneratedComponent;`;
            const func = new Function(...scopeKeys, finalCode);
            const GeneratedComponent = func(...scopeValues);

            return GeneratedComponent;

        } catch (err) {
            console.error("Preview Error:", err);
            return () => (
                <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-bold">Preview Error</h3>
                    <p className="text-sm font-mono mt-2 whitespace-pre-wrap">{err.message}</p>
                </div>
            );
        }
    }, [code]);

    return Component ? <Component /> : null;
};

export function PreviewPanel({ code }) {
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Live Preview</h2>
                <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    Connected
                </div>
            </div>
            <div className="flex-1 overflow-auto p-8 bg-gray-100 checkerboard-bg relative">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                <div className="relative z-10">
                    {code ? <LiveRenderer code={code} /> : (
                        <div className="flex items-center justify-center h-full text-gray-400 mt-20">
                            <p>Generate some UI to see a preview</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
