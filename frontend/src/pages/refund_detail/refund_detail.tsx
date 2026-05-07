import './refund_detail.css'

export default function RefundDetail() {
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back">‹</span>
        <span className="nav-title">환급 상세</span>
        <div className="right"><span className="icon">🔗</span></div>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div className="summary-card">
          <div className="label">올리브영 명동본점에서 받을 환급</div>
          <div className="amount">12,400<span className="currency">원</span></div>
          <div className="row">
            <div className="stat">
              <div className="stat-label">구매 금액</div>
              <div className="stat-value">156,000원</div>
            </div>
            <div className="stat">
              <div className="stat-label">환급 진행</div>
              <div className="stat-value">3 / 5 단계</div>
            </div>
          </div>
        </div>

        <div className="section-h"><h3>진행 상황</h3></div>
        <div className="timeline">
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content">
              <div className="tl-title">구매 완료</div>
              <div className="tl-time">5월 2일 14:32 · 면세 가맹점에서 결제</div>
            </div>
          </div>
          <div className="tl-item done">
            <div className="tl-dot">✓</div>
            <div className="tl-content">
              <div className="tl-title">면세 자격 확인</div>
              <div className="tl-time">5월 2일 14:33 · 환급사업자 자동 승인</div>
            </div>
          </div>
          <div className="tl-item current">
            <div className="tl-dot">3</div>
            <div className="tl-content">
              <div className="tl-title">키오스크에 보여주기</div>
              <div className="tl-time">출국 시 공항 환급 키오스크에서 진행해 주세요</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-dot">4</div>
            <div className="tl-content">
              <div className="tl-title">세관 반출 확인</div>
              <div className="tl-time">키오스크 통과 후 자동 진행</div>
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
          <div className="info-row"><span className="key">매장</span><span className="val">올리브영 명동본점</span></div>
          <div className="info-row"><span className="key">구매 일시</span><span className="val">2026.05.02 14:32</span></div>
          <div className="info-row"><span className="key">결제 수단</span><span className="val">VISA •••• 4521</span></div>
          <div className="info-row"><span className="key">총 구매액</span><span className="val">156,000원</span></div>
          <div className="info-row"><span className="key">VAT</span><span className="val">14,182원</span></div>
          <div className="info-row">
            <span className="key">예상 환급액</span>
            <span className="val" style={{ color: 'var(--toss-blue)' }}>+12,400원</span>
          </div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn">키오스크에 보여주기</button>
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
