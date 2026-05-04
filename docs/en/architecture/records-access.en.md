# Records, Access, and Presentations

This page defines the private service event records, encrypted off-chain record envelope, holder access grants, and verifiable presentation shape.

## 1.13 Service event record schema

This is a generic schema for tax refunds, hotel status, rental status, license checks, and escrow lifecycle events.

```json
{
  "type": "ServiceEventRecord",
  "version": "1.0",
  "eventId": "evt_taxrefund_01J8TXA",
  "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
  "serviceDomain": "tax_refund",
  "eventType": "tax_refund_state_update",
  "status": "purchase_record_registered",
  "occurredAt": "2026-05-02T05:00:00Z",
  "actor": {
    "holderDid": "did:peer:2.taxPairwiseExample",
    "issuerDid": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR",
    "verifierDid": "did:xrpl:1:rMERCHANT_OR_REFUND_COUNTER"
  },
  "references": {
    "vcId": "urn:vc:tax-refund-event:01J8TXEVENT",
    "offchainRecordRef": "offrec_tax_claim_01J8TXA",
    "offchainRecordHash": "sha256:3bc4c1...",
    "xrplTxHash": null,
    "publicAnchorId": "anchor_tax_status_root_20260502"
  },
  "privacy": {
    "containsPersonalData": true,
    "publiclyLinkable": false,
    "defaultDisclosure": [
      "status",
      "issuerDid",
      "validity"
    ],
    "restrictedDisclosure": [
      "merchantId",
      "amount",
      "receipt",
      "passportEvidence",
      "taxEvidence"
    ]
  }
}
```

---

## 1.14 Off-chain encrypted record envelope

This is how DID-related records can point to sensitive off-chain data while controlling access.

```json
{
  "type": "EncryptedRecordEnvelope",
  "version": "1.0",
  "offchainRecordRef": "offrec_tax_claim_01J8TXA",
  "recordHash": "sha256:3bc4c1...",
  "contentAddress": "s3://private-bucket/tenant/records/offrec_tax_claim_01J8TXA.enc",
  "encryption": {
    "algorithm": "AES-256-GCM",
    "keyManagement": "envelope_encryption",
    "encryptedDataKeyForIssuer": "base64...",
    "encryptedDataKeyForHolder": "base64..."
  },
  "accessPolicy": {
    "defaultAccess": [
      "issuer",
      "holder"
    ],
    "requiresHolderConsent": true,
    "allowedScopes": [
      "read_status",
      "read_minimal_claims",
      "read_full_evidence"
    ],
    "fullEvidenceRequires": [
      "holderConsent",
      "verifierAuthentication",
      "legalBasis",
      "shortLivedAccessToken"
    ]
  },
  "audit": {
    "createdAt": "2026-05-02T05:00:00Z",
    "lastAccessedAt": null,
    "accessLogRef": "auditlog_01J8TXA"
  }
}
```

---

## 1.15 Access grant schema

When a verifier needs access to more than the minimum presentation, the holder signs an access grant.

```json
{
  "type": "HolderAccessGrant",
  "version": "1.0",
  "grantId": "grant_01J8ACCESS",
  "holderDid": "did:peer:2.taxPairwiseExample",
  "verifierDid": "did:xrpl:1:rTAX_REFUND_OPERATOR_CONNECTOR",
  "issuerDid": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR",
  "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
  "eventId": "evt_taxrefund_01J8TXA",
  "scope": [
    "read_status",
    "read_tax_refund_status_summary"
  ],
  "deniedScope": [
    "read_passport_number",
    "read_arc_number",
    "read_full_visa_record"
  ],
  "purpose": "tax_refund_processing",
  "expiresAt": "2026-05-02T06:00:00Z",
  "nonce": "n_7e92...",
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:peer:2.taxPairwiseExample#key-1",
    "proofPurpose": "authentication",
    "proofValue": "z..."
  }
}
```

Access rule:

```text
Verifier can read off-chain data only if:
  verifier DID is trusted
  + verifier request is signed
  + holder signed an access grant
  + requested scope is allowed
  + grant is not expired
  + credential is valid and not revoked
  + access is logged
```

