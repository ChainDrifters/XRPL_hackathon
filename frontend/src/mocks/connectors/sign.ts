import { hexToBytes } from '../../wallet/crypto/codec'
import { buildEvent } from '../../wallet/identity/proof-chain'
import type { ProofEvent, EventType } from '../../wallet/identity/types'
import { CONNECTORS, type ConnectorIdentity, type ConnectorName } from './keys'
import { isAuthorized } from './trust-policy'

export function getConnector(name: ConnectorName): ConnectorIdentity {
  return CONNECTORS[name]
}

export async function signAsConnector(args: {
  connector: ConnectorName
  eventType: EventType
  payload: unknown
  previousEventHash: string | null
  branchId: string
  caseId: string
  relationshipId: string
  occurredAt?: string
  bypassTrustPolicy?: boolean
}): Promise<ProofEvent> {
  const c = CONNECTORS[args.connector]
  if (!args.bypassTrustPolicy && !isAuthorized(args.eventType, c.did)) {
    throw new Error(`trust policy denies ${c.did} signing ${args.eventType}`)
  }
  return buildEvent({
    eventType: args.eventType,
    attestorDid: c.did,
    attestorPublicKeyHex: c.publicKeyHex,
    attestorPrivateKey: hexToBytes(c.privateKeyHex),
    occurredAt: args.occurredAt,
    payload: args.payload,
    previousEventHash: args.previousEventHash,
    branchId: args.branchId,
    caseId: args.caseId,
    relationshipId: args.relationshipId,
  })
}
