import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './passport_register.css'

type TextField = 'passport' | 'name' | 'nationality'
type DobField = 'dob_y' | 'dob_m' | 'dob_d'
type ActiveField = TextField | DobField | null

const TEXT_FIELDS: { key: TextField; label: string; placeholder: string; maxLength: number; next: ActiveField }[] = [
  { key: 'passport',    label: '여권 번호',      placeholder: 'M12345678',       maxLength: 9,  next: 'name' },
  { key: 'name',        label: '성명 (여권 영문)', placeholder: 'HONG GILDONG',   maxLength: 40, next: 'nationality' },
  { key: 'nationality', label: '국적',            placeholder: 'United States',   maxLength: 40, next: 'dob_y' },
]

const DOB_CELLS: { key: DobField; unit: string; maxLen: number; next: ActiveField }[] = [
  { key: 'dob_y', unit: '년', maxLen: 4, next: 'dob_m' },
  { key: 'dob_m', unit: '월', maxLen: 2, next: 'dob_d' },
  { key: 'dob_d', unit: '일', maxLen: 2, next: null },
]

const NUM_KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

const ALPHA_ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M','⌫'],
]

export default function PassportRegister() {
  const navigate = useNavigate()

  const [activeField, setActiveField] = useState<ActiveField>(null)
  const [values, setValues] = useState<Record<string, string>>({
    passport: '', name: '', nationality: '', dob_y: '', dob_m: '', dob_d: '',
  })

  const isDobActive = activeField === 'dob_y' || activeField === 'dob_m' || activeField === 'dob_d'
  const isTextActive = activeField === 'passport' || activeField === 'name' || activeField === 'nationality'

  const set = (key: string, val: string) => setValues(prev => ({ ...prev, [key]: val }))

  const handleAlphaKey = (key: string) => {
    if (!isTextActive) return
    const fieldInfo = TEXT_FIELDS.find(f => f.key === activeField)!
    const cur = values[activeField as string] ?? ''
    if (key === '⌫') {
      set(activeField as string, cur.slice(0, -1))
    } else if (key === ' ') {
      if (cur.length < fieldInfo.maxLength) set(activeField as string, cur + ' ')
    } else {
      if (cur.length < fieldInfo.maxLength) {
        const next = cur + key
        set(activeField as string, next)
        if (next.length === fieldInfo.maxLength && fieldInfo.maxLength === 9) {
          setActiveField(fieldInfo.next)
        }
      }
    }
  }

  const handleNumKey = (key: string) => {
    if (!isDobActive) return
    const cur = values[activeField as string] ?? ''
    const cell = DOB_CELLS.find(c => c.key === activeField)!
    if (key === '⌫') {
      set(activeField as string, cur.slice(0, -1))
    } else if (cur.length < cell.maxLen) {
      const next = cur + key
      set(activeField as string, next)
      if (next.length === cell.maxLen) setActiveField(cell.next)
    }
  }

  const activeTextInfo = TEXT_FIELDS.find(f => f.key === activeField)

  const displayValue = (key: string, placeholder: string) =>
    values[key] || <span className="field-placeholder">{placeholder}</span>

  return (
    <div className="phone" onClick={() => setActiveField(null)}>
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" onClick={e => { e.stopPropagation(); navigate('/onboarding-start') }} style={{ cursor: 'pointer' }}>‹</span>
        <span className="nav-title">여권 등록</span>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 16 }} onClick={e => e.stopPropagation()}>
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

        {TEXT_FIELDS.map(f => (
          <div
            key={f.key}
            className={`form-group${activeField === f.key ? ' form-active' : ''}`}
            onClick={e => { e.stopPropagation(); setActiveField(f.key) }}
          >
            <div className="label">{f.label}</div>
            <div className="field-display">{displayValue(f.key, f.placeholder)}</div>
          </div>
        ))}

        <div className="form-group" style={{ marginTop: 8 }} onClick={e => e.stopPropagation()}>
          <div className="label">생년월일</div>
          <div className="dob-row">
            {DOB_CELLS.map(cell => (
              <div
                key={cell.key}
                className={`dob-cell${activeField === cell.key ? ' active' : ''}`}
                onClick={e => { e.stopPropagation(); setActiveField(cell.key) }}
              >
                <div className="unit">{cell.unit}</div>
                <div className="dob-value">{values[cell.key] || '–'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 다음 버튼 */}
      {!activeField && (
        <div style={{ padding: '0 20px 48px', flexShrink: 0 }}>
          <button className="cta-btn" style={{ position: 'static', width: '100%' }} onClick={() => navigate('/face-id-register')}>다음</button>
        </div>
      )}

      {/* 알파벳+숫자 커스텀 키보드 */}
      {isTextActive && activeTextInfo && (
        <div className="alpha-keypad" onClick={e => e.stopPropagation()}>
          <div className="keypad-header">
            <span className="keypad-label">{activeTextInfo.label}</span>
            <button className="keypad-done" onClick={() => setActiveField(activeTextInfo.next)}>완료</button>
          </div>
          <div className="alpha-input-preview">
            <span>{values[activeField as string] || <span style={{ color: '#aaa' }}>{activeTextInfo.placeholder}</span>}</span>
            <span className="cursor">|</span>
          </div>
          <div className="alpha-rows">
            {ALPHA_ROWS.map((row, ri) => (
              <div key={ri} className="alpha-row">
                {row.map((k, ki) => (
                  <button
                    key={ki}
                    className={`alpha-key${k === '⌫' ? ' key-del' : ''}`}
                    onClick={() => handleAlphaKey(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
            ))}
            <div className="alpha-row alpha-bottom">
              <button className="alpha-key key-space" onClick={() => handleAlphaKey(' ')}>space</button>
            </div>
          </div>
        </div>
      )}

      {/* 숫자 키패드 (생년월일) */}
      {isDobActive && (
        <div className="keypad" onClick={e => e.stopPropagation()}>
          <div className="keypad-header">
            <span className="keypad-label">
              {activeField === 'dob_y' ? '출생 연도 (4자리)' : activeField === 'dob_m' ? '월' : '일'}
            </span>
            <button className="keypad-done" onClick={() => setActiveField(null)}>완료</button>
          </div>
          <div className="keypad-grid">
            {NUM_KEYS.map((k, i) => (
              <button
                key={i}
                className={`key-btn${k === '' ? ' key-empty' : ''}${k === '⌫' ? ' key-del' : ''}`}
                onClick={() => k && handleNumKey(k)}
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
