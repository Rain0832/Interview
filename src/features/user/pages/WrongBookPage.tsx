import { Link } from 'react-router-dom'
import { useTheme } from '../../../contexts/ThemeContext'
import { useRecord } from '../../../contexts/RecordContext'

export default function WrongBookPage() {
  const { isDark } = useTheme()
  const { getWrongRecords, clearRecords } = useRecord()
  const wrongRecords = getWrongRecords()

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>📝 错题本</h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            共 {wrongRecords.length} 道错题，针对性复习
          </p>
        </div>
        {wrongRecords.length > 0 && (
          <button
            onClick={() => { if (confirm('确定清空所有做题记录？')) clearRecords() }}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${isDark ? 'text-red-400 border-red-800 hover:bg-red-900/30' : 'text-red-600 border-red-200 hover:bg-red-50'}`}
          >
            清空记录
          </button>
        )}
      </div>

      {wrongRecords.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className="text-6xl mb-4">🎉</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>暂无错题</h2>
          <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            去做几道选择题，做错的会自动记录在这里
          </p>
          <Link to="/" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all no-underline">
            去做题 →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {wrongRecords.map((record, idx) => (
            <div
              key={`${record.companyId}-${record.sessionId}-${record.questionId}-${idx}`}
              className={`rounded-xl p-5 border transition-all ${isDark ? 'bg-slate-800 border-slate-700 hover:border-red-700' : 'bg-white border-slate-100 hover:border-red-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold">
                    ✗
                  </span>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                      {record.questionTitle}
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {record.companyId} / {record.sessionId} / #{record.questionId}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/exam/company/${record.companyId}/${record.sessionId}/choice`}
                  className="text-sm text-blue-500 hover:text-blue-400 no-underline"
                >
                  重做 →
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className={`px-2 py-1 rounded ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                  你选: {record.userAnswer || '未答'}
                </span>
                <span className={`px-2 py-1 rounded ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'}`}>
                  正确: {record.correctAnswer}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {new Date(record.timestamp).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
