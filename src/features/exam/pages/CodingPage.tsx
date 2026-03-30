import { useParams, Link } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { getSessionById, type CodingQuestion } from '../data/questions'
import { useTheme } from '../../../contexts/ThemeContext'

export default function CodingPage() {
  const { companyId, sessionId, questionId } = useParams<{
    companyId: string
    sessionId: string
    questionId: string
  }>()
  const session = getSessionById(companyId!, sessionId!)
  const question = session?.questions.find(
    (q) => q.id === Number(questionId) && q.type === 'coding'
  ) as CodingQuestion | undefined
  const { isDark } = useTheme()

  const [code, setCode] = useState(question?.codeTemplate ?? '')
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description')

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
  }, [code])

  const handleReset = useCallback(() => {
    if (question) setCode(question.codeTemplate)
  }, [question])

  if (!question) {
    return (
      <div className="py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>未找到该题目</h2>
        <Link to={`/exam/company/${companyId}/${sessionId}`} className="text-blue-500">返回</Link>
      </div>
    )
  }

  const difficultyColor = {
    Easy: isDark ? 'bg-green-900/40 text-green-300 border-green-700' : 'bg-green-100 text-green-700 border-green-200',
    Medium: isDark ? 'bg-yellow-900/40 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: isDark ? 'bg-red-900/40 text-red-300 border-red-700' : 'bg-red-100 text-red-700 border-red-200',
  }

  const codingQuestions = (session?.questions.filter((q) => q.type === 'coding') ?? []) as CodingQuestion[]
  const currentIdx = codingQuestions.findIndex((q) => q.id === question.id)
  const prevQ = currentIdx > 0 ? codingQuestions[currentIdx - 1] : null
  const nextQ = currentIdx < codingQuestions.length - 1 ? codingQuestions[currentIdx + 1] : null

  return (
    <div className="py-6">
      {/* 题目头部 */}
      <div className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{question.title}</h1>
              {question.difficulty && (
                <span className={`px-3 py-1 text-sm font-medium rounded-lg border ${difficultyColor[question.difficulty]}`}>
                  {question.difficulty}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {question.tags?.map((tag) => (
                <span key={tag} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className={`text-sm text-right space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <div>⏱ {question.timeLimit}</div>
            <div>💾 {question.memoryLimit}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：题目描述 */}
        <div className="space-y-4">
          {/* Tab 切换 */}
          <div className={`flex gap-1 rounded-xl p-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            {(['description', 'solution'] as const).map((tab) => (
              <button
                key={tab}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab
                    ? isDark ? 'bg-slate-600 text-slate-100 shadow-sm' : 'bg-white text-slate-800 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'description' ? '📝 题目描述' : '💡 题解'}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className={`rounded-2xl p-6 shadow-sm border space-y-5 max-h-[70vh] overflow-y-auto ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>题目描述</h3>
                <div className={`leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {question.content}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>输入描述</h3>
                <div className={`leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {question.inputDesc}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>输出描述</h3>
                <div className={`leading-relaxed whitespace-pre-wrap ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {question.outputDesc}
                </div>
              </div>
              {question.examples.map((ex, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    示例 {idx + 1}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className={`text-xs font-medium mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>输入</div>
                      <pre className={`border rounded-lg p-3 text-sm overflow-x-auto font-mono ${isDark ? 'bg-slate-900 border-slate-600 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        {ex.input}
                      </pre>
                    </div>
                    <div>
                      <div className={`text-xs font-medium mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>输出</div>
                      <pre className={`border rounded-lg p-3 text-sm overflow-x-auto font-mono ${isDark ? 'bg-slate-900 border-slate-600 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        {ex.output}
                      </pre>
                    </div>
                  </div>
                  {ex.explanation && (
                    <div className={`p-3 border rounded-lg text-sm ${isDark ? 'bg-blue-900/30 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                      💡 {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'solution' && (
            <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <div className="text-4xl mb-3">🧠</div>
                <p>题解区 —— 做完题后再看哦</p>
                <p className="text-sm mt-1">后续版本将支持添加题解</p>
              </div>
            </div>
          )}
        </div>

        {/* 右侧：代码编辑器 */}
        <div className="space-y-4">
          <div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 text-white">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-slate-400 ml-2">solution.cpp</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                >
                  ↺ 重置
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                >
                  📋 复制
                </button>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full min-h-[50vh] p-4 font-mono text-sm leading-6 bg-slate-900 text-green-400 resize-y border-0 outline-none"
                spellCheck={false}
                placeholder="在此处编写代码..."
              />
            </div>
          </div>

          <div className={`border rounded-xl p-4 text-sm ${isDark ? 'bg-amber-900/20 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            <strong>💡 提示：</strong> 建议复制代码到本地 IDE 中编写和调试，完成后粘贴回来。
            编辑器仅用于预览和快速编辑。
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <div className={`flex items-center justify-between mt-8 pt-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        {prevQ ? (
          <Link
            to={`/exam/company/${companyId}/${sessionId}/coding/${prevQ.id}`}
            className={`px-5 py-2.5 border rounded-xl font-medium transition-all no-underline ${isDark ? 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
          >
            ← {prevQ.title}
          </Link>
        ) : (
          <div />
        )}
        {nextQ ? (
          <Link
            to={`/exam/company/${companyId}/${sessionId}/coding/${nextQ.id}`}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all no-underline"
          >
            {nextQ.title} →
          </Link>
        ) : (
          <Link
            to={`/exam/company/${companyId}/${sessionId}`}
            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all no-underline"
          >
            🎯 返回列表
          </Link>
        )}
      </div>
    </div>
  )
}
