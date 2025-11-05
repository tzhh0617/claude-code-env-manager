# Claude 环境管理器 - 环境缓存机制

## 🎯 缓存策略
**纯文件缓存**：只使用文件系统，无降级机制

## 📁 缓存文件结构

### 文件位置
```
~/.claude-code-env-manager.json
```

### 文件格式
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-05T06:30:00.000Z",
  "environments": [
    {
      "id": "1731234567890",
      "name": "MiniMax 环境",
      "env": [
        {
          "key": "ANTHROPIC_AUTH_TOKEN",
          "value": "sk-mini-xxxxx"
        },
        {
          "key": "ANTHROPIC_BASE_URL",
          "value": "https://api.minimaxi.com/anthropic"
        }
      ],
      "createdAt": "2025-11-05T06:30:00.000Z",
      "updatedAt": "2025-11-05T06:30:00.000Z"
    }
  ]
}
```

## 🔄 加载流程

### 简化策略
```
1. 文件缓存 (~/.claude-code-env-manager.json)
   ↓ 文件不存在或读取失败
2. 空数组初始化
```

### 直接加载
- 直接从文件读取环境配置
- 文件不存在时初始化为空数组
- 读取失败时显示错误并初始化为空数组

## 💾 保存机制

### 纯文件保存
```typescript
const saveEnvironments = async () => {
  // 直接保存到文件
  await saveEnvironmentsToFile()
}
```

### 文件保存逻辑
```typescript
const saveEnvironmentsToFile = async () => {
  const cacheData = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    environments: environments.value
  }

  const jsonContent = JSON.stringify(cacheData, null, 2)

  await invoke('write_file', {
    filePath: `${homeDir}/.claude-code-env-manager.json`,
    content: jsonContent
  })
}
```

## 🛡️ 错误处理

### 简化策略
1. **文件读取失败** → 初始化空数组，显示错误
2. **文件写入失败** → 显示错误，用户重试
3. **JSON解析失败** → 初始化空数组，显示错误

### 日志记录
```typescript
// 成功日志
console.log('从文件加载环境配置:', environments.value.length, '个环境')
console.log('环境配置已保存到文件:', environments.value.length, '个环境')

// 错误日志
console.error('加载环境配置失败:', err)
console.error('保存环境配置到文件失败:', err)
```

## 🚀 使用场景

### 1. 跨设备同步
- 文件缓存可以轻松备份和同步
- 支持手动编辑配置文件
- 便于版本控制

### 2. 数据迁移
- 从旧版本应用升级时保持数据
- 支持配置文件的导入/导出
- 便于数据恢复

### 3. 调试和开发
- 可以直接查看和编辑缓存文件
- 便于测试不同的环境配置
- 支持批量配置修改

## 📊 文件缓存优势

### 核心优势
- **🗄️ 容量无限制**：支持大量环境配置
- **🔄 跨标签页同步**：多个浏览器标签页数据一致
- **📁 文件系统访问**：可以手动备份和编辑
- **🛡️ 数据安全**：不依赖浏览器存储
- **⚡ 代码简洁**：无降级逻辑，维护简单

## 🔧 开发者工具

### 手动查看缓存
```bash
# 查看缓存文件
cat ~/.claude-code-env-manager.json

# 备份缓存
cp ~/.claude-code-env-manager.json ~/.claude-code-env-manager.backup.json
```

### 调试命令
```javascript
// 在浏览器控制台中
console.log('当前环境数量:', environmentStore.environments.length)
console.log('缓存文件路径:', `${await invoke('get_home_dir')}/.claude-code-env-manager.json`)
```

## ✅ 实现特性

- ✅ **纯文件缓存**：只使用文件系统存储
- ✅ **实时保存**：所有操作立即保存到文件
- ✅ **错误处理**：清晰的错误提示和恢复机制
- ✅ **跨标签页**：文件缓存支持多标签页同步
- ✅ **版本控制**：缓存文件包含版本信息
- ✅ **元数据**：记录最后更新时间
- ✅ **代码简洁**：无复杂的降级逻辑，易于维护

这个缓存机制提供了简洁、可靠的文件存储方案，确保用户的环境配置安全、持久且易于管理！🎯