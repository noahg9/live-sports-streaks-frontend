import { useState, useEffect } from 'react'
import StreakTable from './components/StreakTable'

const SPORT_ICONS = {
  football: '⚽',
  basketball: '🏀',
  baseball: '⚾',
  hockey: '🏒',
  rugby: '🏉',
  volleyball: '🏐',
  handball: '🤾',
  tennis: '🎾',
  mma: '🥊',
}

function App() {
  const [streaks, setStreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''
    fetch(`${apiBase}/streaks`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setStreaks(data)
        setLastUpdated(new Date())
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading streaks...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-lg font-semibold">Failed to load streaks</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
      </div>
    </div>
  )

  const activeStreaks = streaks.filter(s => s.length > 0)
  const sports = [...new Set(activeStreaks.filter(s => s.sport).map(s => s.sport))].sort()
  const filtered = activeTab === 'all'
    ? activeStreaks
    : activeStreaks.filter(s => s.sport === activeTab)
  const sorted = [...filtered].sort((a, b) => b.length - a.length)
  const maxLength = sorted.length > 0 ? sorted[0].length : 0

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Live Data</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Sports Streaks</h1>
          <p className="text-gray-400 text-sm mt-2">
            {activeStreaks.length} active streak{activeStreaks.length !== 1 ? 's' : ''} across {sports.length} sport{sports.length !== 1 ? 's' : ''}
            {lastUpdated && <> · {lastUpdated.toLocaleTimeString()}</>}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {['all', ...sports].map(tab => {
            const count = tab === 'all'
              ? activeStreaks.length
              : activeStreaks.filter(s => s.sport === tab).length
            const icon = SPORT_ICONS[tab]
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {icon && <span>{icon}</span>}
                <span>{tab === 'all' ? 'All Sports' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                <span className={`text-xs ${isActive ? 'text-blue-200' : 'text-gray-600'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Table */}
        <StreakTable streaks={sorted} maxLength={maxLength} />
      </div>
    </div>
  )
}

export default App
