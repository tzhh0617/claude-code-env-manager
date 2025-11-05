<template>
  <div class="form-overlay" @click="handleOverlayClick">
    <div class="form-container" @click.stop>
      <div class="form-header">
        <h2>{{ isEdit ? '编辑环境' : '添加环境' }}</h2>
        <button @click="$emit('cancel')" class="btn-close">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="environment-form">
        <div class="form-group">
          <label for="name">环境名称 (备注)</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="例如: MiniMax 环境 (可选)"
          />
        </div>

        <div class="env-section">
          <div class="section-header">
            <h3>环境变量配置</h3>
            <div class="section-actions">
              <button type="button" @click="addCommonVars" class="btn btn-secondary btn-sm">
                添加常用变量
              </button>
              <button type="button" @click="addEnvVar" class="btn btn-primary btn-sm">
                添加变量
              </button>
            </div>
          </div>

          <div class="env-vars-list">
            <div
              v-for="(envVar, index) in formData.env"
              :key="index"
              class="env-var-item"
            >
              <div class="env-var-controls">
                <input
                  v-model="envVar.key"
                  type="text"
                  placeholder="变量名 (如: ANTHROPIC_AUTH_TOKEN)"
                  class="env-key-input"
                  />
                <input
                  v-model="envVar.value"
                  type="text"
                  placeholder="变量值"
                  class="env-value-input"
                />
                <button
                  type="button"
                  @click="removeEnvVar(index)"
                  class="btn btn-danger btn-sm btn-remove"
                >
                  删除
                </button>
              </div>
                </div>

            <div v-if="formData.env.length === 0" class="empty-env-vars">
              <p>暂无环境变量，点击"添加变量"开始配置</p>
            </div>
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
          <button type="submit" :disabled="isLoading || !isFormValid" class="btn btn-primary">
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
import { COMMON_ENV_VARS } from '@/types/environment'

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
const errors = ref<string[]>([])

const formData = reactive<EnvironmentFormData>({
  name: '',
  env: []
})

const isFormValid = computed(() => {
  return formData.env.length > 0 &&
         formData.env.some(envVar => envVar.key.trim() !== '')
})

const resetForm = () => {
  formData.name = ''
  formData.env = []
  errors.value = []
}

const loadEnvironmentData = () => {
  if (props.environment) {
    formData.name = props.environment.name
    formData.env = [...props.environment.env]
  } else {
    // 默认添加一些常用的环境变量
    addCommonVars()
  }
}

const addEnvVar = () => {
  formData.env.push({ key: '', value: '' })
}

const removeEnvVar = (index: number) => {
  formData.env.splice(index, 1)
}

const addCommonVars = () => {
  const existingKeys = new Set(formData.env.map(env => env.key))

  COMMON_ENV_VARS.forEach(commonVar => {
    if (!existingKeys.has(commonVar.key)) {
      formData.env.push({
        key: commonVar.key,
        value: commonVar.defaultValue
      })
    }
  })
}


const validateForm = (): boolean => {
  errors.value = []

  if (formData.env.length === 0) {
    errors.value.push('至少需要添加一个环境变量')
  }

  // 检查是否有有效的环境变量
  const validEnvVars = formData.env.filter(envVar => envVar.key.trim())
  if (validEnvVars.length === 0) {
    errors.value.push('至少需要一个有效的环境变量')
  }

  return errors.value.length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    isLoading.value = true

    // 过滤掉空的环境变量
    const validEnvVars = formData.env.filter(envVar => envVar.key.trim())

    if (isEdit.value && props.environment) {
      await environmentStore.updateEnvironment(props.environment.id, {
        ...formData,
        env: validEnvVars
      })
    } else {
      await environmentStore.addEnvironment({
        ...formData,
        env: validEnvVars
      })
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
  max-width: 700px;
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
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.env-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.1rem;
}

.section-actions {
  display: flex;
  gap: 0.5rem;
}

.env-vars-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.env-var-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

.env-var-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.env-key-input {
  flex: 1;
  min-width: 200px;
}

.env-value-input {
  flex: 2;
  min-width: 200px;
}

.btn-remove {
  flex-shrink: 0;
  width: 60px;
}


.empty-env-vars {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.9rem;
}

input {
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.08);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
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
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
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

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

/* 滚动条样式 */
.form-container::-webkit-scrollbar {
  width: 8px;
}

.form-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.form-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.form-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>