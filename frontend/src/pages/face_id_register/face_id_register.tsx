import './face_id_register.css'

export default function FaceIdRegister() {
  return (
    <div className="phone faceid-phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back">‹</span>
        <span className="nav-title">Face ID 등록</span>
      </div>

      <div className="faceid-content">
        <div className="face-scan-ring">
          <div className="ring-outer" />
          <div className="ring-middle" />
          <div className="ring-inner">
            <div className="scan-line" />
          </div>
          <div className="face-icon">😐</div>
          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />
        </div>

        <div className="faceid-title">Face ID를 등록해주세요</div>
        <div className="faceid-sub">
          면세 QR 발급 시 본인 확인에 사용돼요.<br />등록은 한 번만 해요.
        </div>

        <div className="faceid-actions">
          <button className="cta-btn" style={{ background: '#3182f6' }}>얼굴 인식 시작</button>
          <button className="btn-dark-secondary">나중에 하기</button>
        </div>
      </div>
    </div>
  )
}
