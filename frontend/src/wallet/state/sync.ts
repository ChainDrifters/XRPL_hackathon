const CHANNEL = 'tffl-wallet-sync'

type SyncMessage = { kind: 'refresh' }

let channel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null
  if (!channel) channel = new BroadcastChannel(CHANNEL)
  return channel
}

export function broadcastRefresh(): void {
  getChannel()?.postMessage({ kind: 'refresh' } satisfies SyncMessage)
}

export function onRemoteChange(handler: () => void): () => void {
  const ch = getChannel()
  if (!ch) return () => {}
  const listener = (e: MessageEvent<SyncMessage>) => {
    if (e.data?.kind === 'refresh') handler()
  }
  ch.addEventListener('message', listener)
  return () => ch.removeEventListener('message', listener)
}
