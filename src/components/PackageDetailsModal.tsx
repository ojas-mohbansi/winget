import React, { useState, useEffect } from 'react';
import { WingetPackage, getPackageDetails, installPackage } from '../api/winget';

interface PackageDetailsModalProps {
    pkg: WingetPackage;
    onClose: () => void;
    onInstall: () => void;
}

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const InstallIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const LoadingSpinner = () => (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

const ExternalLinkIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

// Parse winget show output into structured data
const parsePackageDetails = (output: string): Record<string, string> => {
    const details: Record<string, string> = {};
    const lines = output.split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (key && value) {
                details[key] = value;
            }
        }
    }

    return details;
};

// Random pastel colors for package icons (same as PackageItem)
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

export const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({ pkg, onClose, onInstall }) => {
    const [details, setDetails] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [installing, setInstalling] = useState(false);
    const [rawOutput, setRawOutput] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const output = await getPackageDetails(pkg.Id);
                setRawOutput(output);
                const parsed = parsePackageDetails(output);
                setDetails(parsed);
            } catch (error) {
                console.error('Failed to fetch package details:', error);
            }
            setLoading(false);
        };

        fetchDetails();
    }, [pkg.Id]);

    const handleInstall = async () => {
        setInstalling(true);
        await installPackage(pkg.Id);
        setInstalling(false);
        onInstall();
        onClose();
    };

    // Important fields to display prominently
    const importantFields = ['Publisher', 'Description', 'Homepage', 'License', 'Author'];
    const displayDetails = importantFields
        .filter(field => details[field])
        .map(field => ({ label: field, value: details[field] }));

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal animate-scale-in"
                style={{ maxWidth: '560px' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="modal-header relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-white/10 focus-ring"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Close modal"
                    >
                        <CloseIcon />
                    </button>

                    <div className="flex items-start gap-4">
                        {/* Package Icon */}
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl shadow-lg"
                            style={{ background: getPackageColor(pkg.Id) }}
                        >
                            {pkg.Name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1 pr-8">
                            <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                {pkg.Name}
                            </h2>
                            <p className="text-sm truncate" style={{ color: 'var(--text-tertiary)' }}>
                                {pkg.Id}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="badge badge-info">v{pkg.Version}</span>
                                {details['Publisher'] && (
                                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        by {details['Publisher']}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <LoadingSpinner />
                            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Loading package details...
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Description */}
                            {details['Description'] && (
                                <div>
                                    <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
                                        Description
                                    </h4>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {details['Description']}
                                    </p>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="space-y-2">
                                {displayDetails
                                    .filter(d => d.label !== 'Description')
                                    .map(({ label, value }) => (
                                        <div
                                            key={label}
                                            className="flex justify-between items-center py-2 px-3 rounded-lg"
                                            style={{ background: 'var(--bg-secondary)' }}
                                        >
                                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                {label}
                                            </span>
                                            {label === 'Homepage' ? (
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1 text-sm hover:underline"
                                                    style={{ color: 'var(--accent-primary)' }}
                                                >
                                                    <span className="truncate max-w-[200px]">{value}</span>
                                                    <ExternalLinkIcon />
                                                </a>
                                            ) : (
                                                <span className="text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>
                                                    {value}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                            </div>

                            {/* Raw Output (collapsed) */}
                            {rawOutput && (
                                <details className="group">
                                    <summary
                                        className="text-xs cursor-pointer py-2 hover:underline"
                                        style={{ color: 'var(--text-tertiary)' }}
                                    >
                                        View raw output
                                    </summary>
                                    <div className="console mt-2">
                                        <div className="console-body" style={{ maxHeight: '150px' }}>
                                            <pre className="text-xs whitespace-pre-wrap">{rawOutput}</pre>
                                        </div>
                                    </div>
                                </details>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button onClick={onClose} className="btn btn-ghost">
                        Cancel
                    </button>
                    <button
                        onClick={handleInstall}
                        className="btn btn-primary"
                        disabled={installing}
                    >
                        {installing ? <LoadingSpinner /> : <InstallIcon />}
                        <span>{installing ? 'Installing...' : 'Install'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
