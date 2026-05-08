import { useNavigate } from 'react-router-dom'
import '../refund_detail/refund_detail.css'
import '../balance_home/balance_home.css'

export default function RefundDetailShinsegae() {
  const navigate = useNavigate()

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}>‹</span>
        <span className="nav-title">환급 상세</span>
        <div className="right"><span className="icon">🔗</span></div>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div className="summary-card">
          <div className="label">신세계 명동점에서 받을 환급</div>
          <div className="amount">6,800<span className="currency">원</span></div>
          <div className="row">
            <div className="stat">
              <div className="stat-label">구매 금액</div>
              <div className="stat-value">85,000원</div>
            </div>
            <div className="stat">
              <div className="stat-label">환급 진행</div>
              <div className="stat-value">4 / 5 단계</div>
            </div>
          </div>
        </div>

        <div className="section-h"><h3>진행 상황</h3></div>
        <div className="timeline">
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content">
              <div className="tl-title">구매 완료</div>
              <div className="tl-time">5월 4일 11:15 · 면세 가맹점에서 결제</div>
            </div>
          </div>
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content">
              <div className="tl-title">면세 자격 확인</div>
              <div className="tl-time">5월 4일 11:16 · 환급사업자 자동 승인</div>
            </div>
          </div>
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content">
              <div className="tl-title">키오스크에 보여주기</div>
              <div className="tl-time">5월 4일 11:42 · 키오스크 QR 인식 완료</div>
            </div>
          </div>
          <div className="tl-item current">
            <div className="tl-dot">4</div>
            <div className="tl-content">
              <div className="tl-title">세관 반출 확인</div>
              <div className="tl-time">출국 후 자동으로 진행돼요</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-dot">5</div>
            <div className="tl-content">
              <div className="tl-title">환급 완료</div>
              <div className="tl-time">평균 1~3일 안에 받아요</div>
            </div>
          </div>
        </div>

        <div className="section-h"><h3>구매 내역</h3></div>
        <div className="info-card">
          <div className="info-row"><span className="key">매장</span><span className="val">신세계 명동점</span></div>
          <div className="info-row"><span className="key">구매 일시</span><span className="val">2026.05.04 11:15</span></div>
          <div className="info-row"><span className="key">결제 수단</span><span className="val">VISA •••• 4521</span></div>
          <div className="info-row"><span className="key">총 구매액</span><span className="val">85,000원</span></div>
          <div className="info-row"><span className="key">VAT</span><span className="val">7,727원</span></div>
          <div className="info-row">
            <span className="key">예상 환급액</span>
            <span className="val" style={{ color: 'var(--toss-blue)' }}>+6,800원</span>
          </div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn" disabled style={{ background: 'var(--bg-deep)', color: 'var(--text-quaternary)', cursor: 'not-allowed' }}>
          키오스크에 보여주기
        </button>
      </div>
      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>
    </div>
  )
}
