import { useParams, Link } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { getAllQuestionsByCategory, type InterviewCategory } from '../data/interviewTypes'
import FormattedAnswer from '../../../components/ui/FormattedAnswer'

const CATEGORY_ICONS: Partial<Record<InterviewCategory, string>> = {
  'Redis': '🔴', 'MySQL': '🐬', 'Java': '☕', 'C++': '⚙️', 'Go': '🐹', 'Python': '🐍',
  '操作系统': '💻', '计算机网络': '🌐', '数据结构与算法': '🧮', 'Elasticsearch': '🔍',
  '分布式系统': '🌍', '系统设计': '🏗️', '场景题': '🎯', '开放问题': '💬',
  'AI/大模型': '🤖', '手撕算法': '✍️', '项目拷打': '🔥', '其他': '📌',
}

export default function InterviewCategoryPage() {
  const { category } = useParams<{ category?: string }>()
  const { isDark } = useTheme()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('oj-interview-favorites') || '[]')) } catch { return new Set() }
  })

  const saveFavorites = useCallback((fav: Set<string>) => {
    setFavorites(fav)
    localStorage.setItem('oj-interview-favorites', JSON.stringify([...fav]))
  }, [])

  const toggleFavorite = (id: string) => {
    const n = new Set(favorites); n.has(id) ? n.delete(id) : n.add(id); saveFavorites(n)
  }

  const diffColor = (d: string) => d === '基础' ? (isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700') : d === '进阶' ? (isDark ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700') : (isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700')
  const c = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'

  // 具体分类页
  if (category) {
    const decoded = decodeURIComponent(category)
    const catMap = getAllQuestionsByCategory()
    const questions = catMap[decoded as InterviewCategory] || []

    const q = questions[currentIdx]

    return (
      <div className="py-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{CATEGORY_ICONS[decoded as InterviewCategory] || '📌'}</span>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{decoded}</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{questions.length} 道题</p>
            </div>
          </div>
          <Link to="/interview/category" className={`text-sm px-3 py-1.5 rounded-lg no-underline ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>← 全部分类</Link>
        </div>

        {questions.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center ${c}`}><p className={isDark ? 'text-slate-400' : 'text-slate-500'}>暂无题目</p></div>
        ) : (
          <>
            {/* 进度 + 题号 */}
            <div className="mb-4">
              <div className={`flex justify-between text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>第 {currentIdx + 1} / {questions.length} 题</span>
                <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
              </div>
            </div>

            {/* 卡片 */}
            {q && (
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${c}`}>
                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-2.5 py-0.5 rounded-full font-medium ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                    {q.frequency === 'high' && <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-50 text-red-600'}`}>🔥 高频</span>}
                  </div>
                  <button onClick={() => toggleFavorite(q.id)} className={`text-xl cursor-pointer bg-transparent border-0 transition-transform hover:scale-125 ${favorites.has(q.id) ? 'scale-110' : 'opacity-40'}`}>
                    {favorites.has(q.id) ? '⭐' : '☆'}
                  </button>
                </div>
                <div className="px-6 py-5">
                  <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{q.title}</h2>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{q.content}</p>
                </div>
                <div className="px-6 pb-6">
                  {!showAnswer ? (
                    <button onClick={() => setShowAnswer(true)} className={`w-full py-3 rounded-xl text-sm font-medium cursor-pointer transition-all ${isDark ? 'bg-green-900/20 text-green-300 border border-green-800 hover:bg-green-900/40' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'}`}>
                      👁️ 查看参考答案
                    </button>
                  ) : q.referenceAnswer ? (
                    <div className={`rounded-xl border p-5 ${isDark ? 'border-slate-600 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
                      <div className={`text-xs font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}><span className="w-1 h-4 rounded-full bg-green-500" /> 参考答案</div>
                      <FormattedAnswer text={q.referenceAnswer} />
                      {q.source && <div className={`mt-4 pt-3 border-t text-xs ${isDark ? 'border-slate-600 text-slate-500' : 'border-slate-200 text-slate-400'}`}>📌 来源：{q.source}</div>}
                    </div>
                  ) : <div className={`text-center py-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>暂无参考答案</div>}
                </div>
                <div className={`px-6 py-4 border-t flex justify-between ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <button onClick={() => { if (currentIdx > 0) { setCurrentIdx(currentIdx - 1); setShowAnswer(false) } }} disabled={currentIdx === 0} className={`px-5 py-2 rounded-xl text-sm cursor-pointer disabled:opacity-30 ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>← 上一题</button>
                  <button onClick={() => { if (currentIdx < questions.length - 1) { setCurrentIdx(currentIdx + 1); setShowAnswer(false) } }} disabled={currentIdx >= questions.length - 1} className="px-5 py-2 rounded-xl text-sm cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-30">下一题 →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // 分类概览
  const catMap = getAllQuestionsByCategory()
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>🏷️ 分类刷题</h1>
        {favorites.size > 0 && (
          <Link to="/interview/category/⭐ 收藏" className={`text-sm px-4 py-2 rounded-lg no-underline ${isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-600'}`}>⭐ 我的收藏 ({favorites.size})</Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(catMap).sort((a, b) => b[1].length - a[1].length).map(([cat, qs]) => (
          <Link key={cat} to={`/interview/category/${encodeURIComponent(cat)}`}
            className={`group rounded-xl p-5 border transition-all no-underline hover:shadow-md hover:-translate-y-0.5 ${c}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{CATEGORY_ICONS[cat as InterviewCategory] || '📌'}</span>
              <div>
                <h3 className={`font-bold group-hover:text-blue-500 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{cat}</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{qs.length} 道题</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {qs.slice(0, 3).map(q => (
                <span key={q.id} className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{q.title.slice(0, 15)}{q.title.length > 15 ? '…' : ''}</span>
              ))}
              {qs.length > 3 && <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>+{qs.length - 3}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
