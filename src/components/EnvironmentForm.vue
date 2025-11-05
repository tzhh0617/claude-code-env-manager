<template>
  <div class="form-overlay" @click="handleOverlayClick">
    <div class="form-container" @click.stop>
      <div class="form-header">
        <h2>{{ isEdit ? '编辑环境' : '添加环境' }}</h2>
        <button @click="$emit('cancel')" class="btn-close">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="environment-form">
        <div class="form-group">
          <label for="name">环境名称 *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="例如: 开发环境"
          />
        </div>

        <div class="form-group">
          <label for="apiKey">API Key *</label>
          <input
            id="apiKey"
            v-model="formData.apiKey"
            type="password"
            required
            placeholder="sk-ant-..."
          />
          <button
            type="button"
            @click="toggleApiKeyVisibility"
            class="btn-toggle-visibility"
          >
            {{ showApiKey ? '隐藏' : '显示' }}
          </button>
        </div>

        <div class="form-group">
          <label for="baseUrl">Base URL</label>
          <input
            id="baseUrl"
            v-model="formData.baseUrl"
            type="url"
            placeholder="https://api.anthropic.com (可选)"
          />
        </div>

        <div class="form-group">
          <label for="model">Model</label>
          <select id="model" v-model="formData.model">
            <option value="">默认</option>
            <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (20241022)</option>
            <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (20241022)</option>
            <option value="claude-3-opus-20240229">Claude 3 Opus</option>
            <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
            <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="maxTokens">最大 Token 数</label>
            <input
              id="maxTokens"
              v-model.number="formData.maxTokens"
              type="number"
              min="1"
              max="100000"
              placeholder="4096"
            />
          </div>

          <div class="form-group">
            <label for="temperature">Temperature</label>
            <input
              id="temperature"
              v-model.number="formData.temperature"
              type="number"
              min="0"
              max="2"
              step="0.1"
              placeholder="0.7"
            />
          </div>
        </div>

        <div v-if="errors.length > 0" class="error-messages">
          <p v-for="error in errors" :key="error" class="error-message">
            {{ error }}
          </p>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
            取消
          </button>
          <button type="submit" :disabled="isLoading" class="btn btn-primary">
            {{ isLoading ? '保存中...' : (isEdit ? '更新' : '创建') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useEnvironmentStore } from '@/stores/environment'
import type { ClaudeEnvironment, EnvironmentFormData } from '@/types/environment'
import { validateEnvironmentForm } from '@/utils/validation'

interface Props {
  environment?: ClaudeEnvironment | null
}

interface Emits {
  (e: 'save'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const environmentStore = useEnvironmentStore()

const isEdit = computed(() => !!props.environment)
const isLoading = ref(false)
const showApiKey = ref(false)
const errors = ref<string[]>([])

const formData = reactive<EnvironmentFormData>({
  name: '',
  apiKey: '',
  baseUrl: '',
  model: '',
  maxTokens: '',
  temperature: ''
})

const resetForm = () => {
  formData.name = ''
  formData.apiKey = ''
  formData.baseUrl = ''
  formData.model = ''
  formData.maxTokens = ''
  formData.temperature = ''
  errors.value = []
}

const loadEnvironmentData = () => {
  if (props.environment) {
    formData.name = props.environment.name
    formData.apiKey = props.environment.apiKey
    formData.baseUrl = props.environment.baseUrl || ''
    formData.model = props.environment.model || ''
    formData.maxTokens = props.environment.maxTokens?.toString() || ''
    formData.temperature = props.environment.temperature?.toString() || ''
  }
}

const toggleApiKeyVisibility = () => {
  showApiKey.value = !showApiKey.value
  const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement
  if (apiKeyInput) {
    apiKeyInput.type = showApiKey.value ? 'text' : 'password'
  }
}

const validateForm = (): boolean => {
  errors.value = validateEnvironmentForm(formData)
  return errors.value.length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    isLoading.value = true

    if (isEdit.value && props.environment) {
      environmentStore.updateEnvironment(props.environment.id, formData)
    } else {
      environmentStore.addEnvironment(formData)
    }

    emit('save')
  } catch (error) {
    console.error('保存环境失败:', error)
    errors.value = ['保存失败，请重试']
  } finally {
    isLoading.value = false
  }
}

const handleOverlayClick = () => {
  emit('cancel')
}

onMounted(() => {
  resetForm()
  loadEnvironmentData()
})
</script>

<style scoped>
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.form-container {
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h2 {
  margin: 0;
  color: #fff;
}

.btn-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s ease;
}

.btn-close:hover {
  color: #fff;
}

.environment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.9rem;
}

input, select {
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.08);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.btn-toggle-visibility {
  position: absolute;
  right: 0.75rem;
  top: 2.25rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.25rem;
}

.btn-toggle-visibility:hover {
  color: #fff;
}

.form-group {
  position: relative;
}

.error-messages {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  padding: 0.75rem;
}

.error-message {
  margin: 0.25rem 0;
  color: #ef4444;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>