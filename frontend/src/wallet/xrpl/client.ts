import { Client } from 'xrpl'

const DEFAULT_NETWORK = 'wss://s.altnet.rippletest.net:51233'

let cached: Client | null = null
let connecting: Promise<Client> | null = null

export function getNetworkUrl(): string {
  return import.meta.env.VITE_XRPL_NETWORK ?? DEFAULT_NETWORK
}

export async function getClient(): Promise<Client> {
  if (cached?.isConnected()) return cached
  if (!connecting) {
    connecting = (async () => {
      const c = new Client(getNetworkUrl())
      await c.connect()
      cached = c
      return c
    })()
  }
  return connecting
}

export async function disconnectClient(): Promise<void> {
  if (cached?.isConnected()) await cached.disconnect()
  cached = null
  connecting = null
}
