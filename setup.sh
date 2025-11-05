#!/bin/bash

echo "🚀 Claude Code Env Manager - Installation Script"
echo "======================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed, please install Node.js 16+"
    echo "   Visit https://nodejs.org/ to download and install"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm is installed: $(pnpm --version)"

# Check Rust
if ! command -v cargo &> /dev/null; then
    echo "🦀 Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
else
    echo "✅ Rust is installed: $(cargo --version)"
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
pnpm install

# Build frontend
echo "🔨 Building frontend code..."
pnpm run build

echo ""
echo "🎉 Installation completed!"
echo ""
echo "You can now run the following command to start the application:"
echo "pnpm run tauri:dev"
echo ""
echo "Or build the production version:"
echo "pnpm run tauri:build"