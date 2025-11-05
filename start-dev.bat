@echo off
echo 🚀 启动 Claude Code 环境管理器 - 开发模式
echo ==============================================

REM 检查依赖
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先运行 setup.bat
    pause
    exit /b 1
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ pnpm 未安装，请先运行 setup.bat
    pause
    exit /b 1
)

where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Rust/Cargo 未安装，请先运行 setup.bat
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

REM 启动开发服务器
echo 🔧 启动 Tauri 开发服务器...
echo    首次启动可能需要编译 Rust 代码，请耐心等待...
echo.

pnpm run tauri:dev