import { execSync } from 'child_process'
import * as https from 'https'

export interface LcuCredentials {
  port: number
  password: string
  protocol: string
  pid: number
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

export interface Summoner {
  displayName: string
  puuid: string
  summonerId: number
  profileIconId: number
}

export class LcuConnector {
  private credentials: LcuCredentials | null = null

  async connect(): Promise<boolean> {
    try {
      const output = execSync(
        'wmic process where "name=\'LeagueClientUx.exe\'" get CommandLine',
        { encoding: 'utf8', windowsHide: true }
      )

      const portMatch = output.match(/--app-port=(\d+)/)
      const tokenMatch = output.match(/--remoting-auth-token=([\w-]+)/)
      const pidMatch = output.match(/--app-pid=(\d+)/)

      if (portMatch && tokenMatch) {
        this.credentials = {
          port: parseInt(portMatch[1]),
          password: tokenMatch[1],
          protocol: 'https',
          pid: pidMatch ? parseInt(pidMatch[1]) : 0
        }
        return true
      }

      return false
    } catch {
      return false
    }
  }

  private request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.credentials) {
        reject(new Error('未连接到客户端'))
        return
      }

      const auth = Buffer.from(`riot:${this.credentials.password}`).toString('base64')

      const options: https.RequestOptions = {
        hostname: '127.0.0.1',
        port: this.credentials.port,
        path: endpoint,
        method: method,
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        rejectUnauthorized: false
      }

      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            if (data && data.length > 0) {
              resolve(JSON.parse(data) as T)
            } else {
              resolve({} as T)
            }
          } catch {
            resolve({} as T)
          }
        })
      })

      req.on('error', reject)

      if (body) {
        req.write(JSON.stringify(body))
      }

      req.end()
    })
  }

  async getFriends(): Promise<Friend[]> {
    return this.request<Friend[]>('GET', '/lol-chat/v1/friends')
  }

  async deleteFriend(id: string): Promise<boolean> {
    try {
      await this.request('DELETE', `/lol-chat/v1/friends/${id}`)
      return true
    } catch {
      return false
    }
  }

  async getCurrentSummoner(): Promise<Summoner | null> {
    try {
      return await this.request<Summoner>('GET', '/lol-summoner/v1/current-summoner')
    } catch {
      return null
    }
  }

  isConnected(): boolean {
    return this.credentials !== null
  }
}
