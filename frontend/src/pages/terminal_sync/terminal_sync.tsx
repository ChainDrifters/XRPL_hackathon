import './terminal_sync.css'

export default function TerminalSync() {
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back">‹</span>
        <span className="nav-title">당일 면세 내역</span>
        <div className="right"><span className="icon">🔗</span></div>
      </div>

      <div className="scroll-area">
        <div className="today-summary">
          <div className="label">오늘 면세 적용된 곳</div>
          <div className="amount">$30 <span className="sub">환급 예정</span></div>
          <div className="status-chip">💳 결제 완료</div>
        </div>

        <div className="section-h"><h3>면세 적용 내역</h3></div>

        <div className="receipt-list">
          <div className="receipt-item">
            <div className="receipt-icon blue">🛍️</div>
            <div className="receipt-body">
              <div className="name">올리브영</div>
              <div className="time">오후 2:32 · 단말기 인식</div>
            </div>
            <div className="receipt-amt">
              <div className="usd">$10</div>
              <div className="krw">₩13,700</div>
            </div>
          </div>
          <div className="receipt-item">
            <div className="receipt-icon yellow">🏬</div>
            <div className="receipt-body">
              <div className="name">롯데백화점</div>
              <div className="time">오후 4:15 · 단말기 인식</div>
            </div>
            <div className="receipt-amt">
              <div className="usd">$20</div>
              <div className="krw">₩27,400</div>
            </div>
          </div>
        </div>

        <div className="total-card">
          <div>
            <div className="label">총 환급 예정</div>
            <div className="note">출국 후 수령 방법 선택 가능</div>
          </div>
          <div className="amount">$30</div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bn-item"><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">📋</span><span className="label">활동</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>
    </div>
  )
}
