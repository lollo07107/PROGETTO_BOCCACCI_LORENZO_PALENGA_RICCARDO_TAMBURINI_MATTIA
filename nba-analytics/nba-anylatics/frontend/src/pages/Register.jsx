import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handle(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.register(form.username, form.email, form.password)
      navigate('/login')
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
        <div className="auth-subtitle">Crea il tuo account</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="input" placeholder="il tuo nickname"
              value={form.username} onChange={handle('username')} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="input" type="email" placeholder="tua@email.com"
              value={form.email} onChange={handle('email')} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={handle('password')} required minLength={6}
            />
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          <button
            className="btn btn-primary" type="submit"
            disabled={loading} style={{ width: '100%', marginTop: 20 }}
          >
            {loading ? 'Registrazione...' : 'Registrati'}
          </button>
        </form>

        <div className="auth-footer">
          Hai già un account? <Link to="/login">Accedi</Link>
        </div>
      </div>
    </div>
  )
}