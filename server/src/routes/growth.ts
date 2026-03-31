import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../models/database.js'
import { authMiddleware, type JwtPayload } from '../middleware/auth.js'
import { triggerGitSync } from '../utils/gitSync.js'

const router = Router()

// ==================== 路线图 CRUD ====================

router.get('/roadmap', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const rows = db.prepare('SELECT * FROM growth_roadmaps WHERE user_id = ? ORDER BY updated_at DESC').all(userId)
  res.json({ roadmaps: rows })
})

router.post('/roadmap', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const { title, description, milestones } = req.body
  if (!title) { res.status(400).json({ error: '标题不能为空' }); return }
  const id = uuid()
  db.prepare('INSERT INTO growth_roadmaps (id, user_id, title, description, milestones) VALUES (?, ?, ?, ?, ?)').run(id, userId, title, description || '', JSON.stringify(milestones || []))
  triggerGitSync('保存路线图')
  res.json({ id })
})

router.put('/roadmap/:id', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const { title, description, milestones } = req.body
  const result = db.prepare("UPDATE growth_roadmaps SET title=?, description=?, milestones=?, updated_at=datetime('now') WHERE id=? AND user_id=?").run(title, description || '', JSON.stringify(milestones || []), req.params.id, userId)
  if (result.changes === 0) { res.status(404).json({ error: '未找到' }); return }
  triggerGitSync('更新路线图')
  res.json({ success: true })
})

router.delete('/roadmap/:id', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  db.prepare('DELETE FROM growth_roadmaps WHERE id=? AND user_id=?').run(req.params.id, userId)
  db.prepare('DELETE FROM growth_notes WHERE roadmap_id=? AND user_id=?').run(req.params.id, userId)
  triggerGitSync('删除路线图')
  res.json({ success: true })
})

// ==================== 笔记 CRUD ====================

router.get('/notes', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const roadmapId = req.query.roadmap_id as string || ''
  const rows = roadmapId
    ? db.prepare('SELECT * FROM growth_notes WHERE user_id=? AND roadmap_id=? ORDER BY updated_at DESC').all(userId, roadmapId)
    : db.prepare('SELECT * FROM growth_notes WHERE user_id=? ORDER BY updated_at DESC').all(userId)
  res.json({ notes: rows })
})

router.post('/notes', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const { roadmapId, milestoneId, folder, source, title, content } = req.body
  if (!title) { res.status(400).json({ error: '标题不能为空' }); return }
  const id = uuid()
  db.prepare('INSERT INTO growth_notes (id, user_id, roadmap_id, milestone_id, folder, source, title, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, userId, roadmapId || '', milestoneId || '', folder || '', source || 'manual', title, content || '')
  triggerGitSync('保存笔记')
  res.json({ id })
})

router.put('/notes/:id', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  const { title, content, milestoneId, folder } = req.body
  const result = db.prepare("UPDATE growth_notes SET title=?, content=?, milestone_id=?, folder=COALESCE(?,folder), updated_at=datetime('now') WHERE id=? AND user_id=?").run(title, content || '', milestoneId || '', folder, req.params.id, userId)
  if (result.changes === 0) { res.status(404).json({ error: '未找到' }); return }
  triggerGitSync('更新笔记')
  res.json({ success: true })
})

router.delete('/notes/:id', authMiddleware, (req, res) => {
  const { userId } = (req as any).user as JwtPayload
  db.prepare('DELETE FROM growth_notes WHERE id=? AND user_id=?').run(req.params.id, userId)
  triggerGitSync('删除笔记')
  res.json({ success: true })
})

export default router
