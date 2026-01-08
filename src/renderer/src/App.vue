<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TitleBar from './components/TitleBar.vue'
import SideBar from './components/SideBar.vue'
import FriendList from './components/FriendList.vue'
import StatusBar from './components/StatusBar.vue'

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

interface Summoner {
  displayName: string
  puuid: string
}

const isConnected = ref(false)
const isConnecting = ref(false)
const summoner = ref<Summoner | null>(null)
const friends = ref<Friend[]>([])
const isLoading = ref(false)
const isDeleting = ref(false)
const deleteProgress = ref(0)
const deleteTotal = ref(0)
const currentDeleting = ref('')
const deleteSpeed = ref(2000)
const deleteMode = ref<'all' | 'offline' | 'online_first' | 'selected'>('selected')

const selectedFriends = computed(() => friends.value.filter(f => f.selected))
const onlineCount = computed(() => friends.value.filter(f => 
  f.availability === 'online' || f.availability === 'away' || f.availability === 'dnd'
).length)
const offlineCount = computed(() => friends.value.length - onlineCount.value)

async function connectToClient() {
  isConnecting.value = true
  try {
    const connected = await window.electron.lcuConnect()
    isConnected.value = connected
    
    if (connected) {
      summoner.value = await window.electron.lcuGetSummoner()
      await loadFriends()
    }
  } finally {
    isConnecting.value = false
  }
}

async function loadFriends() {
  isLoading.value = true
  try {
    const list = await window.electron.lcuGetFriends()
    friends.value = list.map(f => ({ ...f, selected: false }))
  } finally {
    isLoading.value = false
  }
}

function selectAll() {
  friends.value.forEach(f => f.selected = true)
}

function selectNone() {
  friends.value.forEach(f => f.selected = false)
}

function selectOffline() {
  friends.value.forEach(f => {
    f.selected = f.availability !== 'online' && f.availability !== 'away' && f.availability !== 'dnd'
  })
}

function selectOnline() {
  friends.value.forEach(f => {
    f.selected = f.availability === 'online' || f.availability === 'away' || f.availability === 'dnd'
  })
}

function getStatusPriority(availability: string): number {
  switch (availability) {
    case 'online': return 0
    case 'dnd': return 1
    case 'away': return 2
    case 'mobile': return 3
    default: return 4
  }
}

async function startDelete() {
  const toDelete = deleteMode.value === 'selected' 
    ? selectedFriends.value 
    : deleteMode.value === 'offline'
    ? friends.value.filter(f => f.availability !== 'online' && f.availability !== 'away' && f.availability !== 'dnd')
    : deleteMode.value === 'online_first'
    ? [...friends.value].sort((a, b) => getStatusPriority(a.availability) - getStatusPriority(b.availability))
    : friends.value

  if (toDelete.length === 0) return

  isDeleting.value = true
  deleteProgress.value = 0
  deleteTotal.value = toDelete.length

  for (let i = 0; i < toDelete.length; i++) {
    if (!isDeleting.value) break
    
    const friend = toDelete[i]
    currentDeleting.value = friend.gameName || friend.name
    deleteProgress.value = i + 1

    await window.electron.lcuDeleteFriend(friend.id)
    
    const index = friends.value.findIndex(f => f.id === friend.id)
    if (index > -1) {
      friends.value.splice(index, 1)
    }

    if (i < toDelete.length - 1 && isDeleting.value) {
      await new Promise(resolve => setTimeout(resolve, deleteSpeed.value))
    }
  }

  isDeleting.value = false
  currentDeleting.value = ''
}

function stopDelete() {
  isDeleting.value = false
}

onMounted(() => {
  connectToClient()
})
</script>

<template>
  <div class="app">
    <TitleBar :summoner="summoner" :is-connected="isConnected" />
    
    <div class="main-content">
      <SideBar 
        v-model:delete-mode="deleteMode"
        v-model:delete-speed="deleteSpeed"
        :is-connected="isConnected"
        :is-deleting="isDeleting"
        :friends-count="friends.length"
        :selected-count="selectedFriends.length"
        :online-count="onlineCount"
        :offline-count="offlineCount"
        @select-all="selectAll"
        @select-none="selectNone"
        @select-offline="selectOffline"
        @select-online="selectOnline"
        @start-delete="startDelete"
        @stop-delete="stopDelete"
        @refresh="loadFriends"
        @reconnect="connectToClient"
      />
      
      <div class="content-area">
        <FriendList 
          v-if="isConnected"
          :friends="friends"
          :is-loading="isLoading"
        />
        
        <div v-else class="not-connected">
          <div class="connect-card">
            <div class="connect-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <circle cx="8" cy="12" r="1.5"/>
                <circle cx="16" cy="12" r="1.5"/>
                <path d="M12 9v6"/>
              </svg>
            </div>
            <h2>未连接到客户端</h2>
            <p>请确保英雄联盟客户端已启动并登录</p>
            <button 
              class="btn btn-primary connect-btn" 
              @click="connectToClient"
              :disabled="isConnecting"
            >
              <svg v-if="isConnecting" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {{ isConnecting ? '连接中...' : '连接客户端' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <StatusBar 
      :is-deleting="isDeleting"
      :delete-progress="deleteProgress"
      :delete-total="deleteTotal"
      :current-deleting="currentDeleting"
      :delete-speed="deleteSpeed"
    />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 16px;
  overflow: auto;
  background: linear-gradient(135deg, rgba(10, 20, 40, 0.3) 0%, rgba(1, 10, 19, 0.5) 100%);
}

.not-connected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.connect-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px;
  background: rgba(1, 10, 19, 0.7);
  border: 1px solid var(--gold-7);
  border-radius: 4px;
  max-width: 360px;
}

.connect-icon {
  width: 64px;
  height: 64px;
  color: var(--gold-4);
  margin-bottom: 20px;
  opacity: 0.8;
}

.connect-icon svg {
  width: 100%;
  height: 100%;
}

.connect-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-gold);
}

.connect-card p {
  margin: 0 0 24px;
  font-size: 13px;
  color: var(--text-secondary);
}

.connect-btn {
  padding: 12px 32px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.connect-btn .spin {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
