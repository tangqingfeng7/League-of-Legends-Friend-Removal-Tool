<script setup lang="ts">
interface Friend {
  id: string
  name: string
  gameName: string
  gameTag: string
  puuid: string
  availability: string
  statusMessage: string
  note: string
  selected?: boolean
}

defineProps<{
  friends: Friend[]
  isLoading: boolean
}>()

function getStatusClass(availability: string): string {
  switch (availability) {
    case 'online': return 'online'
    case 'away': return 'away'
    case 'dnd': return 'dnd'
    case 'mobile': return 'mobile'
    default: return 'offline'
  }
}

function getStatusText(availability: string): string {
  switch (availability) {
    case 'online': return '在线'
    case 'away': return '离开'
    case 'dnd': return '勿扰'
    case 'mobile': return '手机'
    default: return '离线'
  }
}
</script>

<template>
  <div class="friend-list-container">
    <!-- 表头 -->
    <div class="list-header">
      <div class="col-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      </div>
      <div class="col-name">名称</div>
      <div class="col-status">状态</div>
      <div class="col-msg">签名</div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div v-for="i in 6" :key="i" class="skeleton-row">
        <div class="skeleton-check loading-skeleton"></div>
        <div class="skeleton-name loading-skeleton"></div>
        <div class="skeleton-status loading-skeleton"></div>
        <div class="skeleton-msg loading-skeleton"></div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="friends.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
        <line x1="18" y1="8" x2="23" y2="8"/>
      </svg>
      <p>暂无好友数据</p>
    </div>

    <!-- 好友列表 -->
    <div v-else class="list-body">
      <div 
        v-for="(friend, index) in friends" 
        :key="friend.id"
        class="friend-row"
        :class="{ selected: friend.selected }"
        :style="{ animationDelay: `${index * 20}ms` }"
        @click="friend.selected = !friend.selected"
      >
        <div class="col-check">
          <input 
            type="checkbox" 
            class="checkbox"
            :checked="friend.selected"
            @click.stop
            @change="friend.selected = !friend.selected"
          />
        </div>
        <div class="col-name">
          <span class="name">{{ friend.gameName || friend.name }}</span>
          <span v-if="friend.gameTag" class="tag">#{{ friend.gameTag }}</span>
        </div>
        <div class="col-status">
          <span class="status-dot" :class="getStatusClass(friend.availability)"></span>
          <span class="status-text">{{ getStatusText(friend.availability) }}</span>
        </div>
        <div class="col-msg">
          <span class="msg">{{ friend.statusMessage || '-' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friend-list-container {
  background: rgba(1, 10, 19, 0.6);
  border: 1px solid var(--gold-7);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.list-header {
  display: grid;
  grid-template-columns: 44px 1fr 90px 1fr;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(180deg, rgba(30, 40, 45, 0.8) 0%, rgba(20, 30, 35, 0.8) 100%);
  border-bottom: 1px solid var(--gold-7);
  font-size: 11px;
  font-weight: 600;
  color: var(--gold-2);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.col-check {
  display: flex;
  align-items: center;
  justify-content: center;
}

.col-check svg {
  width: 14px;
  height: 14px;
  color: var(--gold-3);
}

.list-body {
  flex: 1;
  overflow-y: auto;
}

.friend-row {
  display: grid;
  grid-template-columns: 44px 1fr 90px 1fr;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(70, 55, 20, 0.2);
  cursor: pointer;
  transition: all 0.15s ease;
  animation: fadeIn 0.3s ease backwards;
}

.friend-row:hover {
  background: rgba(200, 170, 110, 0.05);
}

.friend-row.selected {
  background: linear-gradient(90deg, rgba(200, 155, 60, 0.15) 0%, rgba(200, 155, 60, 0.05) 100%);
  border-left: 2px solid var(--gold-3);
  padding-left: 14px;
}

.col-name {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
}

.name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag {
  font-size: 11px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.col-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.online {
  background: var(--status-online);
  box-shadow: 0 0 6px var(--status-online);
}

.status-dot.away {
  background: var(--status-away);
  box-shadow: 0 0 6px var(--status-away);
}

.status-dot.dnd {
  background: var(--status-dnd);
}

.status-dot.mobile {
  background: var(--status-away);
}

.status-dot.offline {
  background: var(--status-offline);
}

.status-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.col-msg {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.msg {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 加载状态 */
.loading-state {
  padding: 8px 0;
}

.skeleton-row {
  display: grid;
  grid-template-columns: 44px 1fr 90px 1fr;
  gap: 8px;
  padding: 12px 16px;
}

.skeleton-check {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  margin: 0 auto;
}

.skeleton-name {
  height: 14px;
  border-radius: 2px;
  width: 50%;
}

.skeleton-status {
  height: 14px;
  border-radius: 2px;
  width: 40px;
}

.skeleton-msg {
  height: 14px;
  border-radius: 2px;
  width: 70%;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.empty-state svg {
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
  opacity: 0.4;
}

.empty-state p {
  font-size: 13px;
}
</style>
