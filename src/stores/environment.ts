import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ClaudeEnvironment, ClaudeSettings, EnvironmentFormData } from '@/types/environment'
import { invoke } from '@tauri-apps/api/tauri'

export const useEnvironmentStore = defineStore('environment', () => {
  const environments = ref<ClaudeEnvironment[]>([])
  const currentSettings = ref<ClaudeSettings | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  
  const loadEnvironments = async () => {
    try {
      // 从文件加载
      const homeDir = await invoke<string>('get_home_dir')
      const cacheFilePath = `${homeDir}/.claude-code-env-manager.json`

      const fileContent = await invoke<string | null>('read_file', {
        filePath: cacheFilePath
      })

      if (fileContent) {
        // 从文件加载成功
        const data = JSON.parse(fileContent)
        environments.value = data.environments || []
        console.log('从文件加载环境配置:', environments.value.length, '个环境')
      } else {
        // 文件不存在，初始化空数组
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
      const homeDir = await invoke<string>('get_home_dir')
      const cacheFilePath = `${homeDir}/.claude-code-env-manager.json`

      const cacheData = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        environments: environments.value
      }

      const jsonContent = JSON.stringify(cacheData, null, 2)

      await invoke<string>('write_file', {
        filePath: cacheFilePath,
        content: jsonContent
      })

      console.log('环境配置已保存到文件:', environments.value.length, '个环境')
    } catch (err) {
      console.error('保存环境配置到文件失败:', err)
      throw err // 重新抛出错误，让上层处理
    }
  }

  const loadCurrentSettings = async () => {
    try {
      isLoading.value = true

      // 获取Claude设置文件路径
      const homeDir = await invoke<string>('get_home_dir')
      const settingsPath = `${homeDir}/.claude/settings.json`

      const fileContent = await invoke<string | null>('read_file', {
        filePath: settingsPath
      })

      if (fileContent) {
        try {
          const jsonData = JSON.parse(fileContent)

          // 直接使用JSON数据
          if (jsonData.env && typeof jsonData.env === 'object') {
            currentSettings.value = { env: jsonData.env }
          } else {
            // 缺少env字段是正常情况，不显示错误
            currentSettings.value = null
            console.log('配置文件中缺少env字段，这是正常情况')
          }
        } catch (parseError) {
          console.error('解析settings.json失败:', parseError)
          error.value = '解析配置文件失败'
        }
      } else {
        currentSettings.value = null
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

      // 前端处理JSON序列化，转换为标准格式
      const envRecord: Record<string, string> = {}
      environment.env.forEach(envVar => {
        if (envVar.key.trim()) {
          envRecord[envVar.key.trim()] = envVar.value
        }
      })

      const settingsContent = {
        env: envRecord
      }

      const jsonContent = JSON.stringify(settingsContent, null, 2)

      // 获取Claude设置文件路径
      const homeDir = await invoke<string>('get_home_dir')
      const settingsPath = `${homeDir}/.claude/settings.json`

      const result = await invoke<string>('write_file', {
        filePath: settingsPath,
        content: jsonContent
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