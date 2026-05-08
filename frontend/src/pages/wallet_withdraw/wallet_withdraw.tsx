import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import './wallet_withdraw.css'
import '../balance_home/balance_home.css'

type ModalPhase = 'face-id' | 'complete' | null

export default function WalletWithdraw() {
  const navigate = useNavigate()
  const [modal, setModal] = useState<ModalPhase>(null)
  const [amount, setAmount] = useState('50,000')
  const [keypadOpen, setKeypadOpen] = useState(false)

  // Face ID → 완료 자동 전환
  useEffect(() => {
    if (modal !== 'face-id') return
    const t = setTimeout(() => setModal('complete'), 2200)
    return () => clearTimeout(t)
  }, [modal])

  function handleKeypad(key: string) {
    setAmount(prev => {
      const raw = prev.replace(/,/g, '')
      if (key === '⌫') {
        const next = raw.slice(0, -1)
        return next ? Number(next).toLocaleString() : ''
      }
      if (key === '전액') return '295,700'
      const next = raw + key
      if (next.length > 9) return prev
      return Number(next).toLocaleString()
    })
  }

  const rlusd = amount
    ? (Number(amount.replace(/,/g, '')) / 1370).toFixed(2)
    : '0.00'

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}>‹</span>
        <span className="nav-title">외부로 출금</span>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
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
          <div className="input-wrap" style={{ cursor: 'text' }} onClick={() => setKeypadOpen(true)}>
            <span style={{ flex: 1, fontSize: 22, fontWeight: 800, color: amount ? 'var(--text-primary)' : 'var(--text-quaternary)' }}>
              {amount || '0'}
            </span>
            <span className="suffix">원</span>
          </div>
          <div className="helper">
            ≈ {rlusd} RLUSD · 잔고 295,700원 사용 가능 ·{' '}
            <span style={{ color: 'var(--toss-blue)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setAmount('295,700')}>전액</span>
          </div>
        </div>

        <div className="summary-info">
          <div className="row"><span className="k">출금 금액</span><span className="v">{amount || '0'}원</span></div>
          <div className="row"><span className="k">≈ RLUSD</span><span className="v">{rlusd} RLUSD</span></div>
          <div className="row"><span className="k">네트워크 수수료</span><span className="v">0.00001 XRP (≈ 0원)</span></div>
          <div className="row total"><span className="k">받는 금액</span><span className="v">{amount || '0'}원</span></div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn" onClick={() => setModal('face-id')}>Face ID로 출금 신청</button>
      </div>
      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>

      {/* ── 숫자 키패드 ── */}
      {keypadOpen && (
        <div className="overlay" onClick={() => setKeypadOpen(false)}>
          <div className="keypad-sheet" onClick={e => e.stopPropagation()}>
            <div className="keypad-amount">
              <span className="keypad-amount-num">{amount || '0'}</span>
              <span className="keypad-amount-unit">원</span>
            </div>
            <div className="keypad-helper">≈ {rlusd} RLUSD</div>
            <div className="keypad-grid">
              {['1','2','3','4','5','6','7','8','9','전액','0','⌫'].map(k => (
                <button key={k} className={`keypad-btn${k === '전액' ? ' keypad-btn-text' : ''}`} onClick={() => handleKeypad(k)}>
                  {k}
                </button>
              ))}
            </div>
            <button className="cta-btn" style={{ margin: '12px 0 0' }} onClick={() => setKeypadOpen(false)}>확인</button>
          </div>
        </div>
      )}

      {/* ── Face ID / 완료 오버레이 ── */}
      {modal && (
        <div className="overlay" onClick={() => modal === 'complete' ? setModal(null) : undefined}>
          <div className="overlay-sheet" onClick={e => e.stopPropagation()}>

            {modal === 'face-id' && (
              <div className="faceid-wrap">
                <div className="face-scan-ring scanning">
                  <div className="ring-outer" />
                  <div className="ring-middle" />
                  <div className="ring-inner">
                    <div className="scan-line" />
                  </div>
                  <div className="face-icon">😊</div>
                  <div className="corner tl" />
                  <div className="corner tr" />
                  <div className="corner bl" />
                  <div className="corner br" />
                </div>
                <div className="faceid-label">얼굴을 인식하고 있어요</div>
                <div className="faceid-sub">잠시만 기다려 주세요...</div>
              </div>
            )}

            {modal === 'complete' && (
              <div className="complete-wrap">
                <div className="complete-icon">✓</div>
                <div className="complete-title">출금 신청 완료</div>
                <div className="complete-amount">{amount}원</div>
                <div className="complete-sub">≈ {rlusd} RLUSD · Coinbase로 출금 신청됐어요</div>
                <div className="summary-info" style={{ width: '100%', marginTop: 16 }}>
                  <div className="row"><span className="k">받는 주소</span><span className="v" style={{ fontSize: 10, fontFamily: 'monospace' }}>rN7n7...fzRH</span></div>
                  <div className="row"><span className="k">네트워크 수수료</span><span className="v">0.00001 XRP</span></div>
                </div>
                <button className="cta-btn" style={{ marginTop: 16 }} onClick={() => { setModal(null); navigate('/balance-home') }}>확인</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
