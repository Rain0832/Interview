/**
 * Git 自动同步 — 数据库变更后自动 commit + push 到 GitHub
 * 
 * 兼容性：不依赖 sqlite3 命令行工具，改用 better-sqlite3 的 JS API 做 checkpoint
 */
import { exec } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..')

let syncTimer: ReturnType<typeof setTimeout> | null = null
let syncing = false

export function triggerGitSync(reason: string = '数据更新') {
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    if (syncing) return
    doGitSync(reason).catch(err => console.warn('[GitSync] 错误:', err.message))
  }, 5000)
}

async function doGitSync(reason: string) {
  syncing = true
  try {
    // 用 JS API 做 WAL checkpoint（不依赖 sqlite3 命令行）
    try {
      const { default: db } = await import('../models/database.js')
      db.pragma('wal_checkpoint(TRUNCATE)')
    } catch (e: any) {
      console.warn('[GitSync] checkpoint 失败:', e.message)
    }

    const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    const dbPath = path.join('server', 'data', 'interview.db')
    const commitMsg = `sync: ${reason} (${timestamp})`

    // git 操作
    await execPromise(`git -C "${PROJECT_ROOT}" add "${dbPath}"`)
    // 检查有没有变更，有才 commit
    try {
      await execPromise(`git -C "${PROJECT_ROOT}" diff --cached --quiet`)
      // 没有变更，跳过
    } catch {
      // diff --quiet 退出码非0 = 有变更，执行 commit
      await execPromise(`git -C "${PROJECT_ROOT}" -c user.name="auto-sync" -c user.email="sync@interviewoj.local" commit -m "${commitMsg}"`)
    }
    await execPromise(`git -C "${PROJECT_ROOT}" push origin main`)
    console.log(`[GitSync] ✅ 同步完成: ${reason}`)
  } catch (err: any) {
    console.warn(`[GitSync] 同步失败(不影响使用): ${err.message?.slice(0, 100)}`)
  }
  syncing = false
}

function execPromise(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message))
      else resolve(stdout)
    })
  })
}
