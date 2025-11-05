import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ClaudeEnvironment, ClaudeSettings, EnvironmentFormData } from '@/types/environment'
import { FileOperations } from '@/utils/fileOperations'

export const useEnvironmentStore = defineStore('environment', () => {
  const environments = ref<ClaudeEnvironment[]>([])
  const currentSettings = ref<ClaudeSettings | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  
  const loadEnvironments = async () => {
    try {
      const cacheData = await FileOperations.readEnvironmentCache()

      if (cacheData) {
        environments.value = cacheData.environments || []
        console.log('从文件加载环境配置:', environments.value.length, '个环境')
      } else {
        environments.value = []
        console.log('缓存文件不存在，初始化空环境列表')
      }
    } catch (err) {
      console.error('加载环境配置失败:', err)
      error.value = '加载环境配置失败'
      environments.value = []
    }
  }

  const saveEnvironments = async () => {
    try {
      // 直接保存到文件
      await saveEnvironmentsToFile()
    } catch (err) {
      console.error('保存环境配置失败:', err)
      error.value = '保存环境配置失败'
    }
  }

  const saveEnvironmentsToFile = async () => {
    try {
      await FileOperations.writeEnvironmentCache({
        environments: environments.value
      })

      console.log('环境配置已保存到文件:', environments.value.length, '个环境')
    } catch (err) {
      console.error('保存环境配置到文件失败:', err)
      throw err
    }
  }

  const loadCurrentSettings = async () => {
    try {
      isLoading.value = true

      const settings = await FileOperations.readClaudeSettings()

      if (settings && settings.env && typeof settings.env === 'object') {
        currentSettings.value = { env: settings.env }
      } else {
        currentSettings.value = null
        console.log('配置文件中缺少env字段，这是正常情况')
      }
    } catch (err) {
      console.error('加载当前设置失败:', err)
      error.value = '加载当前设置失败'
    } finally {
      isLoading.value = false
    }
  }

  const addEnvironment = async (formData: EnvironmentFormData) => {
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
    await saveEnvironments()
    return newEnvironment
  }

  const updateEnvironment = async (id: string, formData: EnvironmentFormData) => {
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
      await saveEnvironments()
      return environments.value[index]
    }
    return null
  }

  const deleteEnvironment = async (id: string) => {
    const index = environments.value.findIndex(env => env.id === id)
    if (index !== -1) {
      environments.value.splice(index, 1)
      await saveEnvironments()
      return true
    }
    return false
  }

  const applyEnvironment = async (environment: ClaudeEnvironment) => {
    try {
      isLoading.value = true
      error.value = null

      await FileOperations.applyClaudeEnvironment(environment.env)
      await loadCurrentSettings()

      return 'success'
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '应用环境失败'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentSettings = async () => {
    try {
      isLoading.value = true
      error.value = null

      await FileOperations.clearClaudeEnvironment()
      currentSettings.value = null

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '清除配置失败'
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
    clearCurrentSettings,
    clearError
  }
})