<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  deleteMode: 'all' | 'offline' | 'online_first' | 'selected'
  deleteSpeed: number
  isConnected: boolean
  isDeleting: boolean
  friendsCount: number
  selectedCount: number
  onlineCount: number
  offlineCount: number
}>()

const emit = defineEmits<{
  'update:deleteMode': [value: 'all' | 'offline' | 'online_first' | 'selected']
  'update:deleteSpeed': [value: number]
  'selectAll': []
  'selectNone': []
  'selectOffline': []
  'selectOnline': []
  'startDelete': []
  'stopDelete': []
  'refresh': []
  'reconnect': []
}>()

const speedOptions = [
  { label: '极速', value: 500, desc: '0.5秒' },
  { label: '快速', value: 1000, desc: '1秒' },
  { label: '正常', value: 2000, desc: '2秒' },
  { label: '慢速', value: 3000, desc: '3秒' },
  { label: '超慢', value: 5000, desc: '5秒' },
  { label: '龟速', value: 10000, desc: '10秒' }
]

const modeOptions = [
  { label: '选中的好友', value: 'selected' },
  { label: '全部好友', value: 'all' },
  { label: '仅离线', value: 'offline' },
  { label: '优先在线', value: 'online_first' }
]

const canDelete = computed(() => {
  if (!props.isConnected || props.isDeleting) return false
  if (props.deleteMode === 'selected') return props.selectedCount > 0
  return props.friendsCount > 0
})

const deleteCount = computed(() => {
  switch (props.deleteMode) {
    case 'selected': return props.selectedCount
    case 'offline': return props.offlineCount
    default: return props.friendsCount
  }
})
</script>

<template>
  <aside class="sidebar">
    <!-- 统计面板 -->
    <div class="panel">
      <div class="panel-header">
        <svg class="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span>好友统计</span>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ friendsCount }}</div>
          <div class="stat-label">总数</div>
        </div>
        <div class="stat-card online">
          <div class="stat-value">{{ onlineCount }}</div>
          <div class="stat-label">在线</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ offlineCount }}</div>
          <div class="stat-label">离线</div>
        </div>
        <div class="stat-card selected">
          <div class="stat-value">{{ selectedCount }}</div>
          <div class="stat-label">已选</div>
        </div>
      </div>
    </div>

    <!-- 快速选择 -->
    <div class="panel">
      <div class="panel-header">
        <svg class="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        <span>快速选择</span>
      </div>
      <div class="quick-btns">
        <button class="btn" @click="emit('selectAll')" :disabled="!isConnected">全选</button>
        <button class="btn" @click="emit('selectNone')" :disabled="!isConnected">全不选</button>
        <button class="btn" @click="emit('selectOnline')" :disabled="!isConnected">选在线</button>
        <button class="btn" @click="emit('selectOffline')" :disabled="!isConnected">选离线</button>
      </div>
    </div>

    <!-- 删除设置 -->
    <div class="panel">
      <div class="panel-header">
        <svg class="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span>删除设置</span>
      </div>
      
      <div class="form-group">
        <label>删除模式</label>
        <select 
          :value="deleteMode"
          @change="emit('update:deleteMode', ($event.target as HTMLSelectElement).value as any)"
        >
          <option v-for="opt in modeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>删除速度</label>
        <select 
          :value="deleteSpeed"
          @change="emit('update:deleteSpeed', Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="opt in speedOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }} ({{ opt.desc }})
          </option>
        </select>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="panel actions-panel">
      <button 
        v-if="!isDeleting"
        class="btn btn-danger action-btn"
        :disabled="!canDelete"
        @click="emit('startDelete')"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        删除 {{ deleteCount }} 个好友
      </button>
      <button 
        v-else
        class="btn btn-warning action-btn"
        @click="emit('stopDelete')"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16" rx="1"/>
          <rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>
        停止删除
      </button>

      <div class="sub-actions">
        <button class="btn" @click="emit('refresh')" :disabled="!isConnected || isDeleting">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          刷新列表
        </button>
        <button class="btn" @click="emit('reconnect')" :disabled="isDeleting">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          重连
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, rgba(10, 20, 40, 0.95) 0%, rgba(1, 10, 19, 0.98) 100%);
  border-right: 1px solid var(--gold-7);
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow-y: auto;
}

.panel {
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--gold-7);
}

.panel-icon {
  width: 14px;
  height: 14px;
  color: var(--gold-3);
}

.panel-header span {
  font-size: 11px;
  font-weight: 600;
  color: var(--gold-2);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-card {
  text-align: center;
  padding: 12px 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: var(--gold-6);
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card.online .stat-value { color: var(--status-online); }
.stat-card.selected .stat-value { color: var(--gold-3); }

.quick-btns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.quick-btns .btn {
  padding: 8px 10px;
  font-size: 11px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group select {
  width: 100%;
}

.actions-panel {
  margin-top: auto;
  border-top: 1px solid var(--gold-7);
}

.action-btn {
  width: 100%;
  padding: 14px;
  font-size: 13px;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn-warning {
  background: linear-gradient(180deg, #d69e2e 0%, #b7791f 100%);
  border-color: #d69e2e;
  color: var(--bg-primary);
}

.sub-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.sub-actions .btn {
  flex: 1;
  padding: 10px 8px;
  font-size: 11px;
}
</style>
