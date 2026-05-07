# Tax Refund E0-E7 Request and Data-Access Process

This document describes the full tax-refund proof-chain flow from `E0` to `E7`.
It focuses on what each party requests, how the wallet decides what to disclose,
what data is accessed, what remains private, and what gets signed.

The core rule is: no party reads wallet records directly. A connector sends a
signed request, the wallet verifies the requester and purpose, the holder approves
the request, and the wallet discloses only the minimum proof or claim needed for
that step.

## Actors

| Actor | DID / key type | Role |
|---|---|---|
| Holder wallet | local holder key / `did:key`, service `did:peer` | Stores credentials, private event chain, encrypted records, signed root checkpoints, and holder consent decisions |
| Toss KYC issuer | `did:xrpl` | Verifies passport/KYC evidence and signs E0 |
| Merchant POS connector | `did:xrpl` | Registers purchase and signs E1 |
| Refund operator connector | `did:xrpl` | Checks tax-free status, refund requests, and operator acceptance; signs E2, E3, E5 |
| Card PSP connector | `did:xrpl` | Checks card authorization and settlement; signs E4 and E7 |
| Customs connector / kiosk mock | `did:xrpl` | Confirms export or failure; signs E6 |
| Trust registry | signed off-chain registry, hash anchored or distributed | Maps event types and request scopes to authorized connector DIDs |
| XRPL | public ledger | Stores organization DIDs, public key references, schema/trust hashes, and optional batch commitments, not per-user records |

## Common Request Envelope

Every external read or proof request uses a signed request. The wallet never trusts
free-form vendor copy.

```json
{
  "type": "PresentationRequest",
  "requestId": "req_taxrefund_01J8",
  "verifierDid": "did:xrpl:1:rREFUND_OPERATOR_CONNECTOR",
  "purpose": "tax_refund_processing",
  "templateId": "tax_refund_minimal_status_v1",
  "requestedScopes": [
    "read_status",
    "read_minimal_claims"
  ],
  "requestedClaims": [
    "passport_verified",
    "tax_refund_readiness",
    "purchase_registered",
    "credential_status"
  ],
  "requiredProofs": [
    "holder_binding",
    "event_chain",
    "credential_status",
    "fresh_checkpoint"
  ],
  "nonce": "n_7e92...",
  "expiresAt": "2026-05-02T06:00:00Z",
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rREFUND_OPERATOR_CONNECTOR#key-1",
    "proofPurpose": "authentication",
    "proofValue": "z..."
  }
}
```

The wallet responds only if all checks pass:

- Resolve `verifierDid` and verify the request signature.
- Check the trust registry for the verifier role, request purpose, and allowed scopes.
- Check `templateId` against the wallet allowlist.
- Check `nonce`, `expiresAt`, replay state, and requested domain.
- Render a holder consent screen from the allowlisted template.
- Require a separate short-lived Holder Access Grant for full evidence.

## Common Wallet Response Shape

The wallet's response is a selective presentation, not a database export.

```json
{
  "type": "TaxRefundPresentation",
  "presentationId": "vp_taxrefund_01J8",
  "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
  "holderBinding": {
    "holderDid": "did:peer:2.taxPairwiseExample",
    "nonce": "n_7e92..."
  },
  "disclosedClaims": {
    "passportVerified": true,
    "taxRefundReadiness": true,
    "currentRefundStatus": "refund_operator_accepted"
  },
  "eventReceipts": [
    "E0",
    "E1",
    "E2",
    "E3",
    "E4",
    "E5"
  ],
  "chainProof": {
    "branchId": "branch_taxrefund_01J8TXA",
    "proofChainRoot": "sha256:event-e5",
    "treeRoot": "sha256:domain-tree-root",
    "inclusionProof": ["sha256:sibling-a", "sha256:sibling-b"]
  },
  "statusProof": {
    "statusRoot": "sha256:status-list-root",
    "statusListIndex": "39201",
    "status": "valid"
  },
  "checkpoint": {
    "checkpointSequence": 17,
    "createdAt": "2026-05-02T05:40:00Z",
    "validUntil": "2026-05-02T06:10:00Z",
    "issuerDid": "did:xrpl:1:rREFUND_OPERATOR_CONNECTOR",
    "proofValue": "z..."
  },
  "holderProof": {
    "verificationMethod": "did:peer:2.taxPairwiseExample#key-1",
    "proofValue": "z..."
  }
}
```

