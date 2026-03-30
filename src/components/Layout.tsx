import { Outlet, Link, useLocation } from 'react-router-dom'
import { getCompanyById, getSessionById } from '../features/exam/data/questions'
import { getInterviewCompany, getDepartment } from '../features/interview/data/interviewTypes'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)
  const { theme, toggleTheme, isDark } = useTheme()
  const { user, isLoggedIn, logout } = useAuth()

  // 动态构建面包屑
  const crumbs: { label: string; to: string }[] = [{ label: '首页', to: '/' }]

  if (pathParts[0] === 'exam') {
    crumbs.push({ label: '笔试题库', to: '/exam' })
    if (pathParts.length >= 3 && pathParts[1] === 'company') {
      const company = getCompanyById(pathParts[2])
      crumbs.push({ label: company?.name || pathParts[2], to: `/exam/company/${pathParts[2]}` })
    }
    if (pathParts.length >= 4 && pathParts[1] === 'company') {
      const session = getSessionById(pathParts[2], pathParts[3])
      crumbs.push({ label: session?.name || pathParts[3], to: `/exam/company/${pathParts[2]}/${pathParts[3]}` })
    }
    if (pathParts.length >= 5) {
      if (pathParts[4] === 'choice') crumbs.push({ label: '选择题', to: location.pathname })
      else if (pathParts[4] === 'coding' && pathParts[5]) crumbs.push({ label: `编程题 #${pathParts[5]}`, to: location.pathname })
    }
  } else if (pathParts[0] === 'interview') {
    crumbs.push({ label: '面试题库', to: '/interview' })
    if (pathParts[1] === 'category') {
      crumbs.push({ label: '分类刷题', to: '/interview/category' })
      if (pathParts[2]) crumbs.push({ label: decodeURIComponent(pathParts[2]), to: location.pathname })
    } else if (pathParts[1] && pathParts[2]) {
      const company = getInterviewCompany(pathParts[1])
      const dept = getDepartment(pathParts[1], pathParts[2])
      if (company) crumbs.push({ label: company.name, to: '/interview' })
      if (dept) crumbs.push({ label: dept.department, to: location.pathname })
    }
  } else if (pathParts[0] === 'growth') {
    crumbs.push({ label: '个人成长', to: '/growth' })
  } else if (pathParts[0] === 'company') {
    // 兼容旧路由
    const company = getCompanyById(pathParts[1])
    crumbs.push({ label: company?.name || pathParts[1], to: `/company/${pathParts[1]}` })
    if (pathParts[2]) {
      const session = getSessionById(pathParts[1], pathParts[2])
      crumbs.push({ label: session?.name || pathParts[2], to: `/company/${pathParts[1]}/${pathParts[2]}` })
    }
  } else {
    const labels: Record<string, string> = { 'wrong-book': '错题本', 'my-records': '做题记录', 'upload': '上传题目', 'login': '登录' }
    if (pathParts[0] && labels[pathParts[0]]) crumbs.push({ label: labels[pathParts[0]], to: location.pathname })
  }

  const navLink = (to: string, _label?: string) =>
    `px-3 py-1.5 rounded-lg transition-colors no-underline text-sm ${
      location.pathname.startsWith(to)
        ? isDark ? 'bg-blue-900/50 text-blue-300 font-medium' : 'bg-blue-50 text-blue-700 font-medium'
        : isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-950 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300 ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">OJ</div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">InterviewOJ</span>
            </Link>
            <div className="flex items-center gap-2">
              <nav className="hidden sm:flex items-center gap-1">
                <Link to="/exam" className={navLink('/exam')}>📝 笔试</Link>
                <Link to="/interview" className={navLink('/interview')}>🎤 面试</Link>
                <Link to="/growth" className={navLink('/growth')}>🌱 成长</Link>
                <Link to="/wrong-book" className={navLink('/wrong-book')}>📕 错题本</Link>
              </nav>
              <button onClick={toggleTheme} className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer border-0 ${isDark ? 'bg-indigo-600' : 'bg-slate-300'}`} aria-label="切换主题" title={`当前: ${theme === 'dark' ? '深色' : '浅色'}模式`}>
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs transition-all duration-300 ${isDark ? 'left-7' : 'left-0.5'}`}>{isDark ? '🌙' : '☀️'}</div>
              </button>
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{user?.username}</span>
                  <button onClick={logout} className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${isDark ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}>退出</button>
                </div>
              ) : (
                <Link to="/login" className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg font-medium hover:shadow-md transition-all no-underline">登录</Link>
              )}
            </div>
          </div>
        </div>
        {/* 移动端导航 */}
        <div className={`sm:hidden border-t px-4 py-2 flex gap-2 text-xs overflow-x-auto ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <Link to="/exam" className={`shrink-0 px-2 py-1 rounded no-underline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>📝 笔试</Link>
          <Link to="/interview" className={`shrink-0 px-2 py-1 rounded no-underline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>🎤 面试</Link>
          <Link to="/growth" className={`shrink-0 px-2 py-1 rounded no-underline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>🌱 成长</Link>
          <Link to="/wrong-book" className={`shrink-0 px-2 py-1 rounded no-underline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>📕 错题本</Link>
        </div>
      </header>

      {crumbs.length > 1 && (
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1 text-sm flex-wrap">
            {crumbs.map((crumb, i) => (
              <li key={crumb.to + i} className="flex items-center gap-1">
                {i > 0 && <span className={`mx-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>/</span>}
                {i < crumbs.length - 1 ? (
                  <Link to={crumb.to} className="text-blue-500 hover:text-blue-400 transition-colors no-underline">{crumb.label}</Link>
                ) : (
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"><Outlet /></main>

      <footer className={`border-t backdrop-blur-sm mt-auto transition-colors duration-300 ${isDark ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white/60'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          InterviewOJ — 互联网求职中心 · 笔试 OJ + 面经题库
        </div>
      </footer>
    </div>
  )
}
