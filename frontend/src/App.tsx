import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './i18n/LangContext'
import { useWalletInit } from './wallet/state/useWallet'
import DevIndex from './pages/dev_index/DevIndex'
import RefundHome from './pages/refund/refund'
import RefundDetail from './pages/refund_detail/refund_detail'
import RefundDetailShinsegae from './pages/refund_detail_shinsegae/refund_detail_shinsegae'
import PayoutSelect from './pages/payout_select/payout_select'
import PayoutSelectLotte from './pages/payout_select_lotte/payout_select_lotte'
import WalletWithdraw from './pages/wallet_withdraw/wallet_withdraw'
import OnboardingStart from './pages/onboarding_start/onboarding_start'
import PassportRegister from './pages/passport_register/passport_register'
import FaceIdRegister from './pages/face_id_register/face_id_register'
import RegisterComplete from './pages/register_complete/register_complete'
import QRIssued from './pages/notification/notification'
import BalanceHome from './pages/balance_home/balance_home'
import TerminalQRScan from './pages/terminal_qr_scan/terminal_qr_scan'
import TerminalFaceId from './pages/terminal_face_id/terminal_face_id'
import TerminalCardInput from './pages/terminal_birth_input/terminal_birth_input'
import TerminalConfirm from './pages/terminal_credential/terminal_credential'
import TerminalComplete from './pages/terminal_complete/terminal_complete'

function App() {
  useWalletInit()
  return (
    <LangProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DevIndex />} />
        <Route path="/refund-home" element={<RefundHome />} />
        <Route path="/refund-detail" element={<RefundDetail />} />
        <Route path="/refund-detail-shinsegae" element={<RefundDetailShinsegae />} />
        <Route path="/payout-select" element={<PayoutSelect />} />
        <Route path="/payout-select-lotte" element={<PayoutSelectLotte />} />
        <Route path="/wallet-withdraw" element={<WalletWithdraw />} />
        <Route path="/onboarding-start" element={<OnboardingStart />} />
        <Route path="/passport-register" element={<PassportRegister />} />
        <Route path="/face-id-register" element={<FaceIdRegister />} />
        <Route path="/register-complete" element={<RegisterComplete />} />
        <Route path="/qr-issued" element={<QRIssued />} />
        <Route path="/balance-home" element={<BalanceHome />} />
        <Route path="/terminal-qr-scan" element={<TerminalQRScan />} />
        <Route path="/terminal-face-id" element={<TerminalFaceId />} />
        <Route path="/terminal-card-input" element={<TerminalCardInput />} />
        <Route path="/terminal-confirm" element={<TerminalConfirm />} />
        <Route path="/terminal-complete" element={<TerminalComplete />} />
      </Routes>
    </BrowserRouter>
    </LangProvider>
  )
}

export default App
