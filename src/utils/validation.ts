import type { EnvironmentFormData } from '@/types/environment'

export const validateEnvironmentForm = (data: EnvironmentFormData): string[] => {
  const errors: string[] = []

  if (!data.name.trim()) {
    errors.push('环境名称不能为空')
  }

  if (!data.apiKey.trim()) {
    errors.push('API Key 不能为空')
  }

  if (data.baseUrl && !isValidUrl(data.baseUrl)) {
    errors.push('Base URL 格式不正确')
  }

  if (data.maxTokens && !isValidNumber(data.maxTokens, 1, 100000)) {
    errors.push('最大 Token 数必须是 1-100000 之间的数字')
  }

  if (data.temperature && !isValidNumber(data.temperature, 0, 2)) {
    errors.push('Temperature 必须是 0-2 之间的数字')
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