function StreakTable({ streaks }) {
  if (!streaks || !Array.isArray(streaks) || streaks.length === 0) {
    return <p className="text-gray-500">No streaks available.</p>
  }

  return (
    <table className="w-full bg-white rounded shadow text-left">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Entity Type</th>
          <th className="px-4 py-2">Sport</th>
          <th className="px-4 py-2">Streak Type</th>
          <th className="px-4 py-2">Length</th>
        </tr>
      </thead>
      <tbody>
        {streaks.map((s, i) => (
          <tr key={i} className="border-t">
            <td className="px-4 py-2">{s.name}</td>
            <td className="px-4 py-2">{s.entity_type}</td>
            <td className="px-4 py-2">{s.sport}</td>
            <td className="px-4 py-2">{s.streak_type}</td>
            <td className="px-4 py-2">{s.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default StreakTable
