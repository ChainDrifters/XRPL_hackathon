import './terminal_card_input.css'

export default function TerminalCardInput() {
  return (
    <div className="terminal-phone">
      <div className="terminal-bar">
        <div className="status-left">
          <div className="status-dot blue" />
          <span className="label">단말기 · 정보 확인</span>
        </div>
        <span className="time">9:41</span>
      </div>

      <div className="terminal-form">
        <div className="form-title">Birth date를<br />확인해 주세요</div>
        <div className="form-sub">면세 처리를 위한 마지막 단계예요</div>

        <div className="dob-block">
          <div className="block-label">생년월일</div>
          <div className="dob-grid">
            <div className="dob-cell"><div className="unit">년</div><div className="value">02</div></div>
            <div className="dob-cell"><div className="unit">월</div><div className="value">11</div></div>
            <div className="dob-cell"><div className="unit">일</div><div className="value">23</div></div>
          </div>
        </div>

        <div className="card-block">
          <div className="block-label">결제 카드</div>
          <div className="card-row">
            <span className="ic">💳</span>
            <div className="info"><div className="ttl">카드</div><div className="sub">터치 또는 삽입</div></div>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="step-list">
          <div className="step-item">
            <div className="step-num done">✓</div>
            <span className="step-text">QR 인식</span>
          </div>
          <div className="step-item">
            <div className="step-num done">✓</div>
            <span className="step-text">Face ID 확인</span>
          </div>
          <div className="step-item current">
            <div className="step-num current">3</div>
            <span className="step-text">생년월일 · 카드 확인</span>
          </div>
        </div>

        <button className="confirm-btn">확인</button>
      </div>
    </div>
  )
}
