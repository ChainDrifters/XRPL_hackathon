import { useNavigate } from 'react-router-dom'
import '../refund_detail/refund_detail.css'
import '../balance_home/balance_home.css'
import { useLang } from '../../i18n/LangContext'

export default function RefundDetailShinsegae() {
  const navigate = useNavigate()
  const { t } = useLang()
  const d = t.refundDetail
  const c = t.common

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}>‹</span>
        <span className="nav-title">{d.navTitle}</span>
        <div className="right"><span className="icon">🔗</span></div>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div className="summary-card">
          <div className="label">{d.shinsegaeLabel}</div>
          <div className="amount">6,800<span className="currency">{c.won}</span></div>
          <div className="row">
            <div className="stat"><div className="stat-label">{d.purchaseAmt}</div><div className="stat-value">85,000{c.won}</div></div>
            <div className="stat"><div className="stat-label">{d.refundProgress}</div><div className="stat-value">{d.progressShinsegae}</div></div>
          </div>
        </div>

        <div className="section-h"><h3>{d.sectionProgress}</h3></div>
        <div className="timeline">
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content"><div className="tl-title">{d.s1}</div><div className="tl-time">{d.s1tS}</div></div>
          </div>
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content"><div className="tl-title">{d.s2}</div><div className="tl-time">{d.s2tS}</div></div>
          </div>
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content"><div className="tl-title">{d.s3}</div><div className="tl-time">{d.s3tS}</div></div>
          </div>
          <div className="tl-item current">
            <div className="tl-dot">4</div>
            <div className="tl-content"><div className="tl-title">{d.s4}</div><div className="tl-time">{d.s4tS}</div></div>
          </div>
          <div className="tl-item">
            <div className="tl-dot">5</div>
            <div className="tl-content"><div className="tl-title">{d.s5}</div><div className="tl-time">{d.s5t}</div></div>
          </div>
        </div>

        <div className="section-h"><h3>{d.sectionPurchase}</h3></div>
        <div className="info-card">
          <div className="info-row"><span className="key">{d.store}</span><span className="val">신세계 명동점</span></div>
          <div className="info-row"><span className="key">{d.purchaseDate}</span><span className="val">2026.05.04 11:15</span></div>
          <div className="info-row"><span className="key">{d.payMethod}</span><span className="val">VISA •••• 4521</span></div>
          <div className="info-row"><span className="key">{d.totalPurchase}</span><span className="val">85,000{c.won}</span></div>
          <div className="info-row"><span className="key">VAT</span><span className="val">7,727{c.won}</span></div>
          <div className="info-row">
            <span className="key">{d.expectedRefund}</span>
            <span className="val" style={{ color: 'var(--toss-blue)' }}>+6,800{c.won}</span>
          </div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn" disabled style={{ background: 'var(--bg-deep)', color: 'var(--text-quaternary)', cursor: 'not-allowed' }}>
          {d.showKiosk}
        </button>
      </div>
      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">{c.nav.home}</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">{c.nav.refund}</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">{c.nav.settings}</span></div>
      </div>
    </div>
  )
}
