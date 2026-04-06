/**
 * Vite 插件：自动同步 Mock 用户数据到 JSON 文件
 *
 * 在开发环境下，当用户信息在浏览器中被更新时，
 * 自动将数据同步到 src/mock/data/ 目录下的 JSON 文件中
 *
 * 使用方法：
 * 1. 启动开发服务器（pnpm dev）
 * 2. 在浏览器中修改用户信息
 * 3. 数据会自动同步到 JSON 文件（查看控制台日志）
 */

import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

interface SyncMockDataOptions {
  /** JSON 文件路径（相对于项目根目录） */
  dataPath: string
  /** LocalStorage key 名称 */
  storageKey: string
  /** 数据类型名称（用于日志输出） */
  dataType: string
}

export function syncMockData(options: SyncMockDataOptions): Plugin {
  const { dataPath, storageKey, dataType } = options
  let jsonFilePath: string
  let isDev = false

  return {
    name: 'vite-plugin-sync-mock-data',
    enforce: 'pre',

    config(config, { command }) {
      isDev = command === 'serve'
    },

    configResolved(config: any) {
      jsonFilePath = path.resolve(config.root, dataPath)
      if (isDev) {
        console.log(`[SyncMockData][${dataType}] 已启用 - 同步到：${jsonFilePath}`)
      }
    },

    // 为开发环境注入同步脚本
    transformIndexHtml(html) {
      if (!isDev) return html

      return html.replace(
        '</head>',
        `
  <script>
    // 监听 LocalStorage ${dataType} 变更并同步到服务器
    (function() {
      const STORAGE_KEY = '${storageKey}'
      const DATA_TYPE = '${dataType}'
      let lastSyncedData = null

      // 初始化时记录当前数据
      try {
        lastSyncedData = localStorage.getItem(STORAGE_KEY)
      } catch(e) {}

      // 定期检查 LocalStorage 变化
      setInterval(function() {
        try {
          const currentData = localStorage.getItem(STORAGE_KEY)
          if (currentData && currentData !== lastSyncedData) {
            lastSyncedData = currentData
            // 发送到 Vite 服务器进行同步
            fetch('/__sync_mock__', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                key: STORAGE_KEY,
                data: JSON.parse(currentData),
                type: DATA_TYPE
              })
            }).then(function(res) {
              if (res.ok) {
                console.log('[SyncMockData][' + DATA_TYPE + '] 数据已同步到 JSON 文件')
              }
            }).catch(function(err) {
              console.error('[SyncMockData][' + DATA_TYPE + '] 同步失败:', err)
            })
          }
        } catch(e) {
          console.error('[SyncMockData][' + DATA_TYPE + '] 检查变化失败:', e)
        }
      }, 1000) // 每秒检查一次
    })()
  </script>
  </head>
`
      )
    },

    // 配置开发服务器中间件
    configureServer(server) {
      if (!isDev) return

      server.middlewares.use('/__sync_mock__', async (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk.toString()
          })
          req.on('end', () => {
            try {
              const { key, data, type } = JSON.parse(body)
              const currentPath = path.resolve(
                server.config.root,
                'src/mock/data',
                key.replace('trade_', '').replace('user_info', 'userInfo') + '.json'
              )

              // 读取当前 JSON 文件内容
              let currentData = {}
              if (fs.existsSync(currentPath)) {
                const content = fs.readFileSync(currentPath, 'utf-8')
                currentData = Array.isArray(data) ? JSON.parse(content) : JSON.parse(content)
              }

              // 合并数据（保留原有字段，更新变化的字段）
              let updatedData
              if (Array.isArray(data)) {
                // 数组类型（客户/产品/报价）：直接替换
                updatedData = data
              } else {
                // 对象类型（用户信息）：合并更新
                updatedData = { ...currentData, ...data }
              }

              // 写回文件
              fs.writeFileSync(currentPath, JSON.stringify(updatedData, null, 2), 'utf-8')

              console.log(`[SyncMockData][${type || dataType}] ✅ 数据已同步到`, currentPath)

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: true }))
            } catch (error) {
              console.error('[SyncMockData] ❌ 同步失败:', error)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: error.message }))
            }
          })
        } else {
          res.writeHead(405)
          res.end()
        }
      })
    }
  }
}
