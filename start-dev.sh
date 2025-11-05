#!/bin/bash

echo "🚀 Starting Claude Code Env Manager - Development Mode"
echo "=========================================="

# Check dependencies
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed, please run ./setup.sh first"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed, please run ./setup.sh first"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "❌ Rust/Cargo is not installed, please run ./setup.sh first"
    exit 1
fi

echo "✅ Environment check passed"
echo ""

# Start development server
echo "🔧 Starting Tauri development server..."
echo "   First startup may need to compile Rust code, please be patient..."
echo ""

pnpm run tauri:dev