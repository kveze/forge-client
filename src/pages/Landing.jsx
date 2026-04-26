import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Landing.module.css'

const STEPS = [
  { num: '01', title: 'Расскажи о себе', desc: 'Пол, вес, возраст, цель, оборудование. Займёт 2 минуты.' },
  { num: '02', title: 'AI строит план', desc: 'Нейросеть анализирует твои данные и создаёт программу под тебя — не под среднего человека.' },
  { num: '03', title: 'Получаешь всё', desc: 'Программа тренировок на неделю + советы по питанию и восстановлению под твой план.' },
]

const FEATURES = [
  { icon: '⚡', title: 'Под тебя, не под всех', desc: 'Учитывает твой уровень, оборудование, травмы и цели. Никаких шаблонов.' },
  { icon: '🥩', title: 'Питание под тренировки', desc: 'Советы что есть в дни тренировок и дни отдыха. Конкретно, без воды.' },
  { icon: '🔄', title: 'Восстановление', desc: 'Режим сна, работа с мышечной болью, что делать в дни отдыха.' },
  { icon: '💾', title: 'Сохраняй и возвращайся', desc: 'План хранится в аккаунте. Зашёл — вспомнил — пошёл тренироваться.' },
]

const REVIEWS = [
  { name: 'Артём К.', age: 23, text: 'Наконец-то план который реально учитывает что у меня только турник во дворе. Неделю уже делаю — огонь.' },
  { name: 'Даша М.', age: 19, text: 'Ожидала что будет очередная фигня из интернета. Нет, советы по питанию прям конкретные, не "ешьте больше белка".' },
  { name: 'Никита Р.', age: 27, text: 'Попробовал на спор с другом. Теперь у нас обоих план отсюда. Дизайн тоже топ.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>FOR<span>G</span>E</div>
        <div className={styles.headerRight}>
          {!loading && (
            user
              ? <>
                  <button className={styles.ghostBtn} onClick={() => navigate('/dashboard')}>МОИ ПЛАНЫ</button>
                  <button className={styles.redBtn} onClick={() => navigate('/generate')}>СОЗДАТЬ ПЛАН</button>
                </>
              : <>
                  <button className={styles.ghostBtn} onClick={() => navigate('/login')}>ВОЙТИ</button>
                  <button className={styles.redBtn} onClick={() => navigate('/register')}>РЕГИСТРАЦИЯ</button>
                </>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroTag}>// ПЕРСОНАЛЬНЫЙ AI ТРЕНЕР</div>
          <h1 className={styles.heroTitle}>
            ТВОЙ<br />
            ПЕРСО<em>НАЛЬ</em><br />
            НЫЙ<br />
            <em>ПЛАН</em>
          </h1>
          <p className={styles.heroSub}>
            Не шаблон из интернета. Не план для среднего человека.<br />
            Программа строится под ТЕБЯ, твои цели и то что есть под рукой.
          </p>
          <button className={styles.heroCta} onClick={() => navigate('/generate')}>
            СОЗДАТЬ МОЙ ПЛАН →
          </button>
          <div className={styles.heroStats}>
            <div className={styles.stat}><div className={styles.statVal}>AI Powered</div><div className={styles.statLabel}>Под тебя лично</div></div>
            <div className={styles.statDiv} />
            <div className={styles.stat}><div className={styles.statVal}>∞</div><div className={styles.statLabel}>Вариаций планов</div></div>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.previewCard}>
            <div className={styles.previewTag}>// ПРИМЕР ПЛАНА</div>
            <div className={styles.previewDay}>Понедельник</div>
            <div className={styles.previewItem}>Отжимания — 4 × 15</div>
            <div className={styles.previewItem}>Подтягивания — 4 × 8</div>
            <div className={styles.previewItem}>Брусья — 3 × 12</div>
            <div className={styles.previewItem}>Планка — 3 × 60 сек</div>
            <div className={styles.previewDay} style={{ marginTop: 16 }}>Среда</div>
            <div className={styles.previewItem}>Приседания — 4 × 20</div>
            <div className={styles.previewItem}>Выпады — 3 × 15</div>
            <div className={styles.previewItem}>Отжимания узкие — 3 × 12</div>
            <div className={styles.previewBlur} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionTag}>// КАК ЭТО РАБОТАЕТ</div>
          <h2 className={styles.sectionTitle}>ТРИ ШАГА<br /><em>ДО РЕЗУЛЬТАТА</em></h2>
          <div className={styles.stepsGrid}>
            {STEPS.map(s => (
              <div key={s.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.num}</div>
                <div className={styles.stepTitle}>{s.title}</div>
                <div className={styles.stepDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionTag}>// ОТЗЫВЫ</div>
          <h2 className={styles.sectionTitle}>ЧТО<br /><em>ГОВОРЯТ</em></h2>
          <div className={styles.reviewsGrid}>
            {REVIEWS.map(r => (
              <div key={r.name} className={styles.reviewCard}>
                <div className={styles.reviewText}>"{r.text}"</div>
                <div className={styles.reviewAuthor}>
                  <div className={styles.reviewName}>{r.name}</div>
                  <div className={styles.reviewAge}>{r.age} лет</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>ХВАТИТ<br /><em>ОТКЛАДЫВАТЬ</em></h2>
          <p className={styles.ctaSub}>Твой план готов за 30 секунд. Бесплатно.</p>
          <button className={styles.heroCta} onClick={() => navigate('/generate')}>
            СОЗДАТЬ МОЙ ПЛАН →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>FOR<span>G</span>E</div>
        <div className={styles.footerText}>© 2026 Forge. Все права защищены.</div>
      </footer>

    </div>
  )
}
