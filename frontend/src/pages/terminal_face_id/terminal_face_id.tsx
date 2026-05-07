import './terminal_face_id.css'

export default function TerminalFaceId() {
  return (
    <div className="terminal-phone">
      <div className="terminal-bar">
        <div className="status-left">
          <div className="status-dot orange" />
          <span className="label">단말기 · 인식중</span>
        </div>
        <span className="time">9:41</span>
      </div>

      <div className="terminal-content">
        <div className="face-ring">
          <div className="r1" /><div className="r2" /><div className="r3" />
          <div className="face">😐</div>
        </div>

        <div className="scanning-label">인식 중...</div>
        <div className="terminal-title">Face ID로<br />본인 확인 중이에요</div>
        <div className="terminal-sub">카메라를 정면으로 봐주세요</div>

        <div className="step-row">
          <span className="step-label">QR 인식</span>
          <span className="step-status done">✓ 완료</span>
        </div>
        <div className="step-row active">
          <span className="step-label">Face ID 확인</span>
          <span className="step-status in-progress">진행 중</span>
        </div>
      </div>
    </div>
  )
}
