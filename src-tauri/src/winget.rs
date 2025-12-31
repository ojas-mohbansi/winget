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
use std::process::{Command, Stdio};
use std::os::windows::process::CommandExt;
use std::io::{BufRead, BufReader};
use tauri::{AppHandle, Emitter};
use crate::models::{WingetCommandResult, WingetPackage};
use crate::security::{is_command_allowed, log_audit_event};
use regex::Regex;

const CREATION_FLAGS_NO_WINDOW: u32 = 0x08000000;

pub struct WingetWrapper;

impl WingetWrapper {
    pub fn run_command(app_handle: &AppHandle, args: Vec<&str>) -> WingetCommandResult {
        // 1. Security Check
        if !is_command_allowed(&args) {
            let _ = log_audit_event(app_handle, "BLOCKED", &args.join(" "), "Security Violations: Command not allowed");
            return WingetCommandResult {
                success: false,
                output: None,
                error: Some("Command blocked by security policy".to_string()),
                code: Some(-1),
            };
        }

        // 2. Construct Command String
        let cmd_string = format!("winget {}", args.join(" "));
        let cmd_type = args[0];
        
        // Streamable commands output progress logs we want to show
        let is_streamable = args.contains(&"install") || 
                            args.contains(&"uninstall") || 
                            (args.contains(&"upgrade") && (args.contains(&"--id") || args.contains(&"--all")));
        
        // Commands that return parseable package lists
        let is_package_list = (cmd_type == "list" || cmd_type == "search" || cmd_type == "upgrade") && !is_streamable;

        // 3. Execution
        let mut command = Command::new("pwsh");
        // Force UTF-8 encoding for parsing
        let script = format!("$OutputEncoding = [Console]::InputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding; {}", cmd_string);
        
        command.args(["-NoProfile", "-NonInteractive", "-Command", &script]);
        command.creation_flags(CREATION_FLAGS_NO_WINDOW);
        command.stdout(Stdio::piped());
        command.stderr(Stdio::piped());

        let mut child = match command.spawn() {
            Ok(c) => c,
            Err(e) => {
                 log_audit_event(app_handle, "ERROR", &cmd_string, &e.to_string());
                 return WingetCommandResult {
                    success: false,
                    output: None,
                    error: Some(e.to_string()),
                    code: Some(-2),
                };
            }
        };

        // Stream stdout
        let stdout = child.stdout.take().unwrap();
        let app_handle_clone = app_handle.clone();
        let cmd_string_clone = cmd_string.clone();
        
        let mut collected_stdout = String::new();
        let mut collected_stderr = String::new();

        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(l) = line {
                collected_stdout.push_str(&l);
                collected_stdout.push('\n');
                if is_streamable {
                    let _ = app_handle_clone.emit("winget-output", &l);
                }
            }
        }
        
        // Stream stderr
        if let Some(stderr) = child.stderr.take() {
             let reader_err = BufReader::new(stderr);
             for line in reader_err.lines() {
                  if let Ok(l) = line {
                      collected_stderr.push_str(&l);
                      collected_stderr.push('\n');
                      if is_streamable {
                        let _ = app_handle_clone.emit("winget-error", &l);
                      }
                  }
             }
        }

        let status = child.wait().unwrap();
        let success = status.success();
        let exit_code = status.code().unwrap_or(0);

        // Audit Log
        let status_str = if success { "SUCCESS" } else { "FAILURE" };
        log_audit_event(app_handle, "EXECUTE", &cmd_string_clone, status_str);

        // PARSING LOGIC
        let mut final_output = Some(collected_stdout.clone());

        if success && is_package_list {
            let is_upgrade_list = cmd_type == "upgrade";
            let packages = Self::parse_winget_output(&collected_stdout, is_upgrade_list);
            if let Ok(json_str) = serde_json::to_string(&packages) {
                final_output = Some(json_str);
            }
        }

        WingetCommandResult {
            success,
            output: final_output,
            error: if success { None } else { Some(collected_stderr) },
            code: Some(exit_code),
        }
    }

    fn parse_winget_output(output: &str, is_upgrade_list: bool) -> Vec<WingetPackage> {
        let mut packages = Vec::new();
        let mut started = false;
        let mut header_found = false;
        
        // Column positions (will be determined from header)
        let mut name_end: usize = 0;
        let mut id_end: usize = 0;
        let mut version_end: usize = 0;
        let mut available_start: usize = 0;

        for line in output.lines() {
            let trimmed = line.trim();
            if trimmed.is_empty() { continue; }
            
            // Skip progress messages and other noise
            if trimmed.starts_with("\\") || trimmed.contains("██") || trimmed.contains("▒") {
                continue;
            }
            
            // Detect header line
            if !header_found && trimmed.starts_with("Name") && trimmed.contains("Id") {
                // Parse column positions from header
                if let Some(id_pos) = trimmed.find("Id") {
                    name_end = id_pos;
                }
                if let Some(ver_pos) = trimmed.find("Version") {
                    id_end = ver_pos;
                }
                if let Some(avail_pos) = trimmed.find("Available") {
                    version_end = avail_pos;
                    available_start = avail_pos;
                } else if let Some(source_pos) = trimmed.find("Source") {
                    version_end = source_pos;
                }
                header_found = true;
                continue;
            }
            
            // Skip separator line
            if trimmed.starts_with("---") || trimmed.starts_with("---") {
                started = true;
                continue;
            }
            
            if !started { continue; }
            
            // Parse data line using column positions
            let line_len = line.len();
            
            // Extract columns based on positions
            let name = if name_end > 0 && line_len >= name_end {
                &line[..name_end.min(line_len)]
            } else {
                ""
            }.trim();
            
            let id = if id_end > name_end && line_len >= id_end {
                &line[name_end..id_end.min(line_len)]
            } else if name_end > 0 && line_len > name_end {
                &line[name_end..]
            } else {
                ""
            }.trim();
            
            let version = if version_end > id_end && line_len >= version_end {
                &line[id_end..version_end.min(line_len)]
            } else if id_end > 0 && line_len > id_end {
                &line[id_end..]
            } else {
                ""
            }.trim();
            
            // For upgrade list, extract available version
            let available = if is_upgrade_list && available_start > 0 && line_len > available_start {
                let avail_str = &line[available_start..];
                // Take first word as version
                avail_str.split_whitespace().next().map(|s| s.to_string())
            } else {
                None
            };
            
            // Validate we have required fields
            if name.is_empty() || id.is_empty() || version.is_empty() {
                // Try regex fallback for edge cases
                let re = Regex::new(r"^(?P<name>.*?)\s{2,}(?P<id>[^\s]+)\s{2,}(?P<version>[^\s]+)").unwrap();
                if let Some(caps) = re.captures(line) {
                    let name = caps.name("name").unwrap().as_str().trim();
                    let id = caps.name("id").unwrap().as_str().trim();
                    let version = caps.name("version").unwrap().as_str().trim();
                    
                    if name != "Name" && id != "Id" && !name.is_empty() && !id.is_empty() {
                        packages.push(WingetPackage {
                            name: name.to_string(),
                            id: id.to_string(),
                            version: version.to_string(),
                            source: Some("winget".to_string()),
                            available_version: None
                        });
                    }
                }
                continue;
            }
            
            // Skip header row if it slipped through
            if name == "Name" && id == "Id" { continue; }
            
            packages.push(WingetPackage {
                name: name.to_string(),
                id: id.to_string(),
                version: version.to_string(),
                source: Some("winget".to_string()),
                available_version: available
            });
        }
        packages
    }
}

