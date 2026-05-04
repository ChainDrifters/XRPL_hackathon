# DID and Credential Model

This page defines issuer DID documents, XRPL DIDSet usage, VC types, XRPL native Credentials, and revocation/status handling.

## 1.6 DID document model

A DID document should contain verification material and public service endpoints only. W3C describes DID documents as containing verification methods, such as public keys, and services relevant to interactions with the DID subject. ([W3C][3]) XRPL’s DID flow is: account holder generates DID, associates it with a DID document, user provides DID + VC, and verifier resolves the DID document to verify authenticity. ([XRP Ledger][1])

### Issuer DID document example

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1"
  ],
  "id": "did:xrpl:1:rISSUER_TOSS_KYC",
  "verificationMethod": [
    {
      "id": "did:xrpl:1:rISSUER_TOSS_KYC#key-1",
      "type": "JsonWebKey2020",
      "controller": "did:xrpl:1:rISSUER_TOSS_KYC",
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "P-256",
        "x": "BASE64URL_X",
        "y": "BASE64URL_Y"
      }
    }
  ],
  "assertionMethod": [
    "did:xrpl:1:rISSUER_TOSS_KYC#key-1"
  ],
  "authentication": [
    "did:xrpl:1:rISSUER_TOSS_KYC#key-1"
  ],
  "service": [
    {
      "id": "did:xrpl:1:rISSUER_TOSS_KYC#schemas",
      "type": "CredentialSchemaService",
      "serviceEndpoint": "https://issuer.example.com/.well-known/vc-schemas"
    },
    {
      "id": "did:xrpl:1:rISSUER_TOSS_KYC#status",
      "type": "CredentialStatusService",
      "serviceEndpoint": "https://issuer.example.com/status-lists"
    },
    {
      "id": "did:xrpl:1:rISSUER_TOSS_KYC#trust",
      "type": "IssuerTrustMetadata",
      "serviceEndpoint": "https://issuer.example.com/trust-metadata.json"
    }
  ]
}
```

Do **not** put this in a user DID document:

```json
{
  "passportNumber": "M12345678",
  "visaType": "D-2",
  "arcNumber": "123456-1234567",
  "taxRefundHistory": "https://..."
}
```

---

## 1.7 XRPL DIDSet transaction example

XRPL’s `DIDSet` transaction creates or updates a DID and supports `Data`, `DIDDocument`, or `URI`; at least one must be included. ([XRP Ledger][4])

Example:

```json
{
  "TransactionType": "DIDSet",
  "Account": "rISSUER_TOSS_KYC",
  "Fee": "10",
  "Sequence": 391,
  "URI": "68656c6c6f2d6865782d656e636f6465642d757269",
  "Data": "",
  "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020"
}
```

Human-readable equivalent of the `URI`:

```text
https://issuer.example.com/did/did-xrpl-rISSUER_TOSS_KYC.json
```

Implementation note:

```text
Store only a DID document reference, schema reference, or public issuer metadata.
Never store passport, ARC, visa, tax, rental, hotel, or license data in DIDSet.Data or DIDDocument.
```

---

## 1.8 Credential taxonomy

Use several credential types. Do not overload one “foreigner credential” with everything.

```yaml
credentialTypes:
  ForeignerKycCredential:
    purpose: Proves a trusted issuer verified the holder's identity and foreign-resident status.
    holderStores: true
    publicOnChain: false

  TaxRefundReadinessCredential:
    purpose: Proves required passport proof, refund slip/QR, and holder consent are ready for a refund workflow. It is not legal refund approval.
    holderStores: true
    publicOnChain: false

  TaxRefundEventReceiptCredential:
    purpose: Status receipt for purchase registered, pre-refunded, export confirmed, payout completed, or failed/cancelled states.
    holderStores: true
    publicOnChain: false

  HotelGuestStatusCredential:
    purpose: Proves booking/check-in/check-out status without exposing full travel history.
    holderStores: true
    publicOnChain: false

  RentalEligibilityCredential:
    purpose: Proves renter eligibility, residence validity, and optionally verified license.
    holderStores: true
    publicOnChain: false

  LicenseVerificationCredential:
    purpose: Proves a driver's license or other rental-related license was verified.
    holderStores: true
    publicOnChain: false

  EscrowStatusCredential:
    purpose: Proves escrow lifecycle status such as created, funded, released, cancelled.
    holderStores: true
    publicOnChain: optional

  ServiceEventReceiptCredential:
    purpose: Generic receipt binding a service event to a relationship ID.
    holderStores: true
    publicOnChain: false
