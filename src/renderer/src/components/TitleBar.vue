<script setup lang="ts">
defineProps<{
  summoner: { displayName: string; puuid: string } | null
  isConnected: boolean
}>()

function minimize() {
  window.electron.windowMinimize()
}

function maximize() {
  window.electron.windowMaximize()
}

function close() {
  window.electron.windowClose()
}
</script>

<template>
  <div class="title-bar">
    <div class="drag-region">
      <div class="app-info">
        <div class="app-logo">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.8"/>
            <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <div class="app-text">
          <span class="app-name">好友清理工具</span>
          <span class="app-version">v1.0.0</span>
        </div>
      </div>
      
      <div class="user-status" v-if="isConnected && summoner">
        <div class="status-indicator" :class="{ online: isConnected }"></div>
        <span class="user-name">{{ summoner.displayName || '已连接' }}</span>
      </div>
    </div>
    
    <div class="window-controls">
      <button class="control-btn" @click="minimize" title="最小化">
        <svg viewBox="0 0 12 12">
          <rect y="5" width="12" height="1.5" rx="0.75" fill="currentColor"/>
        </svg>
      </button>
      <button class="control-btn" @click="maximize" title="最大化">
        <svg viewBox="0 0 12 12">
          <rect x="1.5" y="1.5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
      </button>
      <button class="control-btn close" @click="close" title="关闭">
        <svg viewBox="0 0 12 12">
          <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
  height: 36px;
  background: linear-gradient(180deg, rgba(30, 40, 45, 0.98) 0%, rgba(10, 20, 28, 0.98) 100%);
  border-bottom: 1px solid var(--gold-7);
  position: relative;
}

.title-bar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 10%, var(--gold-5) 50%, transparent 90%);
  opacity: 0.5;
}

.drag-region {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 12px;
  -webkit-app-region: drag;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-logo {
  width: 20px;
  height: 20px;
  color: var(--gold-3);
}

.app-logo svg {
  width: 100%;
  height: 100%;
}

.app-text {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.app-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-gold);
  letter-spacing: 1px;
}

.app-version {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 500;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--gold-7);
  border-radius: 3px;
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--status-offline);
  transition: all 0.3s ease;
}

.status-indicator.online {
  background: var(--status-online);
  box-shadow: 0 0 8px var(--status-online);
}

.user-name {
  font-size: 12px;
  color: var(--gold-2);
  font-weight: 500;
}

.window-controls {
  display: flex;
  height: 100%;
  -webkit-app-region: no-drag;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
  background: transparent;
  border: none;
  color: var(--grey-1);
  cursor: pointer;
  transition: all 0.15s ease;
}

.control-btn svg {
  width: 10px;
  height: 10px;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.control-btn.close:hover {
  background: var(--danger);
  color: white;
}
</style>
