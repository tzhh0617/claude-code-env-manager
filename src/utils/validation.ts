import type { EnvironmentFormData } from '@/types/environment'

export const validateEnvironmentForm = (data: EnvironmentFormData): string[] => {
  const errors: string[] = []

  if (!data.name.trim()) {
    errors.push('Environment name cannot be empty')
  }

  if (data.env.length === 0) {
    errors.push('At least one environment variable is required')
  }

  const validEnvVars = data.env.filter(envVar => envVar.key.trim())
  if (validEnvVars.length === 0) {
    errors.push('At least one valid environment variable is required')
  }

  // Check for duplicate environment variable names
  const keys = validEnvVars.map(envVar => envVar.key.trim())
  const uniqueKeys = new Set(keys)
  if (keys.length !== uniqueKeys.size) {
    errors.push('Duplicate environment variable names exist')
  }

  return errors
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidNumber = (value: string, min: number, max: number): boolean => {
  const num = parseFloat(value)
  return !isNaN(num) && num >= min && num <= max
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}