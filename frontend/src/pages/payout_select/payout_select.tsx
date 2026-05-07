import './payout_select.css'

export default function PayoutSelect() {
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back">‹</span>
        <span className="nav-title">받는 방법</span>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div style={{ padding: '8px 4px 16px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            어떻게 받으시겠어요?
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            아모레퍼시픽 청담 · <strong style={{ color: 'var(--toss-blue)' }}>9,600원</strong>
          </div>
        </div>

        <div className="method-card selected">
          <div className="icon-wrap">💳</div>
          <div className="info">
            <div className="title">한국에서 결제한 카드로 <span className="badge">추천</span></div>
            <div className="desc">VISA •••• 4521 · 영업일 3~7일 · 수수료 0원</div>
          </div>
          <div className="check">✓</div>
        </div>

        <div className="method-card">
          <div className="icon-wrap">🏦</div>
          <div className="info">
            <div className="title">한국 은행 계좌로</div>
            <div className="desc">계좌 정보 입력 · 영업일 1~2일 · 수수료 0원</div>
          </div>
          <div className="check" />
        </div>

        <div className="method-card">
          <div className="icon-wrap">✈️</div>
          <div className="info">
            <div className="title">출국 후에도 받기 <span className="badge adv">빠름</span></div>
            <div className="desc">토스에 보관 · 본국에서 언제든 출금 · 수 분 내</div>
          </div>
          <div className="check" />
        </div>

        <div className="method-card">
          <div className="icon-wrap">💵</div>
          <div className="info">
            <div className="title">공항 현금 환급</div>
            <div className="desc">출국 게이트 환급창구 · 즉시 · USD/CNY/JPY</div>
          </div>
          <div className="check" />
        </div>

        <div className="summary-info" style={{ marginTop: 16 }}>
          <div className="row"><span className="k">환급 금액</span><span className="v">9,600원</span></div>
          <div className="row"><span className="k">수수료</span><span className="v" style={{ color: 'var(--success)' }}>무료</span></div>
          <div className="row total"><span className="k">받는 금액</span><span className="v">9,600원</span></div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn">이 방법으로 받기</button>
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
