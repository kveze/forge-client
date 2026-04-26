import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Auth.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (e) {
      const msgs = {
        'auth/user-not-found': 'Пользователь не найден',
        'auth/wrong-password': 'Неверный пароль',
        'auth/invalid-email': 'Неверный email',
        'auth/invalid-credential': 'Неверный email или пароль',
      }
      setError(msgs[e.code] || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div className={styles.page}>
      <div className={styles.logo}>FOR<span>G</span>E</div>
      <div className={styles.card}>
        <div className={styles.title}>ВОЙТИ</div>
        <div className={styles.subtitle}>// ДОБРО ПОЖАЛОВАТЬ ОБРАТНО</div>

        <div className={styles.field}>
          <div className={styles.label}>Email</div>
          <input
            className={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Пароль</div>
          <input
            className={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <button className={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'ВХОДИМ...' : 'ВОЙТИ'}
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.link}>
          Нет аккаунта?
          <Link to="/register">Создать</Link>
        </div>
      </div>
    </div>
  )
}
