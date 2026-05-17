import { Link } from 'react-router-dom'
import { useWalletStore } from '../../wallet/state/walletStore'

const groups = [
  {
    title: '고객 앱 (Customer App)',
    pages: [
      { path: '/balance-home', label: '홈' },
      { path: '/refund-home', label: '환급' },
      { path: '/refund-detail', label: '환급 상세' },
      { path: '/payout-select', label: '수령 방법 선택' },
      { path: '/wallet-withdraw', label: '외부 지갑 출금' },
      { path: '/qr-issued', label: '알림' },
    ],
  },
  {
    title: '고객 앱 최초 등록',
    pages: [
      { path: '/onboarding-start', label: '시작' },
      { path: '/passport-register', label: '여권 등록' },
      { path: '/face-id-register', label: 'Face ID 등록' },
      { path: '/register-complete', label: '등록 완료' },
    ],
  },
  {
    title: '단말기 (Terminal / POS)',
    pages: [
      { path: '/terminal-qr-scan', label: 'QR 스캔' },
      { path: '/terminal-face-id', label: 'Face ID 인증' },
      { path: '/terminal-card-input', label: '생년월일 입력' },
      { path: '/terminal-confirm', label: '자격 증명' },
      { path: '/terminal-complete', label: '키오스크 완료' },
    ],
  },
]

export default function DevIndex() {
  const reset = useWalletStore(s => s.actions.reset)

  return (
    <div style={{ padding: '32px 24px', fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Foreigner Flow Layer</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 32 }}>개발용 페이지 목록 · Dev Index</p>

      <div style={{ marginBottom: 32, padding: 14, background: '#fff', border: '1px solid #e5e8eb', borderRadius: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Demo controls
        </div>
        <button
          onClick={async () => {
            if (!confirm('Reset wallet? Clears holder, events, credentials. Anchored XRPL tx history stays on testnet.')) return
            await reset()
            location.reload()
          }}
          style={{
            width: '100%', padding: 12, fontSize: 13,
            color: '#666', background: '#f7f7f8',
            border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer',
          }}
        >
          Reset wallet (clear IndexedDB + AES key)
        </button>
      </div>

      {groups.map((group) => (
        <div key={group.title} style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            {group.title}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {group.pages.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#f7f7f8',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: '#111',
                  fontSize: 14,
                }}
              >
                <span>{label}</span>
                <span style={{ fontSize: 12, color: '#bbb', fontFamily: 'monospace' }}>{path}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
