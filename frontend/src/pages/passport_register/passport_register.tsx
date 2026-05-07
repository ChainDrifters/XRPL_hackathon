import './passport_register.css'

export default function PassportRegister() {
  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back">‹</span>
        <span className="nav-title">여권 등록</span>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 140 }}>
        <div style={{ padding: '8px 4px 24px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: -0.3 }}>여권을 등록해 주세요</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>면세 자격 확인을 위해 한 번만 등록하면 돼요.<br />이후엔 자동으로 처리해 드려요.</div>
        </div>

        <div className="passport-scan-area">
          <div className="top-stripe" />
          <div className="scan-icon">🛂</div>
          <div className="scan-title">여권 앞면을 찍어주세요</div>
          <div className="scan-sub">사진 아래 기계판독영역(MRZ)이 나오게</div>
          <div className="open-btn">카메라 열기</div>
        </div>

        <div className="divider-text">— 또는 직접 입력 —</div>

        <div className="form-group" style={{ marginTop: 8 }}>
          <div className="label">여권 번호</div>
          <div className="input-wrap">
            <input type="text" placeholder="M12345678" style={{ letterSpacing: 2, fontFamily: "'SF Mono', monospace", fontSize: 16 }} />
          </div>
        </div>
        <div className="form-group">
          <div className="label">성명 (여권 영문)</div>
          <div className="input-wrap">
            <input type="text" placeholder="HONG GILDONG" style={{ letterSpacing: 1 }} />
          </div>
        </div>
        <div className="form-group">
          <div className="label">국적</div>
          <div className="input-wrap">
            <input type="text" placeholder="🇺🇸 United States" />
            <span style={{ color: 'var(--text-quaternary)', fontSize: 16 }}>›</span>
          </div>
        </div>
        <div className="form-group">
          <div className="label">생년월일</div>
          <div className="input-wrap">
            <input type="text" placeholder="1990. 01. 01" />
          </div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn">다음</button>
      </div>
    </div>
  )
}
