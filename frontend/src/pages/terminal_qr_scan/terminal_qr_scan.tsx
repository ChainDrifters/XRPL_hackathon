import { useNavigate } from 'react-router-dom'
import './terminal_qr_scan.css'
import { useLang } from '../../i18n/LangContext'

export default function TerminalQRScan() {
  const navigate = useNavigate()
  const { t } = useLang()
  const q = t.terminal.qrScan

  return (
    <div className="terminal-phone">
      <div className="terminal-content">
        <div className="qr-viewfinder">
          <div className="bg" />
          <div className="qr-corner tl" /><div className="qr-corner tr" />
          <div className="qr-corner bl" /><div className="qr-corner br" />
          <div className="qr-center">📱</div>
          <div className="qr-scan-line" />
        </div>
        <div className="terminal-title">{q.title}</div>
        <div className="terminal-sub" style={{ whiteSpace: 'pre-line' }}>{q.sub}</div>
      </div>
      <div className="bottom-actions">
        <button className="qr-confirm-btn" onClick={() => navigate('/terminal-face-id')}>{q.confirm}</button>
        <button className="barcode-btn" onClick={() => navigate('/terminal-face-id')}>{q.barcode}</button>
      </div>
    </div>
  )
}
