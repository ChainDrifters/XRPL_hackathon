import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './terminal_face_id.css'
import { useLang } from '../../i18n/LangContext'
import { useAnchoredAction } from '../../wallet/state/useAnchor'
import { REFUND_BRANCH, REFUND_CASE } from '../../wallet/state/caseConstants'
import { ScanFace, UserRoundCheck } from 'lucide-react'

export default function TerminalFaceId() {
  const navigate = useNavigate()
  const { t } = useLang()
  const f = t.terminal.faceId
  const [phase, setPhase] = useState<'scanning' | 'done'>('scanning')
  const anchor = useAnchoredAction()

  useEffect(() => {
    const doneTimer = setTimeout(async () => {
      setPhase('done')
      await anchor.run({
        kind: 'event', connector: 'refundOperator', eventType: 'tax_free_status_verified',
        serviceDomain: 'tax_refund', branchId: REFUND_BRANCH, caseId: REFUND_CASE,
        payload: { status: 'eligible', reasonCode: 'IMM_NRA_OK' },
      })
    }, 2800)
    return () => clearTimeout(doneTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'done') return
    const navTimer = setTimeout(() => navigate('/terminal-card-input'), 1400)
    return () => clearTimeout(navTimer)
  }, [phase, navigate])

  const scanning = phase === 'scanning'
  const done = phase === 'done'

  return (
    <div className="terminal-phone">
      <div className="faceid-content">
        <div className={`face-scan-ring${scanning ? ' scanning' : ''}${done ? ' done' : ''}`}>
          <div className="ring-outer" /><div className="ring-middle" />
          <div className="ring-inner">{scanning && <div className="scan-line" />}</div>
          <div className="face-icon">{done ? <UserRoundCheck size={44}/> : <ScanFace size={44}/>}</div>
          <div className="corner tl" /><div className="corner tr" /><div className="corner bl" /><div className="corner br" />
        </div>

        {done ? (
          <>
            <div className="faceid-status done-label">{f.doneStatus}</div>
            <div className="faceid-title">{f.doneTitle}</div>
            <div className="faceid-sub">{f.doneSub}</div>
          </>
        ) : scanning ? (
          <>
            <div className="faceid-status scanning-label">{f.scanStatus}</div>
            <div className="faceid-title" style={{ whiteSpace: 'pre-line' }}>{f.scanTitle}</div>
            <div className="faceid-sub">{f.sub}</div>
          </>
        ) : (
          <>
            <div className="faceid-title">{f.initTitle}</div>
            <div className="faceid-sub">{f.sub}</div>
          </>
        )}

        <div className="step-row">
          <span className="step-label">{f.qrStep}</span>
          <span className="step-status s-done">{f.done}</span>
        </div>
        <div className={`step-row${done ? ' step-done' : ' step-active'}`}>
          <span className="step-label">{f.faceStep}</span>
          <span className={`step-status ${done ? 's-done' : 's-inprogress'}`}>{done ? f.done : f.inProgress}</span>
        </div>
        {anchor.latestAnchor && (
          <div style={{ marginTop: 14, fontSize: 11, textAlign: 'center' }}>
            <div>E2 anchored on XRPL Testnet</div>
            <a href={anchor.latestAnchor.explorerTxUrl} target="_blank" rel="noreferrer" style={{ color: '#3182f6' }}>
              tx {anchor.latestAnchor.txHash.slice(0, 12)}… →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
