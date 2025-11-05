# Claude Code Env Manager

A desktop application based on Vue 3 + Tauri for managing multiple Claude Code environment configurations with one-click environment switching.

## 🚀 Quick Start

### Desktop Version (Full Features)

⚙️ **Requires additional Rust installation**

1. **Install Rust** (if not already installed):

   ```bash
   # macOS/Linux
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env

   # Windows
   # Visit https://rustup.rs/ to download and install
   ```

2. **Install dependencies and environment**:

   ```bash
   ./setup.sh     # macOS/Linux
   # or
   setup.bat      # Windows
   ```

3. **Launch desktop application**:
   ```bash
   ./start-dev.sh  # macOS/Linux
   # or
   start-dev.bat   # Windows
   ```

## ✨ Features

- ✅ **Environment Management**: Add, edit, delete multiple Claude Code environments
- ✅ **One-Click Switching**: Switch environment configurations with a single click
- ✅ **Status Display**: Real-time display of currently active environment configuration
- ✅ **Cross-Platform**: Support for Windows, macOS, Linux
- ✅ **Local Storage**: Environment configurations securely stored locally

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia
- **Desktop Framework**: Tauri (Rust)
- **Package Manager**: pnpm

## 📋 Requirements

- Node.js 16+
- pnpm 7+
- Rust 1.70+

## 📁 Configuration File Locations

- **Environment Configuration**: `~/.claude-code-env-manager.json`
- **Claude Configuration**: `~/.claude/settings.json`

## ⚠️ FAQ

### Q1: How to check the currently active configuration?

A: The application automatically reads `~/.claude/settings.json` on startup and displays the current configuration status at the top of the interface.

### Q2: Will the application leak my API Key?

A: No. All sensitive information is stored locally and never uploaded to any server.

## 🔧 Development

### Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Start frontend development server
pnpm run dev

# 3. Start Tauri development mode
pnpm run tauri:dev
```

### Build Release

```bash
# Build frontend
pnpm run build

# Build Tauri application
pnpm run tauri:build
```

### Code Standards

The project uses ESLint and Prettier for code formatting:

```bash
# Check code standards
pnpm run lint

# Auto-fix format issues
pnpm run lint:fix
```

## 🔒 Security Considerations

### Data Security

- All sensitive information (API Keys) is stored only on user's local machine
- No network data transmission

## 📞 Technical Support

If you encounter issues:

1. **Read Documentation**: Carefully read this README.md documentation
2. **Check Logs**: View console error messages
3. **Reinstall**: Run `./setup.sh` or `setup.bat` to clean and reinstall
4. **Submit Issues**: Create an Issue in the project repository

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📋 Changelog

### v1.0.0 (2025-11-05)

- ✅ Initial release
- ✅ Support for basic CRUD operations
- ✅ Support for one-click environment switching
- ✅ Support for configuration backup and restore
- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Complete documentation and scripts

---

**🎉 Enjoy using Claude Code Env Manager!**

If you have any suggestions or issues, feel free to provide feedback. Start managing your Claude environments now!
