import React, { useState, useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';

// Explicitly import all deterministic components
import { Navbar } from '../components/ui/Navbar';
import { Sidebar } from '../components/ui/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { Option } from '../components/ui/Option';
import { LayoutInterpreter } from '../components/ui/Layout';
import { themes } from '../theme';

const transformCodeForLivePreview = (code) => {
    if (!code) return '';

    // 1. Remove imports (they are provided by scope)
    let processedCode = code.replace(/import\s+.*?;/gs, '');

    // 2. Check if the code exports a component or is just raw JSX
    let componentName = null;

    if (processedCode.match(/export\s+default\s+function\s+(\w+)/)) {
        processedCode = processedCode.replace(/export\s+default\s+function\s+(\w+)/, (match, name) => {
            componentName = name;
            return `const ${name} = function ${name}`;
        });
    }
    else if (processedCode.match(/export\s+default\s+function\s*\(/)) {
        processedCode = processedCode.replace(/export\s+default\s+function/, 'const GeneratedComponent = function');
        componentName = 'GeneratedComponent';
    }
    else if (processedCode.match(/export\s+default\s+(\w+)/)) {
        const match = processedCode.match(/export\s+default\s+(\w+)/);
        if (match) {
            componentName = match[1];
            processedCode = processedCode.replace(/export\s+default\s+(\w+);?/, '');
        }
    }
    else if (processedCode.match(/function\s+(\w+)/)) {
        const matches = [...processedCode.matchAll(/function\s+(\w+)/g)];
        if (matches.length > 0) {
            componentName = matches[matches.length - 1][1];
        }
    }

    // 3. Construct the render call
    if (componentName) {
        // RENDER DIRECTLY - Allow component to manage its own state/theme
        processedCode += `\nrender(<${componentName} />);`;
    } else {
        // Raw JSX - Wrap in LayoutInterpreter
        processedCode = `render(<LayoutInterpreter><>{code}</></LayoutInterpreter>);`;
    }

    return processedCode;
};

export function PreviewPanel({ code }) {
    const [theme, setTheme] = useState("dark"); // Outer preview theme (mostly unused now if inner has state)

    // HOC to inject current theme into LayoutInterpreter to enforce global preview theme
    const ThemedLayout = (props) => {
        return <LayoutInterpreter {...props} theme={theme} />;
    };

    // Inject previewTheme into scope to allow external control
    const scope = useMemo(() => ({
        ...Lucide, // Icons as base, but UI components overwrite if name conflicts
        Navbar,
        Sidebar,
        Card,
        Button,
        Input,
        Table,
        Modal,
        Select,
        Option,
        LayoutInterpreter: ThemedLayout,
        React,
        useState: React.useState,
        useEffect: React.useEffect,
        useContext: React.useContext,
        useReducer: React.useReducer,
        useCallback: React.useCallback,
        useMemo: React.useMemo,
        useRef: React.useRef,
        themes,
        previewTheme: theme // Inject current outer theme
    }), [theme]);

    // Transform code to use the injected previewTheme logic
    const transformedCode = useMemo(() => {
        let processed = transformCodeForLivePreview(code);

        // HACK: Replace hardcoded useState("dark") with useState(previewTheme) 
        // to allow the outer switcher to drive the inner state.
        // We match "dark", "light", or "ocean" to be safe.
        processed = processed.replace(
            /useState\s*\(\s*["'](dark|light|ocean)["']\s*\)/g,
            'useState(previewTheme)'
        );
        return processed;
    }, [code]);

    const isFullApp = code && code.includes('export default function App');

    return (
        <div className="flex flex-col h-full bg-white" style={{ transform: 'translate(0)' }}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Live Preview</h2>
                <div className="flex items-center gap-4">
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1 outline-none focus:border-blue-500"
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="ocean">Ocean</option>
                    </select>
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Connected (React-Live)
                    </div>
                </div>
            </div>
            <div className={`flex-1 overflow-hidden relative ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
                {/* Checkerboard background only visible if content is transparent/partial, but Layout covers most */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-10"></div>
                <div className="relative z-10 h-full overflow-hidden">
                    {code ? (
                        <LiveProvider
                            code={transformedCode}
                            scope={scope}
                            noInline={true}
                        >
                            <LiveError className="p-4 rounded-lg bg-red-50 text-red-500 border border-red-200 font-mono text-xs whitespace-pre-wrap mb-4" />
                            <LivePreview style={{ height: '100%' }} />
                        </LiveProvider>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 mt-20">
                            <p>Generate some UI to see a preview</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
