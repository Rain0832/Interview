import { useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { useRecord, type UserQuestion } from '../../../contexts/RecordContext'

export default function UploadPage() {
  const { isDark } = useTheme()
  const { userQuestions, addUserQuestion, removeUserQuestion } = useRecord()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'choice' | 'coding'>('choice')
  const [answer, setAnswer] = useState('')
  const [note, setNote] = useState('')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
  const [tags, setTags] = useState('')
  const [choices, setChoices] = useState([
    { label: 'A', text: '' },
    { label: 'B', text: '' },
    { label: 'C', text: '' },
    { label: 'D', text: '' },
  ])
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return

    const q: UserQuestion = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      content: content.trim(),
      type,
      difficulty,
      tags: tags.split(/[,，\s]+/).filter(Boolean),
      createdAt: Date.now(),
    }

    if (type === 'choice') {
      q.choices = choices.filter((c) => c.text.trim())
      q.answer = answer.trim()
      q.note = note.trim()
    }

    addUserQuestion(q)
    // 重置表单
    setTitle('')
    setContent('')
    setAnswer('')
    setNote('')
    setTags('')
    setChoices([
      { label: 'A', text: '' },
      { label: 'B', text: '' },
      { label: 'C', text: '' },
      { label: 'D', text: '' },
    ])
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none ${isDark
    ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400'
  }`

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>➕ 上传题目</h1>
      <p className={`mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        创建你自己的题目，本地保存，随时练习
      </p>

      {/* 成功提示 */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-xl text-sm animate-pulse">
          ✅ 题目创建成功！
        </div>
      )}

      {/* 上传表单 */}
      <div className={`rounded-2xl p-6 border mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="space-y-5">
          {/* 题目类型 */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>题目类型</label>
            <div className="flex gap-3">
              {(['choice', 'coding'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    type === t
                      ? 'bg-blue-600 text-white'
                      : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'choice' ? '✅ 选择题' : '💻 编程题'}
                </button>
              ))}
            </div>
          </div>

          {/* 难度 */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>难度</label>
            <div className="flex gap-3">
              {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    difficulty === d
                      ? d === 'Easy' ? 'bg-green-500 text-white'
                        : d === 'Medium' ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                      : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>题目标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入题目标题"
              className={inputCls}
            />
          </div>

          {/* 内容 */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>题目内容 *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入题目内容..."
              rows={5}
              className={`${inputCls} resize-y`}
            />
          </div>

          {/* 标签 */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>标签（逗号分隔）</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例如：DP, 贪心, 排序"
              className={inputCls}
            />
          </div>

          {/* 选择题特有字段 */}
          {type === 'choice' && (
            <>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>选项</label>
                <div className="space-y-2">
                  {choices.map((choice, idx) => (
                    <div key={choice.label} className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isDark ? 'bg-slate-600 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                        {choice.label}
                      </span>
                      <input
                        type="text"
                        value={choice.text}
                        onChange={(e) => {
                          const newChoices = [...choices]
                          newChoices[idx].text = e.target.value
                          setChoices(newChoices)
                        }}
                        placeholder={`选项 ${choice.label} 内容`}
                        className={`flex-1 ${inputCls}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>正确答案</label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="A / B / C / D"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>解析（可选）</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="答案解析"
                    className={inputCls}
                  />
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 创建题目
          </button>
        </div>
      </div>

      {/* 已上传题目列表 */}
      {userQuestions.length > 0 && (
        <div>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            我的题目 ({userQuestions.length})
          </h2>
          <div className="space-y-3">
            {[...userQuestions].reverse().map((q) => (
              <div
                key={q.id}
                className={`rounded-xl p-5 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${q.type === 'choice'
                        ? isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'
                        : isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {q.type === 'choice' ? '选择题' : '编程题'}
                      </span>
                      {q.difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          q.difficulty === 'Easy' ? isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'
                          : q.difficulty === 'Medium' ? isDark ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                          : isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'
                        }`}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{q.title}</h3>
                    <p className={`text-sm mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{q.content}</p>
                    {q.tags && q.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {q.tags.map((t) => (
                          <span key={t} className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => { if (confirm('确定删除这道题？')) removeUserQuestion(q.id) }}
                    className={`shrink-0 px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${isDark ? 'text-red-400 border-red-800 hover:bg-red-900/30' : 'text-red-600 border-red-200 hover:bg-red-50'}`}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
