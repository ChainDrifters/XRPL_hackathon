// Layer 1 — sign / verify a value as canonical JSON.
import * as ed from '@noble/ed25519'
import { canonicalBytes } from './canonical'
import { bytesToHex, hexToBytes } from './codec'

export async function signCanonical(args: {
  privateKey: Uint8Array
  payload: unknown
}): Promise<{ proofValue: string; signedBytesHex: string }> {
  const bytes = canonicalBytes(args.payload)
  const sig = await ed.signAsync(bytes, args.privateKey)
  return { proofValue: bytesToHex(sig), signedBytesHex: bytesToHex(bytes) }
}

export async function verifyCanonical(args: {
  publicKeyHex: string
  payload: unknown
  proofValue: string
}): Promise<boolean> {
  const bytes = canonicalBytes(args.payload)
  return ed.verifyAsync(hexToBytes(args.proofValue), bytes, hexToBytes(args.publicKeyHex))
}
