// Layer 1 — pairwise relationshipId derivation.
// HKDF-SHA256(holderMasterSecret, info=verifierDid|serviceDomain) -> per-pair secret
// HMAC-SHA256(per-pair secret, message=serviceDomain:verifierDid:holderDid) -> id
import { hkdf } from '@noble/hashes/hkdf.js'
import { hmac } from '@noble/hashes/hmac.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToBase64Url, utf8ToBytes } from './codec'

export function deriveRelationshipId(args: {
  holderMasterSecret: Uint8Array
  verifierDid: string
  serviceDomain: string
  holderDid: string
}): string {
  const info = utf8ToBytes(args.verifierDid + '|' + args.serviceDomain)
  const relationshipSecret = hkdf(sha256, args.holderMasterSecret, undefined, info, 32)
  const message = utf8ToBytes(`${args.serviceDomain}:${args.verifierDid}:${args.holderDid}`)
  return 'rel_' + bytesToBase64Url(hmac(sha256, relationshipSecret, message))
}
