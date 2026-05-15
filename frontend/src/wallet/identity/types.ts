export type Did = string

export type ServiceDomain =
  | 'kyc'
  | 'tax_refund'
  | 'merchant_pos'
  | 'payment'
  | 'customs'
  | 'hotel'
  | 'rental'

export type EventType =
  | 'passport_verified'
  | 'item_purchased'
  | 'purchase_record_registered'
  | 'tax_free_status_verified'
  | 'kiosk_refund_requested'
  | 'immediate_refund_verified'
  | 'immediate_refund_completed'
  | 'downtown_prerefunded'
  | 'card_authorization_verified'
  | 'refund_operator_accepted'
  | 'customs_export_confirmed'
  | 'export_failed'
  | 'card_settlement_completed'
  | 'payout_completed'
  | 'refund_cancelled'
  | 'chargeback_claimed'

export type Holder = {
  holderDid: Did
  publicKeyHex: string
  privateKeyHex: string
  masterSecretHex: string
  createdAt: string
}

export type ServiceRelationship = {
  relationshipId: string
  serviceDomain: ServiceDomain
  verifierDid: Did
  createdAt: string
  credentials: string[]
  events: string[]
}

export type ProofEvent = {
  eventId: string
  eventType: EventType
  attestorDid: Did
  attestorPublicKeyHex: string
  occurredAt: string
  signedAt: string
  previousEventHash: string | null
  eventPayloadHash: string
  payload: unknown
  proof: {
    type: 'DataIntegrityProof'
    verificationMethod: string
    proofPurpose: 'assertionMethod'
    proofValue: string
  }
  branchId: string
  caseId: string
  relationshipId: string
}

export type Credential = {
  id: string
  type: string[]
  issuer: Did
  validFrom: string
  validUntil?: string
  credentialSubject: {
    id: Did
    claims: Record<string, unknown>
  }
  evidence?: {
    type: string
    evidenceRef: string
    evidenceHash: string
    accessPolicy: string
  }
  proof: {
    type: 'DataIntegrityProof'
    verificationMethod: string
    proofPurpose: 'assertionMethod'
    proofValue: string
  }
}

export type DomainRootCheckpoint = {
  type: 'DomainRootCheckpoint'
  relationshipId: string
  serviceDomain: ServiceDomain
  treeRoot: string
  branchId: string
  currentEventHash: string
  currentEventType: EventType
  proofChainRoot: string
  statusRoot: string
  previousCheckpointHash: string | null
  checkpointSequence: number
  createdAt: string
  validUntil: string
  latestEventSignerDid: Did
  checkpointSignerDid: Did
  proof: {
    type: 'DataIntegrityProof'
    verificationMethod: string
    proofPurpose: 'assertionMethod'
    proofValue: string
  }
}

export type EncryptedVaultEntry = {
  vaultId: string
  ownerDid: Did
  contentHash: string
  ciphertext: string
  ivB64: string
  createdAt: string
}