The verifier checks this response against the original request nonce and purpose.
It rejects presentations with stale checkpoints, missing event receipts, invalid
event signatures, disallowed signers, or insufficient status proof.

## Event Receipt Shape

Every event has a signed receipt. The sensitive payload is represented by a hash.

```json
{
  "eventId": "evt_taxrefund_01J8TXA_004",
  "branchId": "branch_taxrefund_01J8TXA",
  "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
  "eventType": "refund_operator_accepted",
  "attestorDid": "did:xrpl:1:rREFUND_OPERATOR_CONNECTOR",
  "occurredAt": "2026-05-02T05:30:00Z",
  "previousEventHash": "sha256:prev-event",
  "eventPayloadHash": "sha256:canonical-private-payload",
  "offchainRecordRef": "offrec_tax_claim_01J8TXA",
  "statusListIndex": "39201",
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rREFUND_OPERATOR_CONNECTOR#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

## E0: Passport Verified

Purpose: create the reusable private KYC/passport anchor.

Requester and signer:

- Requester: Toss KYC issuer.
- Signer: Toss KYC issuer.
- Required authority: `passport_verified`.

Request asks for:

- Passport authenticity check.
- Face match or holder-presence check.
- Foreign visitor or residence-status readiness.
- Consent to create a reusable wallet KYC credential.

Data accessed:

- Passport OCR/MRZ or chip-derived data.
- Face verification result.
- Residence or visa evidence if required.
- Issuer-side KYC evidence record.

Wallet discloses:

- Holder consent for KYC issuance.
- Holder binding key / `did:peer` for this relationship.
- Minimal facts needed to issue the credential.

Wallet receives and stores:

- `ForeignerKycCredential`.
- E0 event receipt.
- `eventPayloadHash` for the private KYC payload.
- Off-chain evidence reference, encrypted where applicable.

Stays private:

- Passport number.
- Full passport image.
- Full MRZ/chip data.
- Raw biometric image or template.
- Detailed visa/ARC values unless explicitly required by law and covered by a separate access grant.

Verification later:

- Resolve Toss KYC DID.
- Verify E0 signature.
- Check status proof for the KYC credential.
- Check E0 is the ancestor for the tax-refund branch being presented.

## E1: Item Purchased

Purpose: register that a tax-refund-relevant purchase occurred.

Requester and signer:

- Requester: Merchant POS connector.
- Signer: Merchant POS connector.
- Required authority: `item_purchased`.

Request asks for:

- Tax-refund readiness proof.
- Holder consent to register this purchase in the refund flow.
- Optional minimal KYC proof, such as "passport verified" and "foreigner/tourist readiness".

Data accessed:

- POS receipt.
- Item category and eligible amount.
- Merchant ID and terminal reference.
- Wallet KYC/readiness proof.

Wallet discloses:

- `passport_verified=true` or selective KYC proof.
- Tax-refund readiness credential.
- Holder consent for purchase registration.
- Relationship-specific holder binding, not a global wallet ID.

Wallet receives and stores:

- E1 event receipt.
- Merchant signature.
- Receipt hash.
- Off-chain receipt/evidence reference.

Stays private:

- Full receipt unless the holder grants access.
- Item details not needed for the current verifier.
- Payment card token.
- Passport source data.

Verification later:

- Merchant DID must resolve to a trusted POS connector.
- Trust policy must allow merchant DID to sign `item_purchased`.
- E1 `previousEventHash` must match E0.
- E1 payload hash must match receipt evidence if full evidence is later granted.

## E2: Tax-Free Status Verified

Purpose: prove that the refund operator checked the purchase against tax-free rules.

Requester and signer:

- Requester: Refund operator connector.
- Signer: Refund operator connector.
- Required authority: `tax_free_status_verified`.

Request asks for:

- E0-E1 chain proof.
- Merchant E1 signature.
- Minimal KYC/readiness proof.
- Purchase registration status.

Data accessed:

- Merchant purchase record.
- Tax-free merchant/operator rules.
- Eligibility result.
- Status-list entry for the resulting credential or event.

Wallet discloses:

- E1 receipt and proof chain link.
- Minimal readiness claim.
- Holder consent for operator processing.

Wallet receives and stores:

- E2 event receipt.
- Operator status result.
- `statusListIndex`.
- Updated status proof or status checkpoint.

Stays private:

- Full item/amount details unless needed for operator processing.
- Operator internal decision rules.
- User identity source documents.

Verification later:

- Refund operator DID must be trusted.
- Trust policy must allow `tax_free_status_verified`.
- E2 must link to E1.
- Status proof must be valid and fresh.

## E3: Kiosk Refund Requested

Purpose: record that the holder requested refund processing at a kiosk or refund counter.

Requester and signer:

- Requester: Kiosk or refund operator connector.
- Signer: Refund operator connector.
- Required authority: `kiosk_refund_requested`.

Request asks for:

- E0-E2 proof chain.
- Current status proof.
- Holder consent to start refund request.
- QR/slip reference or refund case reference.

Data accessed:

- Kiosk session.
- Refund QR/slip.
- Operator case file.
- Wallet proof chain up to E2.

Wallet discloses:

- Chain proof up to E2.
- Current status proof.
- Holder consent.
- Minimal case reference.

Wallet receives and stores:

- E3 event receipt.
- Refund request status.
- Kiosk/operator signature.
- Updated private case reference.

Stays private:

- Kiosk screen logs.
- Kiosk terminal number unless operationally required.
- Full receipt and passport evidence.
- Internal refund case payload.

Verification later:

- Operator DID must be authorized for `kiosk_refund_requested`.
- E3 must link to E2.
- Kiosk request must use a valid nonce/session and not be replayed.

## E4: Card Authorization Verified

Purpose: prove that the refund/card rail can process the provisional or final refund.

Requester and signer:

- Requester: Card PSP connector.
- Signer: Card PSP connector.
- Required authority: `card_authorization_verified`.

Request asks for:

- Refund case reference.
- Amount or authorization context, preferably as a hash or operator reference.
- Tokenized card/account status.

Data accessed:

- PSP authorization record.
- Tokenized card or payout account reference.
- Refund operator instruction.
- E0-E3 case proof if required.

Wallet discloses:

- Refund case reference.
- Holder approval for payout route check.
- Minimal status or account-binding proof.

Wallet receives and stores:

- E4 event receipt.
- PSP authorization status.
- PSP signature.
- Authorization hash.

Stays private:

- PAN.
- Raw card token.
- Payout account details.
- PSP internal risk score.

Verification later:

- PSP DID must be trusted.
- Trust policy must allow `card_authorization_verified`.
- E4 must link to E3.
- Authorization status must match the PSP-signed receipt.

## E5: Refund Operator Accepted

Purpose: prove that the refund operator accepted the case for provisional or final processing.

Requester and signer:

- Requester: Refund operator connector.
- Signer: Refund operator connector.
- Required authority: `refund_operator_accepted`.

Request asks for:

- E0-E4 proof chain.
- Current credential/status proof.
- Payout readiness.
- Optional full evidence access if manual review is required.

Data accessed:

- Operator case file.
- Merchant purchase verification.
- PSP authorization response.
- Status registry.
- Manual review data if separately granted.

Wallet discloses:

- Chain proof up to E4.
- Status proof.
- Holder access grant only for the scopes needed.
- Payout readiness proof, not raw card/account data.

Wallet receives and stores:

- E5 event receipt.
- Accepted/provisional/final status.
- Updated `statusRoot`.
- Signed wallet checkpoint if the operator is issuing a fresh checkpoint at this stage.

Stays private:

- Operator internal notes.
- Full evidence bundle unless access-granted.
- Merchant/PSP private payloads.
- Raw payout details.

Verification later:

- Refund operator DID must be authorized for `refund_operator_accepted`.
- E5 must link to E4.
- Status proof must be fresh.
- Checkpoint sequence must not be older than verifier last-seen state.

## E6: Customs Export Confirmed

Purpose: prove that export confirmation happened or failed.

Requester and signer:

- Requester: Customs connector or kiosk mock.
- Signer: Customs connector.
- Required authority: `customs_export_confirmed`.

Request asks for:

- Eligible goods proof.
- Refund case reference.
- E0-E5 proof chain or minimal export-ready proof.
- Holder consent to present export confirmation data.

Data accessed:

- Customs or kiosk export confirmation result.
- Selective inspection result if applicable.
- Refund case reference.
- Purchase eligibility proof.

Wallet discloses:

- Minimal case proof.
- Goods eligibility proof or receipt hash.
- Holder consent for export confirmation.

Wallet receives and stores:

- E6 event receipt.
- Export confirmed, failed, or inspection-required status.
- Customs signature.
- Customs payload hash.

Stays private:

- Customs internal payload.
- Inspection details.
- Full receipt and passport evidence.
- Per-item data unless legally required.

Verification later:

- Customs DID must resolve to an authorized customs connector.
- Trust policy must reject any non-customs signer for `customs_export_confirmed`.
- E6 must link to E5.
- Export status must match the signed customs event.

## E7: Card Settlement Completed

Purpose: close the case with final refund settlement status.

Requester and signer:

- Requester: Card PSP connector.
- Signer: Card PSP connector.
- Required authority: `card_settlement_completed`.

Request asks for:

- E6 export result.
- Refund authorization reference.
- Settlement route reference.
- Current operator status.

Data accessed:

- PSP settlement record.
- Refund operator settlement instruction.
- Payout rail status.
- Case proof up to E6.

Wallet discloses:

- E6 export result proof.
- Refund authorization reference.
- Holder binding and case reference.

Wallet receives and stores:

- E7 event receipt.
- Settlement completed, failed, or reversed status.
- Final event hash.
- Final `proofChainRoot`.
- Updated signed wallet checkpoint.

Stays private:

- Payout account details.
- Card token.
- PSP settlement internals.
- Bank/card rail metadata.

Verification later:

- PSP DID must be authorized for `card_settlement_completed`.
- E7 must link to E6.
- Final `proofChainRoot` must equal the E7 signed event hash.
- Final checkpoint must include that `proofChainRoot` and pass freshness checks.

## Root Checkpoint After E7

After E7, the wallet updates its local domain tree and stores a signed checkpoint.

```json
{
  "type": "WalletRootCheckpoint",
  "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
  "serviceDomain": "tax_refund",
  "branchId": "branch_taxrefund_01J8TXA",
  "treeRoot": "sha256:domain-tree-root",
  "proofChainRoot": "sha256:event-e7",
  "statusRoot": "sha256:status-list-root",
  "checkpointSequence": 18,
  "createdAt": "2026-05-02T05:50:00Z",
  "validUntil": "2026-05-02T06:20:00Z",
  "issuerDid": "did:xrpl:1:rREFUND_OPERATOR_CONNECTOR",
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rREFUND_OPERATOR_CONNECTOR#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

The `treeRoot` exists because a single `proofChainRoot` only proves one branch.
To detect branch deletion or branch swapping, the verifier can require:

- The disclosed branch.
- The branch `proofChainRoot`.
- A Merkle inclusion proof from branch root to `treeRoot`.
- A signed checkpoint containing that `treeRoot`.
- A fresh `checkpointSequence`.

The last-seen state lives in each verifier/operator backend, not in the checkpoint.
For example, a POS or refund operator stores:

```json
{
  "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
  "lastSeenCheckpointSequence": 18,
  "lastSeenAt": "2026-05-02T05:50:30Z"
}
```

This prevents rollback without exposing a global wallet ID or a cross-service
activity history.

## Verification Summary

During a phone-to-party transaction, the verifier checks:

1. Request nonce matches the wallet response.
2. Holder approved the exact allowlisted purpose and scopes.
3. Every event signature is valid.
4. Every event signer DID resolves through `did:xrpl`.
5. Trust registry allows each signer for that event type.
6. `previousEventHash` links E0 through the latest disclosed event.
7. Any disclosed private payload hashes to the recorded `eventPayloadHash`.
8. Credential/status proof is valid against `statusRoot`.
9. Branch `proofChainRoot` is included in `treeRoot`.
10. Signed checkpoint contains the expected `treeRoot`, `proofChainRoot`, and `statusRoot`.
11. `validUntil` is not expired.
12. `checkpointSequence` is newer than verifier last-seen state.

If full evidence is needed, the verifier must request a separate Holder Access
Grant with a narrow scope, a legal/purpose basis, and a short expiry.
