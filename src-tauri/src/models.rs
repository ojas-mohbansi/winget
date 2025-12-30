use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WingetPackage {
    #[serde(rename = "Id")]
    pub id: String,
    #[serde(rename = "Name")]
    pub name: String,
    #[serde(rename = "Version")]
    pub version: String,
    #[serde(default, rename = "Source")]
    pub source: Option<String>,
    #[serde(default, rename = "Available")]
    pub available_version: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WingetCommandResult {
    pub success: bool,
    pub output: Option<String>, // JSON output if successful and applicable
    pub error: Option<String>,
    pub code: Option<i32>,
}
