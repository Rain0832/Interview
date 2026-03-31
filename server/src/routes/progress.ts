import { Router } from 'express'
import db from '../models/database.js'
import { authMiddleware, type JwtPayload } from '../middleware/auth.js'
import { triggerGitSync } from '../utils/gitSync.js'

const router = Router()

// 获取用户所有题目进度
router.get('/', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const rows = db.prepare('SELECT * FROM question_progress WHERE user_id = ?').all(userId)
  res.json({ progress: rows })
})

// 获取单题进度
router.get('/:questionId', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const row = db.prepare('SELECT * FROM question_progress WHERE user_id = ? AND question_id = ?').get(userId, req.params.questionId)
  res.json({ progress: row || null })
})

// 保存/更新进度（upsert）
router.put('/:questionId', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const { status, myAnswer, note } = req.body
  db.prepare(`INSERT INTO question_progress (user_id, question_id, status, my_answer, note)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, question_id) DO UPDATE SET
      status=COALESCE(excluded.status, status),
      my_answer=COALESCE(excluded.my_answer, my_answer),
      note=COALESCE(excluded.note, note),
      updated_at=datetime('now')
  `).run(userId, req.params.questionId, status || 'learning', myAnswer ?? '', note ?? '')
  triggerGitSync('更新学习进度')
  res.json({ success: true })
})

// 批量获取进度统计
router.get('/stats/summary', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const stats = db.prepare(`SELECT status, COUNT(*) as count FROM question_progress WHERE user_id = ? GROUP BY status`).all(userId)
  res.json({ stats })
})

export default router
