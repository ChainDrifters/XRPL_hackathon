import { useEffect } from 'react'
import { useWalletStore } from './walletStore'
import { onRemoteChange } from './sync'

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
  const refresh = useWalletStore((s) => s.actions.refresh)
  useEffect(() => {
    if (status === 'idle') void init()
  }, [status, init])
  useEffect(() => {
    return onRemoteChange(() => { void refresh() })
  }, [refresh])
  return status === 'ready'
}
