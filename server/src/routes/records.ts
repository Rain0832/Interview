import { Router } from 'express'
import db from '../models/database.js'
import { authMiddleware, type JwtPayload } from '../middleware/auth.js'
import { triggerGitSync } from '../utils/gitSync.js'

const router = Router()

// ==================== 保存做题记录（批量） ====================
router.post('/', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const { records } = req.body

  if (!Array.isArray(records) || records.length === 0) {
    res.status(400).json({ error: '记录不能为空' })
    return
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO answer_records
    (user_id, company_id, session_id, question_id, question_title, user_answer, correct_answer, is_correct)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const tx = db.transaction(() => {
    for (const r of records) {
      stmt.run(userId, r.companyId, r.sessionId, r.questionId, r.questionTitle, r.userAnswer || '', r.correctAnswer, r.isCorrect ? 1 : 0)
    }
  })
  tx()

  triggerGitSync('保存做题记录')
  res.json({ success: true, count: records.length })
})

// ==================== 获取做题记录 ====================
router.get('/', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const records = db.prepare('SELECT * FROM answer_records WHERE user_id = ? ORDER BY created_at DESC').all(userId)
  res.json({ records })
})

// ==================== 获取错题 ====================
router.get('/wrong', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const records = db.prepare('SELECT * FROM answer_records WHERE user_id = ? AND is_correct = 0 ORDER BY created_at DESC').all(userId)
  res.json({ records })
})

// ==================== 统计 ====================
router.get('/stats', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const total = (db.prepare('SELECT COUNT(*) as c FROM answer_records WHERE user_id = ?').get(userId) as any).c
  const correct = (db.prepare('SELECT COUNT(*) as c FROM answer_records WHERE user_id = ? AND is_correct = 1').get(userId) as any).c
  res.json({ total, correct, wrong: total - correct, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 })
})

// ==================== 清空 ====================
router.delete('/', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  db.prepare('DELETE FROM answer_records WHERE user_id = ?').run(userId)
  res.json({ success: true })
})

export default router
