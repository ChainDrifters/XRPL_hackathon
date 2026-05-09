import { useNavigate } from 'react-router-dom'
import './qr_issued.css'
import { useLang } from '../../i18n/LangContext'

export default function QRIssued() {
  const navigate = useNavigate()
  const { t } = useLang()
  const q = t.qrIssued
  const c = t.common

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>{q.navTitle}</span>
        <div className="right"><span className="icon">⚙️</span></div>
      </div>

      <div className="scroll-area">
        <div className="date-label">{q.today}</div>
        <div className="notif-new">
          <div className="notif-row">
            <div className="notif-icon">🔍</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">{q.n1Title}</div>
                <div className="notif-time">{q.justNow}</div>
              </div>
              <div className="notif-text">{q.n1Text}</div>
            </div>
          </div>
        </div>
        <div className="notif-new">
          <div className="notif-row">
            <div className="notif-icon">🔍</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">{q.n2Title}</div>
                <div className="notif-time">{q.oneHourAgo}</div>
              </div>
              <div className="notif-text">{q.n2Text}</div>
            </div>
          </div>
        </div>

        <div className="date-label">{q.yesterday}</div>
        <div className="notif-card">
          <div className="notif-row">
            <div className="notif-icon">🔍</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">{q.n3Title}</div>
                <div className="notif-time">{q.n3Time}</div>
              </div>
              <div className="notif-text">{q.n3Text}</div>
            </div>
          </div>
        </div>
        <div className="notif-card">
          <div className="notif-row">
            <div className="notif-icon-green">💰</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">{q.n4Title}</div>
                <div className="notif-time">{q.n4Time}</div>
              </div>
              <div className="notif-text">{q.n4Text}</div>
            </div>
          </div>
        </div>

        <div className="date-label">{q.twoDaysAgo}</div>
        <div className="notif-card dim">
          <div className="notif-row">
            <div className="notif-icon-grey">🛂</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">{q.n5Title}</div>
                <div className="notif-time">{q.n5Time}</div>
              </div>
              <div className="notif-text">{q.n5Text}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">{c.nav.home}</span></div>
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}><span className="icon">💸</span><span className="label">{c.nav.refund}</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">{c.nav.settings}</span></div>
      </div>
    </div>
  )
}
