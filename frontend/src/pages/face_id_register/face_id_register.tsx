import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './face_id_register.css'

export default function FaceIdRegister() {
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!scanning) return
    const timer = setTimeout(() => navigate('/register-complete'), 3000)
    return () => clearTimeout(timer)
  }, [scanning, navigate])

  const handleStart = () => setScanning(true)

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      {!scanning && (
        <div className="nav-bar">
          <span className="back" onClick={() => navigate('/passport-register')} style={{ cursor: 'pointer' }}>‹</span>
          <span className="nav-title">Face ID 등록</span>
        </div>
      )}

      <div className="faceid-content">
        <div className={`face-scan-ring${scanning ? ' scanning' : ''}`}>
          <div className="ring-outer" />
          <div className="ring-middle" />
          <div className="ring-inner">
            {scanning && <div className="scan-line" />}
          </div>
          <div className="face-icon">{scanning ? '😊' : '😐'}</div>
          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />
        </div>

        <div className="faceid-title">
          {scanning ? '얼굴을 인식하고 있어요' : 'Face ID를 등록해주세요'}
        </div>
        <div className="faceid-sub">
          {scanning
            ? '잠시만 기다려 주세요...'
            : '면세 QR 발급 시 본인 확인에 사용돼요.\n등록은 한 번만 해요.'}
        </div>

      </div>

      {!scanning && (
        <div style={{ padding: '0 20px 48px' }}>
          <button className="cta-btn" style={{ background: '#3182f6' }} onClick={handleStart}>
            얼굴 인식 시작
          </button>
        </div>
      )}
    </div>
  )
}
