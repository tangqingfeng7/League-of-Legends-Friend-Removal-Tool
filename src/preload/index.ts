import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  // 窗口控制
  windowMinimize: () => void
  windowMaximize: () => void
  windowClose: () => void
  // LCU API
  lcuConnect: () => Promise<boolean>
  lcuGetSummoner: () => Promise<{ displayName: string; puuid: string } | null>
  lcuGetFriends: () => Promise<Friend[]>
  lcuDeleteFriend: (id: string) => Promise<boolean>
  lcuIsConnected: () => Promise<boolean>
}

export interface Friend {
  id: string
  name: string
  gameName: string
  gameTag: string
  puuid: string
  availability: string
  statusMessage: string
  note: string
}

const api: ElectronAPI = {
  // 窗口控制
  windowMinimize: () => ipcRenderer.send('window-minimize'),
  windowMaximize: () => ipcRenderer.send('window-maximize'),
  windowClose: () => ipcRenderer.send('window-close'),
  // LCU API
  lcuConnect: () => ipcRenderer.invoke('lcu-connect'),
  lcuGetSummoner: () => ipcRenderer.invoke('lcu-get-summoner'),
  lcuGetFriends: () => ipcRenderer.invoke('lcu-get-friends'),
  lcuDeleteFriend: (id: string) => ipcRenderer.invoke('lcu-delete-friend', id),
  lcuIsConnected: () => ipcRenderer.invoke('lcu-is-connected')
}

contextBridge.exposeInMainWorld('electron', api)
