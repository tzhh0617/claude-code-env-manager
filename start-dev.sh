#!/bin/bash

echo "🚀 启动 Claude Code 环境管理器 - 开发模式"
echo "=========================================="

# 检查依赖
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先运行 ./setup.sh"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，请先运行 ./setup.sh"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "❌ Rust/Cargo 未安装，请先运行 ./setup.sh"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 启动开发服务器
echo "🔧 启动 Tauri 开发服务器..."
echo "   首次启动可能需要编译 Rust 代码，请耐心等待..."
echo ""

pnpm run tauri:dev