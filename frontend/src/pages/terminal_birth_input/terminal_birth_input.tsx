import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './terminal_birth_input.css'
import { useLang } from '../../i18n/LangContext'

type Field = 'year' | 'month' | 'day' | null

export default function TerminalCardInput() {
  const navigate = useNavigate()
  const { t } = useLang()
  const ci = t.terminal.cardInput
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

  const getValue = (f: Field) => { if (f === 'year') return year; if (f === 'month') return month; if (f === 'day') return day; return '' }
  const setValue = (f: Field, v: string) => { if (f === 'year') setYear(v); else if (f === 'month') setMonth(v); else if (f === 'day') setDay(v) }
  const nextField: Record<string, Field> = { year: 'month', month: 'day', day: null }

  const handleKey = (key: string) => {
    if (!activeField) return
    const cur = getValue(activeField)
    if (key === '⌫') { setValue(activeField, cur.slice(0, -1)) }
    else if (cur.length < 2) {
      const next = cur + key
      setValue(activeField, next)
      if (next.length === 2) setActiveField(nextField[activeField])
    }
  }

  const unitLabel = (f: Field) => f === 'year' ? ci.year : f === 'month' ? ci.month : ci.day
  const keypadLabel = activeField === 'year' ? ci.yearLabel : activeField === 'month' ? ci.monthLabel : ci.dayLabel

  if (verifying) {
    return (
      <div className="terminal-phone">
        <div className="verifying-screen">
          <div className="verify-spinner" />
          <div className="verify-title">{ci.verifyTitle}</div>
          <div className="verify-sub">{ci.verifySub}</div>
          <div className="verify-dots"><span /><span /><span /></div>
        </div>
      </div>
    )
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="terminal-phone">
      <div className="terminal-form" onClick={() => setActiveField(null)}>
        <div className="form-title" style={{ whiteSpace: 'pre-line' }}>{ci.formTitle}</div>
        <div className="form-sub">{ci.formSub}</div>

        <div className="dob-block" onClick={e => e.stopPropagation()}>
          <div className="block-label">{ci.dobLabel}</div>
          <div className="dob-grid">
            {(['year','month','day'] as Field[]).map(f => (
              <div key={f} className={`dob-cell${activeField === f ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setActiveField(f) }}>
                <div className="unit">{unitLabel(f)}</div>
                <div className="dob-value">{getValue(f) || '–'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="step-list">
          <div className="step-item"><div className="step-num done">✓</div><span className="step-text">{ci.qrStep}</span></div>
          <div className="step-item"><div className="step-num done">✓</div><span className="step-text">{ci.faceStep}</span></div>
          <div className="step-item current"><div className="step-num current">3</div><span className="step-text">{ci.dobStep}</span></div>
        </div>
      </div>

      {!activeField && (
        <div className="bottom-actions">
          <button className="confirm-btn" onClick={() => setVerifying(true)}>{ci.confirm}</button>
        </div>
      )}

      {activeField && (
        <div className="keypad" onClick={e => e.stopPropagation()}>
          <div className="keypad-header">
            <span className="keypad-label">{keypadLabel}</span>
            <button className="keypad-done" onClick={() => setActiveField(null)}>{ci.done}</button>
          </div>
          <div className="keypad-grid">
            {keys.map((k, i) => (
              <button key={i} className={`key-btn${k === '' ? ' key-empty' : ''}${k === '⌫' ? ' key-del' : ''}`} onClick={() => k && handleKey(k)} disabled={k === ''}>{k}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
