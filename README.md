# Claude Code 环境管理器

一个基于 Vue 3 + Tauri 开发的桌面应用，用于管理多个 Claude Code 环境配置，支持一键切换不同环境。

## 功能特性

- ✅ **环境管理**: 添加、编辑、删除多个 Claude Code 环境
- ✅ **一键切换**: 点击按钮即可切换环境配置
- ✅ **状态显示**: 实时显示当前使用的环境配置
- ✅ **自动备份**: 切换环境前自动备份原有配置
- ✅ **跨平台**: 支持 Windows、macOS、Linux
- ✅ **本地存储**: 环境配置安全存储在本地
- ✅ **数据验证**: 表单数据验证，防止配置错误

## 技术栈

- **前端**: Vue 3 + TypeScript + Vite
- **状态管理**: Pinia
- **桌面框架**: Tauri (Rust)
- **包管理**: pnpm
- **样式**: 原生 CSS + CSS Grid/Flexbox

## 环境要求

- Node.js 16+
- pnpm 7+
- Rust 1.70+ (用于 Tauri)

## 安装步骤

### 1. 克隆项目
```bash
git clone <repository-url>
cd cc-em-web
```

### 2. 安装 Node.js 依赖
```bash
pnpm install
```

### 3. 安装 Rust (如果尚未安装)
```bash
# macOS
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows
# 访问 https://rustup.rs/ 下载安装程序

# Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 4. 构建和运行
```bash
# 开发模式
pnpm run tauri:dev

# 构建生产版本
pnpm run tauri:build
```

## 使用说明

### 添加环境
1. 点击"添加环境"按钮
2. 填写环境信息：
   - 环境名称（必需）
   - API Key（必需）
   - Base URL（可选，默认使用 Anthropic API）
   - 模型（可选，默认使用最新模型）
   - 最大 Token 数（可选）
   - Temperature（可选，0-2之间）
3. 点击"创建"保存

### 切换环境
1. 在环境列表中找到目标环境
2. 点击"应用"按钮
3. 系统会自动备份原配置并应用新配置

### 编辑环境
1. 点击环境卡片上的"编辑"按钮
2. 修改需要更改的信息
3. 点击"更新"保存

### 删除环境
1. 点击环境卡片上的"删除"按钮
2. 确认删除操作

## 配置文件位置

- **环境配置**: 存储在浏览器 localStorage 中
- **Claude 配置**: `~/.claude/settings.json`
- **备份文件**: `~/.claude/settings.json.backup`

## 项目结构

```
cc-em-web/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── EnvironmentList.vue
│   │   └── EnvironmentForm.vue
│   ├── stores/             # Pinia 状态管理
│   │   └── environment.ts
│   ├── types/              # TypeScript 类型定义
│   │   └── environment.ts
│   ├── utils/              # 工具函数
│   │   └── validation.ts
│   ├── views/              # 页面组件
│   │   └── HomeView.vue
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── src-tauri/              # Tauri 后端代码
│   ├── src/
│   │   └── main.rs         # Rust 主程序
│   ├── Cargo.toml          # Rust 依赖配置
│   └── tauri.conf.json     # Tauri 配置
├── package.json            # Node.js 依赖配置
├── vite.config.ts          # Vite 构建配置
└── tsconfig.json           # TypeScript 配置
```

## 常见问题

### Q: 如何查看当前生效的配置？
A: 应用启动时会自动读取 `~/.claude/settings.json` 并在界面顶部显示当前配置状态。

### Q: 应用会泄露我的 API Key 吗？
A: 不会。所有敏感信息都存储在本地，不会上传到任何服务器。

### Q: 如何恢复误删的配置？
A: 每次切换环境时都会自动备份原配置到 `~/.claude/settings.json.backup`，可以手动恢复。

### Q: 支持哪些 Claude 模型？
A: 支持所有 Claude 3 系列模型，包括 Claude 3.5 Sonnet、Claude 3.5 Haiku、Claude 3 Opus 等。

## 开发说明

### 本地开发
```bash
# 启动前端开发服务器
pnpm run dev

# 启动 Tauri 开发模式
pnpm run tauri:dev
```

### 构建发布
```bash
# 构建前端
pnpm run build

# 构建 Tauri 应用
pnpm run tauri:build
```

### 代码规范
项目使用 ESLint 和 Prettier 进行代码格式化：
```bash
# 检查代码规范
pnpm run lint

# 自动修复格式问题
pnpm run lint:fix
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本的增删改查功能
- 支持一键切换环境
- 支持配置备份和恢复# claude-code-env-manager
