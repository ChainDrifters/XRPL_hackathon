import { useNavigate } from 'react-router-dom'
import './qr_issued.css'

export default function QRIssued() {
  const navigate = useNavigate()
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>
          알림
        </span>
        <div className="right"><span className="icon">⚙️</span></div>
      </div>

      <div className="scroll-area">

        {/* 오늘 */}
        <div className="date-label">오늘</div>

        <div className="notif-new">
          <div className="notif-row">
            <div className="notif-icon">🔍</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">올리브영 명동본점 · 정보 조회</div>
                <div className="notif-time">방금</div>
              </div>
              <div className="notif-text">올리브영 명동본점이 면세 자격 확인을 위해 회원님의 여권 정보를 조회했어요.</div>
            </div>
          </div>
        </div>

        <div className="notif-new">
          <div className="notif-row">
            <div className="notif-icon">🔍</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">롯데백화점 · 정보 조회</div>
                <div className="notif-time">1시간 전</div>
              </div>
              <div className="notif-text">롯데백화점이 면세 자격 확인을 위해 회원님의 여권 정보를 조회했어요.</div>
            </div>
          </div>
        </div>

        {/* 어제 */}
        <div className="date-label">어제</div>

        <div className="notif-card">
          <div className="notif-row">
            <div className="notif-icon">🔍</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">신세계 명동점 · 정보 조회</div>
                <div className="notif-time">어제 14:05</div>
              </div>
              <div className="notif-text">신세계 명동점이 면세 자격 확인을 위해 회원님의 여권 정보를 조회했어요.</div>
            </div>
          </div>
        </div>

        <div className="notif-card">
          <div className="notif-row">
            <div className="notif-icon-green">💰</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">환급 승인</div>
                <div className="notif-time">어제 18:20</div>
              </div>
              <div className="notif-text">신세계 명동점 환급 10,800원이 승인됐어요.</div>
            </div>
          </div>
        </div>

        {/* 2일 전 */}
        <div className="date-label">2일 전</div>

        <div className="notif-card dim">
          <div className="notif-row">
            <div className="notif-icon-grey">🛂</div>
            <div className="notif-body">
              <div className="notif-header">
                <div className="notif-title">여권 등록 완료</div>
                <div className="notif-time">2일 전 09:12</div>
              </div>
              <div className="notif-text">면세 서비스를 이용할 준비가 됐어요.</div>
            </div>
          </div>
        </div>

      </div>

      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>
    </div>
  )
}
