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

interface FilterBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    sortBy: 'name' | 'id' | 'version';
    onSortChange: (sort: 'name' | 'id' | 'version') => void;
    totalCount: number;
    filteredCount: number;
}

const SearchIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ClearIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const FilterBar: React.FC<FilterBarProps> = ({
    searchValue,
    onSearchChange,
    sortBy,
    onSortChange,
    totalCount,
    filteredCount
}) => {
    return (
        <div className="flex items-center gap-3 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
                <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Filter packages..."
                    className="input pl-10 pr-10"
                    aria-label="Filter packages"
                />
                {searchValue && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        aria-label="Clear filter"
                    >
                        <ClearIcon />
                    </button>
                )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
                <label
                    htmlFor="sort-select"
                    className="text-sm whitespace-nowrap"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    Sort by:
                </label>
                <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as 'name' | 'id' | 'version')}
                    className="input py-2 px-3 pr-8 cursor-pointer"
                    style={{
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1.25rem'
                    }}
                >
                    <option value="name">Name</option>
                    <option value="id">ID</option>
                    <option value="version">Version</option>
                </select>
            </div>

            {/* Count Badge */}
            {searchValue && filteredCount !== totalCount && (
                <span
                    className="text-sm px-2 py-1 rounded"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                    {filteredCount} of {totalCount}
                </span>
            )}
        </div>
    );
};

// Helper function to filter and sort packages
export const filterAndSortPackages = <T extends { Name: string; Id: string; Version: string }>(
    packages: T[],
    searchValue: string,
    sortBy: 'name' | 'id' | 'version'
): T[] => {
    let filtered = packages;

    // Filter
    if (searchValue.trim()) {
        const search = searchValue.toLowerCase();
        filtered = packages.filter(pkg =>
            pkg.Name.toLowerCase().includes(search) ||
            pkg.Id.toLowerCase().includes(search)
        );
    }

    // Sort
    return [...filtered].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.Name.localeCompare(b.Name);
            case 'id':
                return a.Id.localeCompare(b.Id);
            case 'version':
                return a.Version.localeCompare(b.Version);
            default:
                return 0;
        }
    });
};

