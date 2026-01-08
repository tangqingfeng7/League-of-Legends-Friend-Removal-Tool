import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { LcuConnector } from './lcu-connector'
import * as http from 'http'

let mainWindow: BrowserWindow | null = null
const lcuConnector = new LcuConnector()

// 检查开发服务器是否就绪
function waitForServer(url: string, timeout = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const check = (): void => {
      const req = http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve()
        } else {
          retry()
        }
      })
      
      req.on('error', () => {
        retry()
      })
      
      req.setTimeout(1000, () => {
        req.destroy()
        retry()
      })
    }
    
    const retry = (): void => {
      if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for dev server'))
      } else {
        setTimeout(check, 300)
      }
    }
    
    check()
  })
}

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 开发模式下加载 URL
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const devUrl = process.env['ELECTRON_RENDERER_URL']
    console.log('Waiting for dev server at:', devUrl)
    
    try {
      await waitForServer(devUrl)
      console.log('Dev server is ready!')
      await mainWindow.loadURL(devUrl)
    } catch (e) {
      console.error('Failed to connect to dev server:', e)
      mainWindow.loadURL(`data:text/html,<html><body style="background:#0a0a0f;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column"><h1>Dev Server Error</h1><p>Please restart the application</p></body></html>`)
    }
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 窗口控制
ipcMain.on('window-minimize', () => mainWindow?.minimize())
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.on('window-close', () => mainWindow?.close())

// LCU API 相关
ipcMain.handle('lcu-connect', async () => {
  return await lcuConnector.connect()
})

ipcMain.handle('lcu-get-summoner', async () => {
  return await lcuConnector.getCurrentSummoner()
})

ipcMain.handle('lcu-get-friends', async () => {
  return await lcuConnector.getFriends()
})

ipcMain.handle('lcu-delete-friend', async (_, id: string) => {
  return await lcuConnector.deleteFriend(id)
})

ipcMain.handle('lcu-is-connected', () => {
  return lcuConnector.isConnected()
})

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.lol.friend-cleaner')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await createWindow()

  app.on('activate', async function () {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
