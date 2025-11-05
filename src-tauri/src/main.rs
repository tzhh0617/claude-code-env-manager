// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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
        .map_err(|e| format!("Failed to read file: {}", e))?;

    Ok(Some(content))
}

#[tauri::command]
async fn write_file(file_path: String, content: String) -> Result<String, String> {
    let path = PathBuf::from(&file_path);

    // Auto-create parent directory
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    // Write file
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(format!("File successfully written: {}", file_path))
}

#[tauri::command]
async fn get_home_dir() -> Result<String, String> {
    let home_dir = dirs::home_dir().ok_or("Unable to find user home directory")?;
    Ok(home_dir.to_string_lossy().to_string())
}

#[tauri::command]
async fn show_error(message: String) {
    // This command can show error dialog when called from frontend
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
            // Ensure dependencies are available
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