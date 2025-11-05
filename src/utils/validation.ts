import type { EnvironmentFormData } from '@/types/environment'

export const validateEnvironmentForm = (data: EnvironmentFormData): string[] => {
  const errors: string[] = []

  if (!data.name.trim()) {
    errors.push('环境名称不能为空')
  }

  if (data.env.length === 0) {
    errors.push('至少需要添加一个环境变量')
  }

  const validEnvVars = data.env.filter(envVar => envVar.key.trim())
  if (validEnvVars.length === 0) {
    errors.push('至少需要一个有效的环境变量')
  }

  // 检查重复的环境变量名
  const keys = validEnvVars.map(envVar => envVar.key.trim())
  const uniqueKeys = new Set(keys)
  if (keys.length !== uniqueKeys.size) {
    errors.push('存在重复的环境变量名')
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
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}