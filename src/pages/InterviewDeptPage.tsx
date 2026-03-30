import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { getDepartment, getInterviewCompany, type InterviewQuestion } from '../data/interviewTypes'

export default function InterviewDeptPage() {
  const { companyId, deptId } = useParams<{ companyId: string; deptId: string }>()
  const { isDark } = useTheme()
  const company = getInterviewCompany(companyId!)
  const dept = getDepartment(companyId!, deptId!)

  const [expandedQ, setExpandedQ] = useState<Set<string>>(new Set())
  const [filterCat, setFilterCat] = useState<string>('all')

  if (!company || !dept) {
    return <div className="py-16 text-center"><div className="text-6xl mb-4">😕</div><h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>未找到该部门</h2><Link to="/interview" className="text-blue-500">返回面试板块</Link></div>
  }

  const allQuestions = dept.sessions.flatMap(s => s.questions)
  const categories = [...new Set(allQuestions.map(q => q.category))]

  const toggleQ = (id: string) => setExpandedQ(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n
  })

  const diffColor = (d: string) => d === '基础' ? (isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700') : d === '进阶' ? (isDark ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700') : (isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700')
  const freqColor = (f?: string) => f === 'high' ? (isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-50 text-red-600') : f === 'medium' ? (isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-600') : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500')

  return (
    <div className="py-8">
      {/* Header */}
      <div className={`rounded-2xl p-6 border mb-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: company.color + '20' }}>{company.logo}</div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{company.name} · {dept.department}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{dept.sessions.length} 轮面试 · {allQuestions.length} 道题</p>
          </div>
        </div>
        {dept.description && <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{dept.description}</p>}
        {dept.interviewStyle && <div className={`text-sm p-3 rounded-lg ${isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>💡 <strong>面试特点：</strong>{dept.interviewStyle}</div>}
        {dept.tips && dept.tips.length > 0 && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${isDark ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
            <strong>⚡ 提示：</strong>
            <ul className="mt-1 space-y-0.5 list-disc list-inside">{dept.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
        )}
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${filterCat === 'all' ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>全部 ({allQuestions.length})</button>
        {categories.map(c => {
          const cnt = allQuestions.filter(q => q.category === c).length
          return <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${filterCat === c ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{c} ({cnt})</button>
        })}
      </div>

      {/* 按面试轮次分组显示 */}
      {dept.sessions.map(session => {
        const qs = filterCat === 'all' ? session.questions : session.questions.filter(q => q.category === filterCat)
        if (qs.length === 0) return null
        return (
          <div key={session.id} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{session.round}</h2>
              {session.duration && <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{session.duration}</span>}
              {session.style && <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{session.style}</span>}
            </div>
            <div className="space-y-2">
              {qs.map((q: InterviewQuestion) => {
                const expanded = expandedQ.has(q.id)
                return (
                  <div key={q.id} className={`rounded-xl border overflow-hidden transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <button onClick={() => toggleQ(q.id)} className={`w-full flex items-center gap-3 p-4 text-left cursor-pointer bg-transparent border-0 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                      <span className={`shrink-0 text-sm px-2 py-0.5 rounded ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{q.category}</span>
                      {q.frequency && <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded ${freqColor(q.frequency)}`}>{q.frequency === 'high' ? '高频' : q.frequency === 'medium' ? '中频' : '低频'}</span>}
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
      })}
    </div>
  )
}
