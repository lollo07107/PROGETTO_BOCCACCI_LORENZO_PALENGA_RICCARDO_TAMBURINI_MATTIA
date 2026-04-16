import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { api } from '../services/api'

export default function Partite() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    api.games(filter)
      .then(setGames)
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div className="layout">
      <Navbar />
      <main className="page">
        <h1 className="page-title">Partite <span>& Risultati</span></h1>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { val: '', label: 'Tutte' },
            { val: 'final', label: '✅ Giocate' },
            { val: 'scheduled', label: '🗓 Programmate' },
          ].map(opt => (
            <button
              key={opt.val}
              className={`btn ${filter === opt.val ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(opt.val)}
              style={{ fontSize: '0.82rem', padding: '6px 16px' }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="card">
          {loading && <div className="loader"><div className="spinner" /> Caricamento...</div>}
          {!loading && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Casa</th>
                    <th>Ospite</th>
                    <th>Risultato</th>
                    <th>Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {games.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
                      Nessuna partita trovata
                    </td></tr>
                  )}
                  {games.map(g => {
                    const homeWin = g.status === 'final' && g.home_score > g.away_score
                    return (
                      <tr key={g.id}>
                        <td style={{ color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'JetBrains Mono' }}>
                          {new Date(g.game_date).toLocaleDateString('it-IT')}
                        </td>
                        <td style={{ fontWeight: 600, color: homeWin ? 'var(--success)' : 'var(--text)' }}>
                          {g.home_team}
                        </td>
                        <td style={{ fontWeight: 600, color: !homeWin && g.status === 'final' ? 'var(--success)' : 'var(--text)' }}>
                          {g.away_team}
                        </td>
                        <td className="score-cell">
                          {g.status === 'final'
                            ? <><span className={homeWin ? 'score-w' : 'score-l'}>{g.home_score}</span> – <span className={!homeWin ? 'score-w' : 'score-l'}>{g.away_score}</span></>
                            : <span style={{ color: 'var(--muted)' }}>—</span>
                          }
                        </td>
                        <td>
                          <span className={`badge badge-${g.status}`}>
                            {g.status === 'final' ? 'Finale' : 'Programmata'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}