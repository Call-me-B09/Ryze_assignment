import React, { useMemo } from 'react';
import * as UI from '../components/ui';
import * as Babel from '@babel/standalone';
import * as Lucide from 'lucide-react';

const LiveRenderer = ({ code }) => {
    const Component = useMemo(() => {
        if (!code) return null;

        try {
            // 1. Prepare Scope (Includes React, UI Components, and Lucide Icons)
            const scope = {
                ...UI,
                ...Lucide,
                React,
                useState: React.useState,
                useEffect: React.useEffect,
                useContext: React.useContext,
                useReducer: React.useReducer,
                useCallback: React.useCallback,
                useMemo: React.useMemo,
                useRef: React.useRef,
                useImperativeHandle: React.useImperativeHandle,
                useLayoutEffect: React.useLayoutEffect,
                useDebugValue: React.useDebugValue,
            };
            const scopeKeys = Object.keys(scope);
            const scopeValues = Object.values(scope);

            // 2. Pre-process Code
            // Remove imports
            let processedCode = code.replace(/import\s+.*?;/gs, '');

            // Determine Component Name for Return
            let componentName = 'GeneratedComponent';

            // Handle "export default"
            if (processedCode.includes('export default')) {
                // Case: export default function Name() {}
                if (processedCode.match(/export\s+default\s+function\s+\w+/)) {
                    processedCode = processedCode.replace(/export\s+default\s+function\s+(\w+)/, (match, name) => {
                        componentName = name;
                        return `const ${name} = function ${name}`;
                    });
                }
                // Case: export default function() {}
                else if (processedCode.match(/export\s+default\s+function\s*\(/)) {
                    processedCode = processedCode.replace(/export\s+default\s+function/, 'const GeneratedComponent = function');
                    componentName = 'GeneratedComponent';
                }
                // Case: export default Name
                else {
                    const match = processedCode.match(/export\s+default\s+(\w+)/);
                    if (match) {
                        componentName = match[1];
                        // Remove the export statement entirely
                        processedCode = processedCode.replace(/export\s+default\s+(\w+);?/, '');
                    }
                }
            } else {
                // Case: Raw JSX (Fragments) or unknown structure
                // Wrap in a functional component to be safe
                processedCode = `const GeneratedComponent = () => (<>${processedCode}</>);`;
                componentName = 'GeneratedComponent';
            }

            // 3. Transform with Babel
            const transformedCode = Babel.transform(processedCode, {
                presets: ['react'],
                filename: 'preview.jsx',
            }).code;

            // 4. Construct Final Function Body
            // Append the return statement for the function constructor
            const finalCode = `${transformedCode}; return ${componentName};`;

            // 5. Execute
            const func = new Function(...scopeKeys, finalCode);
            const GeneratedComponent = func(...scopeValues);

            return GeneratedComponent;

        } catch (err) {
            console.error("Preview Error:", err);
            return () => (
                <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg overflow-auto">
                    <h3 className="font-bold">Preview Error</h3>
                    <p className="text-xs font-mono mt-2 whitespace-pre-wrap">{err.message}</p>
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
