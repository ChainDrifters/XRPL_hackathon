import { useNavigate } from 'react-router-dom'
import './register_complete.css'

export default function RegisterComplete() {
  const navigate = useNavigate()

  return (
    <div className="phone" style={{ background: '#fff' }}>
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>

      <div className="complete-content">
        <div className="success-ring">
          <div className="bg" />
          <div className="check">✓</div>
          <div className="outer-ring" />
        </div>

        <div className="complete-title">여권 &amp; Face ID<br />등록 완료!</div>
        <div className="complete-sub">이제 쇼핑 후 단말기에서<br />QR만 보여주면 면세 처리 완료</div>

        <div className="chip-list">
          <div className="chip">
            <span className="ic">🛂</span>
            <div className="body">
              <div className="ttl">여권</div>
              <div className="sub">HONG GILDONG · M12345678</div>
            </div>
            <span className="badge">확인됨</span>
          </div>
          <div className="chip">
            <span className="ic">🆔</span>
            <div className="body">
              <div className="ttl">Face ID</div>
              <div className="sub">생체인증 등록됨</div>
            </div>
            <span className="badge">확인됨</span>
          </div>
        </div>

      </div>

      <div style={{ padding: '0 20px 48px' }}>
        <button
          className="cta-btn"
          style={{ position: 'static', width: '100%' }}
          onClick={() => navigate('/balance-home')}
        >
          면세 쇼핑 시작하기
        </button>
      </div>
    </div>
  )
}
