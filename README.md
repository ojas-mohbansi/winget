# Winget Manager (Winget WebUI)

A modern, secure, and feature-rich graphical user interface for the Windows Package Manager (Winget), built with **Tauri**, **React**, and **Rust**.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)

## ✨ "Midnight Glass" Design System

The app features a premium **Midnight Glass** theme:
- **Glassmorphism**: Sophisticated backdrop blur and frosted glass effects.
- **Dynamic Gradients**: Indigo and violet accents for a high-end feel.
- **Micro-animations**: Smooth transitions, scale effects, and pulsing status indicators.
- **Monospace Console**: A dedicated terminal view for real-time operation feedback.

## 🚀 Features

- **App Catalog**: Search and browse thousands of apps from the official Winget repository.
- **Package Management**: Install, uninstall, and upgrade software with a single click.
- **Package Health Dashboard**: Monitor your system's package status with visual indicators.
- **Advanced Filtering**: Search and sort (Name, ID, Version) through your installed apps.
- **Package Details**: Inspect metadata, publishers, and licenses before installing.
- **Update All**: Batch upgrade all outdated applications at once.
- **Package Pinning**: Pin specific packages to prevent accidental updates.
- **Source Management**: View and reset Winget sources (repositories).
- **Configuration Backup**: Export/Import your installed package list via JSON.
- **Audit Logs**: Built-in security audit logging to track all operations.
- **Keyboard Shortcuts**: Navigate efficiently with Power User shortcuts (`Ctrl+F`, `Ctrl+I`, `Ctrl+U`).

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Rust (Tauri), Windows API
- **Security**: Strict Command Allowlist, Audit Trail, Local-Only Operation
- **CI/CD**: Automated GitHub Actions for releases.

## 📦 Installation & Usage

### Quick Start (Installer)
- **Download**: [Winget Management App v0.1.0 (x64 Setup)](src-tauri/target/release/bundle/nsis/Winget%20Management%20App_0.1.0_x64-setup.exe)
- **Portable**: Alternatively, run `src-tauri/target/release/winget-webui.exe`

### Prerequisites
- Windows 10/11
- [Winget (App Installer)](https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1)
- Node.js & npm (for development)
- Rust (for development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ojas-mohbansi/winget.git
   cd winget
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Locally**
   ```bash
   npm run tauri dev
   ```

## 👨‍💻 Developer

Developed by **Ojas Mohbansi**.

- **GitHub**: [github.com/ojas-mohbansi](https://www.github.com/ojas-mohbansi)
- **Website**: [ojas-m.vercel.app](https://ojas-m.vercel.app)

## 🛡️ Security

This application is designed with security as a priority:
- **No Remote Calls**: All logic runs locally on your machine.
- **Audit Logging**: All actions are recorded to `%APPDATA%/com.winget.webui/logs/audit.log`.
- **Restricted Scope**: Only verified `winget` commands are permitted.

---
© 2025 Ojas Mohbansi. All rights reserved.
