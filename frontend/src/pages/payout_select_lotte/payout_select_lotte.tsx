import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../payout_select/payout_select.css'

type Method = 'card' | 'bank' | 'toss' | 'cash'

const METHODS: { id: Method; icon: string; title: string; badge?: string; badgeType?: string; desc: string }[] = [
  { id: 'card', icon: '💳', title: '한국에서 결제한 카드로', badge: '추천', desc: 'VISA •••• 4521 · 영업일 3~7일 · 수수료 0원' },
  { id: 'bank', icon: '🏦', title: '한국 은행 계좌로', desc: '계좌 정보 입력 · 영업일 1~2일 · 수수료 0원' },
  { id: 'toss', icon: '✈️', title: '출국 후에도 받기', badge: '빠름', badgeType: 'adv', desc: '토스에 보관 · 본국에서 언제든 출금 · 수 분 내' },
  { id: 'cash', icon: '💵', title: '공항 현금 환급', desc: '출국 게이트 환급창구 · 즉시 · USD/CNY/JPY' },
]

export default function PayoutSelectLotte() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Method>('card')

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/refund-home')}>‹</span>
        <span className="nav-title">받는 방법</span>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div style={{ padding: '8px 4px 16px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            어떻게 받으시겠어요?
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            롯데면세점 본점 · <strong style={{ color: 'var(--toss-blue)' }}>286,100원</strong>
          </div>
        </div>

        {METHODS.map(m => (
          <div key={m.id} className={`method-card${selected === m.id ? ' selected' : ''}`} onClick={() => setSelected(m.id)}>
            <div className="icon-wrap">{m.icon}</div>
            <div className="info">
              <div className="title">
                {m.title}
                {m.badge && <span className={`badge${m.badgeType ? ` ${m.badgeType}` : ''}`}>{m.badge}</span>}
              </div>
              <div className="desc">{m.desc}</div>
            </div>
            <div className="check">{selected === m.id ? '✓' : ''}</div>
          </div>
        ))}

        <div className="summary-info" style={{ marginTop: 16 }}>
          <div className="row"><span className="k">환급 금액</span><span className="v">286,100원</span></div>
          <div className="row"><span className="k">수수료</span><span className="v" style={{ color: 'var(--success)' }}>무료</span></div>
          <div className="row total"><span className="k">받는 금액</span><span className="v">286,100원</span></div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn" onClick={() => navigate('/refund-home')}>이 방법으로 받기</button>
      </div>
      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon">🏠</span><span className="label">홈</span></div>
        <div className="bn-item active"><span className="icon">💸</span><span className="label">환급</span></div>
        <div className="bn-item"><span className="icon">⚙️</span><span className="label">설정</span></div>
      </div>
    </div>
  )
}
