import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { useAuth } from '../../../contexts/AuthContext'
import { api } from '../../../services/api'

// ==================== 类型 ====================

interface SubTask { title: string; done: boolean }
interface Milestone {
  id: string; title: string; description: string
  status: 'done' | 'in-progress' | 'todo'; progress: number
  category: string; subTasks?: SubTask[]
}
interface RoadmapData { id?: string; title: string; description: string; milestones: Milestone[] }
interface Note { id: string; roadmapId?: string; milestoneId?: string; title: string; content: string; created_at?: string; updated_at?: string }

// ==================== 默认路线图 ====================
const DEFAULT_ROADMAP: RoadmapData = {
  title: '🚀 AI 技术栈快速转型路线图',
  description: 'C++ 底层 → AI 应用开发工程师',
  milestones: [
    { id: 'cpp-base', title: 'C++ 系统编程', description: '自研 HTTP 框架（muduo Reactor + 状态机 + SSL/TLS）', status: 'done', progress: 100, category: '✅ 已具备', subTasks: [
      { title: 'muduo Reactor 模型 + EventLoop', done: true }, { title: 'HTTP 状态机解析', done: true }, { title: 'OpenSSL BIO 自定义回调', done: true }, { title: '数据库连接池 + MQ 异步入库', done: true }, { title: '策略+工厂+自注册设计模式', done: true },
    ]},
    { id: 'ai-agent-proto', title: 'AI Agent 原型', description: 'MCP 两段式推理 + 工具调用 + 多模型策略', status: 'done', progress: 100, category: '✅ 已具备', subTasks: [
      { title: 'AIStrategy 策略模式 4 种模型', done: true }, { title: 'MCP 两段式推理', done: true }, { title: 'AIToolRegistry 工具注册中心', done: true }, { title: '阿里百炼 RAG 接入', done: true }, { title: 'ONNX Runtime 端侧推理', done: true },
    ]},
    { id: 'agent-upgrade', title: '🥇 Agent 升级为标准框架', description: 'ReAct 多步推理 + Function Calling + 记忆管理', status: 'in-progress', progress: 30, category: '🔴 优先级1', subTasks: [
      { title: 'ReAct 循环（多步工具调用）', done: false }, { title: '标准 Function Calling 接口', done: false }, { title: '记忆管理（滑动窗口+压缩）', done: true }, { title: '新增工具（代码执行/搜索）', done: false }, { title: 'SSE 流式输出', done: false },
    ]},
    { id: 'rag-self-build', title: '🥈 RAG 自建全链路', description: 'ONNX Embedding → FAISS → 上下文注入', status: 'todo', progress: 0, category: '🔴 优先级2', subTasks: [
      { title: 'ONNX Runtime 加载 BGE-small Embedding', done: false }, { title: 'FAISS C++ API 向量索引', done: false }, { title: '文档递归分块', done: false }, { title: '混合检索 BM25+Dense', done: false }, { title: 'Reranking Cross-Encoder', done: false },
    ]},
    { id: 'python-langchain', title: '🥉 Python + LangChain', description: 'Python 速通 + LangChain Agent/RAG', status: 'todo', progress: 0, category: '🔴 优先级4', subTasks: [
      { title: 'Python 语法（与C++对照）', done: false }, { title: 'LangChain Agent ReAct', done: false }, { title: 'LangChain RAG FAISS', done: false }, { title: 'C++ vs LangChain 对比', done: false },
    ]},
    { id: 'llm-fundamentals', title: 'LLM 原理八股', description: 'Transformer / Attention / 训练推理', status: 'in-progress', progress: 40, category: '🔴 优先级5', subTasks: [
      { title: 'Transformer 架构', done: true }, { title: 'GPT vs BERT', done: true }, { title: 'Tokenizer BPE', done: false }, { title: '预训练→SFT→RLHF', done: false }, { title: 'KV Cache/量化/FlashAttention', done: false }, { title: 'Prompt Engineering', done: true }, { title: 'MoE/Speculative Decoding', done: false },
    ]},
  ],
}