```

---

## 1.9 Base VC schema

W3C VC 2.0 supports selective disclosure and zero-knowledge approaches, allowing the holder to disclose only the information needed by a verifier. ([W3C][5]) The `evidence` property can express supporting information, but the cryptographic proof is what verifies issuer authenticity and credential integrity. ([W3C][5])

Base structure:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vc:01J8TAXAMPLE",
  "type": [
    "VerifiableCredential",
    "TaxRefundReadinessCredential"
  ],
  "issuer": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR",
  "validFrom": "2026-05-01T00:00:00Z",
  "validUntil": "2026-12-31T23:59:59Z",
  "credentialSubject": {
    "id": "did:peer:2.taxPairwiseExample",
    "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
    "claims": {}
  },
  "credentialStatus": {
    "id": "https://issuer.example.com/status-lists/tax-refund-2026#39201",
    "type": "BitstringStatusListEntry",
    "statusPurpose": "revocation",
    "statusListIndex": "39201",
    "statusListCredential": "https://issuer.example.com/status-lists/tax-refund-2026"
  },
  "credentialSchema": {
    "id": "https://schemas.example.com/korea-foreigner-finance/tax-refund-readiness-v1.json",
    "type": "JsonSchema"
  },
  "evidence": {
    "type": "IssuerInternalEvidence",
    "evidenceRef": "offrec_tax_evidence_01J8...",
    "evidenceHash": "sha256:4e1c2a...",
    "disclosurePolicy": "holder-consent-required"
  },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "ecdsa-rdfc-2019",
    "created": "2026-05-01T09:00:00Z",
    "verificationMethod": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

---

## 1.10 Credential examples

### A. Foreigner KYC / residence credential

This is the base credential other services can rely on.

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vc:foreigner-kyc:01J8F0KYC",
  "type": [
    "VerifiableCredential",
    "ForeignerKycCredential"
  ],
  "issuer": "did:xrpl:1:rISSUER_TOSS_KYC",
  "validFrom": "2026-05-01T00:00:00Z",
  "validUntil": "2027-05-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:key:zHOLDER_CORE_OR_PEER",
    "relationshipId": "rel_core_8Zcn1vQ9",
    "claims": {
      "identityAssuranceLevel": "IAL2",
      "residenceVerified": true,
      "foreignerStatusVerified": true,
      "jurisdiction": "KR"
    }
  },
  "evidence": {
    "type": "IssuerInternalEvidence",
    "evidenceRef": "offrec_kyc_01J8KYC...",
    "evidenceHash": "sha256:8a970b...",
    "containsSensitivePersonalData": true,
    "notDisclosedToVerifierByDefault": true
  },
  "credentialStatus": {
    "type": "BitstringStatusListEntry",
    "statusPurpose": "revocation",
    "statusListIndex": "82213",
    "statusListCredential": "https://issuer.example.com/status-lists/kyc-2026"
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rISSUER_TOSS_KYC#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

### B. Tax refund readiness credential

This credential means the wallet has the proof, slip reference, and consent needed to proceed with an existing refund-operator flow. It does **not** mean Toss approved a tax refund.

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vc:tax-refund-readiness:01J8TAX123",
  "type": [
    "VerifiableCredential",
    "TaxRefundReadinessCredential"
  ],
  "issuer": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR",
  "validFrom": "2026-05-01T00:00:00Z",
  "validUntil": "2026-12-31T23:59:59Z",
  "credentialSubject": {
    "id": "did:peer:2.taxPairwiseExample",
    "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
    "claims": {
      "passportProofVerified": true,
      "refundSlipPresent": true,
      "holderConsentCaptured": true,
      "jurisdiction": "KR",
      "sourceOfFinalDecision": "designated_refund_operator_or_customs",
      "minDisclosureMode": "readiness_only"
    }
  },
  "evidence": {
    "type": "IssuerInternalEvidence",
    "evidenceRef": "offrec_tax_readiness_01J8...",
    "evidenceHash": "sha256:c40e0f...",
    "accessPolicy": "issuer-only-unless-holder-grants"
  },
  "credentialStatus": {
    "type": "BitstringStatusListEntry",
    "statusPurpose": "revocation",
    "statusListIndex": "39201",
    "statusListCredential": "https://issuer.example.com/status-lists/tax-refund-2026"
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

### C. Tax refund event receipt credential

This links a specific tax refund state update to the user’s tax-refund relationship ID. It records status received from existing actors such as a merchant POS, refund operator, or Customs feed.

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vc:tax-refund-event:01J8TXEVENT",
  "type": [
    "VerifiableCredential",
    "ServiceEventReceiptCredential",
    "TaxRefundEventReceiptCredential"
  ],
  "issuer": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR",
  "validFrom": "2026-05-02T05:00:00Z",
  "credentialSubject": {
    "id": "did:peer:2.taxPairwiseExample",
    "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
    "event": {
      "eventId": "evt_taxrefund_01J8TXA",
      "eventType": "tax_refund_state_update",
      "status": "export_confirmed",
      "sourceActor": "refund_operator_or_customs_feed",
      "merchantCategory": "retail",
      "currency": "KRW",
      "amountHash": "sha256:amount-not-public",
      "externalRecordRef": "offrec_tax_claim_01J8TXA",
      "externalRecordHash": "sha256:3bc4c1..."
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

### D. Hotel status credential

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vc:hotel-status:01J8HOTEL",
  "type": [
    "VerifiableCredential",
    "HotelGuestStatusCredential"
  ],
  "issuer": "did:xrpl:1:rISSUER_HOTEL_PLATFORM",
  "validFrom": "2026-05-02T00:00:00Z",
  "validUntil": "2026-05-05T12:00:00Z",
  "credentialSubject": {
    "id": "did:peer:2.hotelPairwiseExample",
    "relationshipId": "rel_hotel_93vDk2",
    "claims": {
      "hotelBookingVerified": true,
      "checkInStatus": "checked_in",
      "checkOutStatus": "pending",
      "stayWindow": {
        "startDate": "2026-05-02",
        "endDate": "2026-05-05"
      },
      "hotelRecordRef": "offrec_hotel_01J8HOTEL",
      "hotelRecordHash": "sha256:9d2f8a..."
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rISSUER_HOTEL_PLATFORM#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

### E. Rental eligibility + license verification credential

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vc:rental-eligibility:01J8RENT",
  "type": [
    "VerifiableCredential",
    "RentalEligibilityCredential",
    "LicenseVerificationCredential"
  ],
  "issuer": "did:xrpl:1:rISSUER_RENTAL_PLATFORM",
  "validFrom": "2026-05-02T00:00:00Z",
  "validUntil": "2026-08-02T00:00:00Z",
  "credentialSubject": {
    "id": "did:peer:2.rentalPairwiseExample",
    "relationshipId": "rel_rental_X8mw21",
    "claims": {
      "rentalEligible": true,
      "residenceStatusChecked": true,
      "licenseVerified": true,
      "licenseClass": "disclosed_only_if_required",
      "licenseCountry": "disclosed_only_if_required",
      "riskTier": "standard",
      "rentalRecordRef": "offrec_rental_01J8RENT",
      "licenseEvidenceRef": "offrec_license_01J8LIC",
      "recordHash": "sha256:10f7bd..."
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rISSUER_RENTAL_PLATFORM#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

### F. Escrow status credential

XRPL escrows can hold funds until conditions are met; XRPL documents the escrow mechanism as automated ledger-based escrow rather than a traditional third-party holder. ([XRP Ledger][6])

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vc:escrow-status:01J8ESCROW",
  "type": [
    "VerifiableCredential",
    "EscrowStatusCredential"
  ],
  "issuer": "did:xrpl:1:rISSUER_ESCROW_SERVICE",
  "validFrom": "2026-05-02T03:00:00Z",
  "credentialSubject": {
    "id": "did:peer:2.escrowPairwiseExample",
    "relationshipId": "rel_escrow_z91Qw2",
    "linkedServiceRelationshipId": "rel_rental_X8mw21",
    "escrow": {
      "escrowCaseId": "escrow_case_01J8ESC",
      "escrowPurpose": "rental_deposit",
      "status": "funded",
      "xrplEscrow": {
        "ledger": "testnet",
        "owner": "rESCROW_OWNER",
        "destination": "rLANDLORD_OR_PLATFORM",
        "escrowCreateTxHash": "A1B2C3...",
        "offerSequence": 8142,
        "amountHash": "sha256:amount-hidden",
        "conditionHash": "sha256:condition-hidden"
      },
      "offchainContractRef": "offrec_rental_contract_01J8",
      "offchainContractHash": "sha256:5ab87d..."
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rISSUER_ESCROW_SERVICE#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

---

## 1.11 Native XRPL Credential object example

XRPL Credentials can be used for compliance-style authorization, including KYC-like checks, and can authorize on-ledger or off-ledger activities. ([XRP Ledger][7])

Use this only for coarse access control.

Bad public credential type:

```text
ForeignResidentTaxRefundEligibleVisaD2
```

Better public credential type:

```text
ComplianceTierA
```

Example XRPL native Credential object:

```json
{
  "LedgerEntryType": "Credential",
  "Subject": "rHOLDER_PAIRWISE_OR_SERVICE_ACCOUNT",
  "Issuer": "rISSUER_TOSS_KYC",
  "CredentialType": "436f6d706c69616e63655469657241",
  "Expiration": 875664000,
  "URI": "68747470733a2f2f6973737565722e6578616d706c652e636f6d2f76632f636f6d706c69616e63652d746965722d61"
}
```

Human-readable `CredentialType`:

```text
ComplianceTierA
```

This can be useful if a permissioned domain needs to gate access by issuer + credential type. XRPL permissioned domains define accepted credentials as issuer/type pairs, and accounts holding at least one matching credential gain access. ([XRP Ledger][8])

---

## 1.17 Credential status / revocation

Use a status list or Merkle commitment for privacy. W3C Bitstring Status List allows an issuer to manage status entries for credentials, with each credential associated with an item in the list; the standard is designed to support privacy and efficient status checking. ([W3C][9])

Status list example:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/vc/status-list/2021/v1"
  ],
  "id": "https://issuer.example.com/status-lists/tax-refund-2026",
  "type": [
    "VerifiableCredential",
    "BitstringStatusListCredential"
  ],
  "issuer": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR",
  "validFrom": "2026-05-01T00:00:00Z",
  "credentialSubject": {
    "id": "https://issuer.example.com/status-lists/tax-refund-2026#list",
    "type": "BitstringStatusList",
    "statusPurpose": "revocation",
    "encodedList": "H4sIAAAAA..."
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

Optional XRPL anchor:

```json
{
  "type": "StatusListAnchor",
  "issuerDid": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR",
  "statusListUrl": "https://issuer.example.com/status-lists/tax-refund-2026",
  "statusListHash": "sha256:a111...",
  "merkleRoot": "0xabc123...",
  "anchoredOn": {
    "ledger": "xrpl-testnet",
    "txHash": "D4E5F6...",
    "ledgerIndex": 91234567
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
