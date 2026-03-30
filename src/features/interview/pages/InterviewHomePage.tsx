import { Link } from 'react-router-dom'
import { useTheme } from '../../../contexts/ThemeContext'
import { companyInterviews, getAllInterviewQuestions, type InterviewCategory } from '../data/interviewTypes'

const CATEGORY_ICONS: Partial<Record<InterviewCategory, string>> = {
  'Redis': '🔴', 'MySQL': '🐬', 'Java': '☕', 'C++': '⚙️', 'Go': '🐹', 'Python': '🐍',
  '操作系统': '💻', '计算机网络': '🌐', '数据结构与算法': '🧮', 'Elasticsearch': '🔍',
  '分布式系统': '🌍', '系统设计': '🏗️', '场景题': '🎯', '开放问题': '💬',
  'AI/大模型': '🤖', '手撕算法': '✍️', '项目拷打': '🔥', '其他': '📌',
}

export default function InterviewHomePage() {
  const { isDark } = useTheme()
  const allQ = getAllInterviewQuestions()
  const categoryCount: Record<string, number> = {}
  allQ.forEach(q => { categoryCount[q.category] = (categoryCount[q.category] || 0) + 1 })

  return (
    <div className="py-8">
      <div className="mb-10">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>🎤 面试题库</h1>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          来自牛客、小红书等平台的真实面经，按公司部门或题目类型浏览
        </p>
      </div>

      {/* 按公司浏览 */}
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>按公司 · 部门</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {companyInterviews.map(company => (
          <div key={company.id} className={`rounded-2xl p-6 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: company.color + '20' }}>
                {company.logo}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{company.name}</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{company.departments.length} 个部门</p>
              </div>
            </div>
            <div className="space-y-2">
              {company.departments.map(dept => {
                const qCount = dept.sessions.reduce((s, se) => s + se.questions.length, 0)
                return (
                  <Link key={dept.id} to={`/interview/${company.id}/${dept.id}`}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all no-underline ${isDark ? 'border-slate-600 hover:border-blue-500 hover:bg-slate-700/50' : 'border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'}`}>
                    <div>
                      <div className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{dept.department}</div>
                      <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{dept.sessions.length} 轮面试 · {qCount} 题</div>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
        <div className={`rounded-2xl p-6 border-2 border-dashed flex items-center justify-center ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
          <div className={`text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <div className="text-3xl mb-2">➕</div>
            <div className="text-sm">更多公司面经持续更新中...</div>
          </div>
        </div>
      </div>

      {/* 按分类浏览 */}
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>按题目分类</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
          <Link key={cat} to={`/interview/category/${encodeURIComponent(cat)}`}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all no-underline hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
            <span className="text-2xl">{CATEGORY_ICONS[cat as InterviewCategory] || '📌'}</span>
            <div>
              <div className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{cat}</div>
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{count} 题</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
