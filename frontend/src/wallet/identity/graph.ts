import { put, get, list } from '../storage/repo'
import { deriveRelationship, relationshipKey } from './relationship'
import type { Holder, ProofEvent, Credential, ServiceRelationship, ServiceDomain, Did } from './types'

export const HOLDER_KEY = 'self'

export async function loadHolder(): Promise<Holder | undefined> {
  return get<Holder>('holders', HOLDER_KEY)
}

export async function saveHolder(holder: Holder): Promise<void> {
  await put('holders', HOLDER_KEY, holder)
}

export async function ensureRelationship(args: {
  holder: Holder
  serviceDomain: ServiceDomain
  verifierDid: Did
}): Promise<ServiceRelationship> {
  const key = relationshipKey(args.serviceDomain, args.verifierDid)
  const existing = await get<ServiceRelationship>('relationships', key)
  if (existing) return existing
  const fresh = deriveRelationship(args)
  await put('relationships', key, fresh)
  return fresh
}

export async function listRelationships(): Promise<ServiceRelationship[]> {
  return list<ServiceRelationship>('relationships')
}

export async function appendEvent(event: ProofEvent): Promise<void> {
  await put('events', event.eventId, event)
  const key = relationshipKey(
    inferDomainFromEvent(event),
    event.attestorDid,
  )
  const rel = await get<ServiceRelationship>('relationships', key)
  if (rel && !rel.events.includes(event.eventId)) {
    rel.events.push(event.eventId)
    await put('relationships', key, rel)
  }
}

export async function listEvents(): Promise<ProofEvent[]> {
  return list<ProofEvent>('events')
}

export async function getEvent(eventId: string): Promise<ProofEvent | undefined> {
  return get<ProofEvent>('events', eventId)
}

export async function saveCredential(vc: Credential): Promise<void> {
  await put('credentials', vc.id, vc)
}

export async function listCredentials(): Promise<Credential[]> {
  return list<Credential>('credentials')
}

function inferDomainFromEvent(event: ProofEvent): ServiceDomain {
  switch (event.eventType) {
    case 'passport_verified':
      return 'kyc'
    case 'item_purchased':
      return 'merchant_pos'
    case 'card_authorization_verified':
    case 'card_settlement_completed':
      return 'payment'
    case 'customs_export_confirmed':
    case 'export_failed':
      return 'customs'
    default:
      return 'tax_refund'
  }
}
