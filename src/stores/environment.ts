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
        console.log('Loaded environment configurations from file:', environments.value.length, 'environments')
      } else {
        environments.value = []
        console.log('Cache file does not exist, initializing empty environment list')
      }
    } catch (err) {
      console.error('Failed to load environment configuration:', err)
      error.value = 'Failed to load environment configuration'
      environments.value = []
    }
  }

  const saveEnvironments = async () => {
    try {
      // Save directly to file
      await saveEnvironmentsToFile()
    } catch (err) {
      console.error('Failed to save environment configuration:', err)
      error.value = 'Failed to save environment configuration'
    }
  }

  const saveEnvironmentsToFile = async () => {
    try {
      await FileOperations.writeEnvironmentCache({
        environments: environments.value
      })

      console.log('Environment configuration saved to file:', environments.value.length, 'environments')
    } catch (err) {
      console.error('Failed to save environment configuration to file:', err)
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
        console.log('Missing env field in configuration file, this is normal')
      }
    } catch (err) {
      console.error('Failed to load current settings:', err)
      error.value = 'Failed to load current settings'
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply environment'
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear configuration'
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