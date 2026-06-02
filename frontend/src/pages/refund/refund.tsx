import { useNavigate } from 'react-router-dom'
import './refund.css'
import { useLang } from '../../i18n/LangContext'

export default function RefundHome() {
  const navigate = useNavigate()
  const { t } = useLang()
  const r = t.refundHome
  const c = t.common

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>{r.navTitle}</span>
        <div className="right">
          <span className="icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/qr-issued')}>🔔</span>
          <span className="icon">⚙️</span>
        </div>
      </div>

      <div className="scroll-area">
        <div className="summary-card">
          <div className="label">{r.summaryLabel}</div>
          <div className="amount">314,900<span className="currency">{c.won}</span></div>
          <div className="row">
            <div className="stat">
              <div className="stat-label">{r.inProgress}</div>
              <div className="stat-value">{r.inProgressStat}</div>
            </div>
            <div className="stat">
              <div className="stat-label">{r.canReceive}</div>
              <div className="stat-value">{r.canReceiveStat}</div>
            </div>
          </div>
        </div>

        <div className="section-h"><h3>{r.sectionInProgress}</h3><span className="more">{r.itemCount}</span></div>

        <div className="case-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-detail')}>
          <div className="top">
            <div><div className="merchant">{r.merchantOlive}</div><div className="meta">{r.oliveMeta}</div></div>
            <div className="pill">+12,400{c.won}</div>
          </div>
          <div className="progress">
            <div className="seg done" /><div className="seg done" />
            <div className="seg" /><div className="seg" /><div className="seg" />
          </div>
          <div className="step-text">{r.oliveStep}</div>
        </div>

        <div className="case-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-detail-shinsegae')}>
          <div className="top">
            <div><div className="merchant">{r.merchantShinsegae}</div><div className="meta">{r.shinsegaeMeta}</div></div>
            <div className="pill">+6,800{c.won}</div>
          </div>
          <div className="progress">
            <div className="seg done" /><div className="seg done" />
            <div className="seg done" /><div className="seg done" /><div className="seg" />
          </div>
          <div className="step-text">{r.shinsegaeStep}</div>
        </div>

        <div className="section-h"><h3>{r.sectionCanReceive}</h3><span className="more">{r.itemCount}</span></div>

        <div className="case-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/payout-select')}>
          <div className="top">
            <div><div className="merchant">{r.merchantAmore}</div><div className="meta">{r.amoreMeta}</div></div>
            <div className="pill" style={{ background: 'var(--main-blue)', color: 'white' }}>{r.receive}</div>
          </div>
          <div className="step-text" style={{ color: 'var(--success)' }}>{r.amoreStep}</div>
        </div>

        <div className="case-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/payout-select-lotte')}>
          <div className="top">
            <div><div className="merchant">{r.merchantLotte}</div><div className="meta">{r.lotteMeta}</div></div>
            <div className="pill" style={{ background: 'var(--main-blue)', color: 'white' }}>{r.receive}</div>
          </div>
          <div className="step-text" style={{ color: 'var(--success)' }}>{r.lotteStep}</div>
        </div>

        <div className="section-h"><h3>{r.sectionCompleted}</h3><span className="more">{c.viewAll}</span></div>
        <div className="case-card" style={{ opacity: 0.7 }}>
          <div className="top">
            <div><div className="merchant">{r.merchantHyundai}</div><div className="meta">{r.hyundaiMeta}</div></div>
            <div className="pill" style={{ background: 'var(--bg-deep)', color: 'var(--text-tertiary)' }}>14,500{c.won}</div>
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
