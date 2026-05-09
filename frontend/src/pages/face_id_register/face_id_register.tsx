import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './face_id_register.css'
import { useLang } from '../../i18n/LangContext'

export default function FaceIdRegister() {
  const navigate = useNavigate()
  const { t } = useLang()
  const f = t.faceIdRegister
  const c = t.common
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!scanning) return
    const timer = setTimeout(() => navigate('/register-complete'), 3000)
    return () => clearTimeout(timer)
  }, [scanning, navigate])

  return (
    <div className="phone">
      <div className="notch" />
      <div className="status-bar"><span>9:41</span><span>📶 🔋</span></div>
      {!scanning && (
        <div className="nav-bar">
          <span className="back" onClick={() => navigate('/passport-register')} style={{ cursor: 'pointer' }}>‹</span>
          <span className="nav-title">{f.navTitle}</span>
        </div>
      )}

      <div className="faceid-content">
        <div className={`face-scan-ring${scanning ? ' scanning' : ''}`}>
          <div className="ring-outer" /><div className="ring-middle" />
          <div className="ring-inner">{scanning && <div className="scan-line" />}</div>
          <div className="face-icon">{scanning ? '😊' : '😐'}</div>
          <div className="corner tl" /><div className="corner tr" /><div className="corner bl" /><div className="corner br" />
        </div>
        <div className="faceid-title">{scanning ? c.faceId.scanning : f.title}</div>
        <div className="faceid-sub" style={{ whiteSpace: 'pre-line' }}>{scanning ? c.faceId.wait : f.sub}</div>
      </div>

      {!scanning && (
        <div style={{ padding: '0 20px 48px' }}>
          <button className="cta-btn" style={{ background: '#3182f6' }} onClick={() => setScanning(true)}>{f.start}</button>
        </div>
      )}
    </div>
  )
}
