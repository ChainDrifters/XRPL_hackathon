import { Link } from 'react-router-dom'

const groups = [
  {
    title: '고객 앱 (Customer App)',
    pages: [
      { path: '/balance-home', label: '홈' },
      { path: '/refund-home', label: '환급 목록' },
      { path: '/refund-detail', label: '환급 상세' },
      { path: '/payout-select', label: '수령 방법 선택' },
      { path: '/wallet-withdraw', label: '외부 지갑 출금' },
      { path: '/qr-issued', label: 'QR 발급 완료' },
    ],
  },
  {
    title: '온보딩 (Onboarding)',
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
      { path: '/terminal-card-input', label: '카드 입력' },
      { path: '/terminal-confirm', label: '결제 확인' },
    ],
  },
]

export default function DevIndex() {
  return (
    <div style={{ padding: '32px 24px', fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Toss Foreigner Flow Layer</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 32 }}>개발용 페이지 목록 · Dev Index</p>

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
