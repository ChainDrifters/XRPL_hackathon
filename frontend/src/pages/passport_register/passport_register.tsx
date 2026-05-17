import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './passport_register.css'
import { useLang } from '../../i18n/LangContext'
import { useAnchoredAction } from '../../wallet/state/useAnchor'
import { listPersonas } from '../../wallet/personas/loader'
import { useWalletStore } from '../../wallet/state/walletStore'

const PERSONA_FLAGS: Record<string, string> = {
  jane_doe: '🇺🇸',
  wang_xiaolei: '🇨🇳',
  sato_haruki: '🇯🇵',
  priya_iyer: '🇮🇳',
  mia_kovac: '🇭🇷',
}

type TextField = 'passport' | 'name' | 'nationality'
type DobField = 'dob_y' | 'dob_m' | 'dob_d'
type ActiveField = TextField | DobField | null

const NUM_KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

const ALPHA_ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M','⌫'],
]

export default function PassportRegister() {
  const navigate = useNavigate()
  const { t } = useLang()
  const p = t.passportRegister

  const TEXT_FIELDS: { key: TextField; label: string; placeholder: string; maxLength: number; next: ActiveField }[] = [
    { key: 'passport',    label: p.passportLabel,     placeholder: 'M12345678',     maxLength: 9,  next: 'name' },
    { key: 'name',        label: p.nameLabel,         placeholder: 'HONG GILDONG',  maxLength: 40, next: 'nationality' },
    { key: 'nationality', label: p.nationalityLabel,  placeholder: 'United States', maxLength: 40, next: 'dob_y' },
  ]

  const DOB_CELLS: { key: DobField; unit: string; maxLen: number; next: ActiveField }[] = [
    { key: 'dob_y', unit: p.year,  maxLen: 4, next: 'dob_m' },
    { key: 'dob_m', unit: p.month, maxLen: 2, next: 'dob_d' },
    { key: 'dob_d', unit: p.day,   maxLen: 2, next: null },
  ]

  const [activeField, setActiveField] = useState<ActiveField>(null)
  const [values, setValues] = useState<Record<string, string>>({ passport: '', name: '', nationality: '', dob_y: '', dob_m: '', dob_d: '' })
  const anchor = useAnchoredAction()
  const persona = useWalletStore(s => s.persona)
  const selectPersona = useWalletStore(s => s.actions.selectPersona)
  const personas = listPersonas()

  useEffect(() => {
    if (!persona) return
    const [y, m, d] = persona.passport.dateOfBirth.split('-')
    setValues({
      passport: persona.passport.passportNumber,
      name: `${persona.passport.givenNames} ${persona.passport.surname}`,
      nationality: persona.passport.nationality,
      dob_y: y, dob_m: m, dob_d: d,
    })
  }, [persona])

  const isDobActive = activeField === 'dob_y' || activeField === 'dob_m' || activeField === 'dob_d'
  const isTextActive = activeField === 'passport' || activeField === 'name' || activeField === 'nationality'
  const set = (key: string, val: string) => setValues(prev => ({ ...prev, [key]: val }))

  const handleAlphaKey = (key: string) => {
    if (!isTextActive) return
    const fieldInfo = TEXT_FIELDS.find(f => f.key === activeField)!
    const cur = values[activeField as string] ?? ''
    if (key === '⌫') { set(activeField as string, cur.slice(0, -1)) }
    else if (key === ' ') { if (cur.length < fieldInfo.maxLength) set(activeField as string, cur + ' ') }
    else {
      if (cur.length < fieldInfo.maxLength) {
        const next = cur + key
        set(activeField as string, next)
        if (next.length === fieldInfo.maxLength && fieldInfo.maxLength === 9) setActiveField(fieldInfo.next)
      }
    }
  }

  const handleNumKey = (key: string) => {
    if (!isDobActive) return
    const cur = values[activeField as string] ?? ''
    const cell = DOB_CELLS.find(c => c.key === activeField)!
    if (key === '⌫') { set(activeField as string, cur.slice(0, -1)) }
    else if (cur.length < cell.maxLen) {
      const next = cur + key
      set(activeField as string, next)
      if (next.length === cell.maxLen) setActiveField(cell.next)
    }
  }

  const activeTextInfo = TEXT_FIELDS.find(f => f.key === activeField)
  const displayValue = (key: string, placeholder: string) => values[key] || <span className="field-placeholder">{placeholder}</span>

  const dobKeypadLabel = activeField === 'dob_y' ? p.dobYearFull : activeField === 'dob_m' ? p.month : p.day

  return (
    <div className="phone" onClick={() => setActiveField(null)}>
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      <div className="nav-bar">
        <span className="back" onClick={e => { e.stopPropagation(); navigate('/onboarding-start') }} style={{ cursor: 'pointer' }}>‹</span>
        <span className="nav-title">{p.navTitle}</span>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 16 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '8px 4px 24px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: -0.3 }}>{p.heading}</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{p.sub}</div>
        </div>

        <div style={{ marginBottom: 16, padding: 12, background: '#f5f7fa', borderRadius: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#888', marginBottom: 8 }}>DEMO — Pick a persona</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {personas.map(pp => (
              <button
                key={pp.id}
                onClick={() => { void selectPersona(pp.id) }}
                style={{
                  padding: '6px 10px', fontSize: 11, borderRadius: 14,
                  border: persona?.id === pp.id ? '2px solid #3182f6' : '1px solid #ddd',
                  background: persona?.id === pp.id ? '#e8f3ff' : '#fff',
                  cursor: 'pointer',
                }}
              >
                {PERSONA_FLAGS[pp.id] ?? '🪪'} {pp.passport.givenNames.split(' ')[0]} {pp.passport.surname}
              </button>
            ))}
          </div>
        </div>

        <div className="passport-scan-area">
          <div className="top-stripe" />
          <div className="scan-icon">🛂</div>
          <div className="scan-title">{p.scanTitle}</div>
          <div className="scan-sub">{p.scanSub}</div>
          <div className="open-btn">{p.openCamera}</div>
        </div>

        <div className="divider-text">{p.orEnter}</div>

        {TEXT_FIELDS.map(f => (
          <div key={f.key} className={`form-group${activeField === f.key ? ' form-active' : ''}`} onClick={e => { e.stopPropagation(); setActiveField(f.key) }}>
            <div className="label">{f.label}</div>
            <div className="field-display">{displayValue(f.key, f.placeholder)}</div>
          </div>
        ))}

        <div className="form-group" style={{ marginTop: 8 }} onClick={e => e.stopPropagation()}>
          <div className="label">{p.dobLabel}</div>
          <div className="dob-row">
            {DOB_CELLS.map(cell => (
              <div key={cell.key} className={`dob-cell${activeField === cell.key ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setActiveField(cell.key) }}>
                <div className="unit">{cell.unit}</div>
                <div className="dob-value">{values[cell.key] || '–'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!activeField && (
        <div style={{ padding: '0 20px 48px', flexShrink: 0 }}>
          <button className="cta-btn" style={{ position: 'static', width: '100%' }} disabled={anchor.pending} onClick={async () => {
            const ev = await anchor.run({ kind: 'e0' })
            if (ev) navigate('/face-id-register')
          }}>{anchor.pending ? 'Anchoring to XRPL Testnet...' : p.next}</button>
          {anchor.error && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 8 }}>{anchor.error}</div>}
          {anchor.latestAnchor && (
            <div style={{ marginTop: 12, fontSize: 12 }}>
              <div>E0 anchored. tx: <code>{anchor.latestAnchor.txHash.slice(0, 12)}…</code></div>
              <a href={anchor.latestAnchor.explorerTxUrl} target="_blank" rel="noreferrer">Testnet에서 보기 →</a>
            </div>
          )}
        </div>
      )}

      {isTextActive && activeTextInfo && (
        <div className="alpha-keypad" onClick={e => e.stopPropagation()}>
          <div className="keypad-header">
            <span className="keypad-label">{activeTextInfo.label}</span>
            <button className="keypad-done" onClick={() => setActiveField(activeTextInfo.next)}>{p.done}</button>
          </div>
          <div className="alpha-input-preview">
            <span>{values[activeField as string] || <span style={{ color: '#aaa' }}>{activeTextInfo.placeholder}</span>}</span>
            <span className="cursor">|</span>
          </div>
          <div className="alpha-rows">
            {ALPHA_ROWS.map((row, ri) => (
              <div key={ri} className="alpha-row">
                {row.map((k, ki) => (
                  <button key={ki} className={`alpha-key${k === '⌫' ? ' key-del' : ''}`} onClick={() => handleAlphaKey(k)}>{k}</button>
                ))}
              </div>
            ))}
            <div className="alpha-row alpha-bottom">
              <button className="alpha-key key-space" onClick={() => handleAlphaKey(' ')}>space</button>
            </div>
          </div>
        </div>
      )}

      {isDobActive && (
        <div className="keypad" onClick={e => e.stopPropagation()}>
          <div className="keypad-header">
            <span className="keypad-label">{dobKeypadLabel}</span>
            <button className="keypad-done" onClick={() => setActiveField(null)}>{p.done}</button>
          </div>
          <div className="keypad-grid">
            {NUM_KEYS.map((k, i) => (
              <button key={i} className={`key-btn${k === '' ? ' key-empty' : ''}${k === '⌫' ? ' key-del' : ''}`} onClick={() => k && handleNumKey(k)} disabled={k === ''}>{k}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
