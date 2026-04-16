import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('nba_user') || '{}')

  function logout() {
    localStorage.removeItem('nba_token')
    localStorage.removeItem('nba_user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <div className="navbar-logo">NBA</div>
        <div>
          <div className="navbar-title">Analytics Platform</div>
          <span className="navbar-subtitle">POWERED BY BALLDONTLIE.IO</span>
        </div>
      </NavLink>

      <div className="navbar-nav">
        <NavLink to="/" end className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
          🏠 Home
        </NavLink>
        <NavLink to="/classifica" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
          📊 Classifica
        </NavLink>
        <NavLink to="/giocatori" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
          👤 Giocatori
        </NavLink>
        <NavLink to="/partite" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
          🗓 Partite
        </NavLink>
        <NavLink to="/predizione" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
          🎯 Predizione
        </NavLink>
      </div>

      <div className="navbar-right">
        <span className="season-badge">● Stagione 2024–25</span>
        {user.username && <span style={{color:'#8fa3b8', fontSize:'0.82rem'}}>👤 {user.username}</span>}
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  )
}