import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Auth.module.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) return
    if (password !== confirm) { setError('Пароли не совпадают'); return }
    if (password.length < 6) { setError('Пароль минимум 6 символов'); return }

    setLoading(true)
    setError('')
    try {
      await register(email, password)
      navigate('/')
    } catch (e) {
      const msgs = {
        'auth/email-already-in-use': 'Email уже используется',
        'auth/invalid-email': 'Неверный email',
        'auth/weak-password': 'Слишком слабый пароль',
      }
      setError(msgs[e.code] || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.logo}>FOR<span>G</span>E</div>
      <div className={styles.card}>
        <div className={styles.title}>РЕГИСТРАЦИЯ</div>
        <div className={styles.subtitle}>// СОЗДАЙ СВОЙ АККАУНТ</div>

        <div className={styles.field}>
          <div className={styles.label}>Email</div>
          <input
            className={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Пароль</div>
          <input
            className={styles.input}
            type="password"
            placeholder="минимум 6 символов"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Повтори пароль</div>
          <input
            className={styles.input}
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
        </div>

        <button className={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'СОЗДАЁМ...' : 'СОЗДАТЬ АККАУНТ'}
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.link}>
          Уже есть аккаунт?
          <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  )
}
