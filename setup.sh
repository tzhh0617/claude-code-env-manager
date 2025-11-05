#!/bin/bash

echo "🚀 Claude Code 环境管理器 - 安装脚本"
echo "======================================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 16+"
    echo "   访问 https://nodejs.org/ 下载安装"
    exit 1
fi

echo "✅ Node.js 已安装: $(node --version)"

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm 已安装: $(pnpm --version)"

# 检查 Rust
if ! command -v cargo &> /dev/null; then
    echo "🦀 安装 Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
else
    echo "✅ Rust 已安装: $(cargo --version)"
fi

# 安装项目依赖
echo "📦 安装项目依赖..."
pnpm install

# 构建前端
echo "🔨 构建前端代码..."
pnpm run build

echo ""
echo "🎉 安装完成！"
echo ""
echo "现在可以运行以下命令启动应用："
echo "pnpm run tauri:dev"
echo ""
echo "或者构建生产版本："
echo "pnpm run tauri:build"