import { useNavigate } from 'react-router-dom'
import './onboarding_start.css'

export default function OnboardingStart() {
  const navigate = useNavigate()

  return (
    <div className="phone" style={{ background: '#fff' }}>
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="onboarding-hero">
          <div className="hero-icon">🛍️</div>
          <div className="hero-title">한국 쇼핑,<br />세금 돌려받아요</div>
          <div className="hero-sub">외국인 여행자 면세 환급을<br />앱 하나로 간편하게</div>
        </div>

        <div className="onboarding-cta">
          <div className="feature-row">
            <span className="ic">🛂</span>
            <div><div className="ttl">여권 한 번 등록</div><div className="sub">이후엔 자동으로 면세 적용</div></div>
          </div>
          <div className="feature-row">
            <span className="ic">💸</span>
            <div><div className="ttl">결제 즉시 환급 확정</div><div className="sub">복잡한 서류 없이 자동 처리</div></div>
          </div>
          <div className="feature-row">
            <span className="ic">🏦</span>
            <div><div className="ttl">원하는 방법으로 수령</div><div className="sub">카드·계좌·현금 모두 가능</div></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 48px' }}>
        <button className="cta-btn" onClick={() => navigate('/passport-register')}>
          시작하기
        </button>
      </div>
    </div>
  )
}
