import './face_id_timer.css'

export default function FaceIdTimer() {
  return (
    <div className="phone timer-phone">
      <div className="notch" style={{ background: '#0a0f1e' }} />
      <div className="status-bar" style={{ color: 'white' }}><span>9:41</span><span>📶 🔋</span></div>

      <div className="timer-content">
        <div className="timer-ring">
          <svg viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle cx="110" cy="110" r="100" fill="none" stroke="#3182F6" strokeWidth="8"
              strokeDasharray="628" strokeDashoffset="157" strokeLinecap="round" />
          </svg>
          <div className="timer-inner">
            <div className="timer-value">2:47</div>
            <div className="timer-sub">QR 유효시간</div>
          </div>
        </div>

        <div className="auth-status">인증 완료</div>
        <div className="auth-title">Face ID 인증 중...</div>
        <div className="auth-desc">화면을 보여주면<br />면세 QR이 자동으로 표시돼요</div>

        <div className="timer-actions">
          <button className="btn-cancel">취소</button>
        </div>
      </div>
    </div>
  )
}
