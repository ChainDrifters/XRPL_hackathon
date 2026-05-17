import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useMemo } from 'react'
import './balance_home.css'
import '../refund_storage/refund_storage.css'
import { useLang } from '../../i18n/LangContext'
import { useWalletStore } from '../../wallet/state/walletStore'

type ModalPhase = 'face-id' | 'qr' | 'tx-list' | 'refund-detail' | 'withdraw-detail' | null

interface TxItem {
  id: string
  type: 'refund' | 'withdraw'
  title: string
  merchant: string
  sub: string
  amt: string
  rlusd: string
  address?: string
  txId?: string
  networkFee?: string
  coin?: string
}

export default function BalanceHome() {
  const navigate = useNavigate()
  const { t, lang, setLang } = useLang()
  const b = t.balanceHome
  const c = t.common

  const TX_DATA: TxItem[] = [
    { id: 'tx1', type: 'refund',   title: b.tx1Title, merchant: b.tx1Merchant, sub: '5월 1일 14:22',  amt: '+286,100원', rlusd: '208.41 RLUSD' },
    { id: 'tx2', type: 'refund',   title: b.tx2Title, merchant: b.tx2Merchant, sub: '4월 30일 18:05', amt: '+9,600원',   rlusd: '7.01 RLUSD' },
    { id: 'tx3', type: 'withdraw', title: b.tx3Title, merchant: '',            sub: '4월 25일 09:30', amt: '-50,000원',  rlusd: '36.45 RLUSD', coin: 'RLUSD', address: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH', txId: 'A3F2C19E...9C1B', networkFee: '0.00001 XRP' },
    { id: 'tx4', type: 'refund',   title: b.tx4Title, merchant: b.tx4Merchant, sub: '4월 22일 11:10', amt: '+41,300원',  rlusd: '30.15 RLUSD' },
    { id: 'tx5', type: 'refund',   title: b.tx5Title, merchant: b.tx5Merchant, sub: '4월 18일 16:45', amt: '+13,700원',  rlusd: '10.00 RLUSD' },
    { id: 'tx6', type: 'withdraw', title: b.tx6Title, merchant: '',            sub: '4월 10일 08:55', amt: '-100,000원', rlusd: '72.99 RLUSD', coin: 'RLUSD', address: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH', txId: 'B8D4F02A...3E7C', networkFee: '0.00001 XRP' },
  ]

  const [modal, setModal] = useState<ModalPhase>(null)
  const [selectedTx, setSelectedTx] = useState<TxItem | null>(null)
  const [detailFromList, setDetailFromList] = useState(false)
  const [seconds, setSeconds] = useState(180)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function openQR() { setModal('qr'); setSeconds(180) }
  function closeModal() { setModal(null); if (timerRef.current) clearInterval(timerRef.current) }

  function openTxDetail(tx: TxItem) {
    setDetailFromList(modal === 'tx-list')
    setSelectedTx(tx)
    setModal(tx.type === 'withdraw' ? 'withdraw-detail' : 'refund-detail')
  }

  function closeDetail() { setModal(detailFromList ? 'tx-list' : null) }

  useEffect(() => {
    if (modal === 'qr') {
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { clearInterval(timerRef.current!); setModal(null); return 0 }
          return s - 1
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [modal])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const QR_SVG = (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="4" fill="#111" /><rect x="18" y="18" width="28" height="28" rx="2" fill="white" /><rect x="24" y="24" width="16" height="16" rx="1" fill="#111" />
      <rect x="106" y="10" width="44" height="44" rx="4" fill="#111" /><rect x="114" y="18" width="28" height="28" rx="2" fill="white" /><rect x="120" y="24" width="16" height="16" rx="1" fill="#111" />
      <rect x="10" y="106" width="44" height="44" rx="4" fill="#111" /><rect x="18" y="114" width="28" height="28" rx="2" fill="white" /><rect x="24" y="120" width="16" height="16" rx="1" fill="#111" />
      <rect x="62" y="10" width="8" height="8" fill="#111" /><rect x="78" y="10" width="8" height="8" fill="#111" /><rect x="62" y="26" width="8" height="8" fill="#111" /><rect x="70" y="18" width="8" height="8" fill="#111" /><rect x="86" y="18" width="8" height="8" fill="#111" /><rect x="78" y="34" width="8" height="8" fill="#111" /><rect x="86" y="42" width="8" height="8" fill="#111" /><rect x="62" y="42" width="8" height="8" fill="#111" />
      <rect x="10" y="62" width="8" height="8" fill="#111" /><rect x="26" y="62" width="8" height="8" fill="#111" /><rect x="42" y="62" width="8" height="8" fill="#111" /><rect x="18" y="70" width="8" height="8" fill="#111" /><rect x="34" y="70" width="8" height="8" fill="#111" /><rect x="10" y="78" width="8" height="8" fill="#111" /><rect x="42" y="78" width="8" height="8" fill="#111" /><rect x="18" y="86" width="8" height="8" fill="#111" /><rect x="26" y="94" width="8" height="8" fill="#111" /><rect x="42" y="94" width="8" height="8" fill="#111" />
      <rect x="62" y="62" width="8" height="8" fill="#111" /><rect x="78" y="62" width="8" height="8" fill="#111" /><rect x="94" y="62" width="8" height="8" fill="#111" /><rect x="110" y="62" width="8" height="8" fill="#111" /><rect x="126" y="62" width="8" height="8" fill="#111" /><rect x="70" y="70" width="8" height="8" fill="#111" /><rect x="86" y="70" width="8" height="8" fill="#111" /><rect x="102" y="70" width="8" height="8" fill="#111" /><rect x="118" y="70" width="8" height="8" fill="#111" /><rect x="134" y="70" width="8" height="8" fill="#111" /><rect x="62" y="78" width="8" height="8" fill="#111" /><rect x="94" y="78" width="8" height="8" fill="#111" /><rect x="126" y="78" width="8" height="8" fill="#111" /><rect x="78" y="86" width="8" height="8" fill="#111" /><rect x="110" y="86" width="8" height="8" fill="#111" /><rect x="62" y="94" width="8" height="8" fill="#111" /><rect x="86" y="94" width="8" height="8" fill="#111" /><rect x="102" y="94" width="8" height="8" fill="#111" /><rect x="134" y="94" width="8" height="8" fill="#111" />
      <rect x="106" y="62" width="8" height="8" fill="#111" /><rect x="114" y="70" width="8" height="8" fill="#111" /><rect x="130" y="70" width="8" height="8" fill="#111" /><rect x="106" y="78" width="8" height="8" fill="#111" /><rect x="122" y="86" width="8" height="8" fill="#111" /><rect x="106" y="94" width="8" height="8" fill="#111" /><rect x="118" y="94" width="8" height="8" fill="#111" /><rect x="134" y="94" width="8" height="8" fill="#111" />
      <rect x="62" y="106" width="8" height="8" fill="#111" /><rect x="78" y="106" width="8" height="8" fill="#111" /><rect x="94" y="106" width="8" height="8" fill="#111" /><rect x="70" y="114" width="8" height="8" fill="#111" /><rect x="86" y="114" width="8" height="8" fill="#111" /><rect x="62" y="122" width="8" height="8" fill="#111" /><rect x="78" y="130" width="8" height="8" fill="#111" /><rect x="94" y="122" width="8" height="8" fill="#111" /><rect x="70" y="130" width="8" height="8" fill="#111" />
      <rect x="106" y="106" width="8" height="8" fill="#111" /><rect x="122" y="106" width="8" height="8" fill="#111" /><rect x="138" y="106" width="8" height="8" fill="#111" /><rect x="114" y="114" width="8" height="8" fill="#111" /><rect x="130" y="122" width="8" height="8" fill="#111" /><rect x="106" y="130" width="8" height="8" fill="#111" /><rect x="122" y="138" width="8" height="8" fill="#111" /><rect x="138" y="130" width="8" height="8" fill="#111" />
    </svg>
  )

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>Trixa</span>
        <div className="right">
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            style={{ background: 'var(--bg-deep)', border: 'none', borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-secondary)', marginRight: 4 }}
          >
            {lang === 'ko' ? '🇺🇸 EN' : '🇰🇷 KO'}
          </button>
          <span className="icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/qr-issued')}>🔔</span>
          <span className="icon">⚙️</span>
        </div>
      </div>

      <div className="scroll-area">
        <WalletAnchorList />
        <div className="qr-issue-card" onClick={openQR}>
          <div className="qr-left">
            <div className="qr-icon">📱</div>
            <div>
              <div className="qr-title">{b.qrIssueTitle}</div>
              <div className="qr-sub">{b.qrIssueSub}</div>
            </div>
          </div>
        </div>

        <div className="balance-hero">
          <div className="label">{b.heroLabel}</div>
          <div className="amount">295,700<span style={{ fontSize: 20, fontWeight: 700 }}>{c.won}</span></div>
          <div className="amount-rlusd-sub">≈ 215.42 RLUSD · {b.heroSub}</div>
          <div className="refund-available">
            <span className="refund-available-label">{b.availableLabel}</span>
            <span className="refund-available-value">314,900{c.won}</span>
          </div>
          <button className="hero-withdraw-btn" onClick={() => navigate('/wallet-withdraw')}>{c.withdraw}</button>
        </div>

        <div className="section-h">
          <h3>{b.recentTx}</h3>
          <span className="more" style={{ cursor: 'pointer' }} onClick={() => setModal('tx-list')}>{c.viewAll}</span>
        </div>
        <div className="info-card" style={{ padding: '4px 18px', marginBottom: 12 }}>
          {TX_DATA.slice(0, 3).map(tx => (
            <div key={tx.id} className={`tx-item${tx.type === 'withdraw' ? ' out' : ''}`} style={{ cursor: 'pointer' }} onClick={() => openTxDetail(tx)}>
              <div className="ic">{tx.type === 'withdraw' ? '↑' : '↓'}</div>
              <div className="body"><div className="ttl">{tx.title}</div><div className="sub">{tx.sub}</div></div>
              <div className="right"><div className="amt">{tx.amt}</div><div className="when">{tx.rlusd}</div></div>
            </div>
          ))}
        </div>

        <div className="section-h"><h3>{b.recentTaxFree}</h3><span className="more">{c.viewAll}</span></div>
        <div className="case-card">
          <div className="top">
            <div><div className="merchant">{b.case1Merchant}</div><div className="meta">{b.todayTerminal}</div></div>
            <div className="pill success">13,700{c.won}</div>
          </div>
        </div>
        <div className="case-card">
          <div className="top">
            <div><div className="merchant">{b.case2Merchant}</div><div className="meta">{b.todayTerminal}</div></div>
            <div className="pill success">27,400{c.won}</div>
          </div>
        </div>
        <div className="case-card" style={{ opacity: 0.6 }}>
          <div className="top">
            <div><div className="merchant">{b.case3Merchant}</div><div className="meta">{b.yesterday}</div></div>
            <div className="pill" style={{ background: 'var(--bg-deep)', color: 'var(--text-tertiary)' }}>10,800{c.won}</div>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bn-item active"><span className="icon">🏠</span><span className="label">{c.nav.home}</span></div>
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}><span className="icon">💸</span><span className="label">{c.nav.refund}</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">{c.nav.settings}</span></div>
      </div>

      {modal && (
        <div className="overlay" onClick={modal === 'refund-detail' || modal === 'withdraw-detail' ? closeDetail : closeModal}>
          <div className="overlay-sheet" onClick={e => e.stopPropagation()}>

            {modal === 'face-id' && (
              <div className="faceid-wrap">
                <div className="face-scan-ring scanning">
                  <div className="ring-outer" /><div className="ring-middle" /><div className="ring-inner"><div className="scan-line" /></div>
                  <div className="face-icon">😊</div>
                  <div className="corner tl" /><div className="corner tr" /><div className="corner bl" /><div className="corner br" />
                </div>
                <div className="faceid-label">{c.faceId.scanning}</div>
                <div className="faceid-sub">{c.faceId.wait}</div>
              </div>
            )}

            {modal === 'qr' && (
              <div className="qr-modal-wrap">
                <div className="qr-modal-title">{c.qr.title}</div>
                <div className="qr-modal-sub">{c.qr.showToTerminal}</div>
                <div className="qr-code-box">{QR_SVG}</div>
                <div className="qr-timer-row">
                  <span className="qr-timer-icon">⏱</span>
                  <span className="qr-timer-val">{mm}:{ss}</span>
                  <span className="qr-timer-note">{c.qr.expireNote}</span>
                </div>
                <button className="qr-close-btn" onClick={closeModal}>{c.qr.close}</button>
              </div>
            )}

            {modal === 'tx-list' && (
              <div className="tx-list-wrap">
                <div className="tx-list-header">
                  <span className="tx-list-title">{b.txListTitle}</span>
                  <button className="tx-list-close" onClick={closeModal}>✕</button>
                </div>
                <div className="tx-list-scroll">
                  {TX_DATA.map(tx => (
                    <div key={tx.id} className={`tx-item${tx.type === 'withdraw' ? ' out' : ''}`} style={{ cursor: 'pointer' }} onClick={() => openTxDetail(tx)}>
                      <div className="ic">{tx.type === 'withdraw' ? '↑' : '↓'}</div>
                      <div className="body"><div className="ttl">{tx.title}</div><div className="sub">{tx.sub}</div></div>
                      <div className="right"><div className="amt">{tx.amt}</div><div className="when">{tx.rlusd}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modal === 'refund-detail' && selectedTx && (
              <div className="refund-detail-wrap">
                <div className="rd-icon-circle">✓</div>
                <div className="rd-title">{b.refundDetailTitle}</div>
                <div className="rd-amount">{selectedTx.amt.replace('+', '')}</div>
                <div className="rd-from">{selectedTx.merchant}{b.refundFrom}</div>
                <div className="rd-date">{selectedTx.sub}</div>
                <div className="summary-info" style={{ width: '100%', marginTop: 16 }}>
                  <div className="row"><span className="k">{c.source}</span><span className="v">{selectedTx.title}</span></div>
                  <div className="row"><span className="k">RLUSD</span><span className="v">{selectedTx.rlusd}</span></div>
                </div>
                <button className="cta-btn" style={{ marginTop: 16 }} onClick={closeDetail}>{c.confirm}</button>
              </div>
            )}

            {modal === 'withdraw-detail' && selectedTx && (
              <div className="wd-sheet">
                <div className="wd-header">
                  <span className="wd-title">{b.wdTitle}</span>
                  <button className="wd-close" onClick={closeDetail}>✕</button>
                </div>
                <div className="wd-scroll">
                  <div className="wd-timeline">
                    <div className="wd-step">
                      <div className="wd-step-left"><div className="wd-diamond filled" /><div className="wd-line" /></div>
                      <div className="wd-step-body">
                        <div className="wd-step-title">{b.wdStep1}</div>
                        <div className="wd-step-date">{selectedTx.sub} 09:30</div>
                      </div>
                    </div>
                    <div className="wd-step">
                      <div className="wd-step-left"><div className="wd-diamond filled" /><div className="wd-line" /></div>
                      <div className="wd-step-body">
                        <div className="wd-step-title">{b.wdStep2}</div>
                        <div className="wd-step-date">{selectedTx.sub} 09:31</div>
                      </div>
                    </div>
                    <div className="wd-step last">
                      <div className="wd-step-left"><div className="wd-diamond filled" /></div>
                      <div className="wd-step-body">
                        <div className="wd-step-title">{b.wdStep3}</div>
                        <div className="wd-step-date">{selectedTx.sub} 09:32</div>
                        <div className="wd-step-note">{b.wdStepNote}</div>
                        <div className="wd-links">
                          <span className="wd-link">{b.wdNotArrived}</span>
                          <span className="wd-link-sep"> · </span>
                          <span className="wd-link warn">{b.wdReportScam}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="wd-divider" />
                  <div className="summary-info" style={{ marginTop: 0 }}>
                    <div className="row"><span className="k">{c.status}</span><span className="v" style={{ color: 'var(--success)', fontWeight: 700 }}>{c.completed}</span></div>
                    <div className="row"><span className="k">{c.date}</span><span className="v">{selectedTx.sub}</span></div>
                    <div className="row"><span className="k">{c.source}</span><span className="v">{lang === 'ko' ? '잔고' : 'Balance'}</span></div>
                    <div className="row"><span className="k">{c.asset}</span><span className="v">{selectedTx.coin ?? 'RLUSD'}</span></div>
                    <div className="row"><span className="k">{c.withdrawAmount}</span><span className="v">{selectedTx.rlusd}</span></div>
                    <div className="row"><span className="k">{c.networkFee}</span><span className="v">{selectedTx.networkFee}</span></div>
                    <div className="row"><span className="k">{c.address}</span><span className="v" style={{ fontSize: 10, fontFamily: 'monospace' }}>{selectedTx.address ? `${selectedTx.address.slice(0, 6)}...${selectedTx.address.slice(-4)}` : '-'}</span></div>
                    <div className="row"><span className="k">{c.network}</span><span className="v">XRPL</span></div>
                    <div className="row"><span className="k">{c.txId}</span><span className="v" style={{ fontSize: 10, fontFamily: 'monospace' }}>{selectedTx.txId}</span></div>
                  </div>
                  <button className="cta-btn" style={{ marginTop: 16 }} onClick={() => { setModal(null); navigate('/wallet-withdraw') }}>
                    {b.wdAgain}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

function WalletAnchorList() {
  const events = useWalletStore(s => s.events)
  const anchored = useMemo(() => events.filter(e => e.anchor).slice().reverse(), [events])
  const [expanded, setExpanded] = useState(false)
  if (anchored.length === 0) return null
  const DEFAULT_COUNT = 2
  const VISIBLE_WHEN_EXPANDED = 5
  const ROW_HEIGHT = 26
  const hasMore = anchored.length > DEFAULT_COUNT
  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 12 }}>
      <div
        onClick={() => hasMore && setExpanded(v => !v)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, cursor: hasMore ? 'pointer' : 'default' }}
      >
        <span style={{ fontWeight: 700 }}>XRPL Testnet anchors ({anchored.length})</span>
        {hasMore && (
          <span style={{ fontSize: 11, color: '#3182f6' }}>
            {expanded ? '▲ 접기' : `▼ 더보기 (+${anchored.length - DEFAULT_COUNT})`}
          </span>
        )}
      </div>
      <div
        style={{
          maxHeight: expanded ? VISIBLE_WHEN_EXPANDED * ROW_HEIGHT : DEFAULT_COUNT * ROW_HEIGHT,
          overflowY: expanded && anchored.length > VISIBLE_WHEN_EXPANDED ? 'auto' : 'hidden',
        }}
      >
        {(expanded ? anchored : anchored.slice(0, DEFAULT_COUNT)).map(e => (
          <div
            key={e.eventId}
            style={{ display: 'flex', justifyContent: 'space-between', height: ROW_HEIGHT, alignItems: 'center', borderTop: '1px solid #eee' }}
          >
            <span style={{ color: '#888' }}>{e.eventType}</span>
            <a href={e.anchor!.explorerTxUrl} target="_blank" rel="noreferrer" style={{ color: '#3182f6' }}>
              {e.anchor!.txHash.slice(0, 10)}… →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
