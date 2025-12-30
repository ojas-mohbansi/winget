import { invoke } from "@tauri-apps/api/core";

export interface WingetPackage {
    Id: string;
    Name: string;
    Version: string;
    Source?: string;
    Available?: string;
}

export interface WingetCommandResult {
    success: boolean;
    output?: string;
    error?: string;
    code?: number;
}

export async function checkAdmin(): Promise<boolean> {
    return await invoke("check_admin");
}

export async function requestAdmin(): Promise<boolean> {
    return await invoke("request_admin");
}

// Helper function to run winget commands that return JSON-parseable package lists
async function runWingetPackageCommand(args: string[]): Promise<WingetPackage[]> {
    const result = await invoke<WingetCommandResult>("run_winget", { args });
    if (result.success && result.output) {
        try {
            // Backend parses text output to JSON for list/search/upgrade commands
            return JSON.parse(result.output) as WingetPackage[];
        } catch (e) {
            console.error("Failed to parse winget output:", e);
            return [];
        }
    }
    return [];
}

// Helper function to run winget commands that return raw text
async function runWingetTextCommand(args: string[]): Promise<string> {
    const result = await invoke<WingetCommandResult>("run_winget", { args });
    return result.output || "";
}

// Helper function to run winget action commands (install, uninstall, etc.)
async function runWingetActionCommand(args: string[]): Promise<WingetCommandResult> {
    return await invoke<WingetCommandResult>("run_winget", { args });
}

export async function searchPackages(query: string): Promise<WingetPackage[]> {
    return await runWingetPackageCommand(["search", query]);
}

export async function listInstalledPackages(): Promise<WingetPackage[]> {
    return await runWingetPackageCommand(["list", "--source", "winget"]);
}

export async function getUpgrades(): Promise<WingetPackage[]> {
    return await runWingetPackageCommand(["upgrade"]);
}

export async function installPackage(id: string): Promise<WingetCommandResult> {
    const args = ["install", "--id", id, "--accept-source-agreements", "--accept-package-agreements"];
    return await runWingetActionCommand(args);
}

export async function uninstallPackage(id: string): Promise<WingetCommandResult> {
    const args = ["uninstall", "--id", id];
    return await runWingetActionCommand(args);
}

export async function upgradePackage(id: string): Promise<WingetCommandResult> {
    const args = ["upgrade", "--id", id, "--accept-source-agreements", "--accept-package-agreements"];
    return await runWingetActionCommand(args);
}

export async function upgradeAllPackages(): Promise<WingetCommandResult> {
    const args = ["upgrade", "--all", "--include-unknown", "--accept-source-agreements", "--accept-package-agreements"];
    return await runWingetActionCommand(args);
}

export async function getPackageDetails(id: string): Promise<string> {
    return await runWingetTextCommand(["show", "--id", id]);
}

export async function pinPackage(id: string): Promise<WingetCommandResult> {
    return await runWingetActionCommand(["pin", "add", "--id", id]);
}

export async function unpinPackage(id: string): Promise<WingetCommandResult> {
    return await runWingetActionCommand(["pin", "remove", "--id", id]);
}

export async function listPins(): Promise<string> {
    return await runWingetTextCommand(["pin", "list"]);
}

export async function listSources(): Promise<string> {
    return await runWingetTextCommand(["source", "list"]);
}

export async function resetSources(): Promise<WingetCommandResult> {
    return await runWingetActionCommand(["source", "reset", "--force"]);
}

export async function exportPackages(filePath: string): Promise<WingetCommandResult> {
    return await runWingetActionCommand(["export", "-o", filePath]);
}

export async function importPackages(filePath: string): Promise<WingetCommandResult> {
    return await runWingetActionCommand(["import", "-i", filePath, "--accept-source-agreements", "--accept-package-agreements"]);
}

export async function getAuditLogs(): Promise<string | null> {
    return await invoke("read_audit_logs");
}
