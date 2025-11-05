import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ClaudeEnvironment, ClaudeSettings, EnvironmentFormData } from '@/types/environment'
import { invoke } from '@tauri-apps/api/tauri'

export const useEnvironmentStore = defineStore('environment', () => {
  const environments = ref<ClaudeEnvironment[]>([])
  const currentSettings = ref<ClaudeSettings | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeEnvironment = computed(() =>
    environments.value.find(env => env.isActive)
  )

  const loadEnvironments = () => {
    try {
      const stored = localStorage.getItem('claude_environments')
      if (stored) {
        environments.value = JSON.parse(stored)
      }
    } catch (err) {
      console.error('加载环境配置失败:', err)
      error.value = '加载环境配置失败'
    }
  }

  const saveEnvironments = () => {
    try {
      localStorage.setItem('claude_environments', JSON.stringify(environments.value))
    } catch (err) {
      console.error('保存环境配置失败:', err)
      error.value = '保存环境配置失败'
    }
  }

  const loadCurrentSettings = async () => {
    try {
      isLoading.value = true
      const settings = await invoke<ClaudeSettings | null>('get_current_settings')
      currentSettings.value = settings
    } catch (err) {
      console.error('加载当前设置失败:', err)
      error.value = '加载当前设置失败'
    } finally {
      isLoading.value = false
    }
  }

  const addEnvironment = (formData: EnvironmentFormData) => {
    const newEnvironment: ClaudeEnvironment = {
      id: Date.now().toString(),
      name: formData.name,
      apiKey: formData.apiKey,
      baseUrl: formData.baseUrl || undefined,
      model: formData.model || undefined,
      maxTokens: formData.maxTokens ? parseInt(formData.maxTokens) : undefined,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    environments.value.push(newEnvironment)
    saveEnvironments()
    return newEnvironment
  }

  const updateEnvironment = (id: string, formData: EnvironmentFormData) => {
    const index = environments.value.findIndex(env => env.id === id)
    if (index !== -1) {
      environments.value[index] = {
        ...environments.value[index],
        name: formData.name,
        apiKey: formData.apiKey,
        baseUrl: formData.baseUrl || undefined,
        model: formData.model || undefined,
        maxTokens: formData.maxTokens ? parseInt(formData.maxTokens) : undefined,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        updatedAt: new Date().toISOString()
      }
      saveEnvironments()
      return environments.value[index]
    }
    return null
  }

  const deleteEnvironment = (id: string) => {
    const index = environments.value.findIndex(env => env.id === id)
    if (index !== -1) {
      const environment = environments.value[index]
      if (environment.isActive) {
        // 如果删除的是当前激活的环境，清除激活状态
        environment.isActive = false
      }
      environments.value.splice(index, 1)
      saveEnvironments()
      return true
    }
    return false
  }

  const applyEnvironment = async (environment: ClaudeEnvironment) => {
    try {
      isLoading.value = true
      error.value = null

      // 清除所有环境的激活状态
      environments.value.forEach(env => env.isActive = false)

      // 设置当前环境为激活状态
      const envIndex = environments.value.findIndex(env => env.id === environment.id)
      if (envIndex !== -1) {
        environments.value[envIndex].isActive = true
      }

      const result = await invoke<string>('apply_environment', {
        environment: {
          name: environment.name,
          api_key: environment.apiKey,
          base_url: environment.baseUrl,
          model: environment.model,
          max_tokens: environment.maxTokens,
          temperature: environment.temperature
        }
      })

      saveEnvironments()
      await loadCurrentSettings()

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '应用环境失败'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    environments,
    currentSettings,
    isLoading,
    error,
    activeEnvironment,
    loadEnvironments,
    loadCurrentSettings,
    addEnvironment,
    updateEnvironment,
    deleteEnvironment,
    applyEnvironment,
    clearError
  }
})