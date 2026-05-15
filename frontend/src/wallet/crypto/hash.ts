// Layer 1 — SHA-256 over canonical JSON.
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex } from './codec'
import { canonicalBytes } from './canonical'

export function sha256Bytes(input: Uint8Array): Uint8Array {
  return sha256(input)
}

export function sha256Hex(input: Uint8Array): string {
  return 'sha256:' + bytesToHex(sha256(input))
}

// Hash an arbitrary value via canonical JSON. Returns "sha256:<hex>".
export function hashCanonical(value: unknown): string {
  return sha256Hex(canonicalBytes(value))
}
