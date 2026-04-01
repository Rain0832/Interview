import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

// ==================== 全局错误捕获（防止静默崩溃）====================
process.on('uncaughtException', (err) => {
  console.error('\n❌ 未捕获的异常:', err.message)
  console.error(err.stack)
  process.exit(1)
})
process.on('unhandledRejection', (reason) => {
  console.error('\n❌ 未处理的 Promise 拒绝:', reason)
})

console.log('📦 正在加载模块...')

let authRoutes: any, recordRoutes: any, submissionRoutes: any, questionRoutes: any, growthRoutes: any, progressRoutes: any

try {
  authRoutes = (await import('./routes/auth.js')).default
  recordRoutes = (await import('./routes/records.js')).default
  submissionRoutes = (await import('./routes/submissions.js')).default
  questionRoutes = (await import('./routes/questions.js')).default
  growthRoutes = (await import('./routes/growth.js')).default
  progressRoutes = (await import('./routes/progress.js')).default
  console.log('✅ 所有模块加载完成')
} catch (err: any) {
  console.error('❌ 模块加载失败:', err.message)
  console.error(err.stack)
  console.error('\n💡 可能的原因:')
  console.error('  1. 依赖未安装 → 请在 server/ 目录下运行: npm install')
  console.error('  2. better-sqlite3 编译失败 → 需要: npm install -g node-gyp && npm install')
  console.error('     WSL/Linux 需要: sudo apt install python3 make g++')
  console.error('     Windows 需要: npm install --global windows-build-tools')
  console.error('  3. Node.js 版本不兼容 → 需要 Node.js >= 20')
  process.exit(1)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = parseInt(process.env.PORT || '3000')

// ==================== 中间件 ====================
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '1mb' }))

// ==================== API 路由 ====================
app.use('/api/auth', authRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/growth', growthRoutes)
app.use('/api/progress', progressRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ==================== 静态文件托管（生产模式） ====================
const distPath = path.join(__dirname, '..', '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.use((_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
  console.log(`📂 静态文件: ${distPath}`)
} else {
  console.log('⚠️  未找到 dist/ 目录，仅提供 API 服务（前端请用 npm run dev 启动）')
}

// ==================== 启动 ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🚀 InterviewOJ Server 已启动:`)
  console.log(`     http://localhost:${PORT}`)
  console.log(`     API: http://localhost:${PORT}/api/health`)
  console.log(`\n  💡 如果是开发模式，请在另一个终端运行: npm run dev\n`)
})
