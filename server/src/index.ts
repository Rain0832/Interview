import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import authRoutes from './routes/auth.js'
import recordRoutes from './routes/records.js'
import submissionRoutes from './routes/submissions.js'
import questionRoutes from './routes/questions.js'
import growthRoutes from './routes/growth.js'
import progressRoutes from './routes/progress.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = parseInt(process.env.PORT || '3000')

// ==================== 中间件 ====================
app.use(cors({
  origin: true,
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))

// ==================== API 路由 ====================
app.use('/api/auth', authRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/growth', growthRoutes)
app.use('/api/progress', progressRoutes)

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ==================== 静态文件托管（生产模式） ====================
const distPath = path.join(__dirname, '..', '..', 'dist')
app.use(express.static(distPath))

// SPA fallback：所有未匹配的路由返回 index.html
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

// ==================== 启动 ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🚀 InterviewOJ Server running at:`)
  console.log(`     http://0.0.0.0:${PORT}`)
  console.log(`     API: http://0.0.0.0:${PORT}/api/health\n`)
})
