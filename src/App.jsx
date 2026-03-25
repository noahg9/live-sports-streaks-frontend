import { useState, useEffect } from 'react'
import StreakTable from './components/StreakTable'

const SPORT_LABELS = {
  american_football: 'American Football',
  mma:               'MMA',
  nba:               'NBA',
  afl:               'AFL',
}

const SPORT_ICONS = {
  football:          '⚽',
  basketball:        '🏀',
  baseball:          '⚾',
  hockey:            '🏒',
  rugby:             '🏉',
  volleyball:        '🏐',
  handball:          '🤾',
  american_football: '🏈',
  tennis:            '🎾',
  mma:               '🥊',
}

function App() {
  const [streaks, setStreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [activeLeague, setActiveLeague] = useState('all')
  const [activeStreakType, setActiveStreakType] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''
    fetch(`${apiBase}/streaks`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setStreaks(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 font-medium">Failed to load streaks</p>
        <p className="text-gray-600 text-sm mt-1">{error}</p>
      </div>
    </div>
  )

  const activeStreaks = streaks.filter(s => s.length > 0)
  const sports = [...new Set(activeStreaks.filter(s => s.sport).map(s => s.sport))].sort()

  const bySport = activeTab === 'all'
    ? activeStreaks
    : activeStreaks.filter(s => s.sport === activeTab)

  const leagueCounts = bySport.reduce((acc, s) => {
    if (s.league) acc[s.league] = (acc[s.league] ?? 0) + 1
    return acc
  }, {})
  const leagues = Object.keys(leagueCounts).filter(l => leagueCounts[l] >= 3).sort()

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setActiveLeague('all')
    setActiveStreakType('all')
  }

  const streakTypes = [...new Set(bySport.filter(s => s.streak_type).map(s => s.streak_type))].sort()

  const filtered = bySport
    .filter(s => activeLeague === 'all' || s.league === activeLeague)
    .filter(s => activeStreakType === 'all' || s.streak_type === activeStreakType)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))

  const sorted = [...filtered].sort((a, b) => b.length - a.length)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">🔥 Sports Streaks</h1>
          <p className="text-gray-500 text-sm mt-1">Longest active winning &amp; unbeaten runs</p>
        </div>

        {/* Sport tabs */}
        <div className="flex flex-wrap gap-x-1 gap-y-1 mb-5 border-b border-white/8 pb-4">
          {['all', ...sports].map(tab => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {SPORT_ICONS[tab] && <span className="text-base">{SPORT_ICONS[tab]}</span>}
                <span>{tab === 'all' ? 'All' : SPORT_LABELS[tab] ?? tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </button>
            )
          })}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 mb-5">
          {/* Streak type */}
          {streakTypes.length > 1 && (
            <div className="flex rounded-lg overflow-hidden border border-white/8">
              {['all', 'win', 'unbeaten'].map(type => {
                const isActive = activeStreakType === type
                return (
                  <button
                    key={type}
                    onClick={() => setActiveStreakType(type)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                )
              })}
            </div>
          )}

          {/* League */}
          {leagues.length > 0 && (
            <select
              value={activeLeague}
              onChange={e => setActiveLeague(e.target.value)}
              className="bg-gray-900 text-gray-400 text-xs rounded-lg px-3 py-1.5 border border-white/8 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="all">All Leagues</option>
              {leagues.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          )}

          {/* Search */}
          <div className="relative flex-1 min-w-40">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-900 text-gray-300 text-xs rounded-lg pl-8 pr-4 py-1.5 border border-white/8 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">×</button>
            )}
          </div>
        </div>

        <StreakTable streaks={sorted} />
      </div>
    </div>
  )
}

export default App
