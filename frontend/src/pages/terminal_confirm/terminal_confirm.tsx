import { useNavigate } from 'react-router-dom'
import './terminal_confirm.css'
import { useLang } from '../../i18n/LangContext'

export default function TerminalConfirm() {
  const navigate = useNavigate()
  const { t } = useLang()
  const co = t.terminal.confirm

  return (
    <div className="terminal-phone">
      <div className="terminal-confirm-content">
        <div className="success-rings">
          <div className="r1" /><div className="r2" />
          <div className="check">✓</div>
        </div>
        <div className="confirm-label">{co.label}</div>
        <div className="confirm-title">{co.title}</div>
        <div className="confirm-sub" style={{ whiteSpace: 'pre-line' }}>{co.sub}</div>

        <div className="confirm-info">
          <div className="confirm-row"><span className="k">{co.name}</span><span className="v">HONG GILDONG</span></div>
          <div className="confirm-row"><span className="k">{co.nationality}</span><span className="v">{co.nationalityValue}</span></div>
          <div className="confirm-row"><span className="k">{co.taxFree}</span><span className="v success">{co.approved}</span></div>
        </div>
      </div>

      <div className="bottom-actions">
        <button className="proceed-btn" onClick={() => navigate('/terminal-qr-scan')}>{co.proceed}</button>
      </div>
    </div>
  )
}
