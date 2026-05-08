import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import './refund_detail.css'
import '../balance_home/balance_home.css'

type ModalPhase = 'face-id' | 'qr' | null

export default function RefundDetail() {
  const navigate = useNavigate()
  const [modal, setModal] = useState<ModalPhase>(null)
  const [seconds, setSeconds] = useState(180)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function openQR() {
    setModal('face-id')
    setTimeout(() => {
      setModal('qr')
      setSeconds(180)
    }, 2200)
  }

  function closeModal() {
    setModal(null)
    if (timerRef.current) clearInterval(timerRef.current)
  }

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

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}>‹</span>
        <span className="nav-title">환급 상세</span>
        <div className="right"><span className="icon">🔗</span></div>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div className="summary-card">
          <div className="label">올리브영 명동본점에서 받을 환급</div>
          <div className="amount">12,400<span className="currency">원</span></div>
          <div className="row">
            <div className="stat">
              <div className="stat-label">구매 금액</div>
              <div className="stat-value">156,000원</div>
            </div>
            <div className="stat">
              <div className="stat-label">환급 진행</div>
              <div className="stat-value">3 / 5 단계</div>
            </div>
          </div>
        </div>

        <div className="section-h"><h3>진행 상황</h3></div>
        <div className="timeline">
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content">
              <div className="tl-title">구매 완료</div>
              <div className="tl-time">5월 2일 14:32 · 면세 가맹점에서 결제</div>
            </div>
          </div>
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content">
              <div className="tl-title">면세 자격 확인</div>
              <div className="tl-time">5월 2일 14:33 · 환급사업자 자동 승인</div>
            </div>
          </div>
          <div className="tl-item current">
            <div className="tl-dot">3</div>
            <div className="tl-content">
              <div className="tl-title">키오스크에 보여주기</div>
              <div className="tl-time">면세 QR을 발급하여 단말기에 보여주세요</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-dot">4</div>
            <div className="tl-content">
              <div className="tl-title">세관 반출 확인</div>
              <div className="tl-time">키오스크 통과 후 자동 진행</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-dot">5</div>
            <div className="tl-content">
              <div className="tl-title">환급 완료</div>
              <div className="tl-time">평균 1~3일 안에 받아요</div>
            </div>
          </div>
        </div>

        <div className="section-h"><h3>구매 내역</h3></div>
        <div className="info-card">
          <div className="info-row"><span className="key">매장</span><span className="val">올리브영 명동본점</span></div>
          <div className="info-row"><span className="key">구매 일시</span><span className="val">2026.05.02 14:32</span></div>
          <div className="info-row"><span className="key">결제 수단</span><span className="val">VISA •••• 4521</span></div>
          <div className="info-row"><span className="key">총 구매액</span><span className="val">156,000원</span></div>
          <div className="info-row"><span className="key">VAT</span><span className="val">14,182원</span></div>
          <div className="info-row">
            <span className="key">예상 환급액</span>
            <span className="val" style={{ color: 'var(--toss-blue)' }}>+12,400원</span>
          </div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn" onClick={openQR}>키오스크에 보여주기</button>
      </div>
      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>

      {modal && (
        <div className="overlay" onClick={closeModal}>
          <div className="overlay-sheet" onClick={e => e.stopPropagation()}>

            {modal === 'face-id' && (
              <div className="faceid-wrap">
                <div className="face-scan-ring scanning">
                  <div className="ring-outer" />
                  <div className="ring-middle" />
                  <div className="ring-inner">
                    <div className="scan-line" />
                  </div>
                  <div className="face-icon">😊</div>
                  <div className="corner tl" />
                  <div className="corner tr" />
                  <div className="corner bl" />
                  <div className="corner br" />
                </div>
                <div className="faceid-label">얼굴을 인식하고 있어요</div>
                <div className="faceid-sub">잠시만 기다려 주세요...</div>
              </div>
            )}

            {modal === 'qr' && (
              <div className="qr-modal-wrap">
                <div className="qr-modal-title">면세 QR</div>
                <div className="qr-modal-sub">단말기 화면에 가까이 대주세요</div>
                <div className="qr-code-box">
                  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="44" height="44" rx="4" fill="#111" />
                    <rect x="18" y="18" width="28" height="28" rx="2" fill="white" />
                    <rect x="24" y="24" width="16" height="16" rx="1" fill="#111" />
                    <rect x="106" y="10" width="44" height="44" rx="4" fill="#111" />
                    <rect x="114" y="18" width="28" height="28" rx="2" fill="white" />
                    <rect x="120" y="24" width="16" height="16" rx="1" fill="#111" />
                    <rect x="10" y="106" width="44" height="44" rx="4" fill="#111" />
                    <rect x="18" y="114" width="28" height="28" rx="2" fill="white" />
                    <rect x="24" y="120" width="16" height="16" rx="1" fill="#111" />
                    <rect x="62" y="10" width="8" height="8" fill="#111" /><rect x="78" y="10" width="8" height="8" fill="#111" />
                    <rect x="62" y="26" width="8" height="8" fill="#111" /><rect x="70" y="18" width="8" height="8" fill="#111" />
                    <rect x="86" y="18" width="8" height="8" fill="#111" /><rect x="78" y="34" width="8" height="8" fill="#111" />
                    <rect x="86" y="42" width="8" height="8" fill="#111" /><rect x="62" y="42" width="8" height="8" fill="#111" />
                    <rect x="10" y="62" width="8" height="8" fill="#111" /><rect x="26" y="62" width="8" height="8" fill="#111" />
                    <rect x="42" y="62" width="8" height="8" fill="#111" /><rect x="18" y="70" width="8" height="8" fill="#111" />
                    <rect x="34" y="70" width="8" height="8" fill="#111" /><rect x="10" y="78" width="8" height="8" fill="#111" />
                    <rect x="42" y="78" width="8" height="8" fill="#111" /><rect x="18" y="86" width="8" height="8" fill="#111" />
                    <rect x="26" y="94" width="8" height="8" fill="#111" /><rect x="42" y="94" width="8" height="8" fill="#111" />
                    <rect x="62" y="62" width="8" height="8" fill="#111" /><rect x="78" y="62" width="8" height="8" fill="#111" />
                    <rect x="94" y="62" width="8" height="8" fill="#111" /><rect x="110" y="62" width="8" height="8" fill="#111" />
                    <rect x="126" y="62" width="8" height="8" fill="#111" /><rect x="70" y="70" width="8" height="8" fill="#111" />
                    <rect x="86" y="70" width="8" height="8" fill="#111" /><rect x="102" y="70" width="8" height="8" fill="#111" />
                    <rect x="118" y="70" width="8" height="8" fill="#111" /><rect x="134" y="70" width="8" height="8" fill="#111" />
                    <rect x="62" y="78" width="8" height="8" fill="#111" /><rect x="94" y="78" width="8" height="8" fill="#111" />
                    <rect x="126" y="78" width="8" height="8" fill="#111" /><rect x="78" y="86" width="8" height="8" fill="#111" />
                    <rect x="110" y="86" width="8" height="8" fill="#111" /><rect x="62" y="94" width="8" height="8" fill="#111" />
                    <rect x="86" y="94" width="8" height="8" fill="#111" /><rect x="102" y="94" width="8" height="8" fill="#111" />
                    <rect x="134" y="94" width="8" height="8" fill="#111" /><rect x="106" y="62" width="8" height="8" fill="#111" />
                    <rect x="114" y="70" width="8" height="8" fill="#111" /><rect x="130" y="70" width="8" height="8" fill="#111" />
                    <rect x="106" y="78" width="8" height="8" fill="#111" /><rect x="122" y="86" width="8" height="8" fill="#111" />
                    <rect x="106" y="94" width="8" height="8" fill="#111" /><rect x="118" y="94" width="8" height="8" fill="#111" />
                    <rect x="134" y="94" width="8" height="8" fill="#111" /><rect x="62" y="106" width="8" height="8" fill="#111" />
                    <rect x="78" y="106" width="8" height="8" fill="#111" /><rect x="94" y="106" width="8" height="8" fill="#111" />
                    <rect x="70" y="114" width="8" height="8" fill="#111" /><rect x="86" y="114" width="8" height="8" fill="#111" />
                    <rect x="62" y="122" width="8" height="8" fill="#111" /><rect x="78" y="130" width="8" height="8" fill="#111" />
                    <rect x="94" y="122" width="8" height="8" fill="#111" /><rect x="70" y="130" width="8" height="8" fill="#111" />
                    <rect x="106" y="106" width="8" height="8" fill="#111" /><rect x="122" y="106" width="8" height="8" fill="#111" />
                    <rect x="138" y="106" width="8" height="8" fill="#111" /><rect x="114" y="114" width="8" height="8" fill="#111" />
                    <rect x="130" y="122" width="8" height="8" fill="#111" /><rect x="106" y="130" width="8" height="8" fill="#111" />
                    <rect x="122" y="138" width="8" height="8" fill="#111" /><rect x="138" y="130" width="8" height="8" fill="#111" />
                  </svg>
                </div>
                <div className="qr-timer-row">
                  <span className="qr-timer-icon">⏱</span>
                  <span className="qr-timer-val">{mm}:{ss}</span>
                  <span className="qr-timer-note">후 만료</span>
                </div>
                <button className="qr-close-btn" onClick={closeModal}>닫기</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
