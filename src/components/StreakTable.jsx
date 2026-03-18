const MEDALS = ['🥇', '🥈', '🥉']

const STREAK_STYLES = {
  win:      { pill: 'bg-emerald-950 text-emerald-400 ring-1 ring-emerald-800', bar: 'bg-emerald-500' },
  unbeaten: { pill: 'bg-blue-950 text-blue-400 ring-1 ring-blue-800',         bar: 'bg-blue-500'    },
}

const DEFAULT_STYLE = { pill: 'bg-gray-800 text-gray-300', bar: 'bg-gray-500' }

function StreakTable({ streaks, maxLength = 0 }) {
  if (!streaks || streaks.length === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl p-16 text-center">
        <p className="text-gray-600 text-sm">No active streaks right now.</p>
        <p className="text-gray-700 text-xs mt-1">Data refreshes every hour.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden ring-1 ring-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-800/60 text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-5 py-3 text-center w-12">#</th>
            <th className="px-5 py-3 text-left">Name</th>
            <th className="px-5 py-3 text-left hidden sm:table-cell">Type</th>
            <th className="px-5 py-3 text-right">Streak</th>
          </tr>
        </thead>
        <tbody>
          {streaks.map((s, i) => {
            const style = STREAK_STYLES[s.streak_type] ?? DEFAULT_STYLE
            const barPct = maxLength > 0 ? Math.round((s.length / maxLength) * 100) : 0
            const isFirst = i === 0

            return (
              <tr
                key={i}
                className={`border-t border-white/5 transition-colors hover:bg-white/5 ${
                  isFirst ? 'bg-yellow-500/5' : ''
                }`}
              >
                {/* Rank */}
                <td className="px-5 py-3.5 text-center">
                  {i < 3
                    ? <span className="text-base leading-none">{MEDALS[i]}</span>
                    : <span className="text-gray-600 text-xs tabular-nums">{i + 1}</span>
                  }
                </td>

                {/* Name */}
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-white leading-tight">{s.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 capitalize">
                    {s.entity_type} · {s.sport}{s.league && <> · <span className="text-gray-600">{s.league}</span></>}
                    <span className={`ml-2 sm:hidden px-1.5 py-0.5 rounded-full text-xs font-medium capitalize ${style.pill}`}>
                      {s.streak_type}
                    </span>
                  </div>
                </td>

                {/* Streak type badge — hidden on mobile (shown inline above) */}
                <td className="px-5 py-3.5 hidden sm:table-cell">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${style.pill}`}>
                    {s.streak_type}
                  </span>
                </td>

                {/* Length + bar */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-3">
                    <div className="w-20 bg-gray-800 rounded-full h-1.5 hidden md:block overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all ${style.bar}`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    <span className={`font-bold tabular-nums text-base w-6 text-right ${isFirst ? 'text-yellow-400' : 'text-white'}`}>
                      {s.length}
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default StreakTable
