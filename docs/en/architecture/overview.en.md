# Chain Architecture Overview

This page covers the core trust model, participant roles, and on-chain/off-chain boundary.

This design is aligned with the Toss Special Track theme: XRPL-based services that improve financial access and UX for foreign residents in Korea, especially DID-based foreigner identity / residence verification and visa-status-linked financial automation.  It also fits the KFIP 2026 program direction around XRPL-based financial service prototypes. 

## 1.1 Core architecture decision

Use **XRPL DID as the public trust anchor**, but do **not** use one permanent public DID as the direct link across all user activity.

Instead:

```text
User-facing layer:
  Toss Identity Wallet

Private identity layer:
  Holder DID
  Identity graph
  Service-specific relationship IDs
  Verifiable Credentials

Public XRPL layer:
  Issuer DID
  Public verification keys
  Schema references
  Status-list commitments
  Optional coarse Credential objects
  Optional escrow/payment transaction hashes

Off-chain regulated layer:
  Passport / ARC / visa evidence
  Tax refund evidence
  Hotel booking records
  Rental contract records
  Driver/license verification records
  Escrow case files
```

Reason: XRPL DID documents can be associated with a URI, DID document, or implicit DID document, but XRPL’s own documentation warns that DID documents are publicly available and should not include personal information. ([XRP Ledger][1])

The system should support linking one user to many service events, but the linkage should be **private, consented, and selectively disclosed**.

---

## 1.2 Roles

```yaml
roles:
  holder:
    description: Foreign resident user.
    controls:
      - identity wallet
      - holder DID key
      - service relationship IDs
      - verifiable credentials
      - consent decisions

  issuer:
    description: Party that verifies real-world facts and issues VCs.
    examples:
      - Toss KYC provider
      - tax-refund operator
      - hotel platform
      - rental platform
      - license verification provider
      - escrow service provider
    controls:
      - issuer DID
      - issuer signing keys
      - credential schemas
      - credential status lists
      - sensitive evidence records

  verifier:
    description: Party that requests proof from the user.
    examples:
      - merchant
      - hotel
      - landlord
      - escrow service
      - Toss financial product
    does:
      - sends proof request
      - verifies presentation
      - checks issuer trust
      - checks credential status

  xrpl:
    description: Public trust and settlement layer.
    stores:
      - DID anchor
      - public issuer keys
      - schema URI/hash
      - coarse credential status if needed
      - escrow/payment tx references if needed

  offchain_record_store:
    description: Regulated/private storage.
    stores:
      - personal documents
      - evidence
      - transaction details
      - encrypted service records
      - access logs
```

---

## 1.5 What goes on-chain vs off-chain

| Object                         |           Store on XRPL? |          Store off-chain? | Store in user wallet? | Notes                              |
| ------------------------------ | -----------------------: | ------------------------: | --------------------: | ---------------------------------- |
| Issuer DID                     |                      Yes |             Optional copy |                    No | Public trust anchor                |
| Issuer public key              |            Yes / DID doc |             Optional copy |                    No | Used for VC verification           |
| User holder DID                |                    Maybe |                       Yes |                   Yes | Avoid public reuse across services |
| Full VC                        |              No, usually | Optional encrypted backup |                   Yes | User-controlled credential         |
| Passport / ARC / visa evidence |                       No |                       Yes |  No or encrypted copy | Sensitive                          |
| Tax refund eligibility VC      |              No, usually |   Optional encrypted copy |                   Yes | Present selectively                |
| Tax refund transaction detail  |                       No |                       Yes |      Optional receipt | Sensitive financial/merchant data  |
| Hotel status                   |                       No |                       Yes |     Yes as VC/receipt | Sensitive travel data              |
| Rental status                  |                       No |                       Yes |     Yes as VC/receipt | Sensitive housing data             |
| License verification result    |                       No |                       Yes |             Yes as VC | Sensitive                          |
| Escrow transaction hash        | Yes, if XRPL escrow used |                       Yes |                   Yes | Public tx hash may be linkable     |
| Escrow case detail             |                       No |                       Yes |              Optional | Keep contract metadata private     |
| Revocation/status list root    |                      Yes |                       Yes |                    No | Privacy-preserving validity check  |

XRPL native Credentials can store attestations on-ledger, and the public fields include `Subject`, `Issuer`, `CredentialType`, `Expiration`, and optional `URI`. ([XRP Ledger][2]) Because those fields are public metadata, use native XRPL Credentials only for coarse eligibility or access control, not for detailed tax, visa, hotel, rental, or license facts.

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
