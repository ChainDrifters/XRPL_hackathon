import { useNavigate } from 'react-router-dom'
import './refund_storage.css'

export default function RefundStorage() {
  const navigate = useNavigate()
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}>‹</span>
        <span className="nav-title">환급 보관함</span>
        <div className="right"><span className="icon">⋯</span></div>
      </div>

      <div className="scroll-area">
        <div className="balance-card">
          <div className="label">
            보관 중인 환급 금액
            <span className="info-icon">ⓘ</span>
          </div>
          <div className="amount-krw">295,700<span className="currency">원</span></div>
          <div className="amount-rlusd">≈ 215.42 RLUSD · 토스가 안전하게 보관 중</div>
          <div className="actions">
            <button className="act primary" onClick={() => navigate('/wallet-withdraw')}>출금하기</button>
            <button className="act" onClick={() => navigate('/payout-select')}>받는 방법 변경</button>
          </div>
        </div>

        <div style={{ background: 'var(--success-light)', borderRadius: 12, padding: '12px 14px', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 2 }}>안전하게 보관 중이에요</div>
            <div style={{ fontSize: 11, color: '#006b4f', lineHeight: 1.4 }}>
              토스가 라이센스 받은 파트너와 함께 보관해요. 분실/도난 시에도 본인인증으로 다시 받을 수 있어요.
            </div>
          </div>
        </div>

        <div className="section-h"><h3>최근 입출금</h3><span className="more">전체보기 ›</span></div>
        <div className="info-card" style={{ padding: '4px 18px' }}>
          <div className="tx-item">
            <div className="ic">↓</div>
            <div className="body"><div className="ttl">롯데면세점 환급</div><div className="sub">5월 1일 14:22</div></div>
            <div className="right"><div className="amt">+286,100원</div><div className="when">208.41 RLUSD</div></div>
          </div>
          <div className="tx-item">
            <div className="ic">↓</div>
            <div className="body"><div className="ttl">아모레퍼시픽 환급</div><div className="sub">4월 30일 18:05</div></div>
            <div className="right"><div className="amt">+9,600원</div><div className="when">7.01 RLUSD</div></div>
          </div>
          <div className="tx-item out">
            <div className="ic">↑</div>
            <div className="body"><div className="ttl">Coinbase로 출금</div><div className="sub">4월 25일 09:30</div></div>
            <div className="right"><div className="amt">-50,000원</div><div className="when">36.45 RLUSD</div></div>
          </div>
        </div>

        <div className="section-h"><h3>고급</h3></div>
        <div className="info-card">
          <div className="advanced-row">
            <div className="ic">🔗</div>
            <div className="body"><div className="ttl">받는 주소 보기</div><div className="sub">XRPL 주소 + QR 코드</div></div>
            <span className="chevron">›</span>
          </div>
          <div className="advanced-divider" />
          <div className="advanced-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/wallet-withdraw')}>
            <div className="ic">📤</div>
            <div className="body"><div className="ttl">외부 지갑으로 출금</div><div className="sub">Bitstamp, Coinbase 등 거래소 입금</div></div>
            <span className="chevron">›</span>
          </div>
          <div className="advanced-divider" />
          <div className="advanced-row">
            <div className="ic">📜</div>
            <div className="body"><div className="ttl">트랜잭션 내역</div><div className="sub">XRPL 원장 기록 보기</div></div>
            <span className="chevron">›</span>
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
