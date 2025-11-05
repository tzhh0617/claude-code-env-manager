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