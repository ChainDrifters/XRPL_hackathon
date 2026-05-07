import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RefundHome from './pages/refund_home/refund_home'
import RefundDetail from './pages/refund_detail/refund_detail'
import PayoutSelect from './pages/payout_select/payout_select'
import RefundStorage from './pages/refund_storage/refund_storage'
import WalletWithdraw from './pages/wallet_withdraw/wallet_withdraw'
import OnboardingStart from './pages/onboarding_start/onboarding_start'
import PassportRegister from './pages/passport_register/passport_register'
import FaceIdRegister from './pages/face_id_register/face_id_register'
import RegisterComplete from './pages/register_complete/register_complete'
import QRHome from './pages/qr_home/qr_home'
import FaceIdTimer from './pages/face_id_timer/face_id_timer'
import QRIssued from './pages/qr_issued/qr_issued'
import TerminalSync from './pages/terminal_sync/terminal_sync'
import BalanceHome from './pages/balance_home/balance_home'
import ShoppingHistory from './pages/shopping_history/shopping_history'
import TerminalQRScan from './pages/terminal_qr_scan/terminal_qr_scan'
import TerminalFaceId from './pages/terminal_face_id/terminal_face_id'
import TerminalCardInput from './pages/terminal_card_input/terminal_card_input'
import TerminalConfirm from './pages/terminal_confirm/terminal_confirm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/refund-home" replace />} />
        <Route path="/refund-home" element={<RefundHome />} />
        <Route path="/refund-detail" element={<RefundDetail />} />
        <Route path="/payout-select" element={<PayoutSelect />} />
        <Route path="/refund-storage" element={<RefundStorage />} />
        <Route path="/wallet-withdraw" element={<WalletWithdraw />} />
        <Route path="/onboarding-start" element={<OnboardingStart />} />
        <Route path="/passport-register" element={<PassportRegister />} />
        <Route path="/face-id-register" element={<FaceIdRegister />} />
        <Route path="/register-complete" element={<RegisterComplete />} />
        <Route path="/qr-home" element={<QRHome />} />
        <Route path="/face-id-timer" element={<FaceIdTimer />} />
        <Route path="/qr-issued" element={<QRIssued />} />
        <Route path="/terminal-sync" element={<TerminalSync />} />
        <Route path="/balance-home" element={<BalanceHome />} />
        <Route path="/shopping-history" element={<ShoppingHistory />} />
        <Route path="/terminal-qr-scan" element={<TerminalQRScan />} />
        <Route path="/terminal-face-id" element={<TerminalFaceId />} />
        <Route path="/terminal-card-input" element={<TerminalCardInput />} />
        <Route path="/terminal-confirm" element={<TerminalConfirm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
