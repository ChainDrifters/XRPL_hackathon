import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './terminal_qr_scan.css'
import { useLang } from '../../i18n/LangContext'
import { useWalletStore } from '../../wallet/state/walletStore'
import { REFUND_BRANCH } from '../../wallet/state/caseConstants'

export default function TerminalQRScan() {
  const navigate = useNavigate()
  const { t } = useLang()
  const q = t.terminal.qrScan
  const allEvents = useWalletStore(s => s.events)
  const branchEvents = useMemo(() => allEvents.filter(e => e.branchId === REFUND_BRANCH), [allEvents])
  const phoneReady = branchEvents.length > 0

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
        <div style={{ marginTop: 14, padding: 10, background: phoneReady ? '#e8f3ff' : '#fff3cd', borderRadius: 8, fontSize: 12, textAlign: 'center' }}>
          {phoneReady ? (
            <>
              <div style={{ fontWeight: 700, color: '#1b64da' }}>Phone synced — {branchEvents.length} events</div>
              <div style={{ color: '#666', marginTop: 2 }}>latest: {branchEvents[branchEvents.length - 1].eventType}</div>
            </>
          ) : (
            <div style={{ color: '#856404' }}>Waiting for phone to start refund case…</div>
          )}
        </div>
      </div>
      <div className="bottom-actions">
        <button className="qr-confirm-btn" disabled={!phoneReady} onClick={() => navigate('/terminal-face-id')}>{q.confirm}</button>
        <button className="barcode-btn" disabled={!phoneReady} onClick={() => navigate('/terminal-face-id')}>{q.barcode}</button>
      </div>
    </div>
  )
}
