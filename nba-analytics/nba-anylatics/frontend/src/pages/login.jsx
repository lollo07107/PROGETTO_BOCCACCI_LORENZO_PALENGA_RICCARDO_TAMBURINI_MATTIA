import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login(email, password)
      localStorage.setItem('nba_token', data.token)
      localStorage.setItem('nba_user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">NBA Analytics</div>
        <div className="auth-subtitle">Accedi alla piattaforma</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="input" type="email" placeholder="tua@email.com"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          <button
            className="btn btn-primary" type="submit"
            disabled={loading} style={{ width: '100%', marginTop: 20 }}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div className="auth-footer">
          Non hai un account? <Link to="/register">Registrati</Link>
        </div>
      </div>
    </div>
  )
}