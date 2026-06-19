import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../payout_select/payout_select.css'
import { useLang } from '../../i18n/LangContext'
import { type ReactNode } from 'react'
import { Signal, BatteryMedium, ChevronLeft, Settings, Home, Banknote, CreditCard, Landmark, PlaneTakeoff, Check } from 'lucide-react'

type Method = 'card' | 'bank' | 'toss' | 'cash'

export default function PayoutSelectLotte() {
  const navigate = useNavigate()
  const { t } = useLang()
  const p = t.payoutSelect
  const c = t.common
  const [selected, setSelected] = useState<Method>('card')

  const METHODS: { id: Method; icon: ReactNode; title: string; badge?: string; badgeType?: string; desc: string }[] = [
    { id: 'card',  icon: <CreditCard size={22}/>, title: p.m1Title, badge: p.m1Badge, desc: p.m1Desc },
    { id: 'bank',  icon: <Landmark size={22}/>, title: p.m2Title, desc: p.m2Desc },
    { id: 'toss',  icon: <PlaneTakeoff size={22}/>, title: p.m3Title, badge: p.m3Badge, badgeType: 'adv', desc: p.m3Desc },
    { id: 'cash',  icon: <Banknote size={22}/>, title: p.m4Title, desc: p.m4Desc },
  ]

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span style={{display:'flex',gap:4,alignItems:'center'}}><Signal size={16}/><BatteryMedium size={16}/></span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}><ChevronLeft size={24}/></span>
        <span className="nav-title">{p.navTitle}</span>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div style={{ padding: '8px 4px 16px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{p.heading}</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            {p.lotteContext} <strong style={{ color: 'var(--main-blue)' }}>286,100{c.won}</strong>
          </div>
        </div>

        {METHODS.map(m => (
          <div key={m.id} className={`method-card${selected === m.id ? ' selected' : ''}`} onClick={() => setSelected(m.id)}>
            <div className="icon-wrap">{m.icon}</div>
            <div className="info">
              <div className="title">
                {m.title}
                {m.badge && <span className={`badge${m.badgeType ? ` ${m.badgeType}` : ''}`}>{m.badge}</span>}
              </div>
              <div className="desc">{m.desc}</div>
            </div>
            <div className="check">{selected === m.id ? <Check size={18}/> : null}</div>
          </div>
        ))}

        <div className="summary-info" style={{ marginTop: 16 }}>
          <div className="row"><span className="k">{p.refundAmt}</span><span className="v">286,100{c.won}</span></div>
          <div className="row"><span className="k">{p.fee}</span><span className="v" style={{ color: 'var(--success)' }}>{p.free}</span></div>
          <div className="row total"><span className="k">{p.receiveAmt}</span><span className="v">286,100{c.won}</span></div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn" onClick={() => navigate('/refund-home')}>{p.cta}</button>
      </div>
      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon"><Home size={20}/></span><span className="label">{c.nav.home}</span></div>
        <div className="bn-item active"><span className="icon"><Banknote size={20}/></span><span className="label">{c.nav.refund}</span></div>
        <div className="bn-item"><span className="icon"><Settings size={20}/></span><span className="label">{c.nav.settings}</span></div>
      </div>
    </div>
  )
}
