/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

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
  summonerId?: number
  profileIconId?: number
}

interface ElectronAPI {
  windowMinimize: () => void
  windowMaximize: () => void
  windowClose: () => void
  lcuConnect: () => Promise<boolean>
  lcuGetSummoner: () => Promise<Summoner | null>
  lcuGetFriends: () => Promise<Friend[]>
  lcuDeleteFriend: (id: string) => Promise<boolean>
  lcuIsConnected: () => Promise<boolean>
}

interface Window {
  electron: ElectronAPI
}
