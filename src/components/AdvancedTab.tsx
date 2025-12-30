import React, { useEffect, useState } from 'react';
import { getAuditLogs, listSources, resetSources, listPins, exportPackages, importPackages } from '../api/winget';
import { save, open } from '@tauri-apps/plugin-dialog';

// Icon components
const ExportIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ImportIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ResetIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const RefreshIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const DatabaseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
);

const PinIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const LogIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const SaveIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

export const AdvancedTab: React.FC = () => {
    const [logs, setLogs] = useState("Loading logs...");
    const [sources, setSources] = useState("Loading sources...");
    const [pins, setPins] = useState("Loading pins...");
    const [actionStatus, setActionStatus] = useState("");
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const l = await getAuditLogs();
        setLogs(l || "No logs found.");

        const s = await listSources();
        setSources(s);

        const p = await listPins();
        setPins(p);
    };

    const handleResetSources = async () => {
        setShowResetConfirm(false);
        setActionStatus("Resetting sources...");
        await resetSources();
        setActionStatus("Sources reset successfully.");
        loadData();
        setTimeout(() => setActionStatus(""), 3000);
    };

    const handleExport = async () => {
        const path = await save({
            filters: [{
                name: 'Winget Configuration',
                extensions: ['json']
            }]
        });
        if (path) {
            setActionStatus(`Exporting to ${path}...`);
            await exportPackages(path);
            setActionStatus("Export complete.");
            setTimeout(() => setActionStatus(""), 3000);
        }
    };

    const handleImport = async () => {
        const path = await open({
            multiple: false,
            filters: [{
                name: 'Winget Configuration',
                extensions: ['json']
            }]
        });
        if (path) {
            setActionStatus(`Importing from ${path}...`);
            await importPackages(path as string);
            setActionStatus("Import complete.");
            setTimeout(() => setActionStatus(""), 3000);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Status Bar */}
            {actionStatus && (
                <div
                    className="flex items-center gap-2 p-3 rounded-lg animate-slide-up"
                    style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}
                >
                    <svg className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm" style={{ color: 'var(--accent-primary)' }}>{actionStatus}</span>
                </div>
            )}

            {/* Import / Export */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(99, 102, 241, 0.2)' }}
                    >
                        <SaveIcon />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Backup & Restore</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Export your packages to JSON for backup or restore</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="btn btn-primary flex-1">
                        <ExportIcon />
                        <span>Export Packages</span>
                    </button>
                    <button onClick={handleImport} className="btn btn-success flex-1">
                        <ImportIcon />
                        <span>Import Packages</span>
                    </button>
                </div>
            </div>

            {/* Sources */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-warning)' }}
                        >
                            <DatabaseIcon />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Source Manager</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage winget package sources</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="btn btn-sm btn-danger"
                    >
                        <ResetIcon />
                        <span>Reset</span>
                    </button>
                </div>
                <div className="console">
                    <div className="console-body" style={{ maxHeight: '120px' }}>
                        <pre className="text-xs whitespace-pre-wrap">{sources}</pre>
                    </div>
                </div>
            </div>

            {/* Pins */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-success)' }}
                    >
                        <PinIcon />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Pinned Packages</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Packages excluded from automatic updates</p>
                    </div>
                </div>
                <div className="console">
                    <div className="console-body" style={{ maxHeight: '120px' }}>
                        <pre className="text-xs whitespace-pre-wrap">{pins || 'No pinned packages.'}</pre>
                    </div>
                </div>
            </div>

            {/* Logs */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-danger)' }}
                        >
                            <LogIcon />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Audit Logs</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Security audit trail for all operations</p>
                        </div>
                    </div>
                    <button onClick={loadData} className="btn btn-sm btn-ghost">
                        <RefreshIcon />
                        <span>Refresh</span>
                    </button>
                </div>
                <div className="console">
                    <div className="console-body" style={{ maxHeight: '200px' }}>
                        <pre className="text-xs whitespace-pre-wrap" style={{ color: 'var(--text-tertiary)' }}>{logs}</pre>
                    </div>
                </div>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="modal-backdrop" onClick={() => setShowResetConfirm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                Reset Sources?
                            </h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: 'var(--text-secondary)' }}>
                                This will reset all winget sources to their default configuration.
                            </p>
                            <p className="text-sm mt-2" style={{ color: 'var(--accent-warning)' }}>
                                ⚠️ Any custom sources will be removed.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowResetConfirm(false)} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button onClick={handleResetSources} className="btn btn-danger">
                                <ResetIcon />
                                <span>Reset Sources</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
