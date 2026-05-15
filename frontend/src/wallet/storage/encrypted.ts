import { bytesToBase64Url, base64UrlToBinaryString, utf8ToBytes, bytesToUtf8 } from '../crypto/codec'

const KEY_STORAGE = 'tffl-wallet-key-v1'
const ALGORITHM = { name: 'AES-GCM', length: 256 } as const

async function loadOrCreateKey(): Promise<CryptoKey> {
  const existingHex = localStorage.getItem(KEY_STORAGE)
  if (existingHex) {
    const raw = Uint8Array.from(binaryStringToBytes(base64UrlToBinaryString(existingHex)))
    return crypto.subtle.importKey('raw', raw, ALGORITHM, false, ['encrypt', 'decrypt'])
  }
  const key = await crypto.subtle.generateKey(ALGORITHM, true, ['encrypt', 'decrypt'])
  const exported = new Uint8Array(await crypto.subtle.exportKey('raw', key))
  localStorage.setItem(KEY_STORAGE, bytesToBase64Url(exported))
  return key
}

function binaryStringToBytes(s: string): Uint8Array {
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i += 1) out[i] = s.charCodeAt(i)
  return out
}

let cached: Promise<CryptoKey> | null = null
function key(): Promise<CryptoKey> {
  if (!cached) cached = loadOrCreateKey()
  return cached
}

export type EncryptedEnvelope = {
  v: 1
  ivB64: string
  ctB64: string
}

export async function encryptJson(value: unknown): Promise<EncryptedEnvelope> {
  const k = await key()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = utf8ToBytes(JSON.stringify(value))
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, k, plaintext as BufferSource),
  )
  return { v: 1, ivB64: bytesToBase64Url(iv), ctB64: bytesToBase64Url(ct) }
}

export async function decryptJson<T = unknown>(env: EncryptedEnvelope): Promise<T> {
  const k = await key()
  const iv = binaryStringToBytes(base64UrlToBinaryString(env.ivB64))
  const ct = binaryStringToBytes(base64UrlToBinaryString(env.ctB64))
  const pt = new Uint8Array(
    await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, k, ct as BufferSource),
  )
  return JSON.parse(bytesToUtf8(pt)) as T
}
