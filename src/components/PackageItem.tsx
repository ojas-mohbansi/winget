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
import { WingetPackage, installPackage, uninstallPackage, upgradePackage, pinPackage } from '../api/winget';
import { PackageDetailsModal } from './PackageDetailsModal';

interface PackageItemProps {
    pkg: WingetPackage;
    isInstalled: boolean;
    onOperationStart: (currentAction: string) => void;
    onOperationComplete: () => void;
}

// Icon components
const InstallIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const UninstallIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const UpgradeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const PinIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const InfoIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LoadingSpinner = () => (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

// Random pastel colors for package icons
const getPackageColor = (id: string) => {
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
        'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};

export const PackageItem: React.FC<PackageItemProps> = ({ pkg, isInstalled, onOperationStart, onOperationComplete }) => {
    const [loading, setLoading] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [showDetails, setShowDetails] = React.useState(false);

    const handleInstall = async () => {
        setLoading(true);
        onOperationStart(`Installing ${pkg.Name}...`);
        await installPackage(pkg.Id);
        setLoading(false);
        onOperationComplete();
    };

    const handleUninstall = async () => {
        setShowConfirm(false);
        setLoading(true);
        onOperationStart(`Uninstalling ${pkg.Name}...`);
        await uninstallPackage(pkg.Id);
        setLoading(false);
        onOperationComplete();
    };

    const handleUpgrade = async () => {
        setLoading(true);
        onOperationStart(`Upgrading ${pkg.Name}...`);
        await upgradePackage(pkg.Id);
        setLoading(false);
        onOperationComplete();
    };

    const handlePin = async () => {
        setLoading(true);
        onOperationStart(`Pinning ${pkg.Name}...`);
        await pinPackage(pkg.Id);
        setLoading(false);
        onOperationComplete();
    };

    return (
        <>
            <div
                className="glass-card p-4 flex items-start gap-4 group"
                role="article"
                aria-label={`Package: ${pkg.Name}`}
            >
                {/* Package Icon */}
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg"
                    style={{ background: getPackageColor(pkg.Id) }}
                    aria-hidden="true"
                >
                    {pkg.Name.charAt(0).toUpperCase()}
                </div>

                {/* Package Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-base truncate" style={{ color: 'var(--text-primary)' }}>
                                {pkg.Name}
                            </h3>
                            <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                                {pkg.Id}
                            </p>
                        </div>

                        {/* Version Badges */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="badge badge-info">v{pkg.Version}</span>
                            {pkg.Available && (
                                <span className="badge badge-success">
                                    ⬆ {pkg.Available}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {isInstalled ? (
                            <>
                                <button
                                    disabled={loading}
                                    onClick={() => setShowConfirm(true)}
                                    className="btn btn-sm btn-danger focus-ring"
                                    aria-label={`Uninstall ${pkg.Name}`}
                                >
                                    {loading ? <LoadingSpinner /> : <UninstallIcon />}
                                    <span>Uninstall</span>
                                </button>
                                {pkg.Available && (
                                    <button
                                        disabled={loading}
                                        onClick={handleUpgrade}
                                        className="btn btn-sm btn-success focus-ring"
                                        aria-label={`Upgrade ${pkg.Name} to version ${pkg.Available}`}
                                    >
                                        {loading ? <LoadingSpinner /> : <UpgradeIcon />}
                                        <span>Upgrade</span>
                                    </button>
                                )}
                                <button
                                    disabled={loading}
                                    onClick={handlePin}
                                    className="btn btn-sm btn-ghost focus-ring"
                                    title="Pin this package to prevent updates"
                                    aria-label={`Pin ${pkg.Name} to prevent updates`}
                                >
                                    <PinIcon />
                                    <span>Pin</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    disabled={loading}
                                    onClick={() => setShowDetails(true)}
                                    className="btn btn-sm btn-ghost focus-ring"
                                    aria-label={`View details for ${pkg.Name}`}
                                >
                                    <InfoIcon />
                                    <span>Details</span>
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={handleInstall}
                                    className="btn btn-sm btn-primary focus-ring"
                                    aria-label={`Install ${pkg.Name}`}
                                >
                                    {loading ? <LoadingSpinner /> : <InstallIcon />}
                                    <span>Install</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowConfirm(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-title"
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 id="confirm-title" className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                Confirm Uninstall
                            </h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Are you sure you want to uninstall <strong style={{ color: 'var(--text-primary)' }}>{pkg.Name}</strong>?
                            </p>
                            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowConfirm(false)} className="btn btn-ghost focus-ring">
                                Cancel
                            </button>
                            <button onClick={handleUninstall} className="btn btn-danger focus-ring">
                                <UninstallIcon />
                                <span>Uninstall</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Package Details Modal */}
            {showDetails && (
                <PackageDetailsModal
                    pkg={pkg}
                    onClose={() => setShowDetails(false)}
                    onInstall={onOperationComplete}
                />
            )}
        </>
    );
};

