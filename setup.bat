@echo off
echo 🚀 Claude Code Env Manager - Windows Installation Script
echo ================================================

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed, please install Node.js 16+
    echo    Visit https://nodejs.org/ to download and install
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Check pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing pnpm...
    npm install -g pnpm
)

echo ✅ pnpm is installed
pnpm --version

REM Check Rust
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo 🦀 Rust is not installed, please visit https://rustup.rs/ to download and install
    echo    Or use winget install Rustlang.Rust.MSVC
    pause
    exit /b 1
)

echo ✅ Rust is installed
cargo --version

REM Install project dependencies
echo 📦 Installing project dependencies...
pnpm install

REM Build frontend
echo 🔨 Building frontend code...
pnpm run build

echo.
echo 🎉 Installation completed!
echo.
echo You can now run the following command to start the application:
echo pnpm run tauri:dev
echo.
echo Or build the production version:
echo pnpm run tauri:build
echo.
pause