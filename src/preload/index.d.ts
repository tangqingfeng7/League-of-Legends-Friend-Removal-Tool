import { ElectronAPI, Friend } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
  }
}

export { ElectronAPI, Friend }
