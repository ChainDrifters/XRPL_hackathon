import './wallet_withdraw.css'

export default function WalletWithdraw() {
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back">‹</span>
        <span className="nav-title">외부로 출금</span>
        <div className="right"><span className="icon">📜</span></div>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div className="toggle-group">
          <div className="toggle-tab">받기</div>
          <div className="toggle-tab active">보내기</div>
        </div>

        <div className="form-group">
          <div className="label">보내는 자산</div>
          <div className="input-wrap asset-row">
            <div className="asset-icon">𝐗</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>RLUSD</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>잔고 215.42 · ≈ 295,700원</div>
            </div>
            <span style={{ color: 'var(--text-quaternary)' }}>›</span>
          </div>
        </div>

        <div className="form-group">
          <div className="label">받는 사람 주소</div>
          <div className="input-wrap">
            <input className="mono" type="text" placeholder="rXXX... 또는 ENS 입력" defaultValue="rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH" />
            <span className="suffix" style={{ cursor: 'pointer' }}>📷</span>
          </div>
          <div className="helper" style={{ color: 'var(--success)' }}>✓ Coinbase 입금 주소로 확인됐어요</div>
        </div>

        <div className="form-group">
          <div className="label">Destination Tag (필요 시)</div>
          <div className="input-wrap">
            <input className="mono" type="text" placeholder="태그 번호" defaultValue="2937814" />
          </div>
          <div className="helper">거래소 입금 시 보통 필요해요. 모르면 거래소 안내를 확인하세요.</div>
        </div>

        <div className="form-group">
          <div className="label">출금 금액</div>
          <div className="input-wrap">
            <input type="text" placeholder="0" defaultValue="50,000" style={{ fontSize: 22, fontWeight: 800 }} />
            <span className="suffix">원</span>
          </div>
          <div className="helper">
            ≈ 36.42 RLUSD · 잔고 295,700원 사용 가능 ·{' '}
            <span style={{ color: 'var(--toss-blue)', fontWeight: 700, cursor: 'pointer' }}>전액</span>
          </div>
        </div>

        <div className="alert-warn">
          <span className="ic">⏱️</span>
          <div>
            <div className="ttl">처음 보내는 주소예요</div>
            <div className="body">보안을 위해 출금이 24시간 후에 실행돼요. 그 사이에 취소할 수 있어요.</div>
          </div>
        </div>

        <div className="summary-info">
          <div className="row"><span className="k">출금 금액</span><span className="v">50,000원</span></div>
          <div className="row"><span className="k">≈ RLUSD</span><span className="v">36.42 RLUSD</span></div>
          <div className="row"><span className="k">네트워크 수수료</span><span className="v">0.00001 XRP (≈ 0원)</span></div>
          <div className="row"><span className="k">예상 도착 시간</span><span className="v">24시간 후 (안전 대기)</span></div>
          <div className="row total"><span className="k">받는 금액</span><span className="v">50,000원</span></div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn">Face ID로 출금 신청</button>
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
