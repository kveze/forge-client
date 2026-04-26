import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { generatePlan, generateTips, generateRecovery } from '../api/forge'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import styles from './Generate.module.css'

const GOALS = ['Набор массы', 'Сила', 'Рельеф', 'Выносливость', 'Похудение']
const LEVELS = ['Новичок', 'Средний', 'Продвинутый']
const EQUIPMENT_LIST = ['Только тело', 'Турник', 'Брусья', 'Гантели', 'Штанга', 'Скакалка', 'Тренажёры']
const DAYS_LABEL = ['','ДЕНЬ','ДНЯ','ДНЯ','ДНЯ','ДНЕЙ','ДНЕЙ','ДНЕЙ']

const DAYS_RU = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье']

function highlight(text) {
  if (!text) return null
  let result = text
  DAYS_RU.forEach(d => { result = result.replaceAll(d, `§§${d}§§`) })
  return result.split(/(§§.*?§§)/g).map((part, i) => {
    if (part.startsWith('§§')) return <span key={i} className={styles.dayHighlight}>{part.replace(/§§/g, '')}</span>
    return part
  })
}

function TipItem({ text }) {
  // Parse "1. Текст совета" into number + text
  const match = text.match(/^(\d+)\.\s*(.+)/)
  if (!match) return <div className={styles.tipItem}>{text}</div>
  return (
    <div className={styles.tipItem}>
      <span className={styles.tipNum}>{match[1]}</span>
      <span>{match[2]}</span>
    </div>
  )
}

