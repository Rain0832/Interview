import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../contexts/ThemeContext'
import { useAuth } from '../../../contexts/AuthContext'

export default function AuthPage() {
  const { isDark } = useTheme()
  const { login, register, isLoggedIn, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (isLoggedIn) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearError()
    try {
      if (mode === 'login') {
        await login(username, password)
      } else {
        await register(username, email, password)
      }
      navigate('/')
    } catch {
      // error 已在 context 中设置
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none ${isDark
    ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400'
  }`

  return (
    <div className="py-12 max-w-md mx-auto">
      <div className={`rounded-2xl p-8 border shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
            OJ
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {mode === 'login' ? '登录' : '注册'} InterviewOJ
          </h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {mode === 'login' ? '登录以同步你的做题记录' : '创建账号，开始刷题之旅'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              {mode === 'login' ? '用户名 / 邮箱' : '用户名'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === 'login' ? '输入用户名或邮箱' : '2-20 位字母数字下划线'}
              className={inputCls}
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={inputCls}
                required
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? '至少 6 位' : '输入密码'}
              className={inputCls}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <div className={`mt-6 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {mode === 'login' ? (
            <>还没有账号？<button onClick={() => { setMode('register'); clearError() }} className="text-blue-500 hover:text-blue-400 cursor-pointer bg-transparent border-none">注册</button></>
          ) : (
            <>已有账号？<button onClick={() => { setMode('login'); clearError() }} className="text-blue-500 hover:text-blue-400 cursor-pointer bg-transparent border-none">登录</button></>
          )}
        </div>
      </div>
    </div>
  )
}
