use std::fs::OpenOptions;
use std::io::Write;
use chrono::Local;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;
use windows::core::{PCWSTR, HSTRING};
use windows::Win32::UI::Shell::ShellExecuteW;
use windows::Win32::UI::WindowsAndMessaging::SW_SHOW;
use windows::Win32::Foundation::{HANDLE, HWND};
use windows::Win32::Security::{GetTokenInformation, TokenElevation, TOKEN_ELEVATION, TOKEN_QUERY};
use windows::Win32::System::Threading::{GetCurrentProcess, OpenProcessToken};
use std::ffi::c_void;

// Allowed arguments pattern matching.
// This is a strict allowlist.
pub fn is_command_allowed(args: &[&str]) -> bool {
    if args.is_empty() {
        return false;
    }

    match args[0] {
        "list" => {
            // allowed: list (text output)
            // allowed: list --output json (if supported)
            // allowed: list --source winget
            // For text parsing refactor, we just need to ensure it's a list command.
             true
        }
        "search" => {
            // allowed: search <term>
            true
        }
        "install" => {
            // allowed: install --id <ID> --accept-source-agreements --accept-package-agreements
            // Must contain ID and accept flags
            let has_id = args.contains(&"--id");
            let has_accept_source = args.contains(&"--accept-source-agreements");
            let has_accept_package = args.contains(&"--accept-package-agreements");
            has_id && has_accept_source && has_accept_package
        }
        "uninstall" => {
            // allowed: uninstall --id <ID>
            args.contains(&"--id")
        }
        "upgrade" => {
            // allowed: upgrade --id <ID>
            // allowed: upgrade (list upgrades)
            true
        }
        "pin" => {
            // allowed: pin add --id <ID>
            // allowed: pin remove --id <ID>
            // allowed: pin list
            // Just ensure it's a pin command for now, strictness can be added if needed.
            // pin commands are generally safe configuration.
            true 
        }
        "source" => {
             // allowed: source list
             // allowed: source add ...
             // allowed: source remove ...
             // allowed: source update
             // allowed: source reset
             true
        }
        "export" => {
            // allowed: export -o <FILE>
            // Must contain -o
            args.contains(&"-o")
        }
        "import" => {
            // allowed: import -i <FILE>
            // Must contain -i
            args.contains(&"-i")
        }
        "show" => {
            // allowed: show --id <ID>
            args.contains(&"--id")
        }
        _ => false,
    }
}

pub fn log_audit_event(app_handle: &AppHandle, action: &str, details: &str, result: &str) {
    let log_dir = app_handle.path().app_log_dir().unwrap_or(PathBuf::from("."));
    if !log_dir.exists() {
        let _ = std::fs::create_dir_all(&log_dir);
    }
    let log_file_path = log_dir.join("audit.log");

    let now = Local::now();
    let log_entry = format!("[{}] ACTION: {} | DETAILS: {} | RESULT: {}\n", now.format("%Y-%m-%d %H:%M:%S"), action, details, result);

    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(log_file_path) {
        let _ = file.write_all(log_entry.as_bytes());
    }
}

pub fn is_elevated() -> bool {
    unsafe {
        let mut token = HANDLE::default();
        if OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &mut token).is_ok() {
            let mut elevation = TOKEN_ELEVATION::default();
            let mut return_length = 0;
            let result = GetTokenInformation(
                token,
                TokenElevation,
                Some(&mut elevation as *mut _ as *mut c_void),
                std::mem::size_of::<TOKEN_ELEVATION>() as u32,
                &mut return_length,
            );
            
            // Close handle strictly? Windows handle closes on drop? No, HANDLE needs CloseHandle usually but windows crate might handle it?
            // "windows" crate HANDLE implements Drop.
            
            if result.is_ok() {
                return elevation.TokenIsElevated != 0;
            }
        }
        false
    }
}

pub fn elevate_process() -> bool {
    // Get current executable path
    let current_exe = std::env::current_exe().unwrap_or_default();
    if current_exe.as_os_str().is_empty() {
        return false;
    }

    let lp_file = HSTRING::from(current_exe.to_string_lossy().as_ref());
    let lp_verb = windows::core::w!("runas");
    let lp_parameters = windows::core::w!(""); 

    unsafe {
        let result = ShellExecuteW(
            HWND(0), // No parent window
            lp_verb,
            PCWSTR(lp_file.as_ptr()),
            PCWSTR(lp_parameters.as_ptr()),
            None,
            SW_SHOW,
        );
        
        let success = result.0 > 32;
        if success {
             std::process::exit(0); // Close current instance
        }
        success
    }
}
