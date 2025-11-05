// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EnvVar {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ClaudeEnvironment {
    pub name: String,
    pub env: Vec<EnvVar>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClaudeSettings {
    pub env: std::collections::HashMap<String, String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClaudeSettingsWithEnv {
    env: std::collections::HashMap<String, String>,
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

    // 尝试解析为标准格式
    if let Ok(settings_with_env) = serde_json::from_str::<ClaudeSettingsWithEnv>(&content) {
        return Ok(Some(ClaudeSettings {
            env: settings_with_env.env,
        }));
    }

    // 尝试解析为旧的HashMap格式并转换
    #[derive(Debug, Serialize, Deserialize)]
    struct OldClaudeSettings {
        env: std::collections::HashMap<String, String>,
    }

    if let Ok(old_settings) = serde_json::from_str::<OldClaudeSettings>(&content) {
        let env: Vec<EnvVar> = old_settings.env
            .into_iter()
            .map(|(key, value)| EnvVar { key, value })
            .collect();

        return Ok(Some(ClaudeSettings { env }));
    }

    // 尝试解析为最旧的格式并转换
    #[derive(Debug, Serialize, Deserialize)]
    struct LegacyClaudeSettings {
        api_key: String,
        base_url: Option<String>,
        model: Option<String>,
        max_tokens: Option<u32>,
        temperature: Option<f32>,
    }

    if let Ok(legacy_settings) = serde_json::from_str::<LegacyClaudeSettings>(&content) {
        let mut env = Vec::new();
        env.push(EnvVar {
            key: "ANTHROPIC_AUTH_TOKEN".to_string(),
            value: legacy_settings.api_key,
        });

        if let Some(base_url) = legacy_settings.base_url {
            env.push(EnvVar {
                key: "ANTHROPIC_BASE_URL".to_string(),
                value: base_url,
            });
        }

        if let Some(model) = legacy_settings.model {
            env.push(EnvVar {
                key: "ANTHROPIC_MODEL".to_string(),
                value: model,
            });
        }

        if let Some(max_tokens) = legacy_settings.max_tokens {
            env.push(EnvVar {
                key: "MAX_TOKENS".to_string(),
                value: max_tokens.to_string(),
            });
        }

        if let Some(temperature) = legacy_settings.temperature {
            env.push(EnvVar {
                key: "TEMPERATURE".to_string(),
                value: temperature.to_string(),
            });
        }

        return Ok(Some(ClaudeSettings { env }));
    }

    Err(format!("无法解析 settings.json，既不是新格式也不是旧格式"))
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

    // 将数组格式转换为HashMap格式保存
    let env_hashmap: std::collections::HashMap<String, String> = environment.env
        .into_iter()
        .filter(|env_var| !env_var.key.trim().is_empty())
        .map(|env_var| (env_var.key, env_var.value))
        .collect();

    let settings = ClaudeSettingsWithEnv {
        env: env_hashmap,
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