import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './payout_select.css'
import { useLang } from '../../i18n/LangContext'
import { useAnchoredAction } from '../../wallet/state/useAnchor'

const REFUND_BRANCH = 'branch_taxrefund_olive_001'
const REFUND_CASE = 'case_olive_001'

type Method = 'card' | 'bank' | 'toss' | 'cash'

export default function PayoutSelect() {
  const navigate = useNavigate()
  const { t } = useLang()
  const p = t.payoutSelect
  const c = t.common
  const [selected, setSelected] = useState<Method>('card')
  const anchor = useAnchoredAction()

  async function recordSettlementChain() {
    await anchor.run({
      kind: 'event', connector: 'cardPsp', eventType: 'card_authorization_verified',
      serviceDomain: 'payment', branchId: REFUND_BRANCH, caseId: REFUND_CASE,
      payload: { method: selected, network: 'visa_mock' },
    })
    await anchor.run({
      kind: 'event', connector: 'customs', eventType: 'customs_export_confirmed',
      serviceDomain: 'customs', branchId: REFUND_BRANCH, caseId: REFUND_CASE,
      payload: { kioskId: 'ICN_T1_K07', confirmedAt: new Date().toISOString() },
    })
    await anchor.run({
      kind: 'event', connector: 'cardPsp', eventType: 'card_settlement_completed',
      serviceDomain: 'payment', branchId: REFUND_BRANCH, caseId: REFUND_CASE,
      payload: { settledKRW: 9600 },
    })
  }

  const METHODS: { id: Method; icon: string; title: string; badge?: string; badgeType?: string; desc: string }[] = [
    { id: 'card',  icon: '💳', title: p.m1Title, badge: p.m1Badge, desc: p.m1Desc },
    { id: 'bank',  icon: '🏦', title: p.m2Title, desc: p.m2Desc },
    { id: 'toss',  icon: '✈️', title: p.m3Title, badge: p.m3Badge, badgeType: 'adv', desc: p.m3Desc },
    { id: 'cash',  icon: '💵', title: p.m4Title, desc: p.m4Desc },
  ]

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}>‹</span>
        <span className="nav-title">{p.navTitle}</span>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div style={{ padding: '8px 4px 16px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{p.heading}</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            {p.amoreContext} <strong style={{ color: 'var(--toss-blue)' }}>9,600{c.won}</strong>
          </div>
        </div>

        {METHODS.map(m => (
          <div key={m.id} className={`method-card${selected === m.id ? ' selected' : ''}`} onClick={() => setSelected(m.id)}>
            <div className="icon-wrap">{m.icon}</div>
            <div className="info">
              <div className="title">
                {m.title}
                {m.badge && <span className={`badge${m.badgeType ? ` ${m.badgeType}` : ''}`}>{m.badge}</span>}
              </div>
              <div className="desc">{m.desc}</div>
            </div>
            <div className="check">{selected === m.id ? '✓' : ''}</div>
          </div>
        ))}

        <div className="summary-info" style={{ marginTop: 16 }}>
          <div className="row"><span className="k">{p.refundAmt}</span><span className="v">9,600{c.won}</span></div>
          <div className="row"><span className="k">{p.fee}</span><span className="v" style={{ color: 'var(--success)' }}>{p.free}</span></div>
          <div className="row total"><span className="k">{p.receiveAmt}</span><span className="v">9,600{c.won}</span></div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn" disabled={anchor.pending} onClick={async () => { await recordSettlementChain(); navigate('/refund-home') }}>
          {anchor.pending ? 'Settling on XRPL...' : p.cta}
        </button>
        {anchor.latestAnchor && (
          <div style={{ marginTop: 8, fontSize: 11, textAlign: 'center' }}>
            <a href={anchor.latestAnchor.explorerTxUrl} target="_blank" rel="noreferrer">Settlement tx on Testnet →</a>
          </div>
        )}
      </div>
      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">{c.nav.home}</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">{c.nav.refund}</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">{c.nav.settings}</span></div>
      </div>
    </div>
  )
}
