<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isDeleting: boolean
  deleteProgress: number
  deleteTotal: number
  currentDeleting: string
  deleteSpeed: number
}>()

const progressPercent = computed(() => {
  if (props.deleteTotal === 0) return 0
  return Math.round((props.deleteProgress / props.deleteTotal) * 100)
})

const remainingTime = computed(() => {
  if (!props.isDeleting || props.deleteTotal === 0) return ''
  const remaining = props.deleteTotal - props.deleteProgress
  const totalMs = remaining * props.deleteSpeed
  const totalSeconds = Math.ceil(totalMs / 1000)
  
  if (totalSeconds < 60) {
    return `${totalSeconds}s`
  } else {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}m ${seconds}s`
  }
})
</script>

<template>
  <footer class="status-bar">
    <!-- 删除进度 -->
    <div v-if="isDeleting" class="delete-status">
      <div class="progress-section">
        <svg class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <span class="progress-text">
          正在删除: <strong>{{ currentDeleting }}</strong>
        </span>
      </div>
      
      <div class="progress-bar-wrapper">
        <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
      </div>
      
      <div class="progress-info">
        <span>{{ deleteProgress }}/{{ deleteTotal }}</span>
        <span>{{ progressPercent }}%</span>
        <span>{{ remainingTime }}</span>
      </div>
    </div>
    
    <!-- 默认状态 -->
    <div v-else class="default-status">
      <div class="status-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>{{ deleteSpeed / 1000 }}s/个</span>
      </div>
      <div class="status-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>LCU API</span>
      </div>
      <div class="status-version">v1.0.0</div>
    </div>
  </footer>
</template>

<style scoped>
.status-bar {
  height: 32px;
  background: linear-gradient(180deg, rgba(20, 28, 35, 0.95) 0%, rgba(10, 18, 25, 0.98) 100%);
  border-top: 1px solid var(--gold-7);
  padding: 0 16px;
  display: flex;
  align-items: center;
  position: relative;
}

.status-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 10%, var(--gold-6) 50%, transparent 90%);
  opacity: 0.3;
}

.delete-status {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 180px;
}

.spin-icon {
  width: 14px;
  height: 14px;
  color: var(--gold-3);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.progress-text {
  font-size: 11px;
  color: var(--text-secondary);
}

.progress-text strong {
  color: var(--gold-2);
  font-weight: 500;
}

.progress-bar-wrapper {
  flex: 1;
  height: 3px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--gold-4), var(--gold-3));
  border-radius: 2px;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px rgba(200, 155, 60, 0.5);
}

.progress-info {
  display: flex;
  gap: 12px;
  font-size: 10px;
  color: var(--text-muted);
  font-family: monospace;
}

.default-status {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-muted);
}

.status-item svg {
  width: 12px;
  height: 12px;
  color: var(--gold-5);
}

.status-version {
  margin-left: auto;
  font-size: 10px;
  color: var(--text-muted);
  font-family: monospace;
}
</style>
