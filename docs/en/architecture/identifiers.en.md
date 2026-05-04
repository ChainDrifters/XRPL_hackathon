# Identifier Model

This page defines holder identifiers, service-specific relationship IDs, and the private identity graph.

## 1.3 Identifier model

The important thing is to separate **identity**, **relationship**, and **transaction**.

### Identifier hierarchy

```text
Holder DID
  └── private identity graph
        ├── tax_refund relationship ID
        │     ├── tax refund event 1
        │     └── tax refund event 2
        ├── hotel relationship ID
        │     ├── hotel stay event 1
        │     └── hotel stay event 2
        ├── rental relationship ID
        │     ├── rental application event
        │     ├── license verification event
        │     └── rental escrow event
        └── escrow relationship ID
              ├── escrow created
              ├── escrow funded
              ├── escrow released
              └── escrow cancelled
```

### Identifier types

```yaml
identifiers:
  holderDid:
    example: "did:key:zHOLDER_LOCAL_ROOT..."
    visibility: private_or_selectively_disclosed
    purpose: Local root identity controller for the user's identity wallet. Do not publish this on XRPL.

  issuerDid:
    example: "did:xrpl:1:rISSUER..."
    visibility: public
    purpose: Lets verifiers resolve issuer keys and verify VC signatures.

  verifierDid:
    example: "did:xrpl:1:rHOTEL..."
    visibility: public_or_partner_registry
    purpose: Identifies the service requesting proof.

  relationshipId:
    example: "rel_tax_01J8T9K7G2QY4P..."
    visibility: private_or_pairwise
    purpose: Links multiple service events within one domain without exposing the user's global identity.

  eventId:
    example: "evt_taxrefund_01J8TA0X..."
    visibility: private_or_shared_with_authorized_party
    purpose: Identifies one tax refund, hotel stay, rental application, license check, or escrow milestone.

  publicAnchorId:
    example: "anchor_7b0c2c..."
    visibility: public
    purpose: Hash commitment or Merkle proof anchor on XRPL.

  offchainRecordId:
    example: "offrec_01J8TB..."
    visibility: private
    purpose: Lookup key inside the issuer/Toss/private record system.
```

---

## 1.4 Relationship ID derivation

Use pairwise IDs so the same user cannot be trivially correlated across tax, hotel, rental, and escrow contexts.

For holder/verifier pairwise relationships, use `did:peer` or another off-ledger DID method. Do **not** create ledger-based user DIDs for every relationship. XRPL DIDs are for public issuers/connectors, not per-user service links.

```text
relationshipSecret = HKDF(holderMasterSecret, verifierDid || serviceDomain)

relationshipId = base64url(
  HMAC-SHA256(
    relationshipSecret,
    serviceDomain || ":" || verifierDid || ":" || holderDid
  )
)
```

Example:

```json
{
  "holderDid": "did:key:zHOLDER123",
  "verifierDid": "did:xrpl:1:rTAXREFUNDOPERATOR456",
  "serviceDomain": "tax_refund",
  "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT"
}
```

This gives you two benefits:

```text
Same user + same verifier + same service domain
  -> stable relationship ID

Same user + different verifier/service domain
  -> different relationship ID
```

So the user can be linked to multiple tax refund transactions inside the tax-refund context, but a hotel should not automatically learn the user’s tax-refund history.

---

## 1.12 Private identity graph schema

This is the key object that lets one identity connect to many service events without exposing everything publicly.

```json
{
  "type": "PrivateIdentityGraph",
  "version": "1.0",
  "identityGraphId": "igr_01J8ROOT",
  "holderDid": "did:key:zHOLDER_CORE",
  "walletAccountId": "toss_wallet_user_opaque_123",
  "createdAt": "2026-05-02T00:00:00Z",
  "serviceRelationships": [
    {
      "serviceDomain": "tax_refund",
      "verifierDid": "did:xrpl:1:rTAX_OPERATOR",
      "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
      "pairwiseHolderDid": "did:peer:2.taxPairwiseExample",
      "credentials": [
        "urn:vc:tax-refund-readiness:01J8TAX123",
        "urn:vc:tax-refund-event:01J8TXEVENT"
      ],
      "events": [
        "evt_taxrefund_01J8TXA",
        "evt_taxrefund_01J8TXB"
      ]
    },
    {
      "serviceDomain": "hotel",
      "verifierDid": "did:xrpl:1:rHOTEL_PLATFORM",
      "relationshipId": "rel_hotel_93vDk2",
      "pairwiseHolderDid": "did:peer:2.hotelPairwiseExample",
      "credentials": [
        "urn:vc:hotel-status:01J8HOTEL"
      ],
      "events": [
        "evt_hotel_checkin_01J8H1",
        "evt_hotel_checkout_01J8H2"
      ]
    },
    {
      "serviceDomain": "rental",
      "verifierDid": "did:xrpl:1:rRENTAL_PLATFORM",
      "relationshipId": "rel_rental_X8mw21",
      "pairwiseHolderDid": "did:peer:2.rentalPairwiseExample",
      "credentials": [
        "urn:vc:rental-eligibility:01J8RENT"
      ],
      "events": [
        "evt_rental_application_01J8R1",
        "evt_license_check_01J8L1"
      ]
    },
    {
      "serviceDomain": "escrow",
      "verifierDid": "did:xrpl:1:rESCROW_SERVICE",
      "relationshipId": "rel_escrow_z91Qw2",
      "pairwiseHolderDid": "did:peer:2.escrowPairwiseExample",
      "linkedServiceRelationshipIds": [
        "rel_rental_X8mw21"
      ],
      "credentials": [
        "urn:vc:escrow-status:01J8ESCROW"
      ],
      "events": [
        "evt_escrow_created_01J8E1",
        "evt_escrow_funded_01J8E2"
      ]
    }
  ],
  "security": {
    "storage": "encrypted_wallet_plus_encrypted_cloud_backup",
    "linkageVisibility": "holder_and_authorized_services_only"
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
