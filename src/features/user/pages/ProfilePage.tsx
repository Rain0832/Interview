import { useState, useEffect } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { useAuth } from '../../../contexts/AuthContext'
import { api } from '../../../services/api'

interface Note {
  id: string; title: string; content: string; folder: string; source: string; milestone_id?: string; created_at: string; updated_at: string
}

export default function ProfilePage() {
  const { isDark } = useTheme()
  const { user, isLoggedIn } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editFolder, setEditFolder] = useState('')

  useEffect(() => {
    const load = async () => {
      if (isLoggedIn) {
        try {
          const res = await api.getNotes()
          setNotes(res.notes)
          return
        } catch { /* fallback */ }
      }
      try { setNotes(JSON.parse(localStorage.getItem('oj-growth-notes') || '[]')) } catch { /* ignore */ }
    }
    load()
  }, [isLoggedIn])

  // 按文件夹分组
  const folders = [...new Set(notes.map(n => n.folder || '未分类'))].sort()
  const filteredNotes = selectedFolder ? notes.filter(n => (n.folder || '未分类') === selectedFolder) : notes
  const sourceLabel = (s: string) => s === 'interview' ? '🎤 面试' : s === 'course' ? '📚 课程' : '✏️ 手动'

  const startEdit = (n: Note) => {
    setSelectedNote(n); setEditing(true); setEditTitle(n.title); setEditContent(n.content); setEditFolder(n.folder || '')
  }

  const saveEdit = async () => {
    if (!selectedNote || !editTitle.trim()) return
    try {
      if (isLoggedIn) await api.saveNote({ id: selectedNote.id, title: editTitle, content: editContent, folder: editFolder })
      setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, title: editTitle, content: editContent, folder: editFolder } : n))
      setEditing(false)
    } catch { /* ignore */ }
  }

  const deleteNote = async (id: string) => {
    if (!confirm('确定删除？')) return
    try {
      if (isLoggedIn) await api.deleteNote(id)
      setNotes(prev => prev.filter(n => n.id !== id))
      if (selectedNote?.id === id) { setSelectedNote(null); setEditing(false) }
    } catch { /* ignore */ }
  }

  const c = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
  const inputCls = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-400'}`

  return (
    <div className="py-8">
      {/* 头部 */}
      <div className={`rounded-2xl border p-6 mb-6 ${c}`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${isDark ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
            {user?.username?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{user?.username || '游客'}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {notes.length} 篇笔记 · {folders.length} 个文件夹 · {isLoggedIn ? '☁️ 云端同步' : '💾 本地存储'}
            </p>
          </div>
        </div>
      </div>

      {/* 三栏布局：文件夹 | 笔记列表 | 编辑/预览 */}
      <div className="flex gap-4" style={{ minHeight: '60vh' }}>
        {/* 左栏：文件夹 */}
        <div className={`w-48 shrink-0 rounded-2xl border overflow-hidden ${c}`}>
          <div className={`px-4 py-3 border-b text-xs font-bold ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-100 text-slate-600'}`}>📁 文件夹</div>
          <div className="p-2">
            <button onClick={() => setSelectedFolder(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors mb-1 ${!selectedFolder ? 'bg-blue-600 text-white' : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}>
              📋 全部 ({notes.length})
            </button>
            {folders.map(f => {
              const cnt = notes.filter(n => (n.folder || '未分类') === f).length
              return (
                <button key={f} onClick={() => setSelectedFolder(f)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors mb-0.5 ${selectedFolder === f ? 'bg-blue-600 text-white' : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  📂 {f} ({cnt})
                </button>
              )
            })}
          </div>
        </div>

        {/* 中栏：笔记列表 */}
        <div className={`w-64 shrink-0 rounded-2xl border overflow-hidden flex flex-col ${c}`}>
          <div className={`px-4 py-3 border-b text-xs font-bold ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
            📝 笔记 ({filteredNotes.length})
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className={`p-6 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>暂无笔记</div>
            ) : filteredNotes.map(n => (
              <button key={n.id} onClick={() => { setSelectedNote(n); setEditing(false) }}
                className={`w-full text-left px-4 py-3 border-b cursor-pointer transition-colors ${selectedNote?.id === n.id ? (isDark ? 'bg-blue-900/30' : 'bg-blue-50') : isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{n.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{sourceLabel(n.source)}</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{(n.updated_at || n.created_at || '').slice(0, 10)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 右栏：编辑 / 预览 */}
        <div className={`flex-1 rounded-2xl border overflow-hidden flex flex-col ${c}`}>
          {selectedNote ? (
            <>
              <div className={`px-5 py-3 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{sourceLabel(selectedNote.source)}</span>
                  {selectedNote.folder && <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>📂 {selectedNote.folder}</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editing ? saveEdit() : startEdit(selectedNote)}
                    className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer ${editing ? 'bg-green-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    {editing ? '💾 保存' : '✏️ 编辑'}
                  </button>
                  <button onClick={() => deleteNote(selectedNote.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer ${isDark ? 'text-red-400 bg-red-900/20' : 'text-red-500 bg-red-50'}`}>🗑️</button>
                </div>
              </div>
              {editing ? (
                <div className="p-5 space-y-3 flex-1 overflow-y-auto">
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className={inputCls} placeholder="标题" />
                  <input type="text" value={editFolder} onChange={e => setEditFolder(e.target.value)} className={inputCls} placeholder="文件夹" />
                  <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className={`${inputCls} flex-1 min-h-[300px] resize-y font-mono text-xs leading-relaxed`} placeholder="笔记内容（支持 Markdown）" />
                </div>
              ) : (
                <div className="p-5 flex-1 overflow-y-auto">
                  <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{selectedNote.title}</h2>
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedNote.content || '(空内容)'}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`flex-1 flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <div className="text-center">
                <div className="text-5xl mb-3">📖</div>
                <p className="text-sm">选择左侧笔记查看详情</p>
                <p className="text-xs mt-1">在面试刷题或课程学习时点击 📝 可新建笔记</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
