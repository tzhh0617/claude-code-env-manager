# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + Tauri desktop application for managing multiple Claude Code environment configurations. It allows users to switch between different Claude API configurations (API keys, models, etc.) with a single click. The application has both web and desktop versions.

## Development Commands

### Basic Development
```bash
# Install dependencies
pnpm install

# Start web development server (Vite)
pnpm run dev

# Start Tauri development mode (desktop app)
pnpm run tauri:dev

# Type checking
vue-tsc

# Build for production
pnpm run build

# Build Tauri desktop app
pnpm run tauri:build
```

### Code Quality
```bash
# Lint with ESLint
pnpm run lint

# Auto-fix linting issues
pnpm run lint:fix

# Format with Prettier
pnpm run format
```

## Architecture

### Frontend (Vue 3)
- **Framework**: Vue 3 with Composition API and TypeScript
- **State Management**: Pinia store located in `src/stores/environment.ts`
- **Routing**: Vue Router (simple single-page app)
- **Build Tool**: Vite with TypeScript support
- **Components**:
  - `EnvironmentList.vue`: Displays and manages environment configurations
  - `EnvironmentForm.vue`: Form for creating/editing environments
  - `HomeView.vue`: Main application view

### Backend (Tauri - Rust)
- **Main Rust Code**: `src-tauri/src/main.rs`
- **Tauri Commands**: Handle file system operations for Claude settings
- **Permissions**: File system access enabled for reading/writing `~/.claude/settings.json`

### Data Flow
1. Environment configurations stored in browser localStorage
2. Claude settings file (`~/.claude/settings.json`) managed via Tauri backend
3. State management handled by Pinia store with reactive computed properties
4. API calls to Tauri backend for file operations

### Key Types
- `ClaudeEnvironment`: Complete environment configuration with metadata
- `ClaudeSettings`: Raw Claude settings file format
- `EnvironmentFormData`: Form data for create/edit operations

## Project Structure

```
src/
├── components/           # Vue components
│   ├── EnvironmentList.vue
│   └── EnvironmentForm.vue
├── stores/              # Pinia state management
│   └── environment.ts
├── types/               # TypeScript type definitions
│   └── environment.ts
├── utils/               # Utility functions
│   └── validation.ts
├── views/               # Page components
│   └── HomeView.vue
├── App.vue              # Root component
└── main.ts              # Application entry point

src-tauri/
├── src/
│   └── main.rs          # Rust backend
├── Cargo.toml           # Rust dependencies
└── tauri.conf.json      # Tauri configuration
```

## Development Notes

### Environment Management
- The app manages `~/.claude/settings.json` file for Claude configurations
- Each environment switch creates a backup of the previous settings
- Environment data is persisted in localStorage under key `claude_environments`

### Tauri Integration
- Frontend communicates with Rust backend via `invoke()` calls
- Key Tauri commands: `get_current_settings`, `apply_environment`
- File system permissions are configured in `tauri.conf.json`

### State Management Pattern
- Uses Pinia with Composition API pattern
- Reactive computed properties for derived state (e.g., `activeEnvironment`)
- Async operations with loading states and error handling

### Form Validation
- Custom validation utilities in `src/utils/validation.ts`
- API key format validation and URL validation
- Type-safe form handling with TypeScript interfaces

## Testing and Quality

- ESLint configured for Vue 3 + TypeScript
- Prettier for code formatting
- TypeScript strict mode enabled
- Vue TSC for type checking during build

## Build Process

1. `vite build` creates the frontend bundle in `dist/`
2. `tauri build` packages the desktop application
3. Development uses hot reload with Vite dev server
4. Tauri dev mode rebuilds Rust code on changes