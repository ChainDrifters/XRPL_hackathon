import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './terminal_credential.css'
import { useLang } from '../../i18n/LangContext'
import { useAnchoredAction } from '../../wallet/state/useAnchor'
import { REFUND_BRANCH, REFUND_CASE } from '../../wallet/state/caseConstants'
import { Check } from 'lucide-react'

export default function TerminalConfirm() {
  const navigate = useNavigate()
  const { t } = useLang()
  const co = t.terminal.confirm
  const anchor = useAnchoredAction()

  useEffect(() => {
    void anchor.run({
      kind: 'event', connector: 'refundOperator', eventType: 'downtown_prerefunded',
      serviceDomain: 'tax_refund', branchId: REFUND_BRANCH, caseId: REFUND_CASE,
      payload: { prerefundedKRW: 12400, channel: 'downtown_kiosk' },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="terminal-phone">
      <div className="terminal-confirm-content">
        <div className="success-rings">
          <div className="r1" /><div className="r2" />
          <div className="check"><Check size={24}/></div>
        </div>
        <div className="confirm-label">{co.label}</div>
        <div className="confirm-title">{co.title}</div>
        <div className="confirm-sub" style={{ whiteSpace: 'pre-line' }}>{co.sub}</div>

        <div className="confirm-info">
          <div className="confirm-row"><span className="k">{co.name}</span><span className="v">HONG GILDONG</span></div>
          <div className="confirm-row"><span className="k">{co.nationality}</span><span className="v">{co.nationalityValue}</span></div>
          <div className="confirm-row"><span className="k">{co.taxFree}</span><span className="v success">{co.approved}</span></div>
        </div>
        {anchor.latestAnchor && (
          <div style={{ marginTop: 14, fontSize: 11, textAlign: 'center' }}>
            <div>E3 downtown_prerefunded anchored</div>
            <a href={anchor.latestAnchor.explorerTxUrl} target="_blank" rel="noreferrer" style={{ color: '#3182f6' }}>
              tx {anchor.latestAnchor.txHash.slice(0, 12)}… →
            </a>
          </div>
        )}
        {anchor.pending && <div style={{ marginTop: 14, fontSize: 11, textAlign: 'center' }}>Anchoring…</div>}
      </div>

      <div className="bottom-actions">
        <button className="proceed-btn" onClick={() => navigate('/terminal-complete')}>{co.proceed}</button>
      </div>
    </div>
  )
}
