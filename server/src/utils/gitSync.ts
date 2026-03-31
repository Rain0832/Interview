/**
 * Git 自动同步 — 数据库变更后自动 commit + push 到 GitHub
 *
 * 策略：防抖(debounce) 5秒，避免频繁写入时每次都触发 git 操作
 */
import { exec } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..')

let syncTimer: ReturnType<typeof setTimeout> | null = null
let syncing = false

/**
 * 触发 Git 同步（防抖 5 秒）
 * 多次调用只会在最后一次调用 5 秒后执行一次
 */
export function triggerGitSync(reason: string = '数据更新') {
  if (syncTimer) clearTimeout(syncTimer)

  syncTimer = setTimeout(() => {
    if (syncing) return
    doGitSync(reason)
  }, 5000)
}

async function doGitSync(reason: string) {
  syncing = true
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  const commitMsg = `sync: ${reason} (${timestamp})`

  // 先 checkpoint WAL 到主数据库文件
  const commands = [
    `sqlite3 ${path.join(PROJECT_ROOT, 'server/data/interview.db')} "PRAGMA wal_checkpoint(TRUNCATE);"`,
    `cd ${PROJECT_ROOT} && git add server/data/interview.db`,
    `cd ${PROJECT_ROOT} && git -c user.name="auto-sync" -c user.email="sync@interviewoj.local" diff --cached --quiet || git -c user.name="auto-sync" -c user.email="sync@interviewoj.local" commit -m "${commitMsg}"`,
    `cd ${PROJECT_ROOT} && git push origin main`,
  ]

  for (const cmd of commands) {
    try {
      await execPromise(cmd)
    } catch (err: any) {
      // push 失败不阻断（可能网络不通），只打日志
      console.warn(`[GitSync] 命令失败: ${cmd.slice(0, 80)}...`, err.message?.slice(0, 100))
      break
    }
  }

  syncing = false
  console.log(`[GitSync] ✅ 同步完成: ${reason}`)
}

function execPromise(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message))
      else resolve(stdout)
    })
  })
}
