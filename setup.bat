@echo off
echo 🚀 Claude Code 环境管理器 - Windows 安装脚本
echo ================================================

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js 16+
    echo    访问 https://nodejs.org/ 下载安装
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node --version

REM 检查 pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 安装 pnpm...
    npm install -g pnpm
)

echo ✅ pnpm 已安装
pnpm --version

REM 检查 Rust
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo 🦀 Rust 未安装，请访问 https://rustup.rs/ 下载安装
    echo    或者使用 winget install Rustlang.Rust.MSVC
    pause
    exit /b 1
)

echo ✅ Rust 已安装
cargo --version

REM 安装项目依赖
echo 📦 安装项目依赖...
pnpm install

REM 构建前端
echo 🔨 构建前端代码...
pnpm run build

echo.
echo 🎉 安装完成！
echo.
echo 现在可以运行以下命令启动应用：
echo pnpm run tauri:dev
echo.
echo 或者构建生产版本：
echo pnpm run tauri:build
echo.
pause