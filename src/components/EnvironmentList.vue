<template>
  <div class="environment-list">
    <!-- 当前环境状态 -->
    <div class="current-status" v-if="environmentStore.currentSettings">
      <h2>当前配置状态</h2>
      <div class="status-card">
        <div class="status-indicator active">
          <span class="status-dot"></span>
          <span>已配置环境变量</span>
        </div>
        <div class="status-details">
          <p><strong>环境变量数量:</strong> {{ Object.keys(environmentStore.currentSettings.env).length }}</p>
          <div class="current-env-vars">
            <p v-for="envVar in getDisplayEnvVars(environmentStore.currentSettings.env)" :key="envVar.key" class="current-env-var">
              <strong>{{ envVar.key }}:</strong>
              <span>{{ envVar.value }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="current-status" v-else>
      <h2>当前配置状态</h2>
      <div class="status-card">
        <div class="status-indicator inactive">
          <span class="status-dot"></span>
          <span>未配置</span>
        </div>
        <p>尚未应用任何环境配置</p>
      </div>
    </div>

    <!-- 环境列表 -->
    <div class="environments-section">
      <div class="section-header">
        <h2>环境列表</h2>
        <button @click="showAddForm = true" class="btn btn-primary">
          添加环境
        </button>
      </div>

      <div v-if="environmentStore.environments.length === 0" class="empty-state">
        <p>暂无环境配置</p>
        <button @click="showAddForm = true" class="btn btn-primary">
          创建第一个环境
        </button>
      </div>

      <div v-else class="environment-cards">
        <div
          v-for="environment in environmentStore.environments"
          :key="environment.id"
          class="environment-card"
        >
          <div class="card-header">
            <h3>{{ environment.name }}</h3>
            <div class="card-actions">
              <button
                @click="applyEnvironment(environment)"
                :disabled="environmentStore.isLoading"
                class="btn btn-sm btn-primary"
              >
                应用
              </button>
              <button
                @click="editEnvironment(environment)"
                class="btn btn-sm btn-secondary"
              >
                编辑
              </button>
              <button
                @click="deleteEnvironment(environment.id)"
                class="btn btn-sm btn-danger"
              >
                删除
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="env-preview">
              <p><strong>环境变量数量:</strong> {{ environment.env.length }}</p>
              <div class="key-env-vars">
                <p v-for="envVar in getDisplayEnvVarsFromEnv(environment.env)" :key="envVar.key" class="key-env-var">
                  <strong>{{ envVar.key }}:</strong>
                  <span>{{ envVar.value }}</span>
                </p>
              </div>
            </div>
            <p><strong>更新时间:</strong> {{ formatDate(environment.updatedAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑环境表单 -->
    <EnvironmentForm
      v-if="showAddForm || editingEnvironment"
      :environment="editingEnvironment"
      @save="handleSaveEnvironment"
      @cancel="handleCancelForm"
    />

    <!-- 错误提示 -->
    <div v-if="environmentStore.error" class="error-toast">
      <p>{{ environmentStore.error }}</p>
      <button @click="environmentStore.clearError()" class="btn-close">×</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="environmentStore.isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>正在应用环境配置...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEnvironmentStore } from '@/stores/environment'
import EnvironmentForm from './EnvironmentForm.vue'
import type { ClaudeEnvironment, EnvVar } from '@/types/environment'
import { formatDate } from '@/utils/validation'

const environmentStore = useEnvironmentStore()
const showAddForm = ref(false)
const editingEnvironment = ref<ClaudeEnvironment | null>(null)


const applyEnvironment = async (environment: ClaudeEnvironment) => {
  try {
    await environmentStore.applyEnvironment(environment)
  } catch (error) {
    console.error('应用环境失败:', error)
  }
}

const editEnvironment = (environment: ClaudeEnvironment) => {
  editingEnvironment.value = environment
}

const deleteEnvironment = async (id: string) => {
  if (confirm('确定要删除这个环境配置吗？')) {
    try {
      await environmentStore.deleteEnvironment(id)
    } catch (error) {
      console.error('删除环境失败:', error)
    }
  }
}

const handleSaveEnvironment = () => {
  showAddForm.value = false
  editingEnvironment.value = null
}

const getDisplayEnvVars = (envRecord: Record<string, string>) => {
  // 将HashMap转换为数组
  const envVars = Object.entries(envRecord).map(([key, value]) => ({ key, value }))

  // 只显示重要的环境变量，最多显示5个
  const importantKeys = [
    'ANTHROPIC_AUTH_TOKEN', 'ANTHROPIC_API_KEY', 'API_KEY',
    'ANTHROPIC_BASE_URL', 'BASE_URL',
    'ANTHROPIC_MODEL', 'MODEL'
  ]

  const importantVars = envVars.filter(envVar =>
    importantKeys.some(key => envVar.key.includes(key))
  )

  // 如果重要变量少于3个，添加一些其他变量
  const otherVars = envVars
    .filter(envVar => !importantKeys.some(key => envVar.key.includes(key)))
    .slice(0, Math.max(0, 3 - importantVars.length))

  return [...importantVars, ...otherVars].slice(0, 5)
}

const getDisplayEnvVarsFromEnv = (envVars: EnvVar[]) => {
  // 只显示重要的环境变量，最多显示5个
  const importantKeys = [
    'ANTHROPIC_AUTH_TOKEN', 'ANTHROPIC_API_KEY', 'API_KEY',
    'ANTHROPIC_BASE_URL', 'BASE_URL',
    'ANTHROPIC_MODEL', 'MODEL'
  ]

  const importantVars = envVars.filter(envVar =>
    importantKeys.some(key => envVar.key.includes(key))
  )

  // 如果重要变量少于3个，添加一些其他变量
  const otherVars = envVars
    .filter(envVar => !importantKeys.some(key => envVar.key.includes(key)))
    .slice(0, Math.max(0, 3 - importantVars.length))

  return [...importantVars, ...otherVars].slice(0, 5)
}

const handleCancelForm = () => {
  showAddForm.value = false
  editingEnvironment.value = null
}

onMounted(() => {
  environmentStore.loadEnvironments()
  environmentStore.loadCurrentSettings()
})
</script>

<style scoped>
.environment-list {
  width: 100%;
}

.current-status {
  margin-bottom: 2rem;
}

.status-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.active .status-dot {
  background: #4ade80;
}

.inactive .status-dot {
  background: #ef4444;
}

.status-details p {
  margin: 0.25rem 0;
  color: rgba(255, 255, 255, 0.8);
}

.current-env-vars {
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  border-left: 2px solid rgba(74, 222, 128, 0.3);
}

.current-env-var {
  margin: 0.15rem 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
}

.environment-cards {
  display: grid;
  gap: 1rem;
}

.environment-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.environment-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}


.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  color: #fff;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-content p {
  margin: 0.25rem 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.env-preview {
  margin-bottom: 0.5rem;
}

.key-env-vars {
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  border-left: 2px solid rgba(59, 130, 246, 0.3);
}

.key-env-var {
  margin: 0.15rem 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.btn-primary {
  background: #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}


.error-toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #ef4444;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  max-width: 300px;
  z-index: 1000;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: 999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>