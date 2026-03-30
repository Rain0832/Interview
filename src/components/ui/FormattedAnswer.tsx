import { useTheme } from '../../contexts/ThemeContext'

/**
 * 格式化参考答案组件 — 策略模式：根据文本特征自动选择渲染策略
 *
 * 支持的格式：
 * - 数字编号列表: "1)xxx 2)yyy" 或 "1.xxx 2.yyy"
 * - 符号列表: "·xxx ·yyy" 或 "-xxx"
 * - 中文顿号分割: "A、B、C"
 * - 纯文本段落
 */
export default function FormattedAnswer({ text }: { text: string }) {
  const { isDark } = useTheme()

  if (!text) return null

  // 拆分策略：按数字编号 "1)" "2)" 或 "1." "2." 拆分
  const numberedPattern = /(?:^|\s)(\d+)[)）.、]\s*/
  const hasNumbered = numberedPattern.test(text)

  if (hasNumbered) {
    // 按 "1)" "2)" 等拆分
    const items = text.split(/(?:^|\s)(?=\d+[)）.、])/).map(s => s.trim()).filter(Boolean)
    if (items.length > 1) {
      return (
        <div className="space-y-2">
          {items.map((item, i) => {
            // 提取编号和内容
            const match = item.match(/^(\d+)[)）.、]\s*(.*)/)
            const num = match ? match[1] : String(i + 1)
            const content = match ? match[2] : item
            return (
              <div key={i} className="flex gap-2.5">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {num}
                </span>
                <span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {formatInline(content, isDark)}
                </span>
              </div>
            )
          })}
        </div>
      )
    }
  }

  // 如果文本中包含多个分号或句号分隔的知识点
  const segments = text.split(/[;；]\s*/).filter(s => s.trim())
  if (segments.length >= 3) {
    return (
      <div className="space-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`} />
            <span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {formatInline(seg.trim(), isDark)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // 普通文本：高亮关键术语
  return (
    <div className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
      {formatInline(text, isDark)}
    </div>
  )
}

/** 内联格式化：高亮括号内术语、代码片段 */
function formatInline(text: string, isDark: boolean) {
  // 把 (xxx) 和 「xxx」 中的内容高亮
  const parts = text.split(/(\([^)]+\)|（[^）]+）|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (/^\(.*\)$/.test(part) || /^（.*）$/.test(part)) {
      return <span key={i} className={`font-medium ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{part}</span>
    }
    if (/^`.*`$/.test(part)) {
      return <code key={i} className={`px-1 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-slate-700 text-green-300' : 'bg-slate-100 text-green-700'}`}>{part.slice(1, -1)}</code>
    }
    return <span key={i}>{part}</span>
  })
}