// ==================== 简易 Markdown 渲染 ====================
function renderMarkdown(text: string, isDark: boolean): React.ReactElement {
  const lines = text.split('\n')
  const elements: React.ReactElement[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // 标题
    const hMatch = line.match(/^(#{1,4})\s+(.*)/)
    if (hMatch) {
      const level = hMatch[1].length
      const cls = level === 1 ? 'text-xl font-bold mt-4 mb-2' : level === 2 ? 'text-lg font-bold mt-3 mb-1.5' : 'text-base font-semibold mt-2 mb-1'
      elements.push(<div key={i} className={`${cls} ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{renderInline(hMatch[2], isDark)}</div>)
      i++; continue
    }
    // 代码块
    if (line.startsWith('```')) {
      const codeLines: string[] = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      i++ // skip closing ```
      elements.push(<pre key={i} className={`my-2 p-3 rounded-lg text-sm font-mono overflow-x-auto ${isDark ? 'bg-slate-900 text-green-400' : 'bg-slate-100 text-slate-800'}`}>{codeLines.join('\n')}</pre>)
      continue
    }
    // 列表
    if (/^[-*]\s/.test(line)) {
      elements.push(<div key={i} className="flex gap-2 items-start my-0.5"><span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`} /><span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{renderInline(line.replace(/^[-*]\s/, ''), isDark)}</span></div>)
      i++; continue
    }
    // 有序列表
    const olMatch = line.match(/^(\d+)[.)]\s(.*)/)
    if (olMatch) {
      elements.push(<div key={i} className="flex gap-2 items-start my-0.5"><span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{olMatch[1]}</span><span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{renderInline(olMatch[2], isDark)}</span></div>)
      i++; continue
    }
    // 引用
    if (line.startsWith('>')) {
      elements.push(<div key={i} className={`border-l-3 pl-3 my-1 text-sm italic ${isDark ? 'border-blue-500 text-slate-400' : 'border-blue-400 text-slate-500'}`}>{renderInline(line.slice(1).trim(), isDark)}</div>)
      i++; continue
    }
    // 空行
    if (!line.trim()) { elements.push(<div key={i} className="h-2" />); i++; continue }
    // 普通段落
    elements.push(<p key={i} className={`text-sm leading-relaxed my-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{renderInline(line, isDark)}</p>)
    i++
  }
  return <>{elements}</>
}

function renderInline(text: string, isDark: boolean) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/)
  return parts.map((p, i) => {
    if (/^\*\*.*\*\*$/.test(p)) return <strong key={i} className={isDark ? 'text-slate-100' : 'text-slate-800'}>{p.slice(2, -2)}</strong>
    if (/^`.*`$/.test(p)) return <code key={i} className={`px-1 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-slate-700 text-green-300' : 'bg-slate-200 text-green-700'}`}>{p.slice(1, -1)}</code>
    const linkMatch = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) return <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{linkMatch[1]}</a>
    return <span key={i}>{p}</span>
  })
}

// ==================== 页面组件 ====================

export default function GrowthPage() {
  const { isDark } = useTheme()
  const { isLoggedIn } = useAuth()

  const [roadmap, setRoadmap] = useState<RoadmapData>(DEFAULT_ROADMAP)
  const [notes, setNotes] = useState<Note[]>([])
  const [activeTab, setActiveTab] = useState<'roadmap' | 'notes'>('roadmap')
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [synced, setSynced] = useState(false)
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)

  // 从服务器加载 or localStorage
  const loadData = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const [rmRes, nRes] = await Promise.all([api.getRoadmaps(), api.getNotes()])
        if (rmRes.roadmaps.length > 0) {
          const rm = rmRes.roadmaps[0] as any
          setRoadmap({ id: rm.id, title: rm.title, description: rm.description, milestones: JSON.parse(rm.milestones) })
        }
        setNotes(nRes.notes)
        setSynced(true)
      } catch { /* fallback to local */ }
    } else {
      try {
        const rm = JSON.parse(localStorage.getItem('oj-growth-roadmap') || 'null')
        if (rm) setRoadmap(rm)
        const ns = JSON.parse(localStorage.getItem('oj-growth-notes') || '[]')
        setNotes(ns)
      } catch { /* ignore */ }
    }
  }, [isLoggedIn])

  useEffect(() => { loadData() }, [loadData])

  // 保存路线图
  const saveRoadmap = useCallback(async (rm: RoadmapData) => {
    setRoadmap(rm)
    if (isLoggedIn) {
      try { const res = await api.saveRoadmap({ id: rm.id, title: rm.title, description: rm.description, milestones: rm.milestones }); if (!rm.id && (res as any).id) rm.id = (res as any).id } catch { /* ignore */ }
    }
    localStorage.setItem('oj-growth-roadmap', JSON.stringify(rm))
  }, [isLoggedIn])

  // 切换子任务
  const toggleSubTask = (mId: string, tIdx: number) => {
    const updated = { ...roadmap, milestones: roadmap.milestones.map(m => {
      if (m.id !== mId || !m.subTasks) return m
      const tasks = [...m.subTasks]; tasks[tIdx] = { ...tasks[tIdx], done: !tasks[tIdx].done }
      const doneCount = tasks.filter(t => t.done).length
      const progress = Math.round((doneCount / tasks.length) * 100)
      const status: Milestone['status'] = progress === 100 ? 'done' : progress > 0 ? 'in-progress' : 'todo'
      return { ...m, subTasks: tasks, progress, status }
    })}
    saveRoadmap(updated)
  }

  // 保存笔记
  const saveNote = async (note: Note) => {
    if (isLoggedIn) {
      try {
        if (note.id.startsWith('local-')) {
          const res = await api.saveNote({ roadmapId: roadmap.id, milestoneId: note.milestoneId, title: note.title, content: note.content })
          note.id = (res as any).id
        } else {
          await api.saveNote({ id: note.id, milestoneId: note.milestoneId, title: note.title, content: note.content })
        }
      } catch { /* ignore */ }
    }
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === note.id)
      const updated = idx >= 0 ? prev.map((n, i) => i === idx ? note : n) : [note, ...prev]
      localStorage.setItem('oj-growth-notes', JSON.stringify(updated))
      return updated
    })
    setEditingNote(null)
  }

  const deleteNote = async (id: string) => {
    if (isLoggedIn) { try { await api.deleteNote(id) } catch { /* ignore */ } }
    setNotes(prev => { const u = prev.filter(n => n.id !== id); localStorage.setItem('oj-growth-notes', JSON.stringify(u)); return u })
  }

  const startNewNote = (milestoneId?: string) => {
    setEditingNote({ id: `local-${Date.now()}`, milestoneId: milestoneId || '', title: '', content: '' })
    setPreviewMode(false)
    setActiveTab('notes')
  }

  const totalTasks = roadmap.milestones.reduce((s, m) => s + (m.subTasks?.length || 0), 0)
  const doneTasks = roadmap.milestones.reduce((s, m) => s + (m.subTasks?.filter(t => t.done).length || 0), 0)
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const c = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400'}`

  return (
    <div className="py-8">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>🌱 个人成长</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {roadmap.description}
            {isLoggedIn && synced && <span className="ml-2 text-green-500">☁️ 已同步</span>}
            {!isLoggedIn && <span className="ml-2 text-amber-500">⚠️ 登录后可云端同步</span>}
          </p>
        </div>
      </div>

      {/* 总进度 */}
      <div className={`rounded-2xl p-6 border mb-6 ${c}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{roadmap.title}</span>
          <span className={`text-sm font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{overallProgress}%</span>
        </div>
        <div className={`w-full h-4 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
        </div>
        <div className={`flex justify-between mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <span>{doneTasks}/{totalTasks} 子任务</span>
          <span>{roadmap.milestones.filter(m => m.status === 'done').length}/{roadmap.milestones.length} 里程碑</span>
        </div>
      </div>

      {/* Tab */}
      <div className={`flex gap-1 rounded-xl p-1 mb-6 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
        {(['roadmap', 'notes'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === tab ? (isDark ? 'bg-slate-600 text-white shadow' : 'bg-white text-slate-800 shadow') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>
            {tab === 'roadmap' ? `🗺️ 路线图 (${roadmap.milestones.length})` : `📝 学习笔记 (${notes.length})`}
          </button>
        ))}
      </div>

      {/* ==================== 路线图 ==================== */}
      {activeTab === 'roadmap' && (
        <div className="space-y-3">
          {roadmap.milestones.map((m, mIdx) => {
            const isExpanded = expandedMilestone === m.id
            const statusIcon = m.status === 'done' ? '✅' : m.status === 'in-progress' ? '🔄' : '⬜'
            const barColor = m.status === 'done' ? 'from-green-500 to-emerald-500' : m.status === 'in-progress' ? 'from-blue-500 to-indigo-500' : 'from-slate-400 to-slate-500'
            const milestoneNotes = notes.filter(n => n.milestoneId === m.id)

            return (
              <div key={m.id} className={`rounded-2xl border overflow-hidden ${c}`}>
                <button onClick={() => setExpandedMilestone(isExpanded ? null : m.id)} className={`w-full p-5 text-left cursor-pointer bg-transparent border-0 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0 mt-1">
                      <span className="text-lg">{statusIcon}</span>
                      {mIdx < roadmap.milestones.length - 1 && <div className={`w-0.5 h-6 mt-1 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold">{m.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{m.category}</span>
                        {milestoneNotes.length > 0 && <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>📝 {milestoneNotes.length} 笔记</span>}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                          <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all`} style={{ width: `${m.progress}%` }} />
                        </div>
                        <span className={`text-xs font-bold shrink-0 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{m.progress}%</span>
                        <span className={`shrink-0 transition-transform text-xs ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    {/* 子任务 */}
                    {m.subTasks && (
                      <div className={`px-5 py-3 space-y-1 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50/50'}`}>
                        {m.subTasks.map((t, tIdx) => (
                          <label key={tIdx} className={`flex items-center gap-2.5 cursor-pointer py-1 px-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                            <input type="checkbox" checked={t.done} onChange={() => toggleSubTask(m.id, tIdx)} className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
                            <span className={`text-sm ${t.done ? (isDark ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : (isDark ? 'text-slate-200' : 'text-slate-700')}`}>{t.title}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {/* 关联笔记 */}
                    {milestoneNotes.length > 0 && (
                      <div className={`px-5 py-3 border-t space-y-2 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                        <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>📝 关联笔记</div>
                        {milestoneNotes.map(n => (
                          <div key={n.id} className={`p-3 rounded-lg border cursor-pointer transition-colors ${isDark ? 'border-slate-600 hover:border-blue-500' : 'border-slate-200 hover:border-blue-300'}`}
                            onClick={() => { setEditingNote(n); setPreviewMode(true); setActiveTab('notes') }}>
                            <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{n.title}</div>
                            <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{n.content.slice(0, 80)}...</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* 写笔记按钮 */}
                    <div className={`px-5 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                      <button onClick={() => startNewNote(m.id)} className={`text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                        ✏️ 为此目标写笔记
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ==================== 笔记 ==================== */}
      {activeTab === 'notes' && (
        <div>
          {/* 编辑面板 */}
          {editingNote ? (
            <div className={`rounded-2xl border p-5 mb-6 ${c}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {editingNote.id.startsWith('local-') ? '✏️ 新建笔记' : '✏️ 编辑笔记'}
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => setPreviewMode(!previewMode)} className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${previewMode ? (isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700') : (isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-100 text-slate-600')}`}>
                    {previewMode ? '📝 编辑' : '👁️ 预览'}
                  </button>
                  <button onClick={() => setEditingNote(null)} className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer ${isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>取消</button>
                </div>
              </div>
              <div className="space-y-3">
                <input type="text" value={editingNote.title} onChange={e => setEditingNote({ ...editingNote, title: e.target.value })} placeholder="笔记标题" className={inputCls} />
                <select value={editingNote.milestoneId || ''} onChange={e => setEditingNote({ ...editingNote, milestoneId: e.target.value })} className={inputCls}>
                  <option value="">关联里程碑（可选）</option>
                  {roadmap.milestones.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>

                {previewMode ? (
                  <div className={`min-h-[200px] p-4 rounded-xl border ${isDark ? 'border-slate-600 bg-slate-700/30' : 'border-slate-200 bg-white'}`}>
                    {editingNote.content ? renderMarkdown(editingNote.content, isDark) : <p className={`text-sm italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>暂无内容...</p>}
                  </div>
                ) : (
                  <div>
                    <textarea value={editingNote.content} onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                      placeholder={"支持 Markdown 语法:\n# 标题\n## 二级标题\n- 列表项\n**加粗** `代码`\n```\n代码块\n```\n> 引用"}
                      rows={12} className={`${inputCls} resize-y font-mono text-sm leading-relaxed`}
                      onKeyDown={e => {
                        if (e.key === 'Tab') { e.preventDefault(); const t = e.currentTarget; const s = t.selectionStart; const en = t.selectionEnd; const val = t.value; setEditingNote({ ...editingNote, content: val.substring(0, s) + '  ' + val.substring(en) }); setTimeout(() => { t.selectionStart = t.selectionEnd = s + 2 }, 0) }
                      }}
                    />
                    <div className={`flex gap-2 mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>Tab 缩进</span><span>·</span><span># 标题</span><span>·</span><span>- 列表</span><span>·</span><span>**加粗**</span><span>·</span><span>`代码`</span><span>·</span><span>``` 代码块</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => { if (editingNote.title.trim()) saveNote(editingNote) }} disabled={!editingNote.title.trim()} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all cursor-pointer disabled:opacity-50">💾 保存</button>
                  {!editingNote.id.startsWith('local-') && (
                    <button onClick={() => { if (confirm('确定删除？')) { deleteNote(editingNote.id); setEditingNote(null) } }} className={`px-4 py-2.5 text-sm rounded-xl border cursor-pointer ${isDark ? 'border-red-800 text-red-400 hover:bg-red-900/30' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>🗑️ 删除</button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => startNewNote()} className={`w-full p-4 rounded-xl border-2 border-dashed text-sm font-medium cursor-pointer transition-colors mb-6 ${isDark ? 'border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-300' : 'border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-600'}`}>
              ✏️ 新建笔记
            </button>
          )}

          {/* 笔记列表 */}
          {notes.length === 0 && !editingNote ? (
            <div className={`rounded-2xl border p-12 text-center ${c}`}>
              <div className="text-5xl mb-3">📝</div>
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>还没有笔记，在路线图中点击"写笔记"开始记录</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.filter(n => !editingNote || n.id !== editingNote.id).map(n => {
                const milestone = roadmap.milestones.find(m => m.id === n.milestoneId)
                return (
                  <div key={n.id} className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-200'}`}
                    onClick={() => { setEditingNote(n); setPreviewMode(true) }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{n.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {milestone && <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>{milestone.title}</span>}
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{n.updated_at || n.created_at || ''}</span>
                        </div>
                        {n.content && <p className={`text-xs mt-1.5 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{n.content.slice(0, 120)}</p>}
                      </div>
                      <span className={`text-xs shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>编辑 →</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
