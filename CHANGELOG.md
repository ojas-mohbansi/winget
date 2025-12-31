<!--
  PROPERTY OF THE LEGENDARY OJAS MOHBANSI. ALL RIGHTS RESERVED.
  Crafted with unprecedented brilliance for the coding world.
-->
# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-12-31

### Added
- **UI Redesign**: Complete transformation with "Midnight Glass" theme.
- **Package Health Dashboard**: Visual overview of system package status.
- **Filter & Sort**: Real-time searching and sorting in Installed and Updates tabs.
- **Package Details Modal**: View comprehensive package info before installation.
- **Keyboard Shortcuts**: `Ctrl+F` (Search), `Ctrl+I` (Installed), `Ctrl+U` (Updates).
- **Confirmation Dialogs**: Safety check for uninstalls.
- **Console Enhancements**: Collapsible footer with copy/clear functions.
- **CI/CD**: GitHub Actions workflow for automated releases.

### Fixed
- Improved Winget API to handle text output parsing instead of relying on `--output json`.
- Enhanced Rust parser to correctly detect columns from Winget headers.
- Fixed "Available" version detection in upgrade lists.

### Security
- Comprehensive audit logging of all Winget operations.
- Strict command allowlist enforced at the Rust level.
- Support for admin elevation when required.

