import './terminal_confirm.css'

export default function TerminalConfirm() {
  return (
    <div className="terminal-phone">
      <div className="terminal-bar-success">
        <div className="status-left">
          <div className="status-dot" />
          <span className="label">단말기 · 완료</span>
        </div>
        <span className="time">9:41</span>
      </div>

      <div className="terminal-confirm-content">
        <div className="success-rings">
          <div className="r1" /><div className="r2" />
          <div className="check">✓</div>
        </div>

        <div className="confirm-label">확인 완료</div>
        <div className="confirm-title">면세 대상자예요!</div>
        <div className="confirm-sub">면세 대상자임이 확인됐어요.<br />환급은 앱에서 받으실 수 있어요.</div>

        <div className="confirm-info">
          <div className="confirm-row">
            <span className="k">이름</span>
            <span className="v">HONG GILDONG</span>
          </div>
          <div className="confirm-row">
            <span className="k">국적</span>
            <span className="v">🇺🇸 미국</span>
          </div>
          <div className="confirm-row">
            <span className="k">면세 적용</span>
            <span className="v success">✓ 승인</span>
          </div>
        </div>

        <button className="proceed-btn">결제 진행하기</button>
      </div>
    </div>
  )
}
