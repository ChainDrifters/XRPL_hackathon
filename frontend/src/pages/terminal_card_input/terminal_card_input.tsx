import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './terminal_card_input.css'

type Field = 'year' | 'month' | 'day' | null

export default function TerminalCardInput() {
  const navigate = useNavigate()
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [activeField, setActiveField] = useState<Field>(null)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (!verifying) return
    const timer = setTimeout(() => navigate('/terminal-confirm'), 3000)
    return () => clearTimeout(timer)
  }, [verifying, navigate])

  const getValue = (f: Field) => {
    if (f === 'year') return year
    if (f === 'month') return month
    if (f === 'day') return day
    return ''
  }

  const setValue = (f: Field, v: string) => {
    if (f === 'year') setYear(v)
    else if (f === 'month') setMonth(v)
    else if (f === 'day') setDay(v)
  }

  const nextField: Record<string, Field> = { year: 'month', month: 'day', day: null }

  const handleKey = (key: string) => {
    if (!activeField) return
    const cur = getValue(activeField)
    if (key === '⌫') {
      setValue(activeField, cur.slice(0, -1))
    } else if (cur.length < 2) {
      const next = cur + key
      setValue(activeField, next)
      if (next.length === 2) {
        setActiveField(nextField[activeField])
      }
    }
  }

  if (verifying) {
    return (
      <div className="terminal-phone">
        <div className="verifying-screen">
          <div className="verify-spinner" />
          <div className="verify-title">확인 중이에요</div>
          <div className="verify-sub">면세 대상자 여부를 확인하고 있어요</div>
          <div className="verify-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>
    )
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="terminal-phone">
      <div className="terminal-form" onClick={() => setActiveField(null)}>
        <div className="form-title">생년월일을<br />확인해 주세요</div>
        <div className="form-sub">면세 처리를 위한 마지막 단계예요</div>

        <div className="dob-block" onClick={e => e.stopPropagation()}>
          <div className="block-label">생년월일</div>
          <div className="dob-grid">
            {(['year','month','day'] as Field[]).map(f => (
              <div
                key={f}
                className={`dob-cell${activeField === f ? ' active' : ''}`}
                onClick={e => { e.stopPropagation(); setActiveField(f) }}
              >
                <div className="unit">{f === 'year' ? '년' : f === 'month' ? '월' : '일'}</div>
                <div className="dob-value">{getValue(f) || '–'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="step-list">
          <div className="step-item">
            <div className="step-num done">✓</div>
            <span className="step-text">QR 인식</span>
          </div>
          <div className="step-item">
            <div className="step-num done">✓</div>
            <span className="step-text">Face ID 확인</span>
          </div>
          <div className="step-item current">
            <div className="step-num current">3</div>
            <span className="step-text">생년월일 · 카드 확인</span>
          </div>
        </div>

      </div>

      {!activeField && (
        <div className="bottom-actions">
          <button className="confirm-btn" onClick={() => setVerifying(true)}>확인</button>
        </div>
      )}

      {/* Custom numeric keypad */}
      {activeField && (
        <div className="keypad" onClick={e => e.stopPropagation()}>
          <div className="keypad-header">
            <span className="keypad-label">
              {activeField === 'year' ? '년도 (뒤 2자리)' : activeField === 'month' ? '월' : '일'}
            </span>
            <button className="keypad-done" onClick={() => setActiveField(null)}>완료</button>
          </div>
          <div className="keypad-grid">
            {keys.map((k, i) => (
              <button
                key={i}
                className={`key-btn${k === '' ? ' key-empty' : ''}${k === '⌫' ? ' key-del' : ''}`}
                onClick={() => k && handleKey(k)}
                disabled={k === ''}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
