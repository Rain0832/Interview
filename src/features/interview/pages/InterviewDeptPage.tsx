import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { useAuth } from '../../../contexts/AuthContext'
import { getDepartment, getInterviewCompany } from '../data/interviewTypes'
import FormattedAnswer from '../../../components/ui/FormattedAnswer'
import { api } from '../../../services/api'

type Status = 'unseen' | 'learning' | 'confused' | 'mastered'
const STATUS_MAP: Record<Status, { label: string; icon: string; cls: string; clsDark: string }> = {
  unseen:   { label: '未学习', icon: '⬜', cls: 'bg-slate-100 text-slate-500', clsDark: 'bg-slate-700 text-slate-400' },
  learning: { label: '学习中', icon: '📖', cls: 'bg-blue-50 text-blue-600', clsDark: 'bg-blue-900/40 text-blue-300' },
  confused: { label: '需复习', icon: '❓', cls: 'bg-amber-50 text-amber-600', clsDark: 'bg-amber-900/40 text-amber-300' },
  mastered: { label: '已掌握', icon: '✅', cls: 'bg-green-50 text-green-600', clsDark: 'bg-green-900/40 text-green-300' },
}

export default function InterviewDeptPage() {
  const { companyId, deptId } = useParams<{ companyId: string; deptId: string }>()
  const { isDark } = useTheme()
  const { isLoggedIn } = useAuth()
  const company = getInterviewCompany(companyId!)
  const dept = getDepartment(companyId!, deptId!)

  const [filterCat, setFilterCat] = useState<string>('all')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState<'answer' | 'compare' | 'review'>('answer') // 答题三阶段
  const [myAnswer, setMyAnswer] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [favorites, setFavorites] = useState<Set<string>>(() => { try { return new Set(JSON.parse(localStorage.getItem('oj-interview-favorites') || '[]')) } catch { return new Set() } })
  const [progressMap, setProgressMap] = useState<Record<string, { status: Status; my_answer: string }>>({})

  // 加载进度
  useEffect(() => {
    const load = async () => {
      if (isLoggedIn) {
        try {
          const res = await api.getAllProgress()
          const map: Record<string, any> = {}
          res.progress.forEach((p: any) => { map[p.question_id] = p })
          setProgressMap(map)
        } catch { /* ignore */ }
      } else {
        try { setProgressMap(JSON.parse(localStorage.getItem('oj-interview-progress') || '{}')) } catch { /* ignore */ }
      }
    }
    load()
  }, [isLoggedIn])

  const saveFavorites = useCallback((fav: Set<string>) => { setFavorites(fav); localStorage.setItem('oj-interview-favorites', JSON.stringify([...fav])) }, [])
  const toggleFavorite = (id: string) => { const n = new Set(favorites); n.has(id) ? n.delete(id) : n.add(id); saveFavorites(n) }

  const saveQuestionProgress = useCallback(async (qId: string, status: Status, answer?: string) => {
    const updated = { ...progressMap, [qId]: { status, my_answer: answer ?? progressMap[qId]?.my_answer ?? '' } }
    setProgressMap(updated)
    if (isLoggedIn) { try { await api.saveProgress(qId, { status, myAnswer: answer }) } catch { /* ignore */ } }
    localStorage.setItem('oj-interview-progress', JSON.stringify(updated))
  }, [progressMap, isLoggedIn])

  if (!company || !dept) {
    return <div className="py-16 text-center"><div className="text-6xl mb-4">😕</div><h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>未找到</h2><Link to="/interview" className="text-blue-500">返回</Link></div>
  }

  const allQuestions = dept.sessions.flatMap(s => s.questions)
  const categories = [...new Set(allQuestions.map(q => q.category))]
  const filtered = filterCat === 'all' ? allQuestions : filterCat === '⭐ 收藏' ? allQuestions.filter(q => favorites.has(q.id)) : filterCat.startsWith('status:') ? allQuestions.filter(q => (progressMap[q.id]?.status || 'unseen') === filterCat.slice(7)) : allQuestions.filter(q => q.category === filterCat)

  const q = filtered[currentIdx]
  const qProgress = q ? progressMap[q.id] : undefined
  const c = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
  const diffColor = (d: string) => d === '基础' ? (isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700') : d === '进阶' ? (isDark ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700') : (isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700')

  const goTo = (idx: number) => {
    setCurrentIdx(idx)
    setPhase('answer')
    const nextQ = filtered[idx]
    setMyAnswer(nextQ ? (progressMap[nextQ.id]?.my_answer || '') : '')
  }

  // 统计各状态数量
  const statusCounts: Record<Status, number> = { unseen: 0, learning: 0, confused: 0, mastered: 0 }
  allQuestions.forEach(aq => { const s = (progressMap[aq.id]?.status || 'unseen') as Status; statusCounts[s]++ })

  return (
    <div className="py-8">
      {/* Header */}
      <div className={`rounded-2xl p-5 border mb-5 ${c}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: company.color + '20' }}>{company.logo}</div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{company.name} · {dept.department}</h1>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{allQuestions.length} 题 · ✅{statusCounts.mastered} 📖{statusCounts.learning} ❓{statusCounts.confused} ⬜{statusCounts.unseen}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setViewMode('card')} className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer ${viewMode === 'card' ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>🃏 卡片</button>
            <button onClick={() => setViewMode('list')} className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer ${viewMode === 'list' ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>📋 列表</button>
          </div>
        </div>
        {/* 进度条 */}
        <div className="flex gap-1 mt-3 h-2 rounded-full overflow-hidden">
          {statusCounts.mastered > 0 && <div className="bg-green-500 transition-all" style={{ width: `${(statusCounts.mastered / allQuestions.length) * 100}%` }} />}
          {statusCounts.learning > 0 && <div className="bg-blue-500 transition-all" style={{ width: `${(statusCounts.learning / allQuestions.length) * 100}%` }} />}
          {statusCounts.confused > 0 && <div className="bg-amber-500 transition-all" style={{ width: `${(statusCounts.confused / allQuestions.length) * 100}%` }} />}
          {statusCounts.unseen > 0 && <div className={`${isDark ? 'bg-slate-600' : 'bg-slate-200'} transition-all`} style={{ width: `${(statusCounts.unseen / allQuestions.length) * 100}%` }} />}
        </div>
      </div>

      {/* 筛选：分类 + 状态 */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        <button onClick={() => { setFilterCat('all'); goTo(0) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${filterCat === 'all' ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>全部 ({allQuestions.length})</button>
        {favorites.size > 0 && <button onClick={() => { setFilterCat('⭐ 收藏'); goTo(0) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${filterCat === '⭐ 收藏' ? 'bg-amber-500 text-white' : isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-600'}`}>⭐ {allQuestions.filter(q => favorites.has(q.id)).length}</button>}
        {(Object.entries(STATUS_MAP) as [Status, typeof STATUS_MAP[Status]][]).filter(([s]) => statusCounts[s] > 0).map(([s, info]) => (
          <button key={s} onClick={() => { setFilterCat(`status:${s}`); goTo(0) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${filterCat === `status:${s}` ? 'bg-blue-600 text-white' : isDark ? info.clsDark : info.cls}`}>{info.icon} {info.label} ({statusCounts[s]})</button>
        ))}
        <span className={`px-1 ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>|</span>
        {categories.map(cat => (
          <button key={cat} onClick={() => { setFilterCat(cat); goTo(0) }} className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${filterCat === cat ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{cat}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center ${c}`}><p className={isDark ? 'text-slate-400' : 'text-slate-500'}>暂无题目</p></div>
      ) : viewMode === 'card' && q ? (
        <>
          {/* 题号导航 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {filtered.map((fq, idx) => {
              const s = (progressMap[fq.id]?.status || 'unseen') as Status
              const sInfo = STATUS_MAP[s]
              return (
                <button key={fq.id} onClick={() => goTo(idx)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all ${
                    idx === currentIdx ? 'bg-blue-600 text-white shadow-md scale-110 ring-2 ring-blue-300'
                    : s === 'mastered' ? (isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-600')
                    : s === 'confused' ? (isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-600')
                    : s === 'learning' ? (isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-600')
                    : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`} title={`${fq.title} (${sInfo.label})`}>
                  {idx + 1}
                </button>
              )
            })}
          </div>

          {/* 主卡片 */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${c}`}>
            {/* 头部 */}
            <div className={`px-6 py-3 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{q.category}</span>
                {q.frequency === 'high' && <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-50 text-red-600'}`}>🔥 高频</span>}
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{currentIdx + 1}/{filtered.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => toggleFavorite(q.id)} className={`text-lg cursor-pointer bg-transparent border-0 ${favorites.has(q.id) ? '' : 'opacity-40 hover:opacity-100'}`}>{favorites.has(q.id) ? '⭐' : '☆'}</button>
              </div>
            </div>

            {/* 题目 */}
            <div className="px-6 py-5">
              <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{q.title}</h2>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{q.content}</p>
            </div>

            {/* 答题三阶段 */}
            <div className="px-6 pb-5">
              {phase === 'answer' && (
                <div>
                  <div className={`text-xs font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}><span className="w-1 h-4 rounded-full bg-blue-500" /> 第一步：先写下你的答案</div>
                  <textarea value={myAnswer} onChange={e => setMyAnswer(e.target.value)}
                    placeholder="先自己思考，写下你的回答...\n\n- 核心概念是什么？\n- 底层原理是什么？\n- 有什么注意事项？"
                    rows={6} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-y leading-relaxed ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400'}`} />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { saveQuestionProgress(q.id, 'learning', myAnswer); setPhase('compare') }}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium cursor-pointer hover:shadow-lg transition-all">
                      👁️ 查看参考答案对照
                    </button>
                    {myAnswer.trim() === '' && <button onClick={() => setPhase('compare')} className={`px-4 py-2.5 rounded-xl text-sm cursor-pointer ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>跳过，直接看答案</button>}
                  </div>
                </div>
              )}

              {phase === 'compare' && (
                <div className="space-y-4">
                  {/* 我的答案 */}
                  {myAnswer.trim() && (
                    <div className={`rounded-xl border p-4 ${isDark ? 'border-blue-800 bg-blue-900/10' : 'border-blue-200 bg-blue-50/50'}`}>
                      <div className={`text-xs font-bold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>✍️ 我的答案</div>
                      <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{myAnswer}</div>
                    </div>
                  )}
                  {/* 参考答案 */}
                  {q.referenceAnswer && (
                    <div className={`rounded-xl border p-4 ${isDark ? 'border-green-800 bg-green-900/10' : 'border-green-200 bg-green-50/50'}`}>
                      <div className={`text-xs font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}><span className="w-1 h-4 rounded-full bg-green-500" /> 参考答案</div>
                      <FormattedAnswer text={q.referenceAnswer} />
                    </div>
                  )}
                  {q.source && <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>📌 来源：{q.source}</div>}
                  <button onClick={() => setPhase('review')} className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-medium cursor-pointer hover:shadow-lg transition-all">
                    ✅ 对照完成，标记状态
                  </button>
                </div>
              )}

              {phase === 'review' && (
                <div>
                  <div className={`text-xs font-bold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>这道题你掌握得怎么样？</div>
                  <div className="flex gap-2 flex-wrap">
                    {(Object.entries(STATUS_MAP) as [Status, typeof STATUS_MAP[Status]][]).filter(([s]) => s !== 'unseen').map(([s, info]) => (
                      <button key={s} onClick={() => {
                        saveQuestionProgress(q.id, s, myAnswer)
                        // 自动跳下一题
                        if (currentIdx < filtered.length - 1) {
                          setTimeout(() => goTo(currentIdx + 1), 500)
                        }
                      }}
                        className={`px-5 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all hover:shadow-md ${(qProgress?.status || 'unseen') === s ? 'ring-2 ring-blue-400 scale-105' : ''} ${isDark ? info.clsDark : info.cls}`}>
                        {info.icon} {info.label}
                      </button>
                    ))}
                  </div>
                  <p className={`text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>选择后自动跳到下一题</p>
                </div>
              )}
            </div>

            {/* 底部导航 */}
            <div className={`px-6 py-3 border-t flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <button onClick={() => goTo(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0} className={`px-4 py-2 rounded-xl text-sm cursor-pointer disabled:opacity-30 ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>← 上一题</button>
              <div className="flex items-center gap-2">
                {qProgress && <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? STATUS_MAP[qProgress.status as Status]?.clsDark : STATUS_MAP[qProgress.status as Status]?.cls}`}>{STATUS_MAP[qProgress.status as Status]?.icon} {STATUS_MAP[qProgress.status as Status]?.label}</span>}
              </div>
              <button onClick={() => goTo(Math.min(filtered.length - 1, currentIdx + 1))} disabled={currentIdx >= filtered.length - 1} className="px-4 py-2 rounded-xl text-sm cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-30">下一题 →</button>
            </div>
          </div>
        </>
      ) : (
        /* 列表模式 */
        <div className="space-y-2">
          {filtered.map((fq, idx) => {
            const s = (progressMap[fq.id]?.status || 'unseen') as Status
            return (
              <div key={fq.id} className={`rounded-xl border overflow-hidden transition-all hover:shadow-md ${c}`}>
                <div className="flex items-center gap-2.5 p-3.5">
                  <span className="text-sm">{STATUS_MAP[s].icon}</span>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${diffColor(fq.difficulty)}`}>{fq.difficulty}</span>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{fq.category}</span>
                  <button onClick={() => { setViewMode('card'); goTo(idx) }} className={`flex-1 text-left text-sm font-medium cursor-pointer bg-transparent border-0 hover:text-blue-500 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{fq.title}</button>
                  <button onClick={() => toggleFavorite(fq.id)} className="text-lg cursor-pointer bg-transparent border-0">{favorites.has(fq.id) ? '⭐' : '☆'}</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
