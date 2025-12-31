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

interface PackageHealthProps {
    totalInstalled: number;
    updatesAvailable: number;
    pinnedCount: number;
    onViewUpdates: () => void;
}

export const PackageHealth: React.FC<PackageHealthProps> = ({
    totalInstalled,
    updatesAvailable,
    pinnedCount,
    onViewUpdates
}) => {
    const upToDate = totalInstalled - updatesAvailable - pinnedCount;
    const upToDatePercent = totalInstalled > 0 ? Math.round((upToDate / totalInstalled) * 100) : 100;
    const updatesPercent = totalInstalled > 0 ? Math.round((updatesAvailable / totalInstalled) * 100) : 0;
    const pinnedPercent = totalInstalled > 0 ? Math.round((pinnedCount / totalInstalled) * 100) : 0;

    return (
        <div className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                            Package Health
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {totalInstalled} packages tracked
                        </p>
                    </div>
                </div>

                {updatesAvailable > 0 && (
                    <button onClick={onViewUpdates} className="btn btn-sm btn-success">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Update All ({updatesAvailable})</span>
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div
                className="h-3 rounded-full overflow-hidden flex"
                style={{ background: 'var(--bg-secondary)' }}
                role="progressbar"
                aria-label="Package health breakdown"
            >
                {upToDatePercent > 0 && (
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${upToDatePercent}%`,
                            background: 'var(--accent-success)'
                        }}
                        title={`${upToDatePercent}% up to date`}
                    />
                )}
                {updatesPercent > 0 && (
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${updatesPercent}%`,
                            background: 'var(--accent-warning)'
                        }}
                        title={`${updatesPercent}% need updates`}
                    />
                )}
                {pinnedPercent > 0 && (
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${pinnedPercent}%`,
                            background: 'var(--text-tertiary)'
                        }}
                        title={`${pinnedPercent}% pinned`}
                    />
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-success)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>
                        Up to date <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>({upToDate})</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-warning)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>
                        Updates available <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>({updatesAvailable})</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: 'var(--text-tertiary)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>
                        Pinned <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>({pinnedCount})</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

