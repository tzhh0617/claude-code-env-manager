@echo off
echo 🚀 Starting Claude Code Env Manager - Development Mode
echo ==============================================

REM Check dependencies
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed, please run setup.bat first
    pause
    exit /b 1
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ pnpm is not installed, please run setup.bat first
    pause
    exit /b 1
)

where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Rust/Cargo is not installed, please run setup.bat first
    pause
    exit /b 1
)

echo ✅ Environment check passed
echo.

REM Start development server
echo 🔧 Starting Tauri development server...
echo    First startup may need to compile Rust code, please be patient...
echo.

pnpm run tauri:dev