import { useEffect, useMemo } from 'react'
import '../terminal_credential/terminal_credential.css'
import { useLang } from '../../i18n/LangContext'
import { useAnchoredAction } from '../../wallet/state/useAnchor'
import { useWalletStore } from '../../wallet/state/walletStore'
import { REFUND_BRANCH, REFUND_CASE } from '../../wallet/state/caseConstants'

function formatKRW(n: number): string {
  return n.toLocaleString('en-US')
}

function extractPrerefundedAmount(payload: unknown): number | null {
  if (payload && typeof payload === 'object' && 'prerefundedKRW' in payload) {
    const v = (payload as { prerefundedKRW?: unknown }).prerefundedKRW
    if (typeof v === 'number' && Number.isFinite(v)) return v
  }
  return null
}

export default function TerminalComplete() {
  const { t } = useLang()
  const c = t.terminal.complete
  const cm = t.common
  const anchor = useAnchoredAction()
  const allEvents = useWalletStore(s => s.events)
  const reset = useWalletStore(s => s.actions.reset)

  const branchEvents = useMemo(
    () => allEvents.filter(e => e.branchId === REFUND_BRANCH),
    [allEvents],
  )

  const prerefundedAmount = useMemo(() => {
    for (let i = branchEvents.length - 1; i >= 0; i -= 1) {
      const ev = branchEvents[i]
      if (ev.eventType === 'downtown_prerefunded') {
        const amt = extractPrerefundedAmount(ev.payload)
        if (amt != null) return amt
      }
    }
    return null
  }, [branchEvents])

  useEffect(() => {
    if (prerefundedAmount == null) return
    void anchor.run({
      kind: 'event',
      connector: 'refundOperator',
      eventType: 'immediate_refund_completed',
      serviceDomain: 'tax_refund',
      branchId: REFUND_BRANCH,
      caseId: REFUND_CASE,
      payload: { refundedKRW: prerefundedAmount, channel: 'downtown_kiosk' },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prerefundedAmount])

  async function handleReset() {
    if (!confirm(c.resetConfirm)) return
    await reset()
    localStorage.removeItem('tffl-wallet-key-v1')
    localStorage.removeItem('tffl-selected-persona-id-v1')
    location.href = '/terminal-qr-scan'
  }

  return (
    <div className="terminal-phone">
      <div className="terminal-confirm-content">
        <div className="success-rings">
          <div className="r1" />
          <div className="r2" />
          <div className="check">✓</div>
        </div>
        <div className="confirm-label">{c.label}</div>
        <div className="confirm-title" style={{ whiteSpace: 'pre-line' }}>{c.title}</div>
        <div className="confirm-sub" style={{ whiteSpace: 'pre-line' }}>{c.sub}</div>

        <div className="confirm-info" style={{ marginBottom: 12 }}>
          <div className="confirm-row">
            <span className="k">{c.amountLabel}</span>
            <span className="v success">
              {prerefundedAmount != null ? `${formatKRW(prerefundedAmount)}${cm.won}` : '—'}
            </span>
          </div>
          <div className="confirm-row">
            <span className="k">{c.receiptStore}</span>
            <span className="v">{c.receiptStoreValue}</span>
          </div>
          <div className="confirm-row">
            <span className="k">{c.receiptStatus}</span>
            <span className="v success">{c.receiptStatusValue}</span>
          </div>
        </div>

        <div style={{ marginTop: 4, fontSize: 11, textAlign: 'center' }}>
          <div style={{ color: '#666', marginBottom: 2 }}>{c.anchorLabel}</div>
          {anchor.pending && <div>{c.anchorPending}</div>}
          {anchor.latestAnchor && (
            <a
              href={anchor.latestAnchor.explorerTxUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#3182f6' }}
            >
              tx {anchor.latestAnchor.txHash.slice(0, 12)}… {c.explorerLink}
            </a>
          )}
          {anchor.error && (
            <div style={{ color: '#e74c3c' }}>anchor failed: {anchor.error}</div>
          )}
        </div>
      </div>

      <div className="bottom-actions">
        <button
          className="proceed-btn"
          onClick={handleReset}
          disabled={anchor.pending}
          style={anchor.pending ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
        >
          {c.resetCta}
        </button>
      </div>
    </div>
  )
}
