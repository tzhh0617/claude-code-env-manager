# Claude Code 环境管理器

一个基于 Vue 3 + Tauri 开发的桌面应用，用于管理多个 Claude Code 环境配置，支持一键切换不同环境。

## 🚀 快速开始

### 方式一：Web 版本（无需额外安装）

✅ **推荐新手使用**

应用已经启动！直接在浏览器中打开：
- **地址**: `http://localhost:3000/` (或自动分配的可用端口)
- **特点**: 无需安装 Rust，启动速度快，界面功能完整

### 方式二：桌面版本（完整功能）

⚙️ **需要额外安装 Rust**

1. **安装 Rust**（如果尚未安装）：
   ```bash
   # macOS/Linux
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env

   # Windows
   # 访问 https://rustup.rs/ 下载安装
   ```

2. **安装依赖和环境**：
   ```bash
   ./setup.sh     # macOS/Linux
   # 或
   setup.bat      # Windows
   ```

3. **启动桌面应用**：
   ```bash
   ./start-dev.sh  # macOS/Linux
   # 或
   start-dev.bat   # Windows
   ```

## ✨ 功能特性

- ✅ **环境管理**: 添加、编辑、删除多个 Claude Code 环境
- ✅ **一键切换**: 点击按钮即可切换环境配置
- ✅ **状态显示**: 实时显示当前使用的环境配置
- ✅ **自动备份**: 切换环境前自动备份原有配置
- ✅ **跨平台**: 支持 Windows、macOS、Linux
- ✅ **本地存储**: 环境配置安全存储在本地
- ✅ **数据验证**: 表单数据验证，防止配置错误
- ✅ **Web 版本**: 无需安装 Rust 即可使用基础功能

## 🛠️ 技术栈

- **前端**: Vue 3 + TypeScript + Vite
- **状态管理**: Pinia
- **桌面框架**: Tauri (Rust)
- **包管理**: pnpm
- **样式**: 原生 CSS + CSS Grid/Flexbox

## 📋 环境要求

- Node.js 16+
- pnpm 7+
- Rust 1.70+ (仅桌面版本需要)

## 🎯 使用指南

### 环境管理

#### 添加环境
1. 点击"添加环境"按钮
2. 填写环境信息：
   - **环境名称**（必需）：便于识别的名称（如"开发环境"）
   - **API Key**（必需）：Claude API 密钥
   - **Base URL**（可选）：API 端点，默认使用 Anthropic API
   - **模型**（可选）：选择 Claude 模型版本
   - **最大 Token 数**（可选）：限制响应长度
   - **Temperature**（可选）：控制回答随机性（0-2）
3. 点击"创建"保存

#### 切换环境
1. 在环境列表中找到目标环境
2. 点击"应用"按钮
3. 系统会自动备份原配置并应用新配置

#### 编辑环境
1. 点击环境卡片上的"编辑"按钮
2. 修改需要更改的信息
3. 点击"更新"保存

#### 删除环境
1. 点击环境卡片上的"删除"按钮
2. 确认删除操作

### 状态监控

**当前配置状态**：
- 顶部显示当前生效的配置
- 绿色指示器表示已配置，红色指示器表示未配置
- 显示 API Key、Base URL、Model 等信息

**环境状态**：
- 蓝色边框表示当前使用的环境
- 显示最后更新时间
- API Key 安全显示（部分遮蔽）

## 📁 配置文件位置

- **环境配置**: 存储在浏览器 localStorage 中
- **Claude 配置**: `~/.claude/settings.json`
- **备份文件**: `~/.claude/settings.json.backup`

### 配置文件格式

```json
{
  "api_key": "sk-ant-...",
  "base_url": "https://api.anthropic.com",
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096,
  "temperature": 0.7
}
```

## 🏗️ 项目结构

```
cc-em-web/
├── src/                     # Vue 3 前端代码
│   ├── components/          # UI 组件
│   │   ├── EnvironmentList.vue      # 环境列表组件
│   │   └── EnvironmentForm.vue      # 环境表单组件
│   ├── stores/             # Pinia 状态管理
│   │   └── environment.ts           # 环境状态管理
│   ├── types/              # TypeScript 类型定义
│   │   └── environment.ts           # 环境类型定义
│   ├── utils/              # 工具函数
│   │   └── validation.ts            # 表单验证
│   ├── views/              # 页面组件
│   │   └── HomeView.vue              # 主页面
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── src-tauri/              # Tauri 后端代码
│   ├── src/
│   │   └── main.rs         # Rust 主程序
│   ├── icons/              # 应用图标
│   ├── Cargo.toml          # Rust 依赖配置
│   └── tauri.conf.json     # Tauri 配置
├── docs/                   # 文档目录
│   ├── README.md           # 项目说明
│   ├── QUICK_START.md      # 快速开始
│   ├── USER_GUIDE.md       # 用户指南
│   └── PROJECT_SUMMARY.md  # 项目总结
├── scripts/                # 脚本目录
│   ├── setup.sh            # macOS/Linux 安装脚本
│   ├── setup.bat           # Windows 安装脚本
│   ├── start-dev.sh        # macOS/Linux 启动脚本
│   └── start-dev.bat       # Windows 启动脚本
├── package.json            # Node.js 依赖配置
├── vite.config.ts          # Vite 构建配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 本文档
```

