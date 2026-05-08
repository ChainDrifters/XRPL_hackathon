# Revised Plan Summary - Toss Foreigner Flow Layer

Last updated: 2026-05-04

## Core Position

Toss Foreigner Flow Layer is not a new tax-refund authority, PASS replacement, or public user activity ledger. It is a Toss wallet experience that helps foreigners prepare, prove, and track existing tax-refund, hotel, rental, and deposit workflows.

The product keeps current legal actors in place:

- Merchants/POS systems verify and register purchases.
- Refund operators/eTRS process refund states and payout flows.
- Customs/kiosks confirm export where required.
- Card/PSP systems verify authorizations and settlement.
- Toss coordinates wallet UX, proof presentation, consent, and encrypted records.

Deployment can be either:

- **Toss as licensed/partnered refund operator**: Toss signs operator events directly through its regulated connector.
- **Toss as B2B connector**: Toss routes proof verification for existing refund operators without claiming refund authority.

## Identity Model

Use different identifier types for different jobs.

| Layer | Identifier | Public? | Purpose |
|---|---|---:|---|
| Organization trust | `did:xrpl` | Yes | Public key discovery for Toss, refund operators, POS, PSP, hotel, rental, customs connectors |
| User wallet root | local holder key / `did:key` | No | Wallet signing, recovery, and user consent |
| User-service relationship | `did:peer` + `relationshipId` | No | Pairwise relationship with one verifier or service |
| Proof integrity | `proofChainRoot` | Private by default | Domain-signed checkpoint for one private proof branch; optional batch anchor only |
| Status registry | `statusRoot` | Private by default | Domain-signed checkpoint for validity/revocation status; optional batch anchor only |

The user should not have a single public XRPL DID linking tax, hotel, rental, and escrow activity.

## Reusable E0 / Service DAG

`E0` is the reusable passport/KYC anchor. It is created once and stored in the wallet.

```text
E0 passport_verified
  ├── Tax refund chain A
  ├── Tax refund chain B
  ├── Hotel chain
  └── Rental chain
```

This is a private DAG, not a public global chain. Each branch has its own `did:peer` relationship and proof events. The wallet stores domain-signed `proofChainRoot` / `statusRoot` checkpoints and holder-signed presentations, while XRPL is reserved for issuer DIDs, trust-policy hashes, and optional batch commitments.

## Tax-Refund Proof Chain

Each tax-refund case is a private, hash-linked proof chain. The branch can be
verified while incomplete: `proofChainRoot` means the current latest event hash,
not only the final E7 hash.

```text
passport_verified / tax_refund_readiness
  -> item_purchased
  -> tax_free_status_verified
  -> kiosk_refund_requested
  -> card_authorization_verified
  -> refund_operator_accepted
  -> customs_export_confirmed
  -> card_settlement_completed
```

Each private event contains:

- `eventType`
- `previousEventHash`
- `eventPayloadHash`
- `attestorDid`
- actor signature
- private/off-chain record reference

XRPL does not store these event fields. In production, the wallet stores signed root checkpoints locally; XRPL stores public connector DIDs and, only when needed, opaque batch commitments.

## What Goes On XRPL

- Public issuer/connector DIDs.
- Public keys or DID document references.
- Schema hash.
- Trust policy hash.
- Optional batched `proofChainRoot` commitment.
- Optional batched `statusRoot` commitment.
- Optional escrow transaction hashes for testnet or licensed production flows.

## What Stays Off-Chain

- User `did:peer`.
- `relationshipId`.
- Event type and per-event timestamps.
- Passport evidence.
- Receipt/item details.
- Kiosk number.
- Card authorization token.
- Refund operator payload.
- Customs payload.
- Hotel/rental contract details.

## Verification Model

To verify a private event:

```text
1. Read event.attestorDid.
2. Resolve public key from the actor's did:xrpl DID document.
3. Canonicalize event envelope.
4. Verify actor signature.
5. Check trust policy: is this actor allowed to sign this event type?
6. Check previousEventHash links to prior event.
7. Check the disclosed branch tip hash matches the `proofChainRoot` in the domain-signed checkpoint.
8. Check branch inclusion against the disclosed domain treeRoot and reject stale `previousCheckpointHash`, `checkpointSequence`, `createdAt`, `validUntil`, or event `signedAt` values.
9. Check trust policy allows the checkpoint signer for that service domain.
```

Trust policy is mandatory because signatures only prove possession of a key. The verifier must also check that the signer is allowed to sign that event type. Production POS/merchant signing should use backend or HSM-backed signing rather than storing merchant private keys on POS terminals.

## Presentation Exchange

Operators and vendors query the wallet through scoped presentation requests, not raw database reads.

```text
Refund operator asks for refund-specific proofs.
Hotel asks for booking/check-in proofs.
Rental asks for license/deposit proofs.
```

The wallet returns only the requested selective presentation. Unrelated chains remain hidden.

Each presentation request should also carry a signed, structured consent descriptor. The wallet or kiosk renders that descriptor with allowlisted copy templates so the user sees a natural-language explanation before approving.

```text
tax_refund_kiosk_verify -> 환급을 위해 여권 확인 여부와 면세 구매 증명을 확인할게요
hotel_stay_history -> {hotelName}에서 {nights}일 동안 머문 내역을 확인할게요
rental_deposit_check -> 렌터카 보증금 처리를 위해 면허 확인 여부와 보증금 상태를 확인할게요
```

The final sentence should be generated by the wallet from trusted templates, not accepted as arbitrary vendor text. A details view still shows exact disclosed and withheld fields.

## Backup / Recovery

- Wallet keys recover through passkey/Secure Enclave/StrongBox, cloud-account recovery, or MPC recovery share.
- Private proof chains recover from encrypted cloud backup of the wallet event database.
- Toss may store encrypted blobs, but cannot read private proof-chain contents through normal service operation.

## Diagram

See:

- [privacy-preserving-proof-chain.mmd](privacy-preserving-proof-chain.mmd)
- [multi-service-e0-dag.mmd](multi-service-e0-dag.mmd)

## MVP Scope

Detailed implementation/video plan: [mvp-video-demo-plan.md](mvp-video-demo-plan.md).

Required:

- Tax-refund journey UI across immediate, downtown pre-refund, and airport/kiosk paths.
- `did:peer` relationship for the refund connector.
- Private tax-refund proof chain with signed mock events.
- XRPL Testnet DID/schema/trust-policy/root anchors.
- Encrypted off-chain records with hash references.

Optional:

- Real passport NFC read.
- ZK proof for passport validity.
- Hotel/rental proof-chain demos.
- XRPL Testnet escrow for deposit flow.

## Production Stance

Use XRPL as public PKI, timestamping, integrity anchoring, and escrow/payment infrastructure where appropriate. Do not use XRPL as a personal event log or state machine for user actions.

Recommended custody model:

- Toss manages the wallet UX and connectors.
- User controls presentation via passkey/Secure Enclave/MPC-backed holder key.
- Sensitive legal records are stored in a Toss regulated encrypted vault only where required.
