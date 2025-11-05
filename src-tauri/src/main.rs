// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ClaudeEnvironment {
    pub name: String,
    pub api_key: String,
    pub base_url: Option<String>,
    pub model: Option<String>,
    pub max_tokens: Option<u32>,
    pub temperature: Option<f32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClaudeSettings {
    pub api_key: String,
    pub base_url: Option<String>,
    pub model: Option<String>,
    pub max_tokens: Option<u32>,
    pub temperature: Option<f32>,
}

fn get_claude_settings_path() -> Result<PathBuf, String> {
    let home_dir = dirs::home_dir().ok_or("无法找到用户主目录")?;
    let claude_dir = home_dir.join(".claude");

    if !claude_dir.exists() {
        fs::create_dir_all(&claude_dir).map_err(|e| format!("创建 .claude 目录失败: {}", e))?;
    }

    Ok(claude_dir.join("settings.json"))
}

#[tauri::command]
async fn get_current_settings() -> Result<Option<ClaudeSettings>, String> {
    let settings_path = get_claude_settings_path()?;

    if !settings_path.exists() {
        return Ok(None);
    }

    let content = fs::read_to_string(&settings_path)
        .map_err(|e| format!("读取 settings.json 失败: {}", e))?;

    let settings: ClaudeSettings = serde_json::from_str(&content)
        .map_err(|e| format!("解析 settings.json 失败: {}", e))?;

    Ok(Some(settings))
}

#[tauri::command]
async fn apply_environment(environment: ClaudeEnvironment) -> Result<String, String> {
    let settings_path = get_claude_settings_path()?;

    // 备份现有文件
    if settings_path.exists() {
        let backup_path = settings_path.with_extension("json.backup");
        fs::copy(&settings_path, &backup_path)
            .map_err(|e| format!("创建备份文件失败: {}", e))?;
    }

    let settings = ClaudeSettings {
        api_key: environment.api_key,
        base_url: environment.base_url,
        model: environment.model,
        max_tokens: environment.max_tokens,
        temperature: environment.temperature,
    };

    let content = serde_json::to_string_pretty(&settings)
        .map_err(|e| format!("序列化设置失败: {}", e))?;

    fs::write(&settings_path, content)
        .map_err(|e| format!("写入 settings.json 失败: {}", e))?;

    Ok(format!("环境 '{}' 已成功应用", environment.name))
}

#[tauri::command]
async fn show_error(message: String) {
    // 这个命令可以在前端调用时显示错误对话框
    println!("Error: {}", message);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_current_settings,
            apply_environment,
            show_error
        ])
        .setup(|app| {
            // 确保依赖项可用
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}