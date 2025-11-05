<template>
  <div class="environment-list">
    <!-- 当前环境状态 -->
    <div class="current-status" v-if="environmentStore.currentSettings">
      <h2>当前配置状态</h2>
      <div class="status-card">
        <div class="status-indicator active">
          <span class="status-dot"></span>
          <span>已配置 API Key</span>
        </div>
        <div class="status-details">
          <p><strong>Base URL:</strong> {{ environmentStore.currentSettings.baseUrl || '默认' }}</p>
          <p><strong>Model:</strong> {{ environmentStore.currentSettings.model || '默认' }}</p>
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
          :class="{ active: environment.isActive }"
        >
          <div class="card-header">
            <h3>{{ environment.name }}</h3>
            <div class="card-actions">
              <button
                @click="applyEnvironment(environment)"
                :disabled="environmentStore.isLoading || environment.isActive"
                class="btn btn-sm"
                :class="environment.isActive ? 'btn-success' : 'btn-primary'"
              >
                {{ environment.isActive ? '当前使用' : '应用' }}
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
            <p><strong>API Key:</strong> {{ maskApiKey(environment.apiKey) }}</p>
            <p v-if="environment.baseUrl"><strong>Base URL:</strong> {{ environment.baseUrl }}</p>
            <p v-if="environment.model"><strong>Model:</strong> {{ environment.model }}</p>
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
import type { ClaudeEnvironment } from '@/types/environment'
import { formatDate } from '@/utils/validation'

const environmentStore = useEnvironmentStore()
const showAddForm = ref(false)
const editingEnvironment = ref<ClaudeEnvironment | null>(null)

const maskApiKey = (apiKey: string): string => {
  if (apiKey.length <= 8) return '****'
  return apiKey.substring(0, 4) + '****' + apiKey.substring(apiKey.length - 4)
}

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

const deleteEnvironment = (id: string) => {
  if (confirm('确定要删除这个环境配置吗？')) {
    environmentStore.deleteEnvironment(id)
  }
}

const handleSaveEnvironment = () => {
  showAddForm.value = false
  editingEnvironment.value = null
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

.environment-card.active {
  border-color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
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

.btn-success {
  background: #4ade80;
  color: #000;
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