import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { api } from '../services/api'

export default function Predizione() {
  const [teams, setTeams] = useState([])
  const [homeId, setHomeId] = useState('')
  const [awayId, setAwayId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.teams().then(setTeams)
  }, [])

  async function handlePredict(e) {
    e.preventDefault()
    setError(''); setResult(null); setLoading(true)
    try {
      const data = await api.predict(homeId, awayId)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="page">
        <h1 className="page-title">Predizione <span>Partita</span></h1>

        <div className="predict-box">
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 24 }}>
            Seleziona due squadre per stimare la probabilità di vittoria basata sulle loro performance stagionali.
          </p>

          <form onSubmit={handlePredict}>
            <div className="grid-2" style={{ alignItems: 'center', gap: 16 }}>
              <div>
                <label className="form-label">🏠 Squadra Casa</label>
                <select
                  className="input" value={homeId} onChange={e => setHomeId(e.target.value)} required
                >
                  <option value="">Seleziona...</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">✈️ Squadra Ospite</label>
                <select
                  className="input" value={awayId} onChange={e => setAwayId(e.target.value)} required
                >
                  <option value="">Seleziona...</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="vs-badge">VS</div>

            {error && <div className="error-msg" style={{ marginBottom: 12 }}>⚠ {error}</div>}

            <button
              className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Calcolo in corso...' : '🎯 Calcola Predizione'}
            </button>
          </form>

          {result && (
            <div className="result-box">
              <h3 style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>
                Risultato Predizione
              </h3>

              <div className="prob-bar-wrap">
                <div className="prob-bar-label">
                  <span>{result.homeTeam}</span>
                  <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                    {result.homeWinProb}%
                  </span>
                </div>
                <div className="prob-bar-bg">
                  <div className="prob-bar-fill home" style={{ width: `${result.homeWinProb}%` }} />
                </div>
              </div>

              <div className="prob-bar-wrap">
                <div className="prob-bar-label">
                  <span>{result.awayTeam}</span>
                  <span style={{ color: 'var(--blue)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                    {result.awayWinProb}%
                  </span>
                </div>
                <div className="prob-bar-bg">
                  <div className="prob-bar-fill away" style={{ width: `${result.awayWinProb}%` }} />
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.78rem', color: 'var(--muted)' }}>
                Probabilità pareggio: {result.drawProb}%
              </div>

              <div className="winner-label">
                🏆 Vincitore atteso: {result.predictedWinner}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}