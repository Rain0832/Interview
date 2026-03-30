import { useParams, Link } from 'react-router-dom'
import { getSessionById, type CodingQuestion } from '../data/questions'
import { useTheme } from '../contexts/ThemeContext'

export default function SessionPage() {
  const { companyId, sessionId } = useParams<{ companyId: string; sessionId: string }>()
  const session = getSessionById(companyId!, sessionId!)
  const { isDark } = useTheme()

  if (!session) {
    return (
      <div className="py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>未找到该场次</h2>
        <Link to={`/exam/company/${companyId}`} className="text-blue-500 hover:text-blue-400">返回公司页面</Link>
      </div>
    )
  }

  const choiceQuestions = session.questions.filter((q) => q.type === 'choice')
  const codingQuestions = session.questions.filter((q) => q.type === 'coding') as CodingQuestion[]

  const difficultyColor = {
    Easy: isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700',
    Medium: isDark ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
    Hard: isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700',
  }

  return (
    <div className="py-8">
      {/* Session header */}
      <div className={`rounded-2xl p-8 shadow-sm border mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{session.name}</h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          {session.date && `${session.date} · `}{session.type} · 共 {session.questions.length} 题
        </p>
      </div>

      {/* 选择题模块 */}
      {choiceQuestions.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            <span className="text-xl">✅</span> 选择题
            <span className={`text-sm font-normal ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>({choiceQuestions.length} 题)</span>
          </h2>
          <Link
            to={`/exam/company/${companyId}/${sessionId}/choice`}
            className={`group block rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 no-underline ${isDark ? 'bg-slate-800 border-slate-700 hover:border-green-500' : 'bg-white border-slate-100 hover:border-green-200'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold group-hover:text-green-500 transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  开始答题
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  包含 {choiceQuestions.length} 道单选题，涵盖 AI/LLM、计算机基础等
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-medium shadow-sm group-hover:shadow-md transition-shadow">
                  进入答题 →
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* 编程题模块 */}
      {codingQuestions.length > 0 && (
        <div>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            <span className="text-xl">💻</span> 编程题
            <span className={`text-sm font-normal ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>({codingQuestions.length} 题)</span>
          </h2>
          <div className="space-y-3">
            {codingQuestions.map((q, idx) => (
              <Link
                key={q.id}
                to={`/exam/company/${companyId}/${sessionId}/coding/${q.id}`}
                className={`group flex items-center rounded-xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 no-underline ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-200'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mr-4 shrink-0 transition-colors ${isDark ? 'bg-slate-700 text-slate-300 group-hover:bg-blue-900/50 group-hover:text-blue-300' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-semibold group-hover:text-blue-500 transition-colors truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                    {q.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {q.difficulty && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColor[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                    )}
                    {q.tags?.map((tag) => (
                      <span key={tag} className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`group-hover:text-blue-500 group-hover:translate-x-1 transition-all ml-4 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
