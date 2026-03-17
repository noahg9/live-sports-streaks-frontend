import { useState, useEffect } from 'react'
import StreakTable from './components/StreakTable'

function App() {
  const [streaks, setStreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Live Sports Streaks</h1>
      <StreakTable streaks={streaks} />
    </div>
  )
}

export default App
