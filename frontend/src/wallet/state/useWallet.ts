import { useEffect } from 'react'
import { useWalletStore } from './walletStore'

export function useWallet() {
  return useWalletStore((s) => ({
    status: s.status,
    persona: s.persona,
    holder: s.holder,
    relationships: s.relationships,
    events: s.events,
    credentials: s.credentials,
  }))
}

export function useWalletActions() {
  return useWalletStore((s) => s.actions)
}

export function useWalletInit(): boolean {
  const status = useWalletStore((s) => s.status)
  const init = useWalletStore((s) => s.actions.init)
  useEffect(() => {
    if (status === 'idle') void init()
  }, [status, init])
  return status === 'ready'
}
