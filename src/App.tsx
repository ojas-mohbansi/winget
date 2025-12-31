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
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { checkAdmin, requestAdmin, searchPackages, listInstalledPackages, getUpgrades, upgradeAllPackages, WingetPackage } from './api/winget';
import { PackageItem } from './components/PackageItem';
import { ConsoleOutput } from './components/ConsoleOutput';
import { DeveloperInfo } from './components/DeveloperInfo';
import { AdvancedTab } from './components/AdvancedTab';
import { PackageHealth } from './components/PackageHealth';
import { FilterBar, filterAndSortPackages } from './components/FilterBar';
import './index.css';

// Tab icons as SVG components
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PackageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const UpdateIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const AutomationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AdvancedIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

type TabType = 'search' | 'installed' | 'updates' | 'automation' | 'advanced';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState<WingetPackage[]>([]);
  const [installedPackages, setInstalledPackages] = useState<WingetPackage[]>([]);
  const [upgrades, setUpgrades] = useState<WingetPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showDevInfo, setShowDevInfo] = useState(false);
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);

  // Filter states
  const [installedFilter, setInstalledFilter] = useState('');
  const [installedSort, setInstalledSort] = useState<'name' | 'id' | 'version'>('name');
  const [updatesFilter, setUpdatesFilter] = useState('');
  const [updatesSort, setUpdatesSort] = useState<'name' | 'id' | 'version'>('name');

  useEffect(() => {
    checkAdmin().then(setIsAdmin);
  }, []);

  // Debounced search
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setStatusMessage(`Searching for "${searchQuery}"...`);
    const results = await searchPackages(searchQuery);
    setPackages(results);
    setLoading(false);
    setStatusMessage(results.length > 0 ? `Found ${results.length} packages.` : 'No packages found.');
  }, [searchQuery]);

  const loadInstalled = async () => {
    setLoading(true);
    setStatusMessage("Listing installed packages...");
    const results = await listInstalledPackages();
    setInstalledPackages(results);
    setLoading(false);
    setStatusMessage(`Found ${results.length} installed packages.`);
  };

  const loadUpgrades = async () => {
    setLoading(true);
    setStatusMessage("Checking for upgrades...");
    const results = await getUpgrades();
    setUpgrades(results);
    setLoading(false);
    setStatusMessage(`Found ${results.length} available upgrades.`);
  };

  const handleUpdateAll = async () => {
    if (upgrades.length === 0) return;
    setLoading(true);
    setStatusMessage("Starting bulk upgrade...");
    await upgradeAllPackages();
    await loadUpgrades();
    setLoading(false);
    setStatusMessage("Bulk upgrade completed.");
  };

  useEffect(() => {
    if (activeTab === 'installed') loadInstalled();
    if (activeTab === 'updates') loadUpgrades();
  }, [activeTab]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            setActiveTab('search');
            break;
          case 'u':
            e.preventDefault();
            setActiveTab('updates');
            break;
          case 'i':
            e.preventDefault();
            setActiveTab('installed');
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered and sorted packages
  const filteredInstalled = useMemo(() =>
    filterAndSortPackages(installedPackages, installedFilter, installedSort),
    [installedPackages, installedFilter, installedSort]
  );

  const filteredUpgrades = useMemo(() =>
    filterAndSortPackages(upgrades, updatesFilter, updatesSort),
    [upgrades, updatesFilter, updatesSort]
  );

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'search', label: 'Search', icon: <SearchIcon /> },
    { id: 'installed', label: 'Installed', icon: <PackageIcon /> },
    { id: 'updates', label: 'Updates', icon: <UpdateIcon />, badge: upgrades.length > 0 ? upgrades.length : undefined },
    { id: 'automation', label: 'Automation', icon: <AutomationIcon /> },
    { id: 'advanced', label: 'Advanced', icon: <AdvancedIcon /> },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 btn btn-primary"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="glass-strong px-4 py-3 flex justify-between items-center relative z-10" role="banner">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-lg font-bold gradient-text">Winget Manager</h1>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1" aria-label="Header navigation">
            <button
              onClick={() => window.open("https://github.com/ojas-mohbansi/winget/releases", "_blank")}
              className="btn btn-sm btn-primary focus-ring"
              title="Download Latest Version"
            >
              <DownloadIcon />
              <span>Update App</span>
            </button>

            <a
              href="https://learn.microsoft.com/en-us/windows/package-manager/winget/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-ghost focus-ring"
            >
              <ExternalLinkIcon />
              <span>Docs</span>
            </a>

            <button
              onClick={() => setShowDevInfo(true)}
              className="btn btn-sm btn-ghost focus-ring"
            >
              <InfoIcon />
              <span>About</span>
            </button>
          </nav>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`badge ${isAdmin ? 'badge-danger' : 'badge-success'}`}
            role="status"
            aria-label={isAdmin ? 'Running as administrator' : 'Running as standard user'}
          >
            {isAdmin ? '🔓 ADMIN' : '🔒 USER'}
          </div>
          {!isAdmin && (
            <button
              onClick={() => requestAdmin()}
              className="btn btn-sm btn-ghost focus-ring"
              style={{ borderColor: 'var(--accent-warning)', color: 'var(--accent-warning)' }}
              title="Restart as Administrator"
            >
              Elevate
            </button>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-list" role="tablist" aria-label="Main navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-item focus-ring ${activeTab === tab.id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && <span className="tab-badge" aria-label={`${tab.badge} updates available`}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Loading Bar */}
      {loading && (
        <div className="h-1 w-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }} role="progressbar" aria-label="Loading">
          <div
            className="h-full animate-pulse"
            style={{
              background: 'var(--gradient-primary)',
              width: '100%',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto p-4"
        role="main"
      >
        {/* Tab: Search */}
        {activeTab === 'search' && (
          <div
            className="space-y-4 animate-fade-in"
            role="tabpanel"
            id="panel-search"
            aria-labelledby="tab-search"
          >
            {/* Search Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search packages (e.g., firefox, vscode, python)..."
                className="input flex-1 focus-ring"
                aria-label="Search packages"
              />
              <button onClick={handleSearch} className="btn btn-primary focus-ring" disabled={loading}>
                <SearchIcon />
                <span>Search</span>
              </button>
            </div>

            {/* Empty State */}
            {packages.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                  <svg className="w-10 h-10" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Search for packages</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Enter a package name above to get started</p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Tip: Press Ctrl+F to focus search</p>
              </div>
            )}

            {/* Package List */}
            <div className="space-y-3">
              {packages.map((pkg, index) => (
                <div key={pkg.Id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <PackageItem
                    pkg={pkg}
                    isInstalled={false}
                    onOperationStart={setStatusMessage}
                    onOperationComplete={() => { }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Installed */}
        {activeTab === 'installed' && (
          <div
            className="animate-fade-in"
            role="tabpanel"
            id="panel-installed"
            aria-labelledby="tab-installed"
          >
            {/* Health Dashboard */}
            <PackageHealth
              totalInstalled={installedPackages.length}
              updatesAvailable={upgrades.length}
              pinnedCount={0}
              onViewUpdates={() => setActiveTab('updates')}
            />

            {/* Filter Bar */}
            <FilterBar
              searchValue={installedFilter}
              onSearchChange={setInstalledFilter}
              sortBy={installedSort}
              onSortChange={setInstalledSort}
              totalCount={installedPackages.length}
              filteredCount={filteredInstalled.length}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Installed Packages ({filteredInstalled.length})
              </h2>
              <button onClick={loadInstalled} className="btn btn-sm btn-ghost focus-ring" disabled={loading}>
                <UpdateIcon />
                <span>Refresh</span>
              </button>
            </div>

            {/* Package List */}
            <div className="space-y-3">
              {filteredInstalled.map((pkg, index) => (
                <div key={pkg.Id} className="animate-slide-up" style={{ animationDelay: `${index * 30}ms` }}>
                  <PackageItem
                    pkg={pkg}
                    isInstalled={true}
                    onOperationStart={setStatusMessage}
                    onOperationComplete={loadInstalled}
                  />
                </div>
              ))}
            </div>

            {filteredInstalled.length === 0 && !loading && (
              <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
                {installedFilter ? (
                  <p>No packages match your filter.</p>
                ) : (
                  <p>No packages found from winget source.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Updates */}
        {activeTab === 'updates' && (
          <div
            className="animate-fade-in"
            role="tabpanel"
            id="panel-updates"
            aria-labelledby="tab-updates"
          >
            {/* Filter Bar */}
            {upgrades.length > 0 && (
              <FilterBar
                searchValue={updatesFilter}
                onSearchChange={setUpdatesFilter}
                sortBy={updatesSort}
                onSortChange={setUpdatesSort}
                totalCount={upgrades.length}
                filteredCount={filteredUpgrades.length}
              />
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Available Updates ({filteredUpgrades.length})
              </h2>
              <div className="flex gap-2">
                {upgrades.length > 0 && (
                  <button
                    disabled={loading}
                    onClick={handleUpdateAll}
                    className="btn btn-sm btn-success focus-ring"
                  >
                    <UpdateIcon />
                    <span>Update All</span>
                  </button>
                )}
                <button onClick={loadUpgrades} className="btn btn-sm btn-ghost focus-ring" disabled={loading}>
                  <UpdateIcon />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Package List */}
            <div className="space-y-3">
              {filteredUpgrades.map((pkg, index) => (
                <div key={pkg.Id} className="animate-slide-up" style={{ animationDelay: `${index * 30}ms` }}>
                  <PackageItem
                    pkg={pkg}
                    isInstalled={true}
                    onOperationStart={setStatusMessage}
                    onOperationComplete={loadUpgrades}
                  />
                </div>
              ))}
            </div>

            {upgrades.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <svg className="w-10 h-10" style={{ color: 'var(--accent-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>All up to date!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Your packages are at their latest versions</p>
              </div>
            )}

            {filteredUpgrades.length === 0 && upgrades.length > 0 && !loading && (
              <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
                <p>No packages match your filter.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Automation */}
        {activeTab === 'automation' && (
          <div
            className="space-y-6 animate-fade-in"
            role="tabpanel"
            id="panel-automation"
            aria-labelledby="tab-automation"
          >
            {/* Export & Backup Section */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Export & Backup</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Generate PowerShell scripts for your packages</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Reinstall Script</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>Generate a script to reinstall all your packages</p>
                  <button
                    onClick={async () => {
                      const pkgs = await listInstalledPackages();
                      const script = pkgs.map(p => `winget install --id ${p.Id} -e`).join('\n');
                      await navigator.clipboard.writeText(script);
                      setStatusMessage("Reinstall script copied to clipboard!");
                    }}
                    className="btn btn-primary w-full focus-ring"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Cleanup Script</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>Generate a script to uninstall all packages</p>
                  <button
                    onClick={async () => {
                      const pkgs = await listInstalledPackages();
                      const script = pkgs.map(p => `winget uninstall --id ${p.Id} -e`).join('\n');
                      await navigator.clipboard.writeText(script);
                      setStatusMessage("Cleanup script copied to clipboard!");
                    }}
                    className="btn btn-danger w-full focus-ring"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>

            {/* Scheduled Updates Section */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--accent-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Scheduled Updates</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Set up automatic daily updates at 2 AM</p>
                </div>
              </div>

              <div className="console">
                <div className="console-body" style={{ maxHeight: '80px' }}>
                  <code className="text-xs">
                    Register-ScheduledTask -Action (New-ScheduledTaskAction -Execute 'winget' -Argument 'upgrade --all --include-unknown --accept-source-agreements --accept-package-agreements') -Trigger (New-ScheduledTaskTrigger -Daily -At 2am) -TaskName "WingetAutoUpdate" -User "System" -RunLevel Highest
                  </code>
                </div>
              </div>
              <button
                onClick={() => {
                  const cmd = `Register-ScheduledTask -Action (New-ScheduledTaskAction -Execute 'winget' -Argument 'upgrade --all --include-unknown --accept-source-agreements --accept-package-agreements') -Trigger (New-ScheduledTaskTrigger -Daily -At 2am) -TaskName "WingetAutoUpdate" -User "System" -RunLevel Highest`;
                  navigator.clipboard.writeText(cmd);
                  setStatusMessage("Schedule command copied to clipboard!");
                }}
                className="btn btn-ghost mt-3 focus-ring"
              >
                Copy Command
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                  <svg className="w-4 h-4" style={{ color: 'var(--accent-warning)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Keyboard Shortcuts</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Navigate faster with these shortcuts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Search Tab</span>
                  <kbd className="px-2 py-1 text-xs font-mono rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Ctrl+F</kbd>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Installed Tab</span>
                  <kbd className="px-2 py-1 text-xs font-mono rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Ctrl+I</kbd>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Updates Tab</span>
                  <kbd className="px-2 py-1 text-xs font-mono rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Ctrl+U</kbd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Advanced */}
        {activeTab === 'advanced' && (
          <div
            role="tabpanel"
            id="panel-advanced"
            aria-labelledby="tab-advanced"
          >
            <AdvancedTab />
          </div>
        )}
      </main>

      {/* Console Footer */}
      <div
        className="border-t flex flex-col transition-all duration-300"
        style={{
          borderColor: 'var(--border-subtle)',
          height: consoleCollapsed ? '40px' : '180px',
          background: 'rgba(0, 0, 0, 0.4)'
        }}
      >
        <div
          className="px-3 py-2 flex justify-between items-center cursor-pointer"
          style={{ background: 'var(--bg-tertiary)' }}
          onClick={() => setConsoleCollapsed(!consoleCollapsed)}
          role="button"
          aria-expanded={!consoleCollapsed}
          aria-controls="console-panel"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setConsoleCollapsed(!consoleCollapsed)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Console Output</span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
              {statusMessage || 'Ready'}
            </span>
          </div>
          <button
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label={consoleCollapsed ? 'Expand console' : 'Collapse console'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${consoleCollapsed ? 'rotate-180' : ''}`}
              style={{ color: 'var(--text-secondary)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {!consoleCollapsed && (
          <div id="console-panel">
            <ConsoleOutput className="flex-1 px-3 py-2" />
          </div>
        )}
      </div>

      {/* Developer Info Modal */}
      {showDevInfo && <DeveloperInfo onClose={() => setShowDevInfo(false)} />}
    </div>
  );
}

export default App;

