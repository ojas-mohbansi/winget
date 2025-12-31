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
// Prevents creating additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;
mod security;
mod winget;

use tauri::{AppHandle, Manager};
use crate::winget::WingetWrapper;
use crate::models::WingetCommandResult;

#[tauri::command]
async fn run_winget(app: AppHandle, args: Vec<String>) -> WingetCommandResult {
    // Convert Vec<String> to Vec<&str>
    let str_args: Vec<&str> = args.iter().map(|s| s.as_str()).collect();
    WingetWrapper::run_command(&app, str_args)
}

#[tauri::command]
async fn check_admin() -> bool {
    security::is_elevated()
}

#[tauri::command]
async fn request_admin() -> bool {
    security::elevate_process()
}

#[tauri::command]
async fn read_audit_logs(app: AppHandle) -> Option<String> {
    let log_dir = app.path().app_log_dir().ok()?;
    let log_file = log_dir.join("audit.log");
    if log_file.exists() {
        std::fs::read_to_string(log_file).ok()
    } else {
        Some("No logs found.".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app.get_webview_window("main").expect("no main window").set_focus();
        }))
        .invoke_handler(tauri::generate_handler![run_winget, check_admin, request_admin, read_audit_logs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

