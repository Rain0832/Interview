import { Link } from 'react-router-dom'
import { useTheme } from '../../../contexts/ThemeContext'
import { useRecord } from '../../../contexts/RecordContext'

export default function MyRecordsPage() {
  const { isDark } = useTheme()
  const { getDoneRecords, clearRecords } = useRecord()
  const records = getDoneRecords()

  const correct = records.filter((r) => r.isCorrect).length
  const wrong = records.length - correct
  const pct = records.length > 0 ? Math.round((correct / records.length) * 100) : 0

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>📊 做题记录</h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            追踪你的做题进度与正确率
          </p>
        </div>
        {records.length > 0 && (
          <button
            onClick={() => { if (confirm('确定清空所有做题记录？')) clearRecords() }}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${isDark ? 'text-red-400 border-red-800 hover:bg-red-900/30' : 'text-red-600 border-red-200 hover:bg-red-50'}`}
          >
            清空记录
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="text-6xl mb-4">📭</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>暂无记录</h2>
          <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>开始做题，这里会自动记录你的答题情况</p>
          <Link to="/" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all no-underline">
            去做题 →
          </Link>
        </div>
      ) : (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className={`rounded-xl p-5 text-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{records.length}</div>
              <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>总做题数</div>
            </div>
            <div className={`rounded-xl p-5 text-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="text-3xl font-bold text-green-500">{correct}</div>
              <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>正确</div>
            </div>
            <div className={`rounded-xl p-5 text-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="text-3xl font-bold text-red-500">{wrong}</div>
              <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>错误</div>
            </div>
          </div>

          {/* 正确率进度条 */}
          <div className={`rounded-xl p-5 border mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>正确率</span>
              <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{pct}%</span>
            </div>
            <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* 做题列表 */}
          <div className="space-y-2">
            {[...records].reverse().map((record, idx) => (
              <div
                key={`${record.companyId}-${record.sessionId}-${record.questionId}-${idx}`}
                className={`flex items-center gap-3 rounded-lg p-4 border transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${record.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {record.isCorrect ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{record.questionTitle}</div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {record.companyId} / {record.sessionId} · {new Date(record.timestamp).toLocaleString('zh-CN')}
                  </div>
                </div>
                <div className={`text-sm shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {record.isCorrect ? '✓ 正确' : `✗ ${record.userAnswer || '未答'}→${record.correctAnswer}`}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
