import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { getAllQuestionsByCategory, type InterviewCategory, type InterviewQuestion } from '../data/interviewTypes'

const CATEGORY_ICONS: Partial<Record<InterviewCategory, string>> = {
  'Redis': '🔴', 'MySQL': '🐬', 'Java': '☕', 'C++': '⚙️', 'Go': '🐹', 'Python': '🐍',
  '操作系统': '💻', '计算机网络': '🌐', '数据结构与算法': '🧮', 'Elasticsearch': '🔍',
  '分布式系统': '🌍', '系统设计': '🏗️', '场景题': '🎯', '开放问题': '💬',
  'AI/大模型': '🤖', '手撕算法': '✍️', '项目拷打': '🔥', '其他': '📌',
}

export default function InterviewCategoryPage() {
  const { category } = useParams<{ category?: string }>()
  const { isDark } = useTheme()
  const [expandedQ, setExpandedQ] = useState<Set<string>>(new Set())

  const toggleQ = (id: string) => setExpandedQ(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n
  })

  const diffColor = (d: string) => d === '基础' ? (isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700') : d === '进阶' ? (isDark ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700') : (isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700')

  // 如果有具体分类参数，显示该分类下所有题
  if (category) {
    const decoded = decodeURIComponent(category)
    const catMap = getAllQuestionsByCategory()
    const questions = catMap[decoded as InterviewCategory] || []

    return (
      <div className="py-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{CATEGORY_ICONS[decoded as InterviewCategory] || '📌'}</span>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{decoded}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{questions.length} 道题</p>
          </div>
        </div>
        <div className="space-y-2">
          {questions.map((q: InterviewQuestion) => {
            const expanded = expandedQ.has(q.id)
            return (
              <div key={q.id} className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <button onClick={() => toggleQ(q.id)} className={`w-full flex items-center gap-3 p-4 text-left cursor-pointer bg-transparent border-0 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  <span className={`shrink-0 text-sm px-2 py-0.5 rounded ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                  <span className="flex-1 font-medium text-sm">{q.title}</span>
                  <span className={`shrink-0 transition-transform text-sm ${expanded ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {expanded && (
                  <div className={`px-4 pb-4 space-y-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div className={`pt-3 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{q.content}</div>
                    {q.referenceAnswer && (
                      <details className={`rounded-lg border p-3 ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                        <summary className={`cursor-pointer text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>📖 查看参考答案</summary>
                        <div className={`mt-2 text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{q.referenceAnswer}</div>
                      </details>
                    )}
                    {q.source && <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>来源：{q.source}</div>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 无参数：显示所有分类的概览
  const catMap = getAllQuestionsByCategory()
  return (
    <div className="py-8">
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>🏷️ 分类刷题</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(catMap).sort((a, b) => b[1].length - a[1].length).map(([cat, qs]) => (
          <Link key={cat} to={`/interview/category/${encodeURIComponent(cat)}`}
            className={`group rounded-xl p-5 border transition-all no-underline hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{CATEGORY_ICONS[cat as InterviewCategory] || '📌'}</span>
              <div>
                <h3 className={`font-bold group-hover:text-blue-500 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{cat}</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{qs.length} 道题</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {qs.slice(0, 3).map(q => (
                <span key={q.id} className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{q.title.slice(0, 15)}</span>
              ))}
              {qs.length > 3 && <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>+{qs.length - 3} 更多</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