## 💡 使用技巧

### 环境命名建议
- 使用描述性名称：`开发环境`、`测试环境`、`生产环境`
- 或按项目命名：`项目A-开发`、`项目B-生产`
- 或按用途命名：`个人用途`、`公司项目`

### API Key 安全
- 不要在公共设备上保存 API Key
- 定期更换 API Key
- 使用环境特定的 Key，不要混用

### 模型选择建议
- **Claude 3.5 Sonnet**：通用性能最强，适合大部分任务
- **Claude 3.5 Haiku**：速度快，适合简单任务
- **Claude 3 Opus**：最智能，适合复杂推理任务

### 参数调优
- **Temperature 0.0-0.3**：适合需要准确性的任务（编程、数据分析）
- **Temperature 0.7-1.0**：适合创意性任务（写作、头脑风暴）
- **Max Tokens**：根据需要设置，对话类建议 2048-4096

## ⚠️ 常见问题

### Q1: 如何查看当前生效的配置？
A: 应用启动时会自动读取 `~/.claude/settings.json` 并在界面顶部显示当前配置状态。

### Q2: 应用会泄露我的 API Key 吗？
A: 不会。所有敏感信息都存储在本地，不会上传到任何服务器。

### Q3: 如何恢复误删的配置？
A: 每次切换环境时都会自动备份原配置到 `~/.claude/settings.json.backup`，可以手动恢复。

### Q4: Web 版本和桌面版本有什么区别？
A: Web 版本无法直接修改系统文件，但可以管理和预览环境配置。桌面版本支持完整的功能，包括一键切换环境。

### Q5: 支持哪些 Claude 模型？
A: 支持所有 Claude 3 系列模型，包括 Claude 3.5 Sonnet、Claude 3.5 Haiku、Claude 3 Opus 等。

### Q6: 应用启动失败怎么办？
A:
1. 检查是否安装了所需依赖
2. 运行 `./setup.sh` 或 `setup.bat` 重新安装
3. 查看错误信息并搜索解决方案

## 🔧 开发说明

### 本地开发

```bash
# 1. 安装依赖
pnpm install

# 2. 启动前端开发服务器
pnpm run dev

# 3. 启动 Tauri 开发模式
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

## 🔒 安全考虑

### 数据安全
- 所有敏感信息（API Key）仅存储在用户本地
- 不进行任何网络数据传输
- 配置文件读写权限控制

### 输入验证
- API Key 格式验证
- URL 格式验证
- 数值范围验证
- XSS 防护

## 📞 技术支持

如果遇到问题：

1. **查看文档**：仔细阅读本 README.md 文档
2. **检查日志**：查看控制台错误信息
3. **重新安装**：运行 `./setup.sh` 或 `setup.bat` 清理重装
4. **提交问题**：在项目仓库创建 Issue

## 🔄 未来规划

### v1.1.0 计划功能
- 📋 配置导入导出功能
- 🎨 主题切换（深色/浅色模式）
- 📊 使用统计和历史记录
- 🔔 更新提醒和版本检查
- 🌐 多语言支持

### 长期规划
- 🔌 插件系统
- ☁️ 云端同步（可选）
- 🤖 AI 辅助配置建议
- 📱 移动端支持

## 📄 许可证

MIT License - 允许自由使用、修改和分发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📋 更新日志

### v1.0.0 (2025-11-05)
- ✅ 初始版本发布
- ✅ 支持基本的增删改查功能
- ✅ 支持一键切换环境
- ✅ 支持配置备份和恢复
- ✅ 跨平台支持（Windows、macOS、Linux）
- ✅ Web 版本支持
- ✅ 完整的文档和脚本

---

**🎉 享受使用 Claude Code 环境管理器！**

如有任何建议或问题，欢迎反馈。现在就开始管理您的 Claude 环境吧！