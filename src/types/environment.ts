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
  { key: 'ANTHROPIC_BASE_URL', defaultValue: 'https://api.anthropic.com' },
  { key: 'ANTHROPIC_AUTH_TOKEN', defaultValue: '' },
  { key: 'API_TIMEOUT_MS', defaultValue: '300000' },
  { key: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', defaultValue: '1' },
  { key: 'ANTHROPIC_MODEL', defaultValue: 'claude-3-5-sonnet-20241022' },
  { key: 'ANTHROPIC_SMALL_FAST_MODEL', defaultValue: 'claude-3-5-haiku-20241022' },
  { key: 'ANTHROPIC_DEFAULT_SONNET_MODEL', defaultValue: 'claude-3-5-sonnet-20241022' },
  { key: 'ANTHROPIC_DEFAULT_OPUS_MODEL', defaultValue: 'claude-3-opus-20240229' },
  { key: 'ANTHROPIC_DEFAULT_HAIKU_MODEL', defaultValue: 'claude-3-5-haiku-20241022' },
  { key: 'MAX_TOKENS', defaultValue: '4096' },
  { key: 'TEMPERATURE', defaultValue: '0.7' }
] as const