export default function Generate() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    gender: null,
    age: '', height: '', weight: '',
    goal: null, level: null,
    equipment: ['Только тело'],
    days: 4,
    freeText: ''
  })

  const [plan, setPlan] = useState(null)
  const [tips, setTips] = useState(null)
  const [recovery, setRecovery] = useState(null)
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [loadingWellness, setLoadingWellness] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleEquip = (val) => {
    setForm(f => ({
      ...f,
      equipment: f.equipment.includes(val)
        ? f.equipment.filter(e => e !== val)
        : [...f.equipment, val]
    }))
  }

  const handleGenerate = async () => {
    if (!form.gender || !form.age || !form.weight || !form.goal || !form.level) return

    setLoadingPlan(true)
    setPlan(null)
    setTips(null)
    setRecovery(null)
    setShowBanner(false)
    setSaved(false)

    const payload = {
      gender: form.gender,
      age: form.age,
      height: form.height || 'не указан',
      weight: form.weight,
      goal: form.goal,
      level: form.level,
      equipment: form.equipment.join(', '),
      days: form.days,
      freeText: form.freeText
    }

    try {
      const res = await generatePlan(payload)
      const generatedPlan = res.plan
      setPlan(generatedPlan)
      setShowBanner(!user)

      if (user) {
        setLoadingWellness(true)
        Promise.all([
          generateTips({ ...payload, plan: generatedPlan }),
          generateRecovery(payload)
        ]).then(([t, r]) => {
          setTips(t.tips)
          setRecovery(r.plan)
        }).finally(() => setLoadingWellness(false))
      }
    } catch (e) {
      setPlan('Ошибка: запусти node server.js')
    } finally {
      setLoadingPlan(false)
    }
  }

  const handleSave = async () => {
    if (!user) { navigate('/login'); return }
    setSaveLoading(true)

    const payload = {
      gender: form.gender, age: form.age,
      height: form.height || 'не указан',
      weight: form.weight, goal: form.goal,
      level: form.level, equipment: form.equipment.join(', '),
      days: form.days
    }

    try {
      // Generate tips+recovery if not yet done
      let finalTips = tips
      let finalRecovery = recovery

      if (!finalTips || !finalRecovery) {
        setLoadingWellness(true)
        const [t, r] = await Promise.all([
          generateTips({ ...payload, plan }),
          generateRecovery(payload)
        ])
        finalTips = t.tips
        finalRecovery = r.plan
        setTips(finalTips)
        setRecovery(finalRecovery)
        setLoadingWellness(false)
      }

      await setDoc(doc(db, 'plans', user.uid), {
        plan, tips: finalTips, recovery: finalRecovery,
        form, createdAt: new Date().toISOString()
      })
      setSaved(true)
      setShowBanner(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSaveLoading(false)
    }
  }

  const ready = form.gender && form.age && form.weight && form.goal && form.level

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate('/')}>FOR<span>G</span>E</div>
        <div className={styles.headerRight}>
          {user
            ? <><span className={styles.email}>{user.email}</span><button className={styles.ghostBtn} onClick={() => navigate('/dashboard')}>МОИ ПЛАНЫ</button></>
            : <><button className={styles.ghostBtn} onClick={() => navigate('/login')}>ВОЙТИ</button><button className={styles.redBtn} onClick={() => navigate('/register')}>РЕГИСТРАЦИЯ</button></>
          }
        </div>
      </header>

      <div className={styles.body}>

        {/* FORM */}
        <div className={styles.formCol}>
          <div className={styles.sectionLabel}>// РАССКАЖИ О СЕБЕ</div>
          <div className={styles.headline}>СОЗДАЙ<br /><em>ПЛАН</em></div>

          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>ПОЛ</div>
            <div className={styles.btnRow}>
              {['Мужчина','Женщина'].map(g => (
                <button key={g} className={`${styles.chip} ${form.gender === g ? styles.chipActive : ''}`} onClick={() => set('gender', g)}>{g}</button>
              ))}
            </div>
          </div>

          <div className={styles.numRow}>
            {[
              { label: 'ВОЗРАСТ', key: 'age', placeholder: '20', unit: 'лет' },
              { label: 'ВЕС', key: 'weight', placeholder: '70', unit: 'кг' },
              { label: 'РОСТ', key: 'height', placeholder: '175', unit: 'см' },
            ].map(f => (
              <div key={f.key} className={styles.numField}>
                <div className={styles.fieldLabel}>{f.label}</div>
                <div className={styles.numInputWrap}>
                  <input className={styles.numInput} type="number" placeholder={f.placeholder} value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
                  <span className={styles.numUnit}>{f.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>ЦЕЛЬ</div>
            <div className={styles.btnRow}>
              {GOALS.map(g => (
                <button key={g} className={`${styles.chip} ${form.goal === g ? styles.chipActive : ''}`} onClick={() => set('goal', g)}>{g.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>УРОВЕНЬ</div>
            <div className={styles.btnRow}>
              {LEVELS.map(l => (
                <button key={l} className={`${styles.chip} ${form.level === l ? styles.chipActive : ''}`} onClick={() => set('level', l)}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>ОБОРУДОВАНИЕ</div>
            <div className={styles.btnRow}>
              {EQUIPMENT_LIST.map(e => (
                <button key={e} className={`${styles.chip} ${form.equipment.includes(e) ? styles.chipActive : ''}`} onClick={() => toggleEquip(e)}>{e.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>ДНЕЙ В НЕДЕЛЮ — <span className={styles.daysVal}>{form.days} {DAYS_LABEL[form.days]}</span></div>
            <input type="range" min={2} max={7} value={form.days} onChange={e => set('days', +e.target.value)} />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>РАССКАЖИ БОЛЬШЕ (необязательно)</div>
            <textarea className={styles.textarea} placeholder="Травмы, особенности, предпочтения, упражнения которые хочешь или не хочешь..." value={form.freeText} onChange={e => set('freeText', e.target.value)} rows={3} />
          </div>

          <button className={styles.generateBtn} onClick={handleGenerate} disabled={!ready || loadingPlan}>
            {loadingPlan ? 'ГЕНЕРАЦИЯ...' : 'СОЗДАТЬ ПЛАН →'}
          </button>
        </div>

        {/* RESULTS */}
        <div className={styles.resultCol}>

          {showBanner && (
            <div className={styles.banner}>
              <div className={styles.bannerClose} onClick={() => setShowBanner(false)}>✕</div>
              <div className={styles.bannerTitle}>ПЛАН ГОТОВ!</div>
              <div className={styles.bannerText}>Войдите чтобы сохранить план и получить персональные советы по питанию и восстановлению.</div>
              <div className={styles.bannerBtns}>
                <button className={styles.bannerBtnRed} onClick={() => navigate('/login')}>ВОЙТИ</button>
                <button className={styles.bannerBtnGhost} onClick={() => navigate('/register')}>РЕГИСТРАЦИЯ</button>
              </div>
            </div>
          )}

          {/* Plan */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTitle}>ТРЕНИРОВКИ</div>
              <div className={`${styles.sectionStatus} ${loadingPlan ? styles.statusRed : plan ? styles.statusGreen : ''}`}>
                {loadingPlan ? '// ГЕНЕРАЦИЯ...' : plan ? (saved ? '// СОХРАНЕНО ✓' : '// ГОТОВО') : '// ОЖИДАНИЕ'}
              </div>
            </div>
            <div className={styles.box}>
              {!plan && !loadingPlan && <div className={styles.placeholder}>Заполни форму и нажми кнопку</div>}
              {loadingPlan && <div className={styles.dots}><span/><span/><span/></div>}
              {plan && !loadingPlan && <div className={styles.planText}>{highlight(plan)}</div>}
            </div>
            {plan && !saved && user && (
              <button className={styles.saveBtn} onClick={handleSave} disabled={saveLoading}>
                {saveLoading ? 'СОХРАНЯЕМ...' : 'СОХРАНИТЬ ПЛАН'}
              </button>
            )}
          </div>

          {/* Tips */}
          {(tips || loadingWellness) && (
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitle}>СОВЕТЫ ПО ПИТАНИЮ</div>
                <div className={`${styles.sectionStatus} ${loadingWellness ? styles.statusRed : styles.statusGreen}`}>
                  {loadingWellness ? '// ГЕНЕРАЦИЯ...' : '// ГОТОВО'}
                </div>
              </div>
              <div className={styles.tipsBox}>
                {loadingWellness && <div className={styles.dots}><span/><span/><span/></div>}
                {tips && tips.split('\n').filter(l => l.trim()).map((line, i) => (
                  <TipItem key={i} text={line.trim()} />
                ))}
              </div>
            </div>
          )}

          {/* Recovery */}
          {(recovery || loadingWellness) && (
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitle}>СОН И ВОССТАНОВЛЕНИЕ</div>
                <div className={`${styles.sectionStatus} ${loadingWellness ? styles.statusRed : styles.statusGreen}`}>
                  {loadingWellness ? '// ГЕНЕРАЦИЯ...' : '// ГОТОВО'}
                </div>
              </div>
              <div className={styles.tipsBox}>
                {loadingWellness && <div className={styles.dots}><span/><span/><span/></div>}
                {recovery && recovery.split('\n').filter(l => l.trim()).map((line, i) => (
                  <TipItem key={i} text={line.trim()} />
                ))}
              </div>
            </div>
          )}

          {plan && !user && !showBanner && (
            <div className={styles.lockedMsg}>
              <span>🔒</span> Войдите чтобы получить советы по питанию и восстановлению
              <button className={styles.inlineBtn} onClick={() => navigate('/login')}>ВОЙТИ →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
