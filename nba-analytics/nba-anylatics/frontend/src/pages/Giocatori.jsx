import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { api } from '../services/api'

export default function Giocatori() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [inputVal, setInputVal] = useState('')

  useEffect(() => {
    setLoading(true)
    api.players(search)
      .then(setPlayers)
      .finally(() => setLoading(false))
  }, [search])

  function handleSearch(e) {
    e.preventDefault()
    setSearch(inputVal)
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="page">
        <h1 className="page-title">Giocatori <span>NBA</span></h1>

        <form className="search-wrap" onSubmit={handleSearch}>
          <input
            className="input" placeholder="Cerca giocatore o squadra..."
            value={inputVal} onChange={e => setInputVal(e.target.value)}
            style={{ maxWidth: 360 }}
          />
          <button className="btn btn-primary" type="submit">Cerca</button>
          {search && (
            <button className="btn btn-secondary" type="button" onClick={() => { setSearch(''); setInputVal('') }}>
              Reset
            </button>
          )}
        </form>

        <div className="card">
          {loading && <div className="loader"><div className="spinner" /> Caricamento...</div>}
          {!loading && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Giocatore</th>
                    <th>Ruolo</th>
                    <th>Team</th>
                    <th>PPG</th>
                    <th>RPG</th>
                    <th>APG</th>
                    <th>FG%</th>
                  </tr>
                </thead>
                <tbody>
                  {players.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
                      Nessun giocatore trovato
                    </td></tr>
                  )}
                  {players.map((p, i) => (
                    <tr key={p.id}>
                      <td><span className="rank">#{i + 1}</span></td>
                      <td style={{ fontWeight: 600 }}>{p.first_name} {p.last_name}</td>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: 'var(--muted)' }}>
                          {p.position || '—'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{p.team_name || '—'}</td>
                      <td><span className="highlight" style={{ fontFamily: 'JetBrains Mono' }}>{Number(p.ppg).toFixed(1)}</span></td>
                      <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--blue)' }}>{Number(p.rpg).toFixed(1)}</td>
                      <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent2)' }}>{Number(p.apg).toFixed(1)}</td>
                      <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>{Number(p.fg_pct).toFixed(1)}%</td>
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