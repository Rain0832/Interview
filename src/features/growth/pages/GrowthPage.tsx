import { useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'

// ==================== 路线图数据类型 ====================

interface RoadmapMilestone {
  id: string
  title: string
  description: string
  status: 'done' | 'in-progress' | 'todo'
  progress: number  // 0-100
  category: string
  subTasks?: { title: string; done: boolean }[]
}

interface RoadmapData {
  title: string
  description: string
  milestones: RoadmapMilestone[]
}

// ==================== 默认路线图（AI 技术栈转型）====================

const DEFAULT_ROADMAP: RoadmapData = {
  title: '🚀 AI 技术栈快速转型路线图',
  description: 'C++ 底层 → AI 应用开发工程师。以 RainCppAI 项目为锚点，快速补齐 AI 知识短板。',
  milestones: [
    {
      id: 'cpp-base',
      title: 'C++ 系统编程',
      description: '自研 HTTP 框架（muduo Reactor + 状态机 + SSL/TLS）',
      status: 'done',
      progress: 100,
      category: '✅ 已具备能力',
      subTasks: [
        { title: 'muduo Reactor 模型 + EventLoop', done: true },
        { title: 'HTTP 状态机解析（粘包/拆包）', done: true },
        { title: 'OpenSSL BIO 自定义回调桥接', done: true },
        { title: '数据库连接池 + RabbitMQ 异步入库', done: true },
        { title: '策略 + 工厂 + 自注册设计模式', done: true },
      ],
    },
    {
      id: 'ai-agent-proto',
      title: 'AI Agent 原型',
      description: 'MCP 两段式推理 + 工具调用 + 多模型策略切换',
      status: 'done',
      progress: 100,
      category: '✅ 已具备能力',
      subTasks: [
        { title: 'AIStrategy 策略模式 4 种模型', done: true },
        { title: 'MCP 两段式推理（意图识别→工具→综合）', done: true },
        { title: 'AIToolRegistry 工具注册中心', done: true },
        { title: '阿里百炼 RAG 知识库接入', done: true },
        { title: 'ONNX Runtime 端侧推理', done: true },
      ],
    },
    {
      id: 'agent-upgrade',
      title: '🥇 Agent 升级为标准框架',
      description: 'ReAct 多步推理 + Function Calling + 记忆管理',
      status: 'in-progress',
      progress: 30,
      category: '🔴 优先级1（1周）',
      subTasks: [
        { title: '两段式推理 → ReAct 循环（多步工具调用）', done: false },
        { title: '实现标准 Function Calling 接口', done: false },
        { title: '增加记忆管理（滑动窗口 + 上下文压缩）', done: true },
        { title: '增加 2-3 个实用工具（代码执行/搜索）', done: false },
        { title: 'SSE 流式输出（首 token 200ms）', done: false },
      ],
    },
    {
      id: 'rag-self-build',
      title: '🥈 RAG 自建全链路',
      description: '脱离阿里百炼，ONNX Embedding → FAISS → 上下文注入',
      status: 'todo',
      progress: 0,
      category: '🔴 优先级2（2周）',
      subTasks: [
        { title: 'ONNX Runtime 加载 BGE-small-zh Embedding', done: false },
        { title: 'FAISS C++ API 构建向量索引', done: false },
        { title: '实现文档递归分块策略', done: false },
        { title: '混合检索（BM25 + Dense）', done: false },
        { title: 'Reranking（Cross-Encoder 重排序）', done: false },
        { title: '全链路联调 + 性能量化', done: false },
      ],
    },
    {
      id: 'python-langchain',
      title: '🥉 Python + LangChain',
      description: 'Python 语法速通 + LangChain Agent/RAG demo',
      status: 'todo',
      progress: 0,
      category: '🔴 优先级4（1周）',
      subTasks: [
        { title: 'Python 语法速通（与 C++ 对照）', done: false },
        { title: 'LangChain Agent（ReAct + 工具）', done: false },
        { title: 'LangChain RAG（FAISS + 检索 + LLM）', done: false },
        { title: 'C++ 实现 vs LangChain 对比文档', done: false },
      ],
    },
    {
      id: 'llm-fundamentals',
      title: 'LLM 原理八股',
      description: 'Transformer / Attention / 训练推理 / Prompt Engineering',
      status: 'in-progress',
      progress: 40,
      category: '🔴 优先级5（持续）',
      subTasks: [
        { title: 'Transformer 架构（Self-Attention/FFN/残差/LayerNorm）', done: true },
        { title: 'GPT vs BERT（自回归 vs 双向编码）', done: true },
        { title: 'Tokenizer 原理（BPE/SentencePiece）', done: false },
        { title: '训练三阶段（预训练→SFT→RLHF）', done: false },
        { title: '推理优化（KV Cache/量化/FlashAttention）', done: false },
        { title: 'Prompt Engineering（CoT/Few-shot）', done: true },
        { title: 'Context Engineering vs Prompt Engineering', done: false },
        { title: 'MoE / Speculative Decoding / vLLM', done: false },
      ],
    },
  ],
}

// ==================== 笔记类型 ====================

interface Note {
  id: string
  title: string
  content: string
  milestoneId?: string
  createdAt: number
}

// ==================== 页面组件 ====================

export default function GrowthPage() {
  const { isDark } = useTheme()
  const [roadmap, setRoadmap] = useState<RoadmapData>(() => {
    try {
      const saved = localStorage.getItem('oj-growth-roadmap')
      return saved ? JSON.parse(saved) : DEFAULT_ROADMAP
    } catch { return DEFAULT_ROADMAP }
  })
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem('oj-growth-notes') || '[]') } catch { return [] }
  })
  const [activeTab, setActiveTab] = useState<'roadmap' | 'notes'>('roadmap')
  const [editingNote, setEditingNote] = useState<{ title: string; content: string; milestoneId: string }>({ title: '', content: '', milestoneId: '' })

  const save = (rm: RoadmapData, nt: Note[]) => {
    localStorage.setItem('oj-growth-roadmap', JSON.stringify(rm))
    localStorage.setItem('oj-growth-notes', JSON.stringify(nt))
  }

  const toggleSubTask = (mId: string, tIdx: number) => {
    const updated = { ...roadmap, milestones: roadmap.milestones.map(m => {
      if (m.id !== mId || !m.subTasks) return m
      const tasks = [...m.subTasks]
      tasks[tIdx] = { ...tasks[tIdx], done: !tasks[tIdx].done }
      const doneCount = tasks.filter(t => t.done).length
      const progress = Math.round((doneCount / tasks.length) * 100)
      const status = progress === 100 ? 'done' as const : progress > 0 ? 'in-progress' as const : 'todo' as const
      return { ...m, subTasks: tasks, progress, status }
    })}
    setRoadmap(updated)
    save(updated, notes)
  }

  const addNote = () => {
    if (!editingNote.title.trim()) return
    const n: Note = { id: `note-${Date.now()}`, ...editingNote, createdAt: Date.now() }
    const updated = [n, ...notes]
    setNotes(updated)
    save(roadmap, updated)
    setEditingNote({ title: '', content: '', milestoneId: '' })
  }

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    save(roadmap, updated)
  }

  const totalTasks = roadmap.milestones.reduce((s, m) => s + (m.subTasks?.length || 0), 0)
  const doneTasks = roadmap.milestones.reduce((s, m) => s + (m.subTasks?.filter(t => t.done).length || 0), 0)
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const cardCls = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400'}`

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>🌱 个人成长</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{roadmap.description}</p>
        </div>
      </div>

      {/* 总进度 */}
      <div className={`rounded-2xl p-6 border mb-8 ${cardCls}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{roadmap.title}</span>
          <span className={`text-sm font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{overallProgress}%</span>
        </div>
        <div className={`w-full h-4 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
        </div>
        <div className={`flex justify-between mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <span>{doneTasks} / {totalTasks} 子任务已完成</span>
          <span>{roadmap.milestones.filter(m => m.status === 'done').length} / {roadmap.milestones.length} 里程碑</span>
        </div>
      </div>

      {/* Tab */}
      <div className={`flex gap-1 rounded-xl p-1 mb-6 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
        {(['roadmap', 'notes'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === tab ? (isDark ? 'bg-slate-600 text-white shadow' : 'bg-white text-slate-800 shadow') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>
            {tab === 'roadmap' ? '🗺️ 路线图' : `📝 学习笔记 (${notes.length})`}
          </button>
        ))}
      </div>

      {/* 路线图 Tab */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          {roadmap.milestones.map((m, mIdx) => {
            const statusIcon = m.status === 'done' ? '✅' : m.status === 'in-progress' ? '🔄' : '⬜'
            const barColor = m.status === 'done' ? 'from-green-500 to-emerald-500' : m.status === 'in-progress' ? 'from-blue-500 to-indigo-500' : 'from-slate-400 to-slate-500'
            return (
              <div key={m.id} className={`rounded-2xl border overflow-hidden ${cardCls}`}>
                {/* 头部 */}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {/* 节点指示器 */}
                    <div className="flex flex-col items-center shrink-0 mt-1">
                      <span className="text-xl">{statusIcon}</span>
                      {mIdx < roadmap.milestones.length - 1 && <div className={`w-0.5 h-8 mt-1 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{m.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{m.category}</span>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.description}</p>
                      {/* 进度条 */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                          <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-300`} style={{ width: `${m.progress}%` }} />
                        </div>
                        <span className={`text-xs font-bold shrink-0 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{m.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 子任务 */}
                {m.subTasks && m.subTasks.length > 0 && (
                  <div className={`border-t px-5 py-3 space-y-1.5 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
                    {m.subTasks.map((t, tIdx) => (
                      <label key={tIdx} className={`flex items-center gap-2.5 cursor-pointer py-1 px-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                        <input type="checkbox" checked={t.done} onChange={() => toggleSubTask(m.id, tIdx)}
                          className="w-4 h-4 rounded border-2 accent-blue-500 cursor-pointer" />
                        <span className={`text-sm ${t.done ? (isDark ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : (isDark ? 'text-slate-200' : 'text-slate-700')}`}>
                          {t.title}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 笔记 Tab */}
      {activeTab === 'notes' && (
        <div>
          {/* 新建笔记 */}
          <div className={`rounded-2xl border p-5 mb-6 ${cardCls}`}>
            <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>✏️ 新建笔记</h3>
            <div className="space-y-3">
              <input type="text" value={editingNote.title} onChange={e => setEditingNote(p => ({ ...p, title: e.target.value }))} placeholder="笔记标题" className={inputCls} />
              <select value={editingNote.milestoneId} onChange={e => setEditingNote(p => ({ ...p, milestoneId: e.target.value }))}
                className={inputCls}>
                <option value="">关联里程碑（可选）</option>
                {roadmap.milestones.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
              <textarea value={editingNote.content} onChange={e => setEditingNote(p => ({ ...p, content: e.target.value }))} placeholder="笔记内容（支持 Markdown 风格记录）..." rows={4} className={`${inputCls} resize-y`} />
              <button onClick={addNote} disabled={!editingNote.title.trim()} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all cursor-pointer disabled:opacity-50">保存笔记</button>
            </div>
          </div>
          {/* 笔记列表 */}
          {notes.length === 0 ? (
            <div className={`rounded-2xl border p-12 text-center ${cardCls}`}>
              <div className="text-5xl mb-3">📝</div>
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>还没有笔记，开始记录你的学习吧</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map(n => {
                const milestone = roadmap.milestones.find(m => m.id === n.milestoneId)
                return (
                  <div key={n.id} className={`rounded-xl border p-5 ${cardCls}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{n.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {milestone && <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>{milestone.title}</span>}
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{new Date(n.createdAt).toLocaleString('zh-CN')}</span>
                        </div>
                        {n.content && <p className={`text-sm mt-2 whitespace-pre-wrap leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{n.content}</p>}
                      </div>
                      <button onClick={() => { if (confirm('删除这条笔记？')) deleteNote(n.id) }}
                        className={`shrink-0 text-xs px-2 py-1 rounded border cursor-pointer ${isDark ? 'border-red-800 text-red-400 hover:bg-red-900/30' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>删除</button>
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
