import { useNavigate } from 'react-router-dom'
import './shopping_history.css'

export default function ShoppingHistory() {
  const navigate = useNavigate()
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>알림아이콘</span>
        <div className="right"><span className="icon">🔔</span><span className="icon">⚙️</span></div>
      </div>

      <div className="scroll-area">
        <div className="today-total-card">
          <div className="header">
            <div>
              <div className="label">오늘 총 환급 예정</div>
              <div className="amount">41,100원</div>
            </div>
            <div className="badge">결제완료</div>
          </div>
          <div className="divider" />
          <div className="today-item-list">
            <div className="today-item">
              <div className="left"><span className="ic">🛍️</span><span className="name">올리브영</span></div>
              <span className="usd">13,700원</span>
            </div>
            <div className="today-item">
              <div className="left"><span className="ic">🏬</span><span className="name">롯데백화점</span></div>
              <span className="usd">27,400원</span>
            </div>
          </div>
        </div>

        <div className="section-h"><h3>면세 QR 발급</h3></div>
        <div className="qr-issue-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/qr-home')}>
          <span className="ic">📱</span>
          <div className="body">
            <div className="ttl">지금 QR 발급하기</div>
            <div className="sub">단말기에 보여주세요</div>
          </div>
          <span className="chevron">›</span>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item active"><span className="icon">📋</span><span className="label">활동</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>
    </div>
  )
}
