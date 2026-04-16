import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Classifica from './pages/Classifica'
import Giocatori from './pages/Giocatori'
import Partite from './pages/Partite'
import Predizione from './pages/Predizione'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/classifica" element={<ProtectedRoute><Classifica /></ProtectedRoute>} />
        <Route path="/giocatori" element={<ProtectedRoute><Giocatori /></ProtectedRoute>} />
        <Route path="/partite" element={<ProtectedRoute><Partite /></ProtectedRoute>} />
        <Route path="/predizione" element={<ProtectedRoute><Predizione /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}