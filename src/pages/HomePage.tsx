import { Link } from 'react-router-dom'
import { companies } from '../data/questions'
import { useTheme } from '../contexts/ThemeContext'
import { useRecord } from '../contexts/RecordContext'

export default function HomePage() {
  const { isDark } = useTheme()
  const { records, getWrongRecords, userQuestions } = useRecord()

  return (
    <div className="py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          大厂笔面试题库
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          汇集各大互联网公司笔试与面试真题，助你系统备战秋招春招
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: '公司', value: companies.length, icon: '🏢' },
          { label: '场次', value: companies.reduce((s, c) => s + c.sessions.length, 0), icon: '📋' },
          {
            label: '选择题',
            value: companies.reduce(
              (s, c) => s + c.sessions.reduce((ss, se) => ss + se.questions.filter((q) => q.type === 'choice').length, 0),
              0
            ),
            icon: '✅',
          },
          {
            label: '编程题',
            value: companies.reduce(
              (s, c) => s + c.sessions.reduce((ss, se) => ss + se.questions.filter((q) => q.type === 'coding').length, 0),
              0
            ),
            icon: '💻',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-5 text-center shadow-sm border transition-all hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-100'}`}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{stat.value}</div>
            <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 快捷入口 */}
      {(records.length > 0 || userQuestions.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link to="/my-records" className={`flex items-center gap-3 rounded-xl p-4 border transition-all no-underline ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-300'}`}>
            <span className="text-2xl">📊</span>
            <div>
              <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>做题记录</div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>已做 {records.length} 题</div>
            </div>
          </Link>
          <Link to="/wrong-book" className={`flex items-center gap-3 rounded-xl p-4 border transition-all no-underline ${isDark ? 'bg-slate-800 border-slate-700 hover:border-red-500' : 'bg-white border-slate-100 hover:border-red-300'}`}>
            <span className="text-2xl">📝</span>
            <div>
              <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>错题本</div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{getWrongRecords().length} 道错题</div>
            </div>
          </Link>
          <Link to="/upload" className={`flex items-center gap-3 rounded-xl p-4 border transition-all no-underline ${isDark ? 'bg-slate-800 border-slate-700 hover:border-green-500' : 'bg-white border-slate-100 hover:border-green-300'}`}>
            <span className="text-2xl">➕</span>
            <div>
              <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>我的题目</div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{userQuestions.length} 道自定义</div>
            </div>
          </Link>
        </div>
      )}

      {/* 公司列表 */}
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>选择公司</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => {
          const choiceCount = company.sessions.reduce(
            (s, se) => s + se.questions.filter((q) => q.type === 'choice').length,
            0
          )
          const codingCount = company.sessions.reduce(
            (s, se) => s + se.questions.filter((q) => q.type === 'coding').length,
            0
          )
          return (
            <Link
              key={company.id}
              to={`/exam/company/${company.id}`}
              className={`group block rounded-2xl p-6 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 no-underline ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-200'}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: company.color + '20' }}
                >
                  {company.logo}
                </div>
                <div>
                  <h3 className={`text-xl font-bold group-hover:text-blue-500 transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                    {company.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {company.year} {company.season}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                  📋 {company.sessions.length} 场
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-700'}`}>
                  ✅ {choiceCount} 选择
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-50 text-purple-700'}`}>
                  💻 {codingCount} 编程
                </span>
              </div>
            </Link>
          )
        })}

        {/* 占位卡片 - 更多公司 */}
        <div className={`block rounded-2xl p-6 border-2 border-dashed flex items-center justify-center ${isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <div className="text-4xl mb-2">➕</div>
            <div className="text-sm">更多公司即将添加...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
