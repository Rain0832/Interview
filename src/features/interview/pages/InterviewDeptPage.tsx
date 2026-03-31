import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { getDepartment, getInterviewCompany } from '../data/interviewTypes'
import FormattedAnswer from '../../../components/ui/FormattedAnswer'
import NoteSidebar from '../../../components/ui/NoteSidebar'

export default function InterviewDeptPage() {
  const { companyId, deptId } = useParams<{ companyId: string; deptId: string }>()
  const { isDark } = useTheme()
  const company = getInterviewCompany(companyId!)
  const dept = getDepartment(companyId!, deptId!)

  const [filterCat, setFilterCat] = useState<string>('all')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [showNote, setShowNote] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('oj-interview-favorites') || '[]')) } catch { return new Set() }
  })

  const saveFavorites = useCallback((fav: Set<string>) => {
    setFavorites(fav)
    localStorage.setItem('oj-interview-favorites', JSON.stringify([...fav]))
  }, [])

  const toggleFavorite = (id: string) => {
    const n = new Set(favorites)
    n.has(id) ? n.delete(id) : n.add(id)
    saveFavorites(n)
  }

  if (!company || !dept) {
    return <div className="py-16 text-center"><div className="text-6xl mb-4">😕</div><h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>未找到该部门</h2><Link to="/interview" className="text-blue-500">返回面试板块</Link></div>
  }

  const allQuestions = dept.sessions.flatMap(s => s.questions)
  const categories = [...new Set(allQuestions.map(q => q.category))]
  const filtered = filterCat === 'all' ? allQuestions : filterCat === '⭐ 收藏' ? allQuestions.filter(q => favorites.has(q.id)) : allQuestions.filter(q => q.category === filterCat)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => { setCurrentIdx(0); setShowAnswer(false) }, [filterCat])

  const q = filtered[currentIdx]
  const c = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
  const diffColor = (d: string) => d === '基础' ? (isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700') : d === '进阶' ? (isDark ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700') : (isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700')
  const freqBadge = (f?: string) => f === 'high' ? { cls: isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-50 text-red-600', text: '🔥 高频' } : f === 'medium' ? { cls: isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-600', text: '📊 中频' } : { cls: isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500', text: '💤 低频' }

  return (
    <div className="py-8">
      {/* Header */}
      <div className={`rounded-2xl p-6 border mb-6 ${c}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: company.color + '20' }}>{company.logo}</div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{company.name} · {dept.department}</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{dept.sessions.length} 轮面试 · {allQuestions.length} 道题 · {favorites.size} 收藏</p>
            </div>
          </div>
          {/* 视图切换 */}
          <div className="flex gap-1">
            <button onClick={() => setViewMode('card')} className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${viewMode === 'card' ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>🃏 卡片</button>
            <button onClick={() => setViewMode('list')} className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>📋 列表</button>
          </div>
        </div>
        {dept.interviewStyle && <div className={`text-sm p-3 rounded-lg ${isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>💡 <strong>面试特点：</strong>{dept.interviewStyle}</div>}
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${filterCat === 'all' ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>全部 ({allQuestions.length})</button>
        {favorites.size > 0 && <button onClick={() => setFilterCat('⭐ 收藏')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${filterCat === '⭐ 收藏' ? 'bg-amber-500 text-white' : isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-600'}`}>⭐ 收藏 ({allQuestions.filter(q => favorites.has(q.id)).length})</button>}
        {categories.map(cat => {
          const cnt = allQuestions.filter(q => q.category === cat).length
          return <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${filterCat === cat ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{cat} ({cnt})</button>
        })}
      </div>

      {filtered.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center ${c}`}>
          <div className="text-5xl mb-3">{filterCat === '⭐ 收藏' ? '⭐' : '📭'}</div>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{filterCat === '⭐ 收藏' ? '还没有收藏题目，点击题目卡片上的 ⭐ 按钮收藏' : '该分类下暂无题目'}</p>
        </div>
      ) : viewMode === 'card' ? (
        /* ==================== 卡片模式 ==================== */
        <div>
          {/* 进度条 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>第 {currentIdx + 1} / {filtered.length} 题</span>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{Math.round(((currentIdx + 1) / filtered.length) * 100)}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" style={{ width: `${((currentIdx + 1) / filtered.length) * 100}%` }} />
            </div>
          </div>

          {/* 题号导航 */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {filtered.map((fq, idx) => (
              <button key={fq.id} onClick={() => { setCurrentIdx(idx); setShowAnswer(false) }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                  idx === currentIdx ? 'bg-blue-600 text-white shadow-md scale-110'
                  : favorites.has(fq.id) ? (isDark ? 'bg-amber-900/40 text-amber-300 border border-amber-700' : 'bg-amber-50 text-amber-600 border border-amber-200')
                  : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}>
                {idx + 1}
              </button>
            ))}
          </div>

          {/* 题目卡片 + 笔记侧边栏 */}
          {q && (
            <div className="flex gap-4">
            <div className={`flex-1 min-w-0 rounded-2xl border shadow-sm overflow-hidden ${c}`}>
              {/* 卡片头部 */}
              <div className={`px-6 py-4 border-b flex items-center justify-between flex-wrap gap-2 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm px-2.5 py-0.5 rounded-full font-medium ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{q.category}</span>
                  {q.frequency && <span className={`text-xs px-2 py-0.5 rounded-full ${freqBadge(q.frequency).cls}`}>{freqBadge(q.frequency).text}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowNote(!showNote)}
                    className={`text-sm cursor-pointer bg-transparent border-0 transition-all hover:scale-110 ${showNote ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                    title="写笔记">📝</button>
                  <button onClick={() => toggleFavorite(q.id)}
                    className={`text-xl cursor-pointer transition-transform hover:scale-125 bg-transparent border-0 ${favorites.has(q.id) ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
                    title={favorites.has(q.id) ? '取消收藏' : '收藏'}>
                    {favorites.has(q.id) ? '⭐' : '☆'}
                  </button>
                </div>
              </div>

              {/* 题目内容 */}
              <div className="px-6 py-5">
                <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{q.title}</h2>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{q.content}</p>
              </div>

              {/* 参考答案 */}
              <div className={`px-6 pb-6`}>
                {!showAnswer ? (
                  <button onClick={() => setShowAnswer(true)}
                    className={`w-full py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${isDark ? 'bg-green-900/20 text-green-300 border border-green-800 hover:bg-green-900/40' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'}`}>
                    👁️ 查看参考答案
                  </button>
                ) : q.referenceAnswer ? (
                  <div className={`rounded-xl border p-5 ${isDark ? 'border-slate-600 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
                    <div className={`text-xs font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                      <span className="w-1 h-4 rounded-full bg-green-500" /> 参考答案
                    </div>
                    <FormattedAnswer text={q.referenceAnswer} />
                    {q.source && <div className={`mt-4 pt-3 border-t text-xs ${isDark ? 'border-slate-600 text-slate-500' : 'border-slate-200 text-slate-400'}`}>📌 来源：{q.source}</div>}
                  </div>
                ) : (
                  <div className={`text-center py-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>暂无参考答案</div>
                )}
              </div>

              {/* 底部导航 */}
              <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <button onClick={() => { if (currentIdx > 0) { setCurrentIdx(currentIdx - 1); setShowAnswer(false) } }}
                  disabled={currentIdx === 0}
                  className={`px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  ← 上一题
                </button>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{currentIdx + 1} / {filtered.length}</span>
                <button onClick={() => { if (currentIdx < filtered.length - 1) { setCurrentIdx(currentIdx + 1); setShowAnswer(false) } }}
                  disabled={currentIdx >= filtered.length - 1}
                  className="px-5 py-2 rounded-xl text-sm font-medium cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  下一题 →
                </button>
              </div>
            </div>
            <NoteSidebar
              visible={showNote}
              onClose={() => setShowNote(false)}
              defaultTitle={q ? `面试笔记: ${q.title}` : ''}
              defaultFolder={`${company.name} · ${dept.department}`}
              source="interview"
            />
            </div>
          )}
        </div>
      ) : (
        /* ==================== 列表模式 ==================== */
        <div className="space-y-3">
          {filtered.map((fq, idx) => (
            <div key={fq.id} className={`rounded-xl border overflow-hidden transition-all hover:shadow-md ${c}`}>
              <div className="flex items-center gap-3 p-4">
                <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{idx + 1}</span>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${diffColor(fq.difficulty)}`}>{fq.difficulty}</span>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{fq.category}</span>
                {fq.frequency === 'high' && <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-50 text-red-600'}`}>🔥</span>}
                <button onClick={() => { setViewMode('card'); setCurrentIdx(idx); setShowAnswer(false) }}
                  className={`flex-1 text-left text-sm font-medium cursor-pointer bg-transparent border-0 hover:text-blue-500 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {fq.title}
                </button>
                <button onClick={() => toggleFavorite(fq.id)}
                  className="shrink-0 text-lg cursor-pointer bg-transparent border-0">
                  {favorites.has(fq.id) ? '⭐' : '☆'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
