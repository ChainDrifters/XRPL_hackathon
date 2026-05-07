import './qr_issued.css'

export default function QRIssued() {
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>
          알림 <span className="notif-badge">1</span>
        </span>
        <div className="right"><span className="icon">⚙️</span></div>
      </div>

      <div className="scroll-area">
        <div className="notif-new">
          <div className="notif-row">
            <div className="notif-icon">🛍️</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">면세 QR 발급됨</div>
                <div className="notif-time">방금</div>
              </div>
              <div className="notif-text">올리브영 명동본점에서 면세 QR이 발급됐어요. 단말기에 보여주세요.</div>
              <div className="notif-cta">QR 보기</div>
            </div>
          </div>
        </div>

        <div className="date-label">어제</div>

        <div className="notif-card">
          <div className="notif-row">
            <div className="notif-icon-green">💰</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">환급 승인</div>
                <div className="notif-time">어제 18:20</div>
              </div>
              <div className="notif-text">신세계 명동점 환급 $8이 승인됐어요.</div>
            </div>
          </div>
        </div>

        <div className="notif-card dim">
          <div className="notif-row">
            <div className="notif-icon-grey">🛂</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">여권 등록 완료</div>
                <div className="notif-time">2일 전</div>
              </div>
              <div className="notif-text">면세 서비스를 이용할 준비가 됐어요.</div>
            </div>
          </div>
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
