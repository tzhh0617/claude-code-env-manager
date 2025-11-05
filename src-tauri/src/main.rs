// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;


#[tauri::command]
async fn read_file(file_path: String) -> Result<Option<String>, String> {
    let path = PathBuf::from(&file_path);

    if !path.exists() {
        return Ok(None);
    }

    let content = fs::read_to_string(&path)
        .map_err(|e| format!("读取文件失败: {}", e))?;

    Ok(Some(content))
}

#[tauri::command]
async fn write_file(file_path: String, content: String) -> Result<String, String> {
    let path = PathBuf::from(&file_path);

    // 自动创建父目录
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("创建目录失败: {}", e))?;
    }

    // 写入文件
    fs::write(&path, content)
        .map_err(|e| format!("写入文件失败: {}", e))?;

    Ok(format!("文件已成功写入: {}", file_path))
}

#[tauri::command]
async fn get_home_dir() -> Result<String, String> {
    let home_dir = dirs::home_dir().ok_or("无法找到用户主目录")?;
    Ok(home_dir.to_string_lossy().to_string())
}

#[tauri::command]
async fn show_error(message: String) {
    // 这个命令可以在前端调用时显示错误对话框
    println!("Error: {}", message);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_file,
            write_file,
            get_home_dir,
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