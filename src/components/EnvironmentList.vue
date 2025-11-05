<template>
  <div class="environment-list">
    <!-- 当前环境状态 -->
    <div class="current-status" v-if="environmentStore.currentSettings">
      <div class="status-card">
        <div class="status-header">
          <div class="status-indicator active">
            <span class="status-dot"></span>
            <span>当前配置</span>
          </div>
          <button
            @click="removeCurrentConfig"
            :disabled="environmentStore.isLoading"
            class="btn btn-sm btn-danger"
          >
            移除配置
          </button>
        </div>
        <div class="current-env-vars-table">
          <table class="env-vars-table">
            <tbody>
              <tr
                v-for="envVar in displayEnvVars"
                :key="envVar.key"
                class="env-var-row"
              >
                <td class="env-key-cell">
                  {{ envVar.key }}
                </td>
                <td class="env-value-cell">
                  {{ envVar.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="current-status" v-else>
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

      <div class="info-tip">
        <p>💡 提示：应用环境配置后，请重新打开新的终端窗口以便配置生效</p>
      </div>

      <div
        v-if="environmentStore.environments.length === 0"
        class="empty-state"
      >
        <p>暂无环境配置</p>
        <button @click="showAddForm = true" class="btn btn-primary">
          创建第一个环境
        </button>
      </div>

      <div v-else class="environment-table-container">
        <table class="environment-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>Base URL</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="environment in environmentStore.environments"
              :key="environment.id"
              class="environment-row"
            >
              <td class="name-cell">
                {{ environment.name || "未命名" }}
              </td>
              <td class="url-cell">
                {{ getBaseUrl(environment.env) || "未配置" }}
              </td>
              <td class="actions-cell">
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
              </td>
            </tr>
          </tbody>
        </table>
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
      <button @click="environmentStore.clearError()" class="btn-close">
        ×
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="environmentStore.isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>正在应用环境配置...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useEnvironmentStore } from "@/stores/environment";
import EnvironmentForm from "./EnvironmentForm.vue";
import type { ClaudeEnvironment, EnvVar } from "@/types/environment";

const environmentStore = useEnvironmentStore();
const showAddForm = ref(false);
const editingEnvironment = ref<ClaudeEnvironment | null>(null);

const applyEnvironment = async (environment: ClaudeEnvironment) => {
  try {
    await environmentStore.applyEnvironment(environment);
  } catch (error) {
    console.error("应用环境失败:", error);
  }
};

const editEnvironment = (environment: ClaudeEnvironment) => {
  editingEnvironment.value = environment;
};

const deleteEnvironment = async (id: string) => {
  try {
    await environmentStore.deleteEnvironment(id);
  } catch (error) {
    console.error("删除环境失败:", error);
  }
};

const handleSaveEnvironment = () => {
  showAddForm.value = false;
  editingEnvironment.value = null;
};

const removeCurrentConfig = async () => {
  try {
    await environmentStore.clearCurrentSettings();
  } catch (error) {
    console.error("移除配置失败:", error);
  }
};

const displayEnvVars = computed(() => {
  return Object.entries(environmentStore.currentSettings?.env ?? {}).map(
    ([key, value]) => ({
      key,
      value,
    })
  );
});

const getBaseUrl = (envVars: EnvVar[]) => {
  const baseUrlVar = envVars.find(
    (envVar) => envVar.key === "ANTHROPIC_BASE_URL"
  );
  return baseUrlVar?.value || "";
};

const handleCancelForm = () => {
  showAddForm.value = false;
  editingEnvironment.value = null;
};

onMounted(() => {
  environmentStore.loadEnvironments();
  environmentStore.loadCurrentSettings();
});
</script>

<style scoped>
.environment-list {
  width: 100%;
  overflow-x: hidden;
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

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-header .status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-env-vars-table {
  margin-top: 0.5rem;
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.env-vars-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.env-var-row:hover {
  background: rgba(74, 222, 128, 0.1);
}

.env-key-cell {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-family: monospace;
  background: rgba(74, 222, 128, 0.05);
  border-right: 1px solid rgba(74, 222, 128, 0.2);
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.env-value-cell {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.8);
  word-break: break-all;
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

.environment-table-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.environment-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.environment-table th {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.environment-row {
  transition: all 0.3s ease;
}

.environment-row:hover {
  background: rgba(255, 255, 255, 0.08);
}

.environment-row td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}

.environment-row:last-child td {
  border-bottom: none;
}

.name-cell {
  font-weight: 600;
  color: #fff;
  min-width: 75px;
  text-align: left;
}

.url-cell {
  color: rgba(255, 255, 255, 0.8);
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-all;
  min-width: 200px;
  text-align: left;
}

.actions-cell {
  width: 200px;
  text-align: left;
}

.actions-cell .btn {
  margin-right: 0.5rem;
}

.actions-cell .btn:last-child {
  margin-right: 0;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
