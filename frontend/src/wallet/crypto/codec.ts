// Layer 1 — bytes/string codecs.
// All wallet code converts via this module to keep encoding consistent.

export function bytesToHex(bytes: Uint8Array): string {
  let out = ''
  for (const b of bytes) out += b.toString(16).padStart(2, '0')
  return out
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex
  if (clean.length % 2 !== 0) throw new Error('hex length must be even')
  const out = new Uint8Array(clean.length / 2)
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

const B64URL_PAD = /=+$/g
function base64urlFromBase64(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(B64URL_PAD, '')
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return base64urlFromBase64(btoa(s))
}

export function base64UrlToBinaryString(b64url: string): string {
  const padded = b64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (b64url.length % 4)) % 4)
  return atob(padded)
}

export function utf8ToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s)
}

export function bytesToUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}
