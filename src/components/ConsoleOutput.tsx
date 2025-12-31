/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                                                                      ║
 * ║             PROPERTY OF THE LEGENDARY OJAS MOHBANSI                  ║
 * ║                  (c) 2025 - All Rights Reserved                      ║
 * ║                                                                      ║
 * ║       Crafted with unprecedented brilliance for the coding world.    ║
 * ║                                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */
import React, { useEffect, useRef, useState } from 'react';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

interface ConsoleOutputProps {
    className?: string;
}

const CopyIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ className }) => {
    const [lines, setLines] = useState<Array<{ text: string; type: 'output' | 'error' | 'success' }>>([]);
    const [copied, setCopied] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let unlistenStdout: UnlistenFn;
        let unlistenStderr: UnlistenFn;

        async function startListening() {
            unlistenStdout = await listen<string>('winget-output', (event) => {
                const text = event.payload;
                const type = text.toLowerCase().includes('successfully') ? 'success' : 'output';
                setLines(prev => [...prev, { text, type }]);
            });
            unlistenStderr = await listen<string>('winget-error', (event) => {
                setLines(prev => [...prev, { text: event.payload, type: 'error' }]);
            });
        }

        startListening();

        return () => {
            if (unlistenStdout) unlistenStdout();
            if (unlistenStderr) unlistenStderr();
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lines]);

    const handleCopy = async () => {
        const text = lines.map(l => l.text).join('\n');
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setLines([]);
    };

    const getLineColor = (type: string) => {
        switch (type) {
            case 'error': return 'var(--accent-danger)';
            case 'success': return 'var(--accent-success)';
            default: return '#4ade80';
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Action Buttons */}
            {lines.length > 0 && (
                <div className="absolute top-0 right-0 flex gap-1 z-10">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded transition-colors hover:bg-white/10"
                        style={{ color: copied ? 'var(--accent-success)' : 'var(--text-secondary)' }}
                        title={copied ? 'Copied!' : 'Copy to clipboard'}
                    >
                        <CopyIcon />
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-1.5 rounded transition-colors hover:bg-white/10"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Clear console"
                    >
                        <TrashIcon />
                    </button>
                </div>
            )}

            {/* Console Content */}
            <div
                className="font-mono text-xs overflow-y-auto h-full pr-16"
                style={{ fontFamily: 'var(--font-mono)' }}
            >
                {lines.length === 0 && (
                    <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--text-muted)' }}>$</span>
                        <span className="console-cursor" />
                        <span className="italic" style={{ color: 'var(--text-muted)' }}>Ready for commands...</span>
                    </div>
                )}
                {lines.map((line, index) => (
                    <div
                        key={index}
                        className="console-line py-0.5"
                        style={{ color: getLineColor(line.type) }}
                    >
                        {line.type === 'error' && <span className="mr-1">✗</span>}
                        {line.type === 'success' && <span className="mr-1">✓</span>}
                        {line.text}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

