import { hashCanonical } from '../crypto/hash'
import { signCanonical, verifyCanonical } from '../crypto/sign'
import type { Did, EventType, ProofEvent } from './types'

export type EventBuildInput = {
  eventType: EventType
  attestorDid: Did
  attestorPublicKeyHex: string
  attestorPrivateKey: Uint8Array
  occurredAt?: string
  payload: unknown
  previousEventHash: string | null
  branchId: string
  caseId: string
  relationshipId: string
}

export async function buildEvent(input: EventBuildInput): Promise<ProofEvent> {
  const occurredAt = input.occurredAt ?? new Date().toISOString()
  const signedAt = new Date().toISOString()
  const eventId = `evt_${input.branchId}_${shortRandom()}`
  const eventPayloadHash = hashCanonical(input.payload)

  const envelopeForSigning = {
    eventId,
    eventType: input.eventType,
    attestorDid: input.attestorDid,
    occurredAt,
    signedAt,
    previousEventHash: input.previousEventHash,
    eventPayloadHash,
    branchId: input.branchId,
    caseId: input.caseId,
    relationshipId: input.relationshipId,
  }

  const { proofValue } = await signCanonical({
    privateKey: input.attestorPrivateKey,
    payload: envelopeForSigning,
  })

  return {
    ...envelopeForSigning,
    attestorPublicKeyHex: input.attestorPublicKeyHex,
    payload: input.payload,
    proof: {
      type: 'DataIntegrityProof',
      verificationMethod: `${input.attestorDid}#key-1`,
      proofPurpose: 'assertionMethod',
      proofValue,
    },
  }
}

export function eventHash(event: ProofEvent): string {
  const envelope = {
    eventId: event.eventId,
    eventType: event.eventType,
    attestorDid: event.attestorDid,
    occurredAt: event.occurredAt,
    signedAt: event.signedAt,
    previousEventHash: event.previousEventHash,
    eventPayloadHash: event.eventPayloadHash,
    branchId: event.branchId,
    caseId: event.caseId,
    relationshipId: event.relationshipId,
  }
  return hashCanonical(envelope)
}

export type EventVerifyResult =
  | { ok: true }
  | { ok: false; reason: 'signature' | 'payload_hash' | 'previous_hash' | 'trust_policy' }

export async function verifyEventSignature(
  event: ProofEvent,
  resolverPublicKeyHex: string,
): Promise<EventVerifyResult> {
  const envelope = {
    eventId: event.eventId,
    eventType: event.eventType,
    attestorDid: event.attestorDid,
    occurredAt: event.occurredAt,
    signedAt: event.signedAt,
    previousEventHash: event.previousEventHash,
    eventPayloadHash: event.eventPayloadHash,
    branchId: event.branchId,
    caseId: event.caseId,
    relationshipId: event.relationshipId,
  }
  const sigOk = await verifyCanonical({
    publicKeyHex: resolverPublicKeyHex,
    payload: envelope,
    proofValue: event.proof.proofValue,
  })
  if (!sigOk) return { ok: false, reason: 'signature' }
  if (hashCanonical(event.payload) !== event.eventPayloadHash) {
    return { ok: false, reason: 'payload_hash' }
  }
  return { ok: true }
}

export async function verifyChain(args: {
  events: ProofEvent[]
  resolvePublicKey: (did: Did) => Promise<string>
  isAuthorized: (eventType: EventType, signerDid: Did) => boolean
}): Promise<EventVerifyResult> {
  let prev: string | null = null
  for (const event of args.events) {
    if (event.previousEventHash !== prev) return { ok: false, reason: 'previous_hash' }
    if (!args.isAuthorized(event.eventType, event.attestorDid)) {
      return { ok: false, reason: 'trust_policy' }
    }
    const pk = await args.resolvePublicKey(event.attestorDid)
    const sig = await verifyEventSignature(event, pk)
    if (!sig.ok) return sig
    prev = eventHash(event)
  }
  return { ok: true }
}

function shortRandom(): string {
  const buf = new Uint8Array(8)
  crypto.getRandomValues(buf)
  let out = ''
  for (const b of buf) out += b.toString(16).padStart(2, '0')
  return out
}
