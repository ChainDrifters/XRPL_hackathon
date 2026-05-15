import { create } from 'zustand'
import { generateKeypair, keypairToHex } from '../crypto/keypair'
import { bytesToHex, hexToBytes } from '../crypto/codec'
import { hashCanonical } from '../crypto/hash'
import { signCanonical } from '../crypto/sign'
import {
  HOLDER_KEY,
  appendEvent,
  ensureRelationship,
  listCredentials,
  listEvents,
  listRelationships,
  loadHolder,
  saveCredential,
  saveHolder,
} from '../identity/graph'
import { eventHash } from '../identity/proof-chain'
import type {
  Credential,
  Holder,
  ProofEvent,
  ServiceRelationship,
} from '../identity/types'
import {
  HERO_PERSONA_ID,
  loadPersona,
  type Persona,
} from '../personas'
import {
  CONNECTORS,
  signAsConnector,
  type ConnectorName,
} from '../../mocks/connectors'

type Status = 'idle' | 'loading' | 'ready'

type Actions = {
  init: () => Promise<void>
  selectPersona: (id: string) => Promise<void>
  ensureHolder: () => Promise<Holder>
  issueE0: () => Promise<{ event: ProofEvent; credential: Credential }>
  recordEvent: (args: {
    connector: ConnectorName
    eventType: ProofEvent['eventType']
    payload: unknown
    branchId: string
    caseId: string
    serviceDomain: ProofEvent['eventType'] extends string ? string : never extends never ? string : string
    bypassTrustPolicy?: boolean
  }) => Promise<ProofEvent>
  reset: () => Promise<void>
}

type WalletState = {
  status: Status
  persona: Persona | null
  holder: Holder | null
  relationships: ServiceRelationship[]
  events: ProofEvent[]
  credentials: Credential[]
  actions: Actions
}

async function newHolder(): Promise<Holder> {
  const kp = await generateKeypair()
  const { privateKeyHex, publicKeyHex } = keypairToHex(kp)
  const masterSecret = crypto.getRandomValues(new Uint8Array(32))
  const did = `did:key:z${publicKeyHex.slice(0, 24)}`
  return {
    holderDid: did,
    publicKeyHex,
    privateKeyHex,
    masterSecretHex: bytesToHex(masterSecret),
    createdAt: new Date().toISOString(),
  }
}

export const useWalletStore = create<WalletState>((set, get) => ({
  status: 'idle',
  persona: null,
  holder: null,
  relationships: [],
  events: [],
  credentials: [],
  actions: {
    async init() {
      if (get().status !== 'idle') return
      set({ status: 'loading' })
      const [holder, relationships, events, credentials] = await Promise.all([
        loadHolder(),
        listRelationships(),
        listEvents(),
        listCredentials(),
      ])
      const persona = loadPersona(HERO_PERSONA_ID)
      set({
        status: 'ready',
        persona,
        holder: holder ?? null,
        relationships,
        events,
        credentials,
      })
    },

    async selectPersona(id: string) {
      const persona = loadPersona(id)
      set({ persona })
    },

    async ensureHolder() {
      const existing = get().holder
      if (existing) return existing
      const holder = await newHolder()
      await saveHolder(holder)
      set({ holder })
      return holder
    },

    async issueE0() {
      const persona = get().persona
      if (!persona) throw new Error('persona not selected')
      const existingE0 = get().events.find((e) => e.eventType === 'passport_verified')
      if (existingE0) {
        const existingVc = get().credentials.find((c) => c.type.includes('ForeignerKycCredential'))
        if (existingVc) return { event: existingE0, credential: existingVc }
      }

      const holder = await get().actions.ensureHolder()

      const relationship = await ensureRelationship({
        holder,
        serviceDomain: 'kyc',
        verifierDid: CONNECTORS.kycIssuer.did,
      })

      const evidencePayload = {
        passportNumberHash: hashCanonical(persona.passport.passportNumber),
        nationality: persona.passport.nationality,
        nonResident: persona.residence.isNonResident,
        faceMatch: true,
        residenceChecked: true,
        capturedAt: new Date().toISOString(),
      }

      const e0 = await signAsConnector({
        connector: 'kycIssuer',
        eventType: 'passport_verified',
        payload: evidencePayload,
        previousEventHash: null,
        branchId: `kyc_${persona.id}`,
        caseId: `case_kyc_${persona.id}`,
        relationshipId: relationship.relationshipId,
      })
      await appendEvent(e0)

      const vcSubject = {
        id: holder.holderDid,
        claims: {
          passportVerified: true,
          faceMatchVerified: true,
          residenceChecked: true,
          jurisdiction: 'KR',
          isNonResident: persona.residence.isNonResident,
        },
      }

      const vcUnsigned = {
        '@context': ['https://www.w3.org/ns/credentials/v2'],
        id: `urn:vc:foreigner-kyc:${persona.id}`,
        type: ['VerifiableCredential', 'ForeignerKycCredential'],
        issuer: CONNECTORS.kycIssuer.did,
        validFrom: new Date().toISOString(),
        credentialSubject: vcSubject,
        evidence: {
          type: 'IssuerInternalEvidence',
          evidenceRef: `offrec_kyc_${persona.id}`,
          evidenceHash: hashCanonical(evidencePayload),
          accessPolicy: 'issuer-only-unless-holder-grants',
        },
      }
      const { proofValue } = await signCanonical({
        privateKey: hexToBytes(CONNECTORS.kycIssuer.privateKeyHex),
        payload: vcUnsigned,
      })
      const credential: Credential = {
        ...vcUnsigned,
        proof: {
          type: 'DataIntegrityProof',
          verificationMethod: `${CONNECTORS.kycIssuer.did}#key-1`,
          proofPurpose: 'assertionMethod',
          proofValue,
        },
      }
      await saveCredential(credential)

      set({
        events: [...get().events, e0],
        credentials: [...get().credentials, credential],
        relationships: await listRelationships(),
      })
      return { event: e0, credential }
    },

    async recordEvent(args) {
      const holder = await get().actions.ensureHolder()
      const verifier = CONNECTORS[args.connector]
      const relationship = await ensureRelationship({
        holder,
        serviceDomain: args.serviceDomain as ServiceRelationship['serviceDomain'],
        verifierDid: verifier.did,
      })
      const branchEvents = get().events.filter((e) => e.branchId === args.branchId)
      const previous = branchEvents[branchEvents.length - 1]
      const event = await signAsConnector({
        connector: args.connector,
        eventType: args.eventType,
        payload: args.payload,
        previousEventHash: previous ? eventHash(previous) : null,
        branchId: args.branchId,
        caseId: args.caseId,
        relationshipId: relationship.relationshipId,
        bypassTrustPolicy: args.bypassTrustPolicy,
      })
      await appendEvent(event)
      set({
        events: [...get().events, event],
        relationships: await listRelationships(),
      })
      return event
    },

    async reset() {
      set({
        status: 'idle',
        persona: null,
        holder: null,
        relationships: [],
        events: [],
        credentials: [],
      })
      const { clearAll } = await import('../storage/db')
      await clearAll()
      localStorage.removeItem('tffl-wallet-key-v1')
      void HOLDER_KEY
    },
  },
}))
