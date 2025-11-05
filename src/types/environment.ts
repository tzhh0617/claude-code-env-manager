export interface ClaudeEnvironment {
  id: string
  name: string
  apiKey: string
  baseUrl?: string
  model?: string
  maxTokens?: number
  temperature?: number
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface ClaudeSettings {
  apiKey: string
  baseUrl?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface EnvironmentFormData {
  name: string
  apiKey: string
  baseUrl: string
  model: string
  maxTokens: string
  temperature: string
}