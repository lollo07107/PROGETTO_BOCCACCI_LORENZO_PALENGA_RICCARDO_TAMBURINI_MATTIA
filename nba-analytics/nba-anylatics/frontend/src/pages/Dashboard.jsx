import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../services/api'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.dashboard()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="layout">
      <Navbar />
      <main className="page">
        <h1 className="page-title">Dashboard <span>NBA 2024–25</span></h1>

        {loading && <div className="loader"><div className="spinner" /> Caricamento...</div>}
        {error && <div className="error-msg" style={{ textAlign: 'left', marginBottom: 20 }}>⚠ {error}</div>}

        {data && (
          <>
            {/* Stats Row */}
            <div className="stat-grid">
              <div className="stat-card orange">
                <div className="stat-label">Team totali</div>
                <div className="stat-value">{data.totalTeams}</div>
              </div>
              <div className="stat-card gold">
                <div className="stat-label">Giocatori</div>
                <div className="stat-value">{data.totalPlayers}</div>
              </div>
              <div className="stat-card blue">
                <div className="stat-label">Partite giocate</div>
                <div className="stat-value">{data.totalGames}</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">Media PPG lega</div>
                <div className="stat-value">{data.avgPpg}</div>
              </div>
            </div>

            {/* Two columns */}
            <div className="grid-2">
              {/* Recent Games */}
              <div className="card">
                <h2 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
                  Ultime partite
                </h2>
                {data.recentGames.length === 0 && (
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Nessuna partita disponibile</div>
                )}
                {data.recentGames.map(g => {
                  const homeWin = g.home_score > g.away_score
                  return (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                          <span className={homeWin ? 'score-w' : 'score-l'}>{g.home_team}</span>
                          <span style={{ color: 'var(--muted)', margin: '0 8px', fontSize: '0.8rem' }}>vs</span>
                          <span className={!homeWin ? 'score-w' : 'score-l'}>{g.away_team}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                          {new Date(g.game_date).toLocaleDateString('it-IT')}
                        </div>
                      </div>
                      <div className="score-cell">
                        <span className={homeWin ? 'score-w' : 'score-l'}>{g.home_score}</span>
                        <span style={{ color: 'var(--muted)', margin: '0 4px' }}>–</span>
                        <span className={!homeWin ? 'score-w' : 'score-l'}>{g.away_score}</span>
                      </div>
                    </div>
                  )
                })}
                <Link to="/partite" style={{ display: 'block', marginTop: 14, fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>
                  Vedi tutte →
                </Link>
              </div>

              {/* Top Teams */}
              <div className="card">
                <h2 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
                  Top 5 team
                </h2>
                {data.topTeams.map((t, i) => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span className="rank" style={{ width: 20 }}>#{i + 1}</span>
                    <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{t.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{t.wins}W – {t.losses}L</span>
                    <span className="highlight" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
                      {t.win_pct}%
                    </span>
                  </div>
                ))}
                <Link to="/classifica" style={{ display: 'block', marginTop: 14, fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>
                  Classifica completa →
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}