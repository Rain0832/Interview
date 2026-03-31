import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

interface Props {
  visible: boolean
  onClose: () => void
  defaultTitle?: string
  defaultFolder?: string
  source?: string  // 'interview' | 'course' | 'manual'
  milestoneId?: string
}

export default function NoteSidebar({ visible, onClose, defaultTitle, defaultFolder, source, milestoneId }: Props) {
  const { isDark } = useTheme()
  const { isLoggedIn } = useAuth()
  const [title, setTitle] = useState(defaultTitle || '')
  const [content, setContent] = useState('')
  const [folder, setFolder] = useState(defaultFolder || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!visible) return null

  const save = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      if (isLoggedIn) {
        await api.saveNote({ title, content, folder, source: source || 'manual', milestoneId })
      }
      // 同时存 localStorage 作为降级
      const notes = JSON.parse(localStorage.getItem('oj-growth-notes') || '[]')
      notes.unshift({ id: `local-${Date.now()}`, title, content, folder, source, milestoneId, created_at: new Date().toISOString() })
      localStorage.setItem('oj-growth-notes', JSON.stringify(notes))
      setSaved(true)
      setTimeout(() => { setSaved(false); setTitle(''); setContent('') }, 1500)
    } catch { /* ignore */ }
    setSaving(false)
  }

  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400'}`

  return (
    <div className={`w-[300px] shrink-0 rounded-2xl border overflow-hidden flex flex-col sticky top-20 max-h-[80vh] ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
        <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>📝 快捷笔记</span>
        <button onClick={onClose} className={`text-xs cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>✕</button>
      </div>
      <div className="p-3 space-y-2 flex-1 overflow-y-auto">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="笔记标题" className={inputCls} />
        <input type="text" value={folder} onChange={e => setFolder(e.target.value)} placeholder="文件夹（如：Redis 笔记）" className={inputCls} />
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder={"记录你的思考:\n- 关键知识点\n- 易混淆的地方\n- 面试怎么回答\n\n支持 Markdown"}
          rows={10} className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
          onKeyDown={e => { if (e.key === 'Tab') { e.preventDefault(); const t = e.currentTarget; const s = t.selectionStart; setContent(content.substring(0, s) + '  ' + content.substring(t.selectionEnd)); setTimeout(() => { t.selectionStart = t.selectionEnd = s + 2 }, 0) } }}
        />
      </div>
      <div className={`px-3 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
        {saved ? (
          <div className="w-full py-2 text-sm text-center text-green-500 font-medium">✅ 已保存</div>
        ) : (
          <button onClick={save} disabled={!title.trim() || saving}
            className="w-full py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg cursor-pointer hover:shadow-md transition-all disabled:opacity-50 font-medium">
            {saving ? '保存中...' : '💾 保存笔记'}
          </button>
        )}
        {!isLoggedIn && <p className={`text-xs mt-1.5 text-center ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>⚠️ 未登录，仅保存本地</p>}
      </div>
    </div>
  )
}
