// Layer 1 — Ed25519 keypair generation.
// `@noble/ed25519` v2 is async by default and uses WebCrypto under the hood.
import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha2.js'
import { bytesToHex, hexToBytes } from './codec'

ed.hashes.sha512 = sha512

export type Ed25519Keypair = {
  privateKey: Uint8Array
  publicKey: Uint8Array
}

export type Ed25519KeypairHex = {
  privateKeyHex: string
  publicKeyHex: string
}

export async function generateKeypair(): Promise<Ed25519Keypair> {
  const privateKey = ed.utils.randomSecretKey()
  const publicKey = await ed.getPublicKeyAsync(privateKey)
  return { privateKey, publicKey }
}

export async function deriveKeypairFromSeed(seed: Uint8Array): Promise<Ed25519Keypair> {
  if (seed.length !== 32) throw new Error('seed must be 32 bytes')
  const publicKey = await ed.getPublicKeyAsync(seed)
  return { privateKey: seed, publicKey }
}

export function keypairToHex(kp: Ed25519Keypair): Ed25519KeypairHex {
  return {
    privateKeyHex: bytesToHex(kp.privateKey),
    publicKeyHex: bytesToHex(kp.publicKey),
  }
}

export function keypairFromHex(h: Ed25519KeypairHex): Ed25519Keypair {
  return {
    privateKey: hexToBytes(h.privateKeyHex),
    publicKey: hexToBytes(h.publicKeyHex),
  }
}
