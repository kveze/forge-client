import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '3px', fontSize: '12px' }}>
      ЗАГРУЗКА...
    </div>
  )

  return user ? children : <Navigate to="/login" replace />
}
