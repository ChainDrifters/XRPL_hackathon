import { useNavigate } from 'react-router-dom'
import './onboarding_start.css'
import { useLang } from '../../i18n/LangContext'

export default function OnboardingStart() {
  const navigate = useNavigate()
  const { t, lang, setLang } = useLang()
  const o = t.onboarding

  return (
    <div className="phone" style={{ background: '#fff' }}>
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="onboarding-hero">
          <div className="hero-icon">🛍️</div>
          <div className="hero-title" style={{ whiteSpace: 'pre-line' }}>{o.title}</div>
          <div className="hero-sub" style={{ whiteSpace: 'pre-line' }}>{o.sub}</div>
        </div>

        <div className="onboarding-cta">
          <div className="feature-row">
            <span className="ic">🛂</span>
            <div><div className="ttl">{o.f1Title}</div><div className="sub">{o.f1Sub}</div></div>
          </div>
          <div className="feature-row">
            <span className="ic">💸</span>
            <div><div className="ttl">{o.f2Title}</div><div className="sub">{o.f2Sub}</div></div>
          </div>
          <div className="feature-row">
            <span className="ic">🏦</span>
            <div><div className="ttl">{o.f3Title}</div><div className="sub">{o.f3Sub}</div></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 48px' }}>
        <div className="lang-toggle" style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, gap: 8 }}>
          <button
            onClick={() => setLang('ko')}
            style={{
              padding: '6px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
              background: lang === 'ko' ? 'var(--toss-blue)' : 'var(--bg-deep)',
              color: lang === 'ko' ? 'white' : 'var(--text-tertiary)',
            }}
          >
            🇰🇷 한국어
          </button>
          <button
            onClick={() => setLang('en')}
            style={{
              padding: '6px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
              background: lang === 'en' ? 'var(--toss-blue)' : 'var(--bg-deep)',
              color: lang === 'en' ? 'white' : 'var(--text-tertiary)',
            }}
          >
            🇺🇸 English
          </button>
        </div>
        <button className="cta-btn" onClick={() => navigate('/passport-register')}>
          {o.start}
        </button>
      </div>
    </div>
  )
}
