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
  const [activeLeague, setActiveLeague] = useState('all')
  const [activeStreakType, setActiveStreakType] = useState('all')
  const [search, setSearch] = useState('')
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
        // Use the most recent last_updated timestamp from the streaks themselves
        const timestamps = data.map(s => s.last_updated).filter(Boolean)
        if (timestamps.length > 0) {
          setLastUpdated(new Date(timestamps.sort().at(-1)))
        }
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

  // Filter by sport tab
  const bySport = activeTab === 'all'
    ? activeStreaks
    : activeStreaks.filter(s => s.sport === activeTab)

  // Leagues available for the current sport tab
  const leagues = [...new Set(bySport.filter(s => s.league).map(s => s.league))].sort()

  // Reset league + streak type selection when sport tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setActiveLeague('all')
    setActiveStreakType('all')
  }

  // Streak types present in the current sport/league selection (before streak type filter)
  const streakTypes = [...new Set(bySport.filter(s => s.streak_type).map(s => s.streak_type))].sort()

  // Filter by league, streak type, then search
  const filtered = bySport
    .filter(s => activeLeague === 'all' || s.league === activeLeague)
    .filter(s => activeStreakType === 'all' || s.streak_type === activeStreakType)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))

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
            {lastUpdated && <> · Last fetched {lastUpdated.toLocaleString()}</>}
          </p>
        </div>

        {/* Sport tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
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
                onClick={() => handleTabChange(tab)}
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

        {/* Streak type toggle — only shown when both win + unbeaten exist */}
        {streakTypes.length > 1 && (
          <div className="flex gap-2 mb-4">
            {['all', 'win', 'unbeaten'].map(type => {
              const isActive = activeStreakType === type
              const label = type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)
              return (
                <button
                  key={type}
                  onClick={() => setActiveStreakType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? type === 'unbeaten'
                        ? 'bg-blue-600/30 text-blue-300 ring-1 ring-blue-500'
                        : type === 'win'
                        ? 'bg-emerald-600/30 text-emerald-300 ring-1 ring-emerald-500'
                        : 'bg-gray-700 text-white'
                      : 'bg-gray-800/50 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}

        {/* League filter + search row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {leagues.length > 0 && (
            <select
              value={activeLeague}
              onChange={e => setActiveLeague(e.target.value)}
              className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
            >
              <option value="all">All Leagues</option>
              {leagues.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          )}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-gray-300 text-sm rounded-lg pl-9 pr-4 py-2 border border-white/10 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <StreakTable streaks={sorted} maxLength={maxLength} />
      </div>
    </div>
  )
}

export default App
