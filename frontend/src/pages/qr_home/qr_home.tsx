import { useNavigate } from 'react-router-dom'
import './qr_home.css'

export default function QRHome() {
  const navigate = useNavigate()
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>알림아이콘</span>
        <div className="right">
          <span className="icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/qr-issued')}>🔔</span>
          <span className="icon">⚙️</span>
        </div>
      </div>

      <div className="scroll-area">
        <div className="qr-issue-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/qr-issued')}>
          <div className="blob-1" />
          <div className="blob-2" />
          <div className="inner">
            <div className="sub-label">탭해서 면세 QR 발급</div>
            <div className="main-title">면세 QR 발급</div>
            <div className="desc">단말기에 보여주세요</div>
            <div className="qr-row">
              <div className="qr-mini"><div className="qr-mini-inner" /></div>
              <div>
                <div className="qr-timer-label">유효시간</div>
                <div className="qr-timer">2:47</div>
                <div className="qr-timer-note">Face ID 필요시 재발급</div>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-card" style={{ marginBottom: 12 }}>
          <div className="label">보관 중인 환급금</div>
          <div className="amount">685,000<span className="currency" style={{ fontSize: 14, marginLeft: 4 }}>원</span></div>
          <div className="row">
            <div className="stat"><div className="stat-label">이번 달 환급</div><div className="stat-value">52,000원</div></div>
            <div className="stat"><div className="stat-label">적용된 면세</div><div className="stat-value">12건</div></div>
          </div>
        </div>

        <div className="section-h"><h3>최근 면세 내역</h3><span className="more">전체보기 ›</span></div>

        <div className="case-card">
          <div className="top">
            <div><div className="merchant">올리브영 명동본점</div><div className="meta">방금 전 · 단말기 인식 완료</div></div>
            <div className="pill success">16,440원</div>
          </div>
        </div>
        <div className="case-card">
          <div className="top">
            <div><div className="merchant">신세계 명동점</div><div className="meta">1시간 전</div></div>
            <div className="pill">+10,800원</div>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bn-item active"><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>
    </div>
  )
}
