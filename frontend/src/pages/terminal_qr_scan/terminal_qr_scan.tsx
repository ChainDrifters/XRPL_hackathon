import { useNavigate } from 'react-router-dom'
import './terminal_qr_scan.css'

export default function TerminalQRScan() {
  const navigate = useNavigate()

  return (
    <div className="terminal-phone">
      <div className="terminal-content">
        <div className="qr-viewfinder">
          <div className="bg" />
          <div className="qr-corner tl" />
          <div className="qr-corner tr" />
          <div className="qr-corner bl" />
          <div className="qr-corner br" />
          <div className="qr-center">📱</div>
          <div className="qr-scan-line" />
        </div>

        <div className="terminal-title">QR을 찍어주세요</div>
        <div className="terminal-sub">앱에서 면세 QR을 열고<br />카메라 앞에 가져다 주세요</div>
      </div>

      <div className="bottom-actions">
        <button className="qr-confirm-btn" onClick={() => navigate('/terminal-face-id')}>QR 인식 완료</button>
        <button className="barcode-btn" onClick={() => navigate('/terminal-face-id')}>바코드로 입력</button>
      </div>
    </div>
  )
}
