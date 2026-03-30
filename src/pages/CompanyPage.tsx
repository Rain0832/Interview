import { useParams, Link } from 'react-router-dom'
import { getCompanyById } from '../data/questions'
import { useTheme } from '../contexts/ThemeContext'

export default function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>()
  const company = getCompanyById(companyId!)
  const { isDark } = useTheme()

  if (!company) {
    return (
      <div className="py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>未找到该公司</h2>
        <Link to="/" className="text-blue-500 hover:text-blue-400">返回首页</Link>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* 公司 header */}
      <div className={`rounded-2xl p-8 shadow-sm border mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-sm"
            style={{ backgroundColor: company.color + '20' }}
          >
            {company.logo}
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{company.name}</h1>
            <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {company.year} {company.season} · 共 {company.sessions.length} 场考试
            </p>
          </div>
        </div>
      </div>

      {/* 场次列表 */}
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>考试场次</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {company.sessions.map((session) => {
          const choiceQuestions = session.questions.filter((q) => q.type === 'choice')
          const codingQuestions = session.questions.filter((q) => q.type === 'coding')
          return (
            <Link
              key={session.id}
              to={`/exam/company/${companyId}/${session.id}`}
              className={`group block rounded-2xl p-6 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 no-underline ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-200'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-xl font-bold group-hover:text-blue-500 transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                    {session.name}
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {session.date && `${session.date} · `}{session.type}
                  </p>
                </div>
                <div className="text-3xl">
                  {session.type === '笔试' ? '📝' : '🎤'}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium ${isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                  ✅ {choiceQuestions.length} 道选择题
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium ${isDark ? 'bg-violet-900/40 text-violet-300' : 'bg-violet-50 text-violet-700'}`}>
                  💻 {codingQuestions.length} 道编程题
                </span>
              </div>
              <div className={`mt-4 pt-3 border-t text-sm flex items-center justify-between ${isDark ? 'border-slate-600 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                <span>共 {session.questions.length} 题</span>
                <span className="text-blue-500 group-hover:translate-x-1 transition-transform">
                  进入 →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
