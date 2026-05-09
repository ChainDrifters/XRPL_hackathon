import { useNavigate } from 'react-router-dom'
import './refund_storage.css'
import { useLang } from '../../i18n/LangContext'

export default function RefundStorage() {
  const navigate = useNavigate()
  const { t } = useLang()
  const s = t.refundStorage
  const c = t.common
  const b = t.balanceHome

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}>‹</span>
        <span className="nav-title">{s.navTitle}</span>
        <div className="right"><span className="icon">⋯</span></div>
      </div>

      <div className="scroll-area">
        <div className="balance-card">
          <div className="label">
            {s.balanceLabel}
            <span className="info-icon">ⓘ</span>
          </div>
          <div className="amount-krw">295,700<span className="currency">{c.won}</span></div>
          <div className="amount-rlusd">≈ 215.42 RLUSD · {s.rlusdSub}</div>
          <div className="actions">
            <button className="act primary" onClick={() => navigate('/wallet-withdraw')}>{c.withdraw}</button>
            <button className="act" onClick={() => navigate('/payout-select')}>{s.changeMethod}</button>
          </div>
        </div>

        <div style={{ background: 'var(--success-light)', borderRadius: 12, padding: '12px 14px', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 2 }}>{s.secureTitle}</div>
            <div style={{ fontSize: 11, color: '#006b4f', lineHeight: 1.4 }}>{s.secureText}</div>
          </div>
        </div>

        <div className="section-h"><h3>{s.recentTx}</h3><span className="more">{c.viewAll}</span></div>
        <div className="info-card" style={{ padding: '4px 18px' }}>
          <div className="tx-item">
            <div className="ic">↓</div>
            <div className="body"><div className="ttl">{b.tx1Title}</div><div className="sub">5월 1일 14:22</div></div>
            <div className="right"><div className="amt">+286,100{c.won}</div><div className="when">208.41 RLUSD</div></div>
          </div>
          <div className="tx-item">
            <div className="ic">↓</div>
            <div className="body"><div className="ttl">{b.tx2Title}</div><div className="sub">4월 30일 18:05</div></div>
            <div className="right"><div className="amt">+9,600{c.won}</div><div className="when">7.01 RLUSD</div></div>
          </div>
          <div className="tx-item out">
            <div className="ic">↑</div>
            <div className="body"><div className="ttl">{b.tx3Title}</div><div className="sub">4월 25일 09:30</div></div>
            <div className="right"><div className="amt">-50,000{c.won}</div><div className="when">36.45 RLUSD</div></div>
          </div>
        </div>

        <div className="section-h"><h3>{s.advanced}</h3></div>
        <div className="info-card">
          <div className="advanced-row">
            <div className="ic">🔗</div>
            <div className="body"><div className="ttl">{s.receiveAddr}</div><div className="sub">{s.receiveAddrSub}</div></div>
            <span className="chevron">›</span>
          </div>
          <div className="advanced-divider" />
          <div className="advanced-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/wallet-withdraw')}>
            <div className="ic">📤</div>
            <div className="body"><div className="ttl">{s.externalWithdraw}</div><div className="sub">{s.externalWithdrawSub}</div></div>
            <span className="chevron">›</span>
          </div>
          <div className="advanced-divider" />
          <div className="advanced-row">
            <div className="ic">📜</div>
            <div className="body"><div className="ttl">{s.txHistory}</div><div className="sub">{s.txHistorySub}</div></div>
            <span className="chevron">›</span>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">{c.nav.home}</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">{c.nav.refund}</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">{c.nav.settings}</span></div>
      </div>
    </div>
  )
}
