import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './terminal_face_id.css'

export default function TerminalFaceId() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'scanning' | 'done'>('scanning')

  useEffect(() => {
    const doneTimer = setTimeout(() => setPhase('done'), 2800)
    return () => clearTimeout(doneTimer)
  }, [])

  useEffect(() => {
    if (phase !== 'done') return
    const navTimer = setTimeout(() => navigate('/terminal-card-input'), 900)
    return () => clearTimeout(navTimer)
  }, [phase, navigate])

  const scanning = phase === 'scanning'
  const done = phase === 'done'

  return (
    <div className="terminal-phone">
      <div className="faceid-content">
        <div className={`face-scan-ring${scanning ? ' scanning' : ''}${done ? ' done' : ''}`}>
          <div className="ring-outer" />
          <div className="ring-middle" />
          <div className="ring-inner">
            {scanning && <div className="scan-line" />}
          </div>
          <div className="face-icon">
            {done ? '😊' : scanning ? '😐' : '😐'}
          </div>
          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />
        </div>

        {done ? (
          <>
            <div className="faceid-status done-label">인증 완료</div>
            <div className="faceid-title">본인 확인됐어요</div>
            <div className="faceid-sub">다음 단계로 이동할게요</div>
          </>
        ) : scanning ? (
          <>
            <div className="faceid-status scanning-label">인식 중...</div>
            <div className="faceid-title">Face ID로<br />본인 확인 중이에요</div>
            <div className="faceid-sub">카메라를 정면으로 봐주세요</div>
          </>
        ) : (
          <>
            <div className="faceid-title">Face ID 인증</div>
            <div className="faceid-sub">카메라를 정면으로 봐주세요</div>
          </>
        )}

        <div className="step-row">
          <span className="step-label">QR 인식</span>
          <span className="step-status s-done">✓ 완료</span>
        </div>
        <div className={`step-row${done ? ' step-done' : ' step-active'}`}>
          <span className="step-label">Face ID 확인</span>
          <span className={`step-status ${done ? 's-done' : 's-inprogress'}`}>
            {done ? '✓ 완료' : '진행 중'}
          </span>
        </div>

      </div>
    </div>
  )
}
