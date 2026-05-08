import { useNavigate } from 'react-router-dom'
import './refund_home.css'

export default function RefundHome() {
  const navigate = useNavigate()
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="nav-title" style={{ paddingLeft: 12 }}>환급</span>
        <div className="right">
          <span className="icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/qr-issued')}>🔔</span>
          <span className="icon">⚙️</span>
        </div>
      </div>

      <div className="scroll-area">
        <div className="summary-card">
          <div className="label">받을 수 있는 환급액</div>
          <div className="amount">314,900<span className="currency">원</span></div>
          <div className="row">
            <div className="stat">
              <div className="stat-label">진행 중</div>
              <div className="stat-value">2건 · 19,200원</div>
            </div>
            <div className="stat">
              <div className="stat-label">받을 수 있어요</div>
              <div className="stat-value">2건 · 295,700원</div>
            </div>
          </div>
        </div>

        <div className="section-h"><h3>진행 중인 환급</h3><span className="more">2건</span></div>

        <div className="case-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-detail')}>
          <div className="top">
            <div>
              <div className="merchant">올리브영 명동본점</div>
              <div className="meta">5월 2일 · 156,000원</div>
            </div>
            <div className="pill">+12,400원</div>
          </div>
          <div className="progress">
            <div className="seg done" /><div className="seg done" />
            <div className="seg" /><div className="seg" /><div className="seg" />
          </div>
          <div className="step-text">키오스크에 보여주면 진행돼요</div>
        </div>

        <div className="case-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-detail-shinsegae')}>
          <div className="top">
            <div>
              <div className="merchant">신세계 명동점</div>
              <div className="meta">5월 4일 · 85,000원</div>
            </div>
            <div className="pill">+6,800원</div>
          </div>
          <div className="progress">
            <div className="seg done" /><div className="seg done" />
            <div className="seg done" /><div className="seg done" /><div className="seg" />
          </div>
          <div className="step-text">키오스크에 보여주면 진행돼요</div>
        </div>

        <div className="section-h"><h3>받을 수 있어요</h3><span className="more">2건</span></div>

        <div className="case-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/payout-select')}>
          <div className="top">
            <div>
              <div className="merchant">아모레퍼시픽 청담</div>
              <div className="meta">5월 3일 · 환급 승인됨</div>
            </div>
            <div className="pill" style={{ background: 'var(--toss-blue)', color: 'white' }}>받기</div>
          </div>
          <div className="step-text" style={{ color: 'var(--success)' }}>9,600원을 받을 수 있어요</div>
        </div>

        <div className="case-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/payout-select-lotte')}>
          <div className="top">
            <div>
              <div className="merchant">롯데면세점 본점</div>
              <div className="meta">5월 1일 · 즉시환급 완료</div>
            </div>
            <div className="pill" style={{ background: 'var(--toss-blue)', color: 'white' }}>받기</div>
          </div>
          <div className="step-text" style={{ color: 'var(--success)' }}>286,100원이 보관 중이에요</div>
        </div>

        <div className="section-h"><h3>완료된 환급</h3><span className="more">전체보기 ›</span></div>
        <div className="case-card" style={{ opacity: 0.7 }}>
          <div className="top">
            <div>
              <div className="merchant">현대백화점 무역센터</div>
              <div className="meta">4월 28일 · 한국 카드로 환불</div>
            </div>
            <div className="pill" style={{ background: 'var(--bg-deep)', color: 'var(--text-tertiary)' }}>14,500원</div>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>
    </div>
  )
}
