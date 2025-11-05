import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ClaudeEnvironment, ClaudeSettings, EnvironmentFormData, EnvVar } from '@/types/environment'
import { invoke } from '@tauri-apps/api/tauri'

export const useEnvironmentStore = defineStore('environment', () => {
  const environments = ref<ClaudeEnvironment[]>([])
  const currentSettings = ref<ClaudeSettings | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  
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
    const cleanEnvVars = formData.env
      .filter(envVar => envVar.key.trim())
      .map(envVar => ({
        key: envVar.key.trim(),
        value: envVar.value
      }))

    const newEnvironment: ClaudeEnvironment = {
      id: Date.now().toString(),
      name: formData.name,
      env: cleanEnvVars,
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
      const cleanEnvVars = formData.env
        .filter(envVar => envVar.key.trim())
        .map(envVar => ({
          key: envVar.key.trim(),
          value: envVar.value
        }))

      environments.value[index] = {
        ...environments.value[index],
        name: formData.name,
        env: cleanEnvVars,
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

      const result = await invoke<string>('apply_environment', {
        environment: {
          name: environment.name,
          env: environment.env
        }
      })

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
    loadEnvironments,
    loadCurrentSettings,
    addEnvironment,
    updateEnvironment,
    deleteEnvironment,
    applyEnvironment,
    clearError
  }
})