---

## 1.16 Presentation request consent copy

Before the holder signs a VP or access grant, the wallet renders a natural-language explanation from the signed presentation request.

The renderer is rule-based:

```text
purpose + requesterDisplayName + requestedSummaryFields + retention
  -> allowlisted template
  -> natural-language consent sentence
```

Example request descriptor:

```json
{
  "type": "ConsentDescriptor",
  "templateId": "hotel_stay_history_v1",
  "locale": "ko-KR",
  "requesterDisplayName": "XXX 호텔",
  "requestedSummaryFields": [
    "숙박 기간",
    "체크아웃 완료 여부"
  ],
  "withheldSummaryFields": [
    "여권번호",
    "카드 원문",
    "다른 호텔 이용 내역"
  ],
  "variables": {
    "hotelName": "XXX 호텔",
    "nights": 5
  },
  "retention": "session_only"
}
```

Rendered copy:

```text
XXX 호텔에서 5일 동안 머문 내역을 확인할게요
```

Rules:

- Do not render arbitrary vendor-provided final sentences.
- Only use allowlisted `templateId` values.
- Verify the requester's DID and signature before showing the consent CTA.
- Show exact disclosed fields and withheld fields in a details view.
- Keep the generated sentence and signed descriptor in the local audit log.

---

## 1.17 Verifiable presentation example

This is what the user sends to a hotel, merchant, rental provider, or escrow service.

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vp:01J8VP",
  "type": [
    "VerifiablePresentation"
  ],
  "holder": "did:peer:2.rentalPairwiseExample",
  "verifiableCredential": [
    {
      "id": "urn:vc:rental-eligibility:01J8RENT",
      "type": [
        "VerifiableCredential",
        "RentalEligibilityCredential",
        "LicenseVerificationCredential"
      ],
      "issuer": "did:xrpl:1:rISSUER_RENTAL_PLATFORM",
      "credentialSubject": {
        "id": "did:peer:2.rentalPairwiseExample",
        "relationshipId": "rel_rental_X8mw21",
        "claims": {
          "rentalEligible": true,
          "licenseVerified": true,
          "residenceStatusChecked": true
        }
      },
      "credentialStatus": {
        "type": "BitstringStatusListEntry",
        "statusPurpose": "revocation",
        "statusListIndex": "70091",
        "statusListCredential": "https://issuer.example.com/status-lists/rental-2026"
      },
      "proof": {
        "type": "DataIntegrityProof",
        "verificationMethod": "did:xrpl:1:rISSUER_RENTAL_PLATFORM#key-1",
        "proofPurpose": "assertionMethod",
        "proofValue": "z..."
      }
    }
  ],
  "presentationSubmission": {
    "requestedPurpose": "rental_application",
    "disclosedFields": [
      "rentalEligible",
      "licenseVerified",
      "residenceStatusChecked"
    ],
    "withheldFields": [
      "passportNumber",
      "arcNumber",
      "visaType",
      "licenseNumber",
      "nationality"
    ]
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:peer:2.rentalPairwiseExample#key-1",
    "proofPurpose": "authentication",
    "challenge": "verifier_nonce_abc123",
    "domain": "rental.example.com",
    "proofValue": "z..."
  }
}
```

---


---

[1]: https://xrpl.org/docs/concepts/decentralized-storage/decentralized-identifiers "Decentralized Identifiers"
[2]: https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/credential "Credential"
[3]: https://www.w3.org/TR/did-core/ "Decentralized Identifiers (DIDs) v1.0"
[4]: https://xrpl.org/docs/references/protocol/transactions/types/didset "DIDSet"
[5]: https://www.w3.org/TR/vc-data-model-2.0/ "Verifiable Credentials Data Model v2.0"
[6]: https://xrpl.org/docs/concepts/payment-types/escrow "Escrow"
[7]: https://xrpl.org/docs/concepts/decentralized-storage/credentials "Credentials"
[8]: https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains "Permissioned Domains"
[9]: https://www.w3.org/TR/vc-bitstring-status-list/ "Bitstring Status List v1.0"
