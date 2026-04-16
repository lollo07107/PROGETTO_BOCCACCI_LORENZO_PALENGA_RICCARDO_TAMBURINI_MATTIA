import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { api } from '../services/api'

export default function Classifica() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.teams()
      .then(setTeams)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? teams : teams.filter(t => t.conference === filter)

  return (
    <div className="layout">
      <Navbar />
      <main className="page">
        <h1 className="page-title">Classifica <span>Stagione</span></h1>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['ALL', 'East', 'West'].map(c => (
            <button
              key={c}
              className={`btn ${filter === c ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(c)}
              style={{ fontSize: '0.82rem', padding: '6px 16px' }}
            >
              {c === 'ALL' ? 'Tutte' : `Conference ${c}`}
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
                    <th>#</th>
                    <th>Team</th>
                    <th>Conference</th>
                    <th>Città</th>
                    <th>V</th>
                    <th>S</th>
                    <th>Win %</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <tr key={t.id}>
                      <td><span className="rank">#{i + 1}</span></td>
                      <td style={{ fontWeight: 600 }}>{t.name}</td>
                      <td>
                        <span className={`badge badge-${t.conference?.toLowerCase()}`}>
                          {t.conference}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{t.city}</td>
                      <td style={{ color: 'var(--success)', fontFamily: 'JetBrains Mono' }}>{t.wins}</td>
                      <td style={{ color: '#f87171', fontFamily: 'JetBrains Mono' }}>{t.losses}</td>
                      <td>
                        <span className="highlight" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>
                          {t.win_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}