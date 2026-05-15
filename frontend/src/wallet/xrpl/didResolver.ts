import { getClient } from './client'
import { hexToBytes, bytesToUtf8 } from '../crypto/codec'

export type DidLedgerEntry = {
  account: string
  uriHex: string
  uri: string
  ledgerIndex: number
}

export type DidVerificationMethod = {
  id: string
  type: string
  controller: string
  publicKeyHex: string
}

export type DidDocument = {
  '@context': string[]
  id: string
  controller?: string
  alsoKnownAs?: string[]
  verificationMethod: DidVerificationMethod[]
  assertionMethod?: string[]
  authentication?: string[]
  service?: Array<{
    id: string
    type: string
    serviceEndpoint: Record<string, unknown>
  }>
}

const docCache = new Map<string, Promise<DidDocument>>()
const entryCache = new Map<string, Promise<DidLedgerEntry>>()

export function didFromAccount(account: string): string {
  return `did:xrpl:1:${account}`
}

export function accountFromDid(did: string): string {
  const parts = did.split(':')
  if (parts.length !== 4 || parts[0] !== 'did' || parts[1] !== 'xrpl') {
    throw new Error(`not a did:xrpl: ${did}`)
  }
  return parts[3]
}

export async function fetchLedgerDidEntry(account: string): Promise<DidLedgerEntry> {
  const cached = entryCache.get(account)
  if (cached) return cached
  const promise = (async () => {
    const client = await getClient()
    const response = (await client.request({
      command: 'ledger_entry',
      did: account,
      ledger_index: 'validated',
    } as Parameters<typeof client.request>[0])) as { result: { node: { URI?: string }; ledger_index: number } }
    const node = response.result.node
    const uriHex = node.URI ?? ''
    const uri = uriHex ? bytesToUtf8(hexToBytes(uriHex)) : ''
    return { account, uriHex, uri, ledgerIndex: response.result.ledger_index }
  })()
  entryCache.set(account, promise)
  return promise
}

export async function fetchDidDocument(account: string): Promise<DidDocument> {
  const cached = docCache.get(account)
  if (cached) return cached
  const promise = (async () => {
    const entry = await fetchLedgerDidEntry(account)
    if (!entry.uri) throw new Error(`DID for ${account} has no URI`)
    const res = await fetch(entry.uri)
    if (!res.ok) throw new Error(`DID document fetch failed: ${res.status}`)
    return (await res.json()) as DidDocument
  })()
  docCache.set(account, promise)
  return promise
}

export async function resolveAssertionPublicKey(did: string): Promise<string> {
  const account = accountFromDid(did)
  const doc = await fetchDidDocument(account)
  const ref = doc.assertionMethod?.[0]
  const vm = doc.verificationMethod.find((m) => m.id === ref) ?? doc.verificationMethod[0]
  if (!vm) throw new Error(`no verificationMethod in DID document for ${did}`)
  return vm.publicKeyHex
}
