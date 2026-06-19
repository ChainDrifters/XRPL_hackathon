import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './wallet_withdraw.css'
import '../balance_home/balance_home.css'
import { useLang } from '../../i18n/LangContext'
import { Signal, BatteryMedium, ChevronLeft, Settings, Home, Banknote, ArrowUpDown, RotateCcw, Delete, Check, ScanFace } from 'lucide-react'

type ModalPhase = 'face-id' | 'complete' | null

interface AssetDef {
  code: string
  label: string
  icon: string
  iconBg: string
  iconColor: string
  balance: string
  balanceUnit: string
  krwRate: number
}

export default function WalletWithdraw() {
  const navigate = useNavigate()
  const { t } = useLang()
  const w = t.walletWithdraw
  const c = t.common

  const ASSET_GROUPS: { group: string; assets: AssetDef[] }[] = [
    {
      group: w.fiatGroup,
      assets: [
        { code: 'KRW',   label: w.assetKrw,  icon: '₩', iconBg: '#e8f0fe', iconColor: '#1a73e8', balance: '295,700', balanceUnit: c.won,    krwRate: 1 },
        { code: 'USD',   label: w.assetUsd,  icon: '$', iconBg: '#e8f5e9', iconColor: '#1b8c3e', balance: '215.42',  balanceUnit: 'USD',    krwRate: 1370 },
        { code: 'CNY',   label: w.assetCny,  icon: '¥', iconBg: '#fff3e0', iconColor: '#e65100', balance: '1,580',   balanceUnit: 'CNY',    krwRate: 192 },
        { code: 'JPY',   label: w.assetJpy,  icon: '¥', iconBg: '#fce4ec', iconColor: '#c62828', balance: '32,000',  balanceUnit: 'JPY',    krwRate: 9.2 },
      ],
    },
    {
      group: w.cryptoGroup,
      assets: [
        { code: 'RLUSD', label: 'RLUSD', icon: '𝐗', iconBg: 'var(--rlusd-purple-light)', iconColor: 'var(--rlusd-purple)', balance: '215.42', balanceUnit: 'RLUSD', krwRate: 1370 },
      ],
    },
  ]

  const ALL_ASSETS = ASSET_GROUPS.flatMap(g => g.assets)

  function balanceLabel(a: AssetDef): string {
    if (a.code === 'KRW') return `${c.balance} ${a.balance}${c.won}`
    if (a.code === 'RLUSD') return `${c.balance} ${a.balance} · ≈ ${(parseFloat(a.balance) * a.krwRate).toLocaleString()}${c.won}`
    return `${c.balance} ${a.icon}${a.balance} · ≈ ${(parseFloat(a.balance.replace(/,/g, '')) * a.krwRate).toLocaleString()}${c.won}`
  }

  const [modal, setModal] = useState<ModalPhase>(null)
  const [topAmount, setTopAmount] = useState('')
  const [bottomAmount, setBottomAmount] = useState('')
  const [keypadTarget, setKeypadTarget] = useState<'top' | 'bottom'>('top')
  const [keypadOpen, setKeypadOpen] = useState(false)
  const [assetOpen, setAssetOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<AssetDef>(ALL_ASSETS.find(a => a.code === 'RLUSD')!)
  const [address, setAddress] = useState('rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH')
  const [slippage, setSlippage] = useState(0.5)
  const [customInput, setCustomInput] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const bottomAsset = ALL_ASSETS.find(a => a.code === 'RLUSD')!

  useEffect(() => { setTopAmount(''); setBottomAmount('') }, [selectedAsset])

  useEffect(() => {
    if (modal !== 'face-id') return
    const t = setTimeout(() => setModal('complete'), 2200)
    return () => clearTimeout(t)
  }, [modal])

  function openKeypad(target: 'top' | 'bottom') { setKeypadTarget(target); setKeypadOpen(true) }

  function formatForAsset(val: number, asset: AssetDef): string {
    if (val <= 0) return ''
    if (asset.code === 'KRW' || asset.code === 'JPY') return Math.round(val).toLocaleString()
    return val.toFixed(2)
  }

  function handleKeypad(key: string) {
    const isTop = keypadTarget === 'top'
    const current = isTop ? topAmount : bottomAmount
    const currentAsset = isTop ? selectedAsset : bottomAsset
    const otherAsset = isTop ? bottomAsset : selectedAsset
    const raw = current.replace(/,/g, '')
    let next: string
    if (key === '⌫') {
      const trimmed = raw.slice(0, -1)
      next = trimmed ? Number(trimmed).toLocaleString() : ''
    } else if (key === c.allIn) {
      next = currentAsset.balance
    } else {
      const combined = raw + key
      if (combined.length > 9) return
      next = Number(combined).toLocaleString()
    }
    const maxBal = parseFloat(currentAsset.balance.replace(/,/g, ''))
    let rawNext = next ? Number(next.replace(/,/g, '')) : 0
    if (rawNext > maxBal) { next = currentAsset.balance; rawNext = maxBal }
    const krw = rawNext * currentAsset.krwRate
    const otherVal = krw / otherAsset.krwRate
    if (isTop) { setTopAmount(next); setBottomAmount(formatForAsset(otherVal, bottomAsset)) }
    else { setBottomAmount(next); setTopAmount(formatForAsset(otherVal, selectedAsset)) }
  }

  const topUnit = selectedAsset.code === 'KRW' ? c.won : selectedAsset.balanceUnit
  const shortAddress = address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address
  const rate = selectedAsset.krwRate / bottomAsset.krwRate
  const rateLabel = `1 ${topUnit} = ${rate < 0.01 ? rate.toFixed(6) : rate.toFixed(4)} ${bottomAsset.code}`
  const bottomRaw = bottomAmount ? Number(bottomAmount) : 0
  const minReceived = bottomRaw > 0 ? (bottomRaw * (1 - slippage / 100)).toFixed(2) + ' ' + bottomAsset.code : '-'
  const priceImpact = '< 0.01%'
  const SLIPPAGE_PRESETS = [0.05, 0.1, 0.5, 1]
  const activeAsset = keypadTarget === 'top' ? selectedAsset : bottomAsset
  const activeAmount = keypadTarget === 'top' ? topAmount : bottomAmount
  const activeUnit = keypadTarget === 'top' ? topUnit : bottomAsset.code

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span style={{display:'flex',gap:4,alignItems:'center'}}><Signal size={16}/><BatteryMedium size={16}/></span></div>
      <div className="nav-bar">
        <span className="back" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><ChevronLeft size={24}/></span>
        <span className="nav-title">{w.navTitle}</span>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 180 }}>
        <div className="form-group" style={{ cursor: 'pointer' }} onClick={() => setAssetOpen(true)}>
          <div className="label">{w.sendAsset}</div>
          <div className="input-wrap asset-row">
            <div className="asset-icon" style={{ background: selectedAsset.iconBg, color: selectedAsset.iconColor }}>{selectedAsset.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedAsset.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{balanceLabel(selectedAsset)}</div>
            </div>
            <span style={{ color: 'var(--text-quaternary)' }}>›</span>
          </div>
        </div>

        <div className="form-group">
          <div className="label">{w.recipientAddr}</div>
          <div className="input-wrap">
            <input className="mono" type="text" placeholder={w.addrPlaceholder} value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div className="helper" style={{ color: 'var(--success)' }}>{w.coinbaseConfirmed}</div>
        </div>

        <div className="form-group">
          <div className="label">{w.destTag}</div>
          <div className="input-wrap">
            <input className="mono" type="text" placeholder={w.destTagPlaceholder} defaultValue="2937814" />
          </div>
          <div className="helper">{w.destTagHelper}</div>
        </div>

        <div className="form-group">
          <div className="label">{w.withdrawAmt}</div>
          <div className="swap-box-wrap">
            <div className="swap-box" onClick={() => openKeypad('top')}>
              <div style={{ flex: 1 }}>
                <div className="swap-box-amount" style={{ color: topAmount ? 'var(--text-primary)' : 'var(--text-quaternary)' }}>{topAmount || '0'}</div>
                <div className="swap-box-sub">
                  {c.balance} {selectedAsset.balance} {topUnit} ·{' '}
                  <span style={{ color: 'var(--main-blue)', fontWeight: 700 }}
                    onClick={e => { e.stopPropagation(); setTopAmount(selectedAsset.balance); setBottomAmount(formatForAsset(Number(selectedAsset.balance.replace(/,/g,'')) * selectedAsset.krwRate / bottomAsset.krwRate, bottomAsset)) }}>
                    {c.allIn}
                  </span>
                </div>
              </div>
              <div className="swap-token-chip">
                <div className="asset-icon swap-chip-icon" style={{ background: selectedAsset.iconBg, color: selectedAsset.iconColor }}>{selectedAsset.icon}</div>
                <span className="swap-chip-label">{topUnit}</span>
              </div>
            </div>
            <div className="swap-divider"><div className="swap-arrow"><ArrowUpDown size={18}/></div></div>
            <div className="swap-box" onClick={() => openKeypad('bottom')}>
              <div style={{ flex: 1 }}>
                <div className="swap-box-amount" style={{ color: bottomAmount ? 'var(--text-primary)' : 'var(--text-quaternary)' }}>{bottomAmount || '0'}</div>
                <div className="swap-box-sub">
                  {c.balance} {bottomAsset.balance} {bottomAsset.code} ·{' '}
                  <span style={{ color: 'var(--main-blue)', fontWeight: 700 }}
                    onClick={e => { e.stopPropagation(); setBottomAmount(bottomAsset.balance); setTopAmount(formatForAsset(Number(bottomAsset.balance) * bottomAsset.krwRate / selectedAsset.krwRate, selectedAsset)) }}>
                    {c.allIn}
                  </span>
                </div>
              </div>
              <div className="swap-token-chip">
                <div className="asset-icon swap-chip-icon" style={{ background: bottomAsset.iconBg, color: bottomAsset.iconColor }}>{bottomAsset.icon}</div>
                <span className="swap-chip-label">{bottomAsset.code}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="swap-info-panel">
          <div style={{ paddingBottom: 10 }}>
            <div className="info-row" style={{ borderTop: 'none' }}>
              <span className="info-row-key">Max Slippage</span>
              <span className="info-row-val" style={{ color: slippage > 1 ? '#f59e0b' : 'var(--main-blue)' }}>{slippage}%</span>
            </div>
            <div className="slippage-chips">
              {SLIPPAGE_PRESETS.map(p => (
                <button key={p} className={`slippage-chip${!isCustom && slippage === p ? ' active' : ''}`} onClick={() => { setSlippage(p); setIsCustom(false); setCustomInput('') }}>{p}%</button>
              ))}
              <button className={`slippage-chip${isCustom ? ' active' : ''}`} onClick={() => setIsCustom(true)}>Custom %</button>
            </div>
            {isCustom && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <input className="slippage-custom-input" type="number" min="0.01" max="50" step="0.01" placeholder="0.00" value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onBlur={() => { const v = parseFloat(customInput); if (!isNaN(v) && v > 0) setSlippage(Math.min(v, 50)) }} />
                <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 600 }}>%</span>
              </div>
            )}
          </div>
          <div className="info-panel-divider" />
          <div className="info-row">
            <span className="info-row-key">Rate</span>
            <span className="info-row-val"><span style={{ marginRight: 4, cursor: 'pointer', color: 'var(--text-tertiary)', display:'inline-flex',verticalAlign:'middle' }}><RotateCcw size={14}/></span>{rateLabel}</span>
          </div>
          <div className="info-row"><span className="info-row-key">Minimum Received</span><span className="info-row-val">{minReceived}</span></div>
          <div className="info-row"><span className="info-row-key">Price Impact</span><span className="info-row-val" style={{ color: 'var(--success)' }}>{priceImpact}</span></div>
        </div>
      </div>

      <div className="cta-bottom">
        <button className="cta-btn" onClick={() => setModal('face-id')}>{w.cta}</button>
      </div>
      <div className="bottom-nav">
        <div className="bn-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/balance-home')}><span className="icon"><Home size={20}/></span><span className="label">{c.nav.home}</span></div>
        <div className="bn-item active"><span className="icon"><Banknote size={20}/></span><span className="label">{c.nav.refund}</span></div>
        <div className="bn-item"><span className="icon"><Settings size={20}/></span><span className="label">{c.nav.settings}</span></div>
      </div>

      {assetOpen && (
        <div className="overlay" onClick={() => setAssetOpen(false)}>
          <div className="asset-sheet" onClick={e => e.stopPropagation()}>
            <div className="asset-sheet-handle" />
            <div className="asset-sheet-title">{w.assetSheetTitle}</div>
            {ASSET_GROUPS.map(group => (
              <div key={group.group}>
                <div className="asset-group-label">{group.group}</div>
                {group.assets.map(asset => (
                  <div key={asset.code} className={`asset-option${selectedAsset.code === asset.code ? ' selected' : ''}`} onClick={() => { setSelectedAsset(asset); setAssetOpen(false) }}>
                    <div className="asset-icon" style={{ background: asset.iconBg, color: asset.iconColor }}>{asset.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{asset.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{balanceLabel(asset)}</div>
                    </div>
                    {selectedAsset.code === asset.code && <span style={{ color: 'var(--main-blue)', display:'flex' }}><Check size={18}/></span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {keypadOpen && (
        <div className="overlay" onClick={() => setKeypadOpen(false)}>
          <div className="keypad-sheet" onClick={e => e.stopPropagation()}>
            <div className="keypad-amount">
              <span className="keypad-amount-num">{activeAmount || '0'}</span>
              <span className="keypad-amount-unit">{activeUnit}</span>
            </div>
            <div className="keypad-helper">{c.balance} {activeAsset.balance} {activeUnit}</div>
            <div className="keypad-grid">
              {['1','2','3','4','5','6','7','8','9',c.allIn,'0','⌫'].map(k => (
                <button key={k} className={`keypad-btn${k === c.allIn ? ' keypad-btn-text' : ''}`} onClick={() => handleKeypad(k)}>{k === '⌫' ? <Delete size={18}/> : k}</button>
              ))}
            </div>
            <button className="cta-btn" style={{ margin: '12px 0 0' }} onClick={() => setKeypadOpen(false)}>{c.confirm}</button>
          </div>
        </div>
      )}

      {modal && (
        <div className="overlay" onClick={() => modal === 'complete' ? setModal(null) : undefined}>
          <div className="overlay-sheet" onClick={e => e.stopPropagation()}>
            {modal === 'face-id' && (
              <div className="faceid-wrap">
                <div className="face-scan-ring scanning">
                  <div className="ring-outer" /><div className="ring-middle" /><div className="ring-inner"><div className="scan-line" /></div>
                  <div className="face-icon"><ScanFace size={44}/></div>
                  <div className="corner tl" /><div className="corner tr" /><div className="corner bl" /><div className="corner br" />
                </div>
                <div className="faceid-label">{c.faceId.scanning}</div>
                <div className="faceid-sub">{c.faceId.wait}</div>
              </div>
            )}
            {modal === 'complete' && (
              <div className="complete-wrap">
                <div className="complete-icon"><Check size={24}/></div>
                <div className="complete-title">{w.completionTitle}</div>
                <div className="complete-amount">{bottomAmount || '0'} RLUSD</div>
                <div className="complete-sub">{w.completionSub}</div>
                <div className="summary-info" style={{ width: '100%', marginTop: 16 }}>
                  <div className="row"><span className="k">{w.recipientAddrLabel}</span><span className="v" style={{ fontSize: 10, fontFamily: 'monospace' }}>{shortAddress}</span></div>
                  <div className="row"><span className="k">TxID</span><span className="v" style={{ fontSize: 10, fontFamily: 'monospace' }}>A3F2...9C1B</span></div>
                  <div className="row"><span className="k">{c.networkFee}</span><span className="v">0.00001 XRP</span></div>
                </div>
                <button className="cta-btn" style={{ marginTop: 16 }} onClick={() => { setModal(null); navigate('/balance-home') }}>{c.confirm}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
