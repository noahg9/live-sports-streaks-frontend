import { useState, useEffect } from 'react'
import StreakTable from './components/StreakTable'

function App() {
  const [streaks, setStreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

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

  if (loading) return <div className="p-8 text-gray-600">Loading streaks...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  const sports = [...new Set(streaks.filter(s => s.sport).map(s => s.sport))].sort()
  const filteredStreaks = activeTab === 'all' ? streaks : streaks.filter(s => s.sport === activeTab)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Live Sports Streaks</h1>

      <div role="tablist" className="flex gap-2 mb-4 border-b border-gray-300">
        {['all', ...sports].map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'all' ? 'All Sports' : tab}
          </button>
        ))}
      </div>

      <StreakTable streaks={filteredStreaks} />
    </div>
  )
}

export default App
