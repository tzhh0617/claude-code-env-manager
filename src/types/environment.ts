export interface ClaudeEnvironment {
  id: string
  name: string
  env: EnvVar[]
  createdAt: string
  updatedAt: string
}

export interface ClaudeSettings {
  env: Record<string, string>
}

export interface EnvVar {
  key: string
  value: string
}

export interface EnvironmentFormData {
  name: string
  env: EnvVar[]
}

// 常用的环境变量预设
export const COMMON_ENV_VARS = [
  { key: 'ANTHROPIC_BASE_URL', description: 'API基础URL', defaultValue: 'https://api.anthropic.com' },
  { key: 'ANTHROPIC_AUTH_TOKEN', description: 'API认证令牌', defaultValue: '' },
  { key: 'API_TIMEOUT_MS', description: 'API超时时间(毫秒)', defaultValue: '300000' },
  { key: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', description: '禁用非必要流量', defaultValue: '1' },
  { key: 'ANTHROPIC_MODEL', description: '主要模型', defaultValue: 'claude-3-5-sonnet-20241022' },
  { key: 'ANTHROPIC_SMALL_FAST_MODEL', description: '小型快速模型', defaultValue: 'claude-3-5-haiku-20241022' },
  { key: 'ANTHROPIC_DEFAULT_SONNET_MODEL', description: '默认Sonnet模型', defaultValue: 'claude-3-5-sonnet-20241022' },
  { key: 'ANTHROPIC_DEFAULT_OPUS_MODEL', description: '默认Opus模型', defaultValue: 'claude-3-opus-20240229' },
  { key: 'ANTHROPIC_DEFAULT_HAIKU_MODEL', description: '默认Haiku模型', defaultValue: 'claude-3-5-haiku-20241022' },
  { key: 'MAX_TOKENS', description: '最大Token数', defaultValue: '4096' },
  { key: 'TEMPERATURE', description: '温度参数', defaultValue: '0.7' }
] as const