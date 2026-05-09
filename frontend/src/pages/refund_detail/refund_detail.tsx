import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import './refund_detail.css'
import '../balance_home/balance_home.css'
import { useLang } from '../../i18n/LangContext'

type ModalPhase = 'face-id' | 'qr' | null

export default function RefundDetail() {
  const navigate = useNavigate()
  const { t } = useLang()
  const d = t.refundDetail
  const c = t.common
  const [modal, setModal] = useState<ModalPhase>(null)
  const [seconds, setSeconds] = useState(180)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function openQR() {
    setModal('face-id')
    setTimeout(() => { setModal('qr'); setSeconds(180) }, 2200)
  }

  function closeModal() { setModal(null); if (timerRef.current) clearInterval(timerRef.current) }

  useEffect(() => {
    if (modal === 'qr') {
      timerRef.current = setInterval(() => {
        setSeconds(s => { if (s <= 1) { clearInterval(timerRef.current!); setModal(null); return 0 } return s - 1 })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [modal])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}>‹</span>
        <span className="nav-title">{d.navTitle}</span>
        <div className="right"><span className="icon">🔗</span></div>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div className="summary-card">
          <div className="label">{d.oliveyoungLabel}</div>
          <div className="amount">12,400<span className="currency">{c.won}</span></div>
          <div className="row">
            <div className="stat"><div className="stat-label">{d.purchaseAmt}</div><div className="stat-value">156,000{c.won}</div></div>
            <div className="stat"><div className="stat-label">{d.refundProgress}</div><div className="stat-value">{d.progressOlive}</div></div>
          </div>
        </div>

        <div className="section-h"><h3>{d.sectionProgress}</h3></div>
        <div className="timeline">
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content"><div className="tl-title">{d.s1}</div><div className="tl-time">{d.s1tO}</div></div>
          </div>
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content"><div className="tl-title">{d.s2}</div><div className="tl-time">{d.s2tO}</div></div>
          </div>
          <div className="tl-item current">
            <div className="tl-dot">3</div>
            <div className="tl-content"><div className="tl-title">{d.s3}</div><div className="tl-time">{d.s3tO}</div></div>
          </div>
          <div className="tl-item">
            <div className="tl-dot">4</div>
            <div className="tl-content"><div className="tl-title">{d.s4}</div><div className="tl-time">{d.s4tO}</div></div>
          </div>
          <div className="tl-item">
            <div className="tl-dot">5</div>
            <div className="tl-content"><div className="tl-title">{d.s5}</div><div className="tl-time">{d.s5t}</div></div>
          </div>
        </div>

        <div className="section-h"><h3>{d.sectionPurchase}</h3></div>
        <div className="info-card">
          <div className="info-row"><span className="key">{d.store}</span><span className="val">올리브영 명동본점</span></div>
          <div className="info-row"><span className="key">{d.purchaseDate}</span><span className="val">2026.05.02 14:32</span></div>
          <div className="info-row"><span className="key">{d.payMethod}</span><span className="val">VISA •••• 4521</span></div>
          <div className="info-row"><span className="key">{d.totalPurchase}</span><span className="val">156,000{c.won}</span></div>
          <div className="info-row"><span className="key">VAT</span><span className="val">14,182{c.won}</span></div>
          <div className="info-row">
            <span className="key">{d.expectedRefund}</span>
            <span className="val" style={{ color: 'var(--toss-blue)' }}>+12,400{c.won}</span>
          </div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn" onClick={openQR}>{d.showKiosk}</button>
      </div>
      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">{c.nav.home}</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">{c.nav.refund}</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">{c.nav.settings}</span></div>
      </div>

      {modal && (
        <div className="overlay" onClick={closeModal}>
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
                <div className="qr-code-box">
                  <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                    <rect x="10" y="10" width="44" height="44" rx="4" fill="#111" /><rect x="18" y="18" width="28" height="28" rx="2" fill="white" /><rect x="24" y="24" width="16" height="16" rx="1" fill="#111" />
                    <rect x="106" y="10" width="44" height="44" rx="4" fill="#111" /><rect x="114" y="18" width="28" height="28" rx="2" fill="white" /><rect x="120" y="24" width="16" height="16" rx="1" fill="#111" />
                    <rect x="10" y="106" width="44" height="44" rx="4" fill="#111" /><rect x="18" y="114" width="28" height="28" rx="2" fill="white" /><rect x="24" y="120" width="16" height="16" rx="1" fill="#111" />
                    <rect x="62" y="10" width="8" height="8" fill="#111" /><rect x="78" y="10" width="8" height="8" fill="#111" /><rect x="70" y="18" width="8" height="8" fill="#111" /><rect x="86" y="18" width="8" height="8" fill="#111" /><rect x="62" y="26" width="8" height="8" fill="#111" /><rect x="78" y="34" width="8" height="8" fill="#111" /><rect x="86" y="42" width="8" height="8" fill="#111" /><rect x="62" y="42" width="8" height="8" fill="#111" />
                    <rect x="10" y="62" width="8" height="8" fill="#111" /><rect x="26" y="62" width="8" height="8" fill="#111" /><rect x="42" y="62" width="8" height="8" fill="#111" /><rect x="18" y="70" width="8" height="8" fill="#111" /><rect x="34" y="70" width="8" height="8" fill="#111" /><rect x="10" y="78" width="8" height="8" fill="#111" /><rect x="42" y="78" width="8" height="8" fill="#111" /><rect x="18" y="86" width="8" height="8" fill="#111" /><rect x="26" y="94" width="8" height="8" fill="#111" /><rect x="42" y="94" width="8" height="8" fill="#111" />
                    <rect x="62" y="62" width="8" height="8" fill="#111" /><rect x="78" y="62" width="8" height="8" fill="#111" /><rect x="94" y="62" width="8" height="8" fill="#111" /><rect x="110" y="62" width="8" height="8" fill="#111" /><rect x="126" y="62" width="8" height="8" fill="#111" /><rect x="70" y="70" width="8" height="8" fill="#111" /><rect x="86" y="70" width="8" height="8" fill="#111" /><rect x="102" y="70" width="8" height="8" fill="#111" /><rect x="118" y="70" width="8" height="8" fill="#111" /><rect x="134" y="70" width="8" height="8" fill="#111" /><rect x="62" y="78" width="8" height="8" fill="#111" /><rect x="94" y="78" width="8" height="8" fill="#111" /><rect x="126" y="78" width="8" height="8" fill="#111" /><rect x="78" y="86" width="8" height="8" fill="#111" /><rect x="110" y="86" width="8" height="8" fill="#111" /><rect x="62" y="94" width="8" height="8" fill="#111" /><rect x="86" y="94" width="8" height="8" fill="#111" /><rect x="102" y="94" width="8" height="8" fill="#111" /><rect x="134" y="94" width="8" height="8" fill="#111" />
                    <rect x="106" y="62" width="8" height="8" fill="#111" /><rect x="114" y="70" width="8" height="8" fill="#111" /><rect x="130" y="70" width="8" height="8" fill="#111" /><rect x="106" y="78" width="8" height="8" fill="#111" /><rect x="122" y="86" width="8" height="8" fill="#111" /><rect x="106" y="94" width="8" height="8" fill="#111" /><rect x="118" y="94" width="8" height="8" fill="#111" /><rect x="134" y="94" width="8" height="8" fill="#111" />
                    <rect x="62" y="106" width="8" height="8" fill="#111" /><rect x="78" y="106" width="8" height="8" fill="#111" /><rect x="94" y="106" width="8" height="8" fill="#111" /><rect x="70" y="114" width="8" height="8" fill="#111" /><rect x="86" y="114" width="8" height="8" fill="#111" /><rect x="62" y="122" width="8" height="8" fill="#111" /><rect x="78" y="130" width="8" height="8" fill="#111" /><rect x="94" y="122" width="8" height="8" fill="#111" /><rect x="70" y="130" width="8" height="8" fill="#111" />
                    <rect x="106" y="106" width="8" height="8" fill="#111" /><rect x="122" y="106" width="8" height="8" fill="#111" /><rect x="138" y="106" width="8" height="8" fill="#111" /><rect x="114" y="114" width="8" height="8" fill="#111" /><rect x="130" y="122" width="8" height="8" fill="#111" /><rect x="106" y="130" width="8" height="8" fill="#111" /><rect x="122" y="138" width="8" height="8" fill="#111" /><rect x="138" y="130" width="8" height="8" fill="#111" />
                  </svg>
                </div>
                <div className="qr-timer-row">
                  <span className="qr-timer-icon">⏱</span>
                  <span className="qr-timer-val">{mm}:{ss}</span>
                  <span className="qr-timer-note">{c.qr.expireNote}</span>
                </div>
                <button className="qr-close-btn" onClick={closeModal}>{c.qr.close}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
