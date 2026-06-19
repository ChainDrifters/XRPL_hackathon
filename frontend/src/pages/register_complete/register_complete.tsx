import { useNavigate } from 'react-router-dom'
import './register_complete.css'
import { useLang } from '../../i18n/LangContext'
import { useWalletStore } from '../../wallet/state/walletStore'
import { Signal, BatteryMedium, BookUser, Fingerprint, Check } from 'lucide-react'

export default function RegisterComplete() {
  const navigate = useNavigate()
  const { t } = useLang()
  const r = t.registerComplete
  const persona = useWalletStore(s => s.persona)
  const passportSub = persona
    ? `${persona.passport.givenNames} ${persona.passport.surname} · ${persona.passport.passportNumber}`
    : r.passportSub

  return (
    <div className="phone" style={{ background: '#fff' }}>
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span style={{display:'flex',gap:4,alignItems:'center'}}><Signal size={16}/><BatteryMedium size={16}/></span></div>

      <div className="complete-content">
        <div className="success-rings">
          <div className="r1" />
          <div className="r2" />
          <div className="check"><Check size={36}/></div>
        </div>
        <div className="complete-title" style={{ whiteSpace: 'pre-line' }}>{r.title}</div>
        <div className="complete-sub" style={{ whiteSpace: 'pre-line' }}>{r.sub}</div>

        <div className="chip-list">
          <div className="chip">
            <span className="ic"><BookUser size={20}/></span>
            <div className="body"><div className="ttl">{r.passportLabel}</div><div className="sub">{passportSub}</div></div>
            <span className="badge">{r.confirmed}</span>
          </div>
          <div className="chip">
            <span className="ic"><Fingerprint size={20}/></span>
            <div className="body"><div className="ttl">{r.faceIdLabel}</div><div className="sub">{r.faceIdSub}</div></div>
            <span className="badge">{r.confirmed}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 48px' }}>
        <button className="cta-btn" style={{ position: 'static', width: '100%' }} onClick={() => navigate('/balance-home')}>{r.cta}</button>
      </div>
    </div>
  )
}
