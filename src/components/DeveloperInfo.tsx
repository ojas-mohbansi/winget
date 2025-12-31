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
import React from 'react';

interface DeveloperInfoProps {
    onClose: () => void;
}

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const GithubIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const GlobeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);

export const DeveloperInfo: React.FC<DeveloperInfoProps> = ({ onClose }) => {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-white/10"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <CloseIcon />
                    </button>

                    <div className="text-center pb-2">
                        {/* Logo */}
                        <div
                            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                            style={{ background: 'var(--gradient-primary)' }}
                        >
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold gradient-text">Winget Manager</h2>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Windows Package Manager GUI
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="modal-body space-y-4">
                    {/* Info Grid */}
                    <div className="space-y-3">
                        <InfoRow label="Version" value="0.1.0" />
                        <InfoRow label="Developer" value="Ojas Mohbansi" />
                        <InfoRow label="Tech Stack" value="Tauri • React • Rust" />
                        <InfoRow label="License" value="MIT" />
                    </div>

                    {/* Links */}
                    <div className="flex gap-2 pt-2">
                        <a
                            href="https://www.github.com/ojas-mohbansi"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost flex-1"
                        >
                            <GithubIcon />
                            <span>GitHub</span>
                        </a>
                        <a
                            href="https://ojas-m.vercel.app"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost flex-1"
                        >
                            <GlobeIcon />
                            <span>Website</span>
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 text-center border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Built with ❤️ for Windows Power Users
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        © 2025 Ojas Mohbansi. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Helper component for info rows
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div
        className="flex justify-between items-center py-2 px-3 rounded-lg"
        style={{ background: 'var(--bg-secondary)' }}
    >
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
);

