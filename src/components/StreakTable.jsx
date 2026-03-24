const TYPE_STYLES = {
  win:      { dot: 'bg-emerald-400', text: 'text-emerald-400' },
  unbeaten: { dot: 'bg-blue-400',    text: 'text-blue-400'    },
}

function streakColor(length) {
  if (length >= 15) return 'text-red-400'
  if (length >= 8)  return 'text-orange-400'
  return 'text-white'
}

function StreakTable({ streaks }) {
  if (!streaks || streaks.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 text-sm">No active streaks right now.</p>
        <p className="text-gray-700 text-xs mt-1">Data refreshes every 6 hours.</p>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {streaks.map((s, i) => {
        const style = TYPE_STYLES[s.streak_type] ?? { dot: 'bg-gray-500', text: 'text-gray-400' }
        return (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800/80 transition-colors"
          >
            <span className="text-gray-700 text-xs tabular-nums w-4 shrink-0 text-right">{i + 1}</span>

            <div className="w-44 shrink-0 min-w-0">
              <div className="font-medium text-white truncate">{s.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                <span className={`text-xs capitalize ${style.text}`}>{s.streak_type}</span>
                <span className="text-gray-700 text-xs">·</span>
                <span className="text-xs text-gray-500 capitalize truncate">
                  {s.sport}{s.league && ` · ${s.league}`}
                </span>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-1 flex-wrap">
              {Array.from({ length: Math.min(s.length, 20) }).map((_, j) => (
                <span key={j} className={`w-2 h-2 rounded-sm shrink-0 ${style.dot}`} />
              ))}
              {s.length > 20 && (
                <span className={`text-xs font-medium ${style.text}`}>+{s.length - 20}</span>
              )}
            </div>

            <span className={`text-2xl font-bold tabular-nums shrink-0 w-8 text-right ${streakColor(s.length)}`}>
              {s.length}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default StreakTable
