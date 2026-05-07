import './balance_home.css'

export default function BalanceHome() {
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>알림아이콘</span>
        <div className="right"><span className="icon">🔔</span><span className="icon">⚙️</span></div>
      </div>

      <div className="scroll-area">
        <div className="balance-hero">
          <div className="blob" />
          <div className="label">면세 QR 발급</div>
          <div className="amount">$500</div>
          <div className="actions">
            <button className="btn-primary">면세 QR 발급</button>
            <button className="btn-ghost">환급 받기</button>
          </div>
        </div>

        <div className="section-h"><h3>최근 면세 내역</h3><span className="more">전체보기 ›</span></div>

        <div className="case-card">
          <div className="top">
            <div><div className="merchant">올리브영 명동</div><div className="meta">오늘 · 단말기 인식</div></div>
            <div className="pill success">$10</div>
          </div>
        </div>
        <div className="case-card">
          <div className="top">
            <div><div className="merchant">롯데백화점</div><div className="meta">오늘 · 단말기 인식</div></div>
            <div className="pill success">$20</div>
          </div>
        </div>
        <div className="case-card" style={{ opacity: 0.6 }}>
          <div className="top">
            <div><div className="merchant">신세계 명동점</div><div className="meta">어제</div></div>
            <div className="pill" style={{ background: 'var(--bg-deep)', color: 'var(--text-tertiary)' }}>$8</div>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bn-item active"><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item"><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">📋</span><span className="label">활동</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>
    </div>
  )
}
