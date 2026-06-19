import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../register_complete/register_complete.css'
import { useLang } from '../../i18n/LangContext'
import { useWalletStore } from '../../wallet/state/walletStore'
import { REFUND_BRANCH } from '../../wallet/state/caseConstants'
import { Signal, BatteryMedium, Check, Wallet, Store, Link } from 'lucide-react'

function formatKRW(n: number): string {
  return n.toLocaleString('en-US')
}

function extractPrerefundedAmount(payload: unknown): number | null {
  if (payload && typeof payload === 'object' && 'prerefundedKRW' in payload) {
    const v = (payload as { prerefundedKRW?: unknown }).prerefundedKRW
    if (typeof v === 'number' && Number.isFinite(v)) return v
  }
  if (payload && typeof payload === 'object' && 'refundedKRW' in payload) {
    const v = (payload as { refundedKRW?: unknown }).refundedKRW
    if (typeof v === 'number' && Number.isFinite(v)) return v
  }
  return null
}

export default function RefundComplete() {
  const navigate = useNavigate()
  const { t } = useLang()
  const r = t.refundComplete
  const cm = t.common
  const allEvents = useWalletStore(s => s.events)

  const branchEvents = useMemo(
    () => allEvents.filter(e => e.branchId === REFUND_BRANCH),
    [allEvents],
  )

  const completedEvent = useMemo(
    () => [...branchEvents].reverse().find(e => e.eventType === 'immediate_refund_completed'),
    [branchEvents],
  )

  const amount = useMemo(() => {
    if (completedEvent) {
      const v = extractPrerefundedAmount(completedEvent.payload)
      if (v != null) return v
    }
    for (let i = branchEvents.length - 1; i >= 0; i -= 1) {
      const ev = branchEvents[i]
      if (ev.eventType === 'downtown_prerefunded') {
        const v = extractPrerefundedAmount(ev.payload)
        if (v != null) return v
      }
    }
    return null
  }, [branchEvents, completedEvent])

  return (
    <div className="phone" style={{ background: '#fff' }}>
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span style={{display:'flex',gap:4,alignItems:'center'}}><Signal size={16}/><BatteryMedium size={16}/></span></div>
      <div className="nav-bar">
        <span className="nav-title">{r.navTitle}</span>
      </div>

      <div className="complete-content">
        <div className="success-rings">
          <div className="r1" />
          <div className="r2" />
          <div className="check"><Check size={36}/></div>
        </div>
        <div className="complete-title" style={{ whiteSpace: 'pre-line' }}>{r.title}</div>
        <div className="complete-sub" style={{ whiteSpace: 'pre-line' }}>{r.sub}</div>

        <div className="chip-list">
          <div className="chip">
            <span className="ic"><Wallet size={20}/></span>
            <div className="body">
              <div className="ttl">{r.amountLabel}</div>
              <div className="sub">{amount != null ? `${formatKRW(amount)}${cm.won}` : '—'}</div>
            </div>
            <span className="badge">{r.statusValue}</span>
          </div>
          <div className="chip">
            <span className="ic"><Store size={20}/></span>
            <div className="body">
              <div className="ttl">{r.merchantLabel}</div>
              <div className="sub">{r.merchantValue}</div>
            </div>
          </div>
          {completedEvent?.anchor && (
            <div className="chip">
              <span className="ic"><Link size={20}/></span>
              <div className="body">
                <div className="ttl">{r.anchorLabel}</div>
                <div className="sub">
                  <a
                    href={completedEvent.anchor.explorerTxUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#3182f6' }}
                  >
                    {completedEvent.anchor.txHash.slice(0, 12)}… {r.explorerLink}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 20px 48px' }}>
        <button
          className="cta-btn"
          style={{ position: 'static', width: '100%' }}
          onClick={() => navigate('/balance-home')}
        >
          {r.cta}
        </button>
      </div>
    </div>
  )
}
