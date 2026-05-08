import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import './balance_home.css'
import '../refund_storage/refund_storage.css'

type ModalPhase = 'face-id' | 'qr' | null

export default function BalanceHome() {
  const navigate = useNavigate()
  const [modal, setModal] = useState<ModalPhase>(null)
  const [seconds, setSeconds] = useState(180)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function openQR() {
    setModal('qr')
    setSeconds(180)
  }

  function closeModal() {
    setModal(null)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    if (modal === 'qr') {
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(timerRef.current!)
            setModal(null)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [modal])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>Trixa</span>
        <div className="right"><span className="icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/qr-issued')}>🔔</span><span className="icon">⚙️</span></div>
      </div>

      <div className="scroll-area">
        <div className="qr-issue-card" onClick={openQR}>
          <div className="qr-left">
            <div className="qr-icon">📱</div>
            <div>
              <div className="qr-title">면세 QR 발급하기</div>
              <div className="qr-sub">단말기에 보여주세요</div>
            </div>
          </div>
        </div>

        <div className="balance-hero">
          <div className="label">보관 중인 환급액</div>
          <div className="amount">295,700<span style={{ fontSize: 20, fontWeight: 700 }}>원</span></div>
          <div className="amount-rlusd-sub">≈ 215.42 RLUSD · 토스가 안전하게 보관 중</div>
          <div className="refund-available">
            <span className="refund-available-label">받을 수 있는 환급액</span>
            <span className="refund-available-value">314,900원</span>
          </div>
          <button className="hero-withdraw-btn" onClick={() => navigate('/wallet-withdraw')}>출금하기</button>
        </div>


        <div className="section-h"><h3>최근 입출금</h3><span className="more">전체보기 ›</span></div>
        <div className="info-card" style={{ padding: '4px 18px', marginBottom: 12 }}>
          <div className="tx-item">
            <div className="ic">↓</div>
            <div className="body"><div className="ttl">롯데면세점 환급</div><div className="sub">5월 1일 14:22</div></div>
            <div className="right"><div className="amt">+286,100원</div><div className="when">208.41 RLUSD</div></div>
          </div>
          <div className="tx-item">
            <div className="ic">↓</div>
            <div className="body"><div className="ttl">아모레퍼시픽 환급</div><div className="sub">4월 30일 18:05</div></div>
            <div className="right"><div className="amt">+9,600원</div><div className="when">7.01 RLUSD</div></div>
          </div>
          <div className="tx-item out">
            <div className="ic">↑</div>
            <div className="body"><div className="ttl">Coinbase로 출금</div><div className="sub">4월 25일 09:30</div></div>
            <div className="right"><div className="amt">-50,000원</div><div className="when">36.45 RLUSD</div></div>
          </div>
        </div>


        <div className="section-h"><h3>최근 면세 내역</h3><span className="more">전체보기 ›</span></div>

        <div className="case-card">
          <div className="top">
            <div><div className="merchant">올리브영 명동</div><div className="meta">오늘 · 단말기 인식</div></div>
            <div className="pill success">13,700원</div>
          </div>
        </div>
        <div className="case-card">
          <div className="top">
            <div><div className="merchant">롯데백화점</div><div className="meta">오늘 · 단말기 인식</div></div>
            <div className="pill success">27,400원</div>
          </div>
        </div>
        <div className="case-card" style={{ opacity: 0.6 }}>
          <div className="top">
            <div><div className="merchant">신세계 명동점</div><div className="meta">어제</div></div>
            <div className="pill" style={{ background: 'var(--bg-deep)', color: 'var(--text-tertiary)' }}>10,800원</div>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bn-item active"><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>

      {/* ── 오버레이 ── */}
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
                  {/* SVG QR 패턴 */}
                  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* 모서리 파인더 패턴 */}
                    <rect x="10" y="10" width="44" height="44" rx="4" fill="#111" />
                    <rect x="18" y="18" width="28" height="28" rx="2" fill="white" />
                    <rect x="24" y="24" width="16" height="16" rx="1" fill="#111" />

                    <rect x="106" y="10" width="44" height="44" rx="4" fill="#111" />
                    <rect x="114" y="18" width="28" height="28" rx="2" fill="white" />
                    <rect x="120" y="24" width="16" height="16" rx="1" fill="#111" />

                    <rect x="10" y="106" width="44" height="44" rx="4" fill="#111" />
                    <rect x="18" y="114" width="28" height="28" rx="2" fill="white" />
                    <rect x="24" y="120" width="16" height="16" rx="1" fill="#111" />

                    {/* 데이터 셀 */}
                    <rect x="62" y="10" width="8" height="8" fill="#111" />
                    <rect x="78" y="10" width="8" height="8" fill="#111" />
                    <rect x="62" y="26" width="8" height="8" fill="#111" />
                    <rect x="70" y="18" width="8" height="8" fill="#111" />
                    <rect x="86" y="18" width="8" height="8" fill="#111" />
                    <rect x="78" y="34" width="8" height="8" fill="#111" />
                    <rect x="86" y="42" width="8" height="8" fill="#111" />
                    <rect x="62" y="42" width="8" height="8" fill="#111" />

                    <rect x="10" y="62" width="8" height="8" fill="#111" />
                    <rect x="26" y="62" width="8" height="8" fill="#111" />
                    <rect x="42" y="62" width="8" height="8" fill="#111" />
                    <rect x="18" y="70" width="8" height="8" fill="#111" />
                    <rect x="34" y="70" width="8" height="8" fill="#111" />
                    <rect x="10" y="78" width="8" height="8" fill="#111" />
                    <rect x="42" y="78" width="8" height="8" fill="#111" />
                    <rect x="18" y="86" width="8" height="8" fill="#111" />
                    <rect x="26" y="94" width="8" height="8" fill="#111" />
                    <rect x="42" y="94" width="8" height="8" fill="#111" />

                    <rect x="62" y="62" width="8" height="8" fill="#111" />
                    <rect x="78" y="62" width="8" height="8" fill="#111" />
                    <rect x="94" y="62" width="8" height="8" fill="#111" />
                    <rect x="110" y="62" width="8" height="8" fill="#111" />
                    <rect x="126" y="62" width="8" height="8" fill="#111" />
                    <rect x="70" y="70" width="8" height="8" fill="#111" />
                    <rect x="86" y="70" width="8" height="8" fill="#111" />
                    <rect x="102" y="70" width="8" height="8" fill="#111" />
                    <rect x="118" y="70" width="8" height="8" fill="#111" />
                    <rect x="134" y="70" width="8" height="8" fill="#111" />
                    <rect x="62" y="78" width="8" height="8" fill="#111" />
                    <rect x="94" y="78" width="8" height="8" fill="#111" />
                    <rect x="126" y="78" width="8" height="8" fill="#111" />
                    <rect x="78" y="86" width="8" height="8" fill="#111" />
                    <rect x="110" y="86" width="8" height="8" fill="#111" />
                    <rect x="62" y="94" width="8" height="8" fill="#111" />
                    <rect x="86" y="94" width="8" height="8" fill="#111" />
                    <rect x="102" y="94" width="8" height="8" fill="#111" />
                    <rect x="134" y="94" width="8" height="8" fill="#111" />

                    <rect x="106" y="62" width="8" height="8" fill="#111" />
                    <rect x="114" y="70" width="8" height="8" fill="#111" />
                    <rect x="130" y="70" width="8" height="8" fill="#111" />
                    <rect x="106" y="78" width="8" height="8" fill="#111" />
                    <rect x="122" y="86" width="8" height="8" fill="#111" />
                    <rect x="106" y="94" width="8" height="8" fill="#111" />
                    <rect x="118" y="94" width="8" height="8" fill="#111" />
                    <rect x="134" y="94" width="8" height="8" fill="#111" />

                    <rect x="62" y="106" width="8" height="8" fill="#111" />
                    <rect x="78" y="106" width="8" height="8" fill="#111" />
                    <rect x="94" y="106" width="8" height="8" fill="#111" />
                    <rect x="70" y="114" width="8" height="8" fill="#111" />
                    <rect x="86" y="114" width="8" height="8" fill="#111" />
                    <rect x="62" y="122" width="8" height="8" fill="#111" />
                    <rect x="78" y="130" width="8" height="8" fill="#111" />
                    <rect x="94" y="122" width="8" height="8" fill="#111" />
                    <rect x="70" y="130" width="8" height="8" fill="#111" />

                    <rect x="106" y="106" width="8" height="8" fill="#111" />
                    <rect x="122" y="106" width="8" height="8" fill="#111" />
                    <rect x="138" y="106" width="8" height="8" fill="#111" />
                    <rect x="114" y="114" width="8" height="8" fill="#111" />
                    <rect x="130" y="122" width="8" height="8" fill="#111" />
                    <rect x="106" y="130" width="8" height="8" fill="#111" />
                    <rect x="122" y="138" width="8" height="8" fill="#111" />
                    <rect x="138" y="130" width="8" height="8" fill="#111" />
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
