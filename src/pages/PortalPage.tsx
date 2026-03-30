import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { companies } from '../data/questions'
import { companyInterviews, getAllInterviewQuestions } from '../data/interviewTypes'

export default function PortalPage() {
  const { isDark } = useTheme()
  const allIQ = getAllInterviewQuestions()
  const totalExamQ = companies.reduce((s, c) => s + c.sessions.reduce((ss, se) => ss + se.questions.length, 0), 0)

  const card = (dark: boolean) => `group block rounded-2xl p-8 shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline ${dark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-200'}`

  return (
    <div className="py-8">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          互联网求职中心
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          笔试 OJ + 面经题库，一站式备战大厂秋招春招
        </p>
      </div>

      {/* 统计总览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {[
          { label: '公司', value: companies.length, icon: '🏢' },
          { label: '笔试题', value: totalExamQ, icon: '📝' },
          { label: '面试题', value: allIQ.length, icon: '🎤' },
          { label: '面经部门', value: companyInterviews.reduce((s, c) => s + c.departments.length, 0), icon: '🏛️' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 text-center shadow-sm border transition-all hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{s.value}</div>
            <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 两大板块入口 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {/* 笔试 OJ */}
        <Link to="/exam" className={card(isDark)}>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg">📝</div>
            <div>
              <h2 className={`text-2xl font-bold group-hover:text-blue-500 transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                笔试题库
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                选择题 + 编程题 · OJ 在线判题
              </p>
            </div>
          </div>
          <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            汇集美团、饿了么、蚂蚁、拼多多、米哈游等公司 2027 届笔试真题与模拟题。支持选择题实时判分、编程题在线编辑与混合判题。
          </p>
          <div className="flex gap-3 text-sm">
            <span className={`px-3 py-1.5 rounded-lg font-medium ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>{companies.length} 家公司</span>
            <span className={`px-3 py-1.5 rounded-lg font-medium ${isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-700'}`}>{totalExamQ} 道题</span>
          </div>
        </Link>

        {/* 面试题库 */}
        <Link to="/interview" className={card(isDark)}>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl shadow-lg">🎤</div>
            <div>
              <h2 className={`text-2xl font-bold group-hover:text-purple-500 transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                面试题库
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                真实面经 · 按公司/部门/分类浏览
              </p>
            </div>
          </div>
          <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            来自牛客、小红书等平台的真实面经，按公司部门和题目类型（Redis/MySQL/场景题/手撕算法...）分类，附参考答案。
          </p>
          <div className="flex gap-3 text-sm">
            <span className={`px-3 py-1.5 rounded-lg font-medium ${isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-50 text-purple-700'}`}>{companyInterviews.length} 家公司</span>
            <span className={`px-3 py-1.5 rounded-lg font-medium ${isDark ? 'bg-pink-900/40 text-pink-300' : 'bg-pink-50 text-pink-700'}`}>{allIQ.length} 道面试题</span>
          </div>
        </Link>
      </div>

      {/* 快捷工具 */}
      <h2 className={`text-xl font-bold mb-5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>个人工具</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { to: '/wrong-book', icon: '📝', label: '错题本', desc: '错题复习' },
          { to: '/my-records', icon: '📊', label: '做题记录', desc: '进度追踪' },
          { to: '/upload', icon: '➕', label: '上传题目', desc: '自定义练习' },
          { to: '/interview/category', icon: '🏷️', label: '分类刷题', desc: '按知识点' },
        ].map(t => (
          <Link key={t.to} to={t.to} className={`flex flex-col items-center rounded-xl p-5 border transition-all no-underline hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
            <span className="text-3xl mb-2">{t.icon}</span>
            <span className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.label}</span>
            <span className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
