import { useParams, Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { getSessionById, type ChoiceQuestion } from '../data/questions'
import { useTheme } from '../../../contexts/ThemeContext'
import { useRecord } from '../../../contexts/RecordContext'

export default function ChoicePage() {
  const { companyId, sessionId } = useParams<{ companyId: string; sessionId: string }>()
  const session = getSessionById(companyId!, sessionId!)
  const { isDark } = useTheme()
  const { addRecord } = useRecord()

  const choiceQuestions = useMemo(
    () => (session?.questions.filter((q) => q.type === 'choice') as ChoiceQuestion[]) ?? [],
    [session]
  )

  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({})
  const [showResult, setShowResult] = useState(false)

  if (!session || choiceQuestions.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>暂无选择题</h2>
        <Link to={`/exam/company/${companyId}/${sessionId}`} className="text-blue-500">返回</Link>
      </div>
    )
  }

  const q = choiceQuestions[currentIdx]
  const selected = userAnswers[q.id]
  const revealed = showAnswer[q.id]
  const totalAnswered = Object.keys(userAnswers).length

  const handleSelect = (label: string) => {
    if (revealed) return
    setUserAnswers((prev) => ({ ...prev, [q.id]: label }))
  }

  const handleReveal = () => {
    setShowAnswer((prev) => ({ ...prev, [q.id]: true }))
    // 记录做题结果
    if (q.answer && companyId && sessionId) {
      addRecord({
        companyId,
        sessionId,
        questionId: q.id,
        questionTitle: q.title,
        userAnswer: userAnswers[q.id] || '',
        correctAnswer: q.answer,
        isCorrect: userAnswers[q.id] === q.answer,
        timestamp: Date.now(),
      })
    }
  }

  const handleSubmit = () => {
    // 提交时记录所有未记录的题
    choiceQuestions.forEach((cq) => {
      if (cq.answer && companyId && sessionId) {
        addRecord({
          companyId,
          sessionId,
          questionId: cq.id,
          questionTitle: cq.title,
          userAnswer: userAnswers[cq.id] || '',
          correctAnswer: cq.answer,
          isCorrect: userAnswers[cq.id] === cq.answer,
          timestamp: Date.now(),
        })
      }
    })
    setShowResult(true)
  }

  // 结果页
  if (showResult) {
    const correct = choiceQuestions.filter(
      (cq) => cq.answer && userAnswers[cq.id] === cq.answer
    ).length
    const total = choiceQuestions.length
    const pct = Math.round((correct / total) * 100)

    return (
      <div className="py-8 max-w-2xl mx-auto">
        <div className={`rounded-2xl p-8 shadow-sm border text-center mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>答题完成！</h2>
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent my-4">
            {correct} / {total}
          </div>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>正确率 {pct}%</p>
          <div className={`w-full rounded-full h-3 mt-4 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div
              className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* 逐题回顾 */}
        <div className="space-y-4">
          {choiceQuestions.map((cq, idx) => {
            const ua = userAnswers[cq.id]
            const isCorrect = ua === cq.answer
            return (
              <div key={cq.id} className={`rounded-xl p-5 border ${isCorrect
                ? isDark ? 'bg-green-900/20 border-green-800' : 'bg-white border-green-200'
                : isDark ? 'bg-red-900/20 border-red-800' : 'bg-white border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {idx + 1}
                  </span>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cq.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${isCorrect
                    ? isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'
                    : isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'
                  }`}>
                    {isCorrect ? '✓ 正确' : `✗ 你选 ${ua || '未答'} / 正确 ${cq.answer}`}
                  </span>
                </div>
                {cq.note && (
                  <p className={`text-xs mt-1 pl-9 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>💡 {cq.note}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setShowResult(false)
              setUserAnswers({})
              setShowAnswer({})
              setCurrentIdx(0)
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
          >
            重新答题
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 max-w-3xl mx-auto">
      {/* 进度条 */}
      <div className="mb-6">
        <div className={`flex items-center justify-between mb-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>第 {currentIdx + 1} / {choiceQuestions.length} 题</span>
          <span>已答 {totalAnswered} 题</span>
        </div>
        <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / choiceQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 题号导航 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {choiceQuestions.map((cq, idx) => {
          const answered = !!userAnswers[cq.id]
          const isCurrent = idx === currentIdx
          const isRevealed = showAnswer[cq.id]
          const isCorrect = isRevealed && userAnswers[cq.id] === cq.answer

          let cls = 'w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer '
          if (isCurrent) {
            cls += 'bg-blue-600 text-white shadow-md scale-110'
          } else if (isRevealed) {
            cls += isCorrect
              ? isDark ? 'bg-green-900/40 text-green-300 border border-green-700' : 'bg-green-100 text-green-700 border border-green-300'
              : isDark ? 'bg-red-900/40 text-red-300 border border-red-700' : 'bg-red-100 text-red-700 border border-red-300'
          } else if (answered) {
            cls += isDark ? 'bg-blue-900/40 text-blue-300 border border-blue-700' : 'bg-blue-100 text-blue-700 border border-blue-200'
          } else {
            cls += isDark ? 'bg-slate-700 text-slate-400 border border-slate-600 hover:border-blue-500' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'
          }

          return (
            <button key={cq.id} className={cls} onClick={() => setCurrentIdx(idx)}>
              {idx + 1}
            </button>
          )
        })}
      </div>

      {/* 题目卡片 */}
      <div className={`rounded-2xl p-8 shadow-sm border mb-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-3 mb-5">
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
            单选题
          </span>
          <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>#{q.id}</span>
        </div>
        <h3 className={`text-lg font-semibold leading-relaxed mb-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{q.content}</h3>

        {/* 选项 */}
        <div className="space-y-3">
          {q.choices.map((choice) => {
            const isSelected = selected === choice.label
            const isAnswer = q.answer === choice.label
            let optionCls = 'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer '

            if (revealed) {
              if (isAnswer) {
                optionCls += isDark ? 'border-green-600 bg-green-900/30' : 'border-green-400 bg-green-50'
              } else if (isSelected && !isAnswer) {
                optionCls += isDark ? 'border-red-600 bg-red-900/30' : 'border-red-400 bg-red-50'
              } else {
                optionCls += isDark ? 'border-slate-600 bg-slate-700/50 opacity-60' : 'border-slate-100 bg-slate-50 opacity-60'
              }
            } else if (isSelected) {
              optionCls += isDark ? 'border-blue-500 bg-blue-900/30 shadow-sm' : 'border-blue-400 bg-blue-50 shadow-sm'
            } else {
              optionCls += isDark ? 'border-slate-600 bg-slate-700/30 hover:border-blue-500 hover:bg-blue-900/20' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
            }

            return (
              <div key={choice.label} className={optionCls} onClick={() => handleSelect(choice.label)}>
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                    revealed && isAnswer
                      ? 'bg-green-500 text-white'
                      : revealed && isSelected && !isAnswer
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-blue-500 text-white'
                      : isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {choice.label}
                </span>
                <span className={isDark ? 'text-slate-200 leading-relaxed' : 'text-slate-700 leading-relaxed'}>{choice.text}</span>
                {revealed && isAnswer && <span className="ml-auto text-green-500 shrink-0">✓</span>}
                {revealed && isSelected && !isAnswer && <span className="ml-auto text-red-500 shrink-0">✗</span>}
              </div>
            )
          })}
        </div>

        {/* 查看答案 / 备注 */}
        {selected && !revealed && (
          <button
            onClick={handleReveal}
            className={`mt-5 px-4 py-2 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${isDark ? 'bg-amber-900/30 text-amber-300 border-amber-700 hover:bg-amber-900/50' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
          >
            👁️ 查看答案
          </button>
        )}
        {revealed && q.note && (
          <div className={`mt-5 p-4 border rounded-xl text-sm ${isDark ? 'bg-blue-900/30 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
            💡 <strong>解析：</strong>{q.note}
          </div>
        )}
      </div>

      {/* 上一题 / 下一题 / 提交 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className={`px-5 py-2.5 border rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
        >
          ← 上一题
        </button>
        <div className="flex gap-3">
          {currentIdx < choiceQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
            >
              下一题 →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
            >
              🎯 提交答案
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
