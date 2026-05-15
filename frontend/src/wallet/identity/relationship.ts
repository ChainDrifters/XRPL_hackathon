import { deriveRelationshipId } from '../crypto/derive'
import { hexToBytes } from '../crypto/codec'
import type { Holder, ServiceDomain, ServiceRelationship, Did } from './types'

export function relationshipKey(serviceDomain: ServiceDomain, verifierDid: Did): string {
  return `${serviceDomain}:${verifierDid}`
}

export function deriveRelationship(args: {
  holder: Holder
  serviceDomain: ServiceDomain
  verifierDid: Did
}): ServiceRelationship {
  const relationshipId = deriveRelationshipId({
    holderMasterSecret: hexToBytes(args.holder.masterSecretHex),
    verifierDid: args.verifierDid,
    serviceDomain: args.serviceDomain,
    holderDid: args.holder.holderDid,
  })
  return {
    relationshipId,
    serviceDomain: args.serviceDomain,
    verifierDid: args.verifierDid,
    createdAt: new Date().toISOString(),
    credentials: [],
    events: [],
  }
}
