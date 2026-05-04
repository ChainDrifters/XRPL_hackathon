# Toss Foreigner Flow Layer - XRPL Credentials for Foreigner Service Workflows in Korea

> **KFIP 2026 Hackathon / Toss Special Award Submission Plan (English)**
> Last updated: 2026-05-04

---

## 0. One-Liner

> **"A Toss-native workflow wallet that uses passport verification, service-specific credentials, and XRPL trust anchors to streamline existing tax-refund, hotel, rental, and deposit processes for foreigners in Korea without replacing regulated operators."**

---

## 1. What Changed In This Revision

The previous plan read like a direct Toss onboarding or PASS-replacement project. This revision lowers legal friction by making the product a **process-streamlining layer** for existing regulated and commercial workflows.

| Previous framing | Revised framing |
|---|---|
| PASS replacement / new identity-verification pipeline | Helper path for foreigner workflows that PASS and Korean mobile flows do not serve well |
| Toss leads identity, refund, and settlement | Existing merchants, refund operators, customs, and tax authorities keep their roles |
| Product decides tax-refund eligibility | Product pre-checks readiness, stores slips/QRs, tracks status, and connects payout preferences |
| Credentials are the product itself | Credentials reduce repeated submission and create a privacy-preserving audit trail |

**Principle**: do not invent new legal authority; clean up the inputs, consent, evidence, and status trail around workflows that already exist.

---

## 2. Project Identity

- **Working name**: Toss Foreigner Flow Layer
- **Internal module**: Passport Auth Layer
- **Category**: Foreigner service workflow wallet inside Toss
- **Primary MVP**: Korean foreign-tourist tax-refund assistant
- **Expansion services**: hotel check-in / stay proof, rental application / license verification, hotel or rental deposit escrow
- **Why XRPL**: not to put personal data on-chain, but to provide issuer trust anchors, schema/status commitments, optional coarse credentials, and optional settlement/escrow references

---

## 3. Problem Definition

### 3-1. Current Tax-Refund Flow

The new [tax-refund-flow.mmd](../current-context/tax-refund-flow.mmd) and [tax-refund-sequence.mmd](../current-context/tax-refund-sequence.mmd) show the current process and its legal actors.

| Actor | Current responsibility | Product assist |
|---|---|---|
| Customer / foreign tourist | Presents passport, buys goods, stores refund slips, confirms export at departure | Reusable passport proof, slip/QR wallet, checklist, status tracking |
| Designated tax-free merchant | Checks passport/refund status, issues sales confirmation, registers purchase | Lower repeated data entry through Toss proof; sends electronic slip to wallet |
| Refund counter operator / eTRS | Receives transactions, approves/pays refund, creates settlement evidence | Verifies wallet presentation, connects payout rail, issues status event |
| Korea Customs / departure customs | Confirms outbound shipment/export, performs selective inspection | App prepares the user; receives export-confirmation status where available |
| NTS / tax office | Reflects tax evidence and settlement data | Not replaced; merchant/refund-operator reporting flow stays intact |

Core current constraints include non-resident foreign-tourist status, designated tax-free merchant, eligible goods, minimum purchase amount, outbound shipment within 3 months, and unopened/unused goods confirmation. The app can guide and pre-check these constraints, but the final decision remains with the existing actor.

### 3-2. User Pain Points

- Passport and refund slips are repeatedly shown at stores, downtown counters, airport/port counters, and kiosks.
- Paper slips, QR codes, card authorizations, and payout partner accounts are fragmented.
- Immediate refund, downtown pre-refund, and airport/port refund branches are hard to understand.
- Downtown pre-refund may be reversed or charged if export confirmation fails, but users do not get a clear status trail.
- Hotel check-in, rentals, license checks, and deposits repeat the same identity and eligibility evidence.

---

## 4. Solution Hypothesis

**Toss Foreigner Flow Layer** lets a foreigner verify passport/face/residence-related facts once, then present service-specific proofs with minimum disclosure.

```text
User device / Toss app
  - Passport NFC or passport OCR
  - Face Pay / liveness
  - Service wallet: tax, hotel, rental, escrow
  - did:peer per service relationship
  - Refund slip / QR / booking / license evidence

Toss / partner backend
  - Proof verification
  - Refund operator, hotel, rental connector
  - Encrypted off-chain record store
  - Consent and access grants

XRPL
  - Public issuer/connector DID
  - Schema/trust-policy/status-list hash
  - Optional proofChainRoot
  - Optional coarse XRPL Credential
  - Optional escrow/payment tx hash
```

The tax refund itself is not moved on-chain. Refund amounts, receipts, passport numbers, residence status, hotel stay history, and rental contracts remain off-chain and encrypted.

### 4-1. Revised Identity / Ledger Boundary

The user should not have one public XRPL DID that links tax, hotel, rental, and escrow activity. User-service relationships use off-ledger pairwise identifiers.

| Layer | Identifier | Where it lives | Purpose |
|---|---|---|---|
| User wallet root | local holder key / `did:key` | Device + encrypted backup | Controls wallet signatures and recovery |
| User-service relationship | `did:peer` + `relationshipId` | Exchanged off-chain with one verifier | Prevents cross-service correlation |
| Public organization trust | `did:xrpl` | XRPL | Resolves issuer/connector public keys |
| Proof integrity | `proofChainRoot` / `statusRoot` | XRPL as opaque hashes | Proves private records were not rewritten |

XRPL is therefore used as public PKI and notary, not as a per-user event log. The ledger must not contain event types, user DIDs, case IDs, receipt details, kiosk IDs, card status, or per-event timestamps.

### 4-2. Reusable E0 and Service DAG

The passport/KYC event should not be recreated for every purchase or service. The wallet creates one reusable identity anchor:

```text
E0 = passport_verified / ForeignerKycCredential
```

Then service-specific proof chains branch from E0:

```text
E0 passport_verified
  ├── Tax refund chain A: E1_tax_purchase -> E2_tax_status -> E3_tax_payout
  ├── Tax refund chain B: E1_tax_purchase -> E2_tax_status -> E3_tax_payout
  ├── Hotel chain: E1_booking_verified -> E2_check_in -> E3_check_out
  └── Rental chain: E1_license_verified -> E2_deposit_authorized -> E3_vehicle_returned
```

The structure is therefore a private service DAG, not one global public user chain. Each branch uses its own `did:peer` relationship and proof root.

### 4-3. Scoped Queries With Presentation Exchange

Verified operators and vendors should not query raw wallet data directly. They send a presentation request describing the exact proof they need.

```text
refund operator asks for:
  passport proof is valid
  refund slip exists
  card authorization status exists

hotel asks for:
  passport proof is valid
  booking belongs to this holder

rental asks for:
  passport proof is valid
  license proof is valid
  deposit authorization exists
```

The wallet answers with a selective presentation. Unrelated chains stay hidden.

The user-facing consent page should translate the scoped request into natural language. This should be deterministic and rule-based, not arbitrary vendor copy.

```text
signed presentation request
  -> verifier trust check
  -> allowlisted consent template
  -> natural Korean sentence
  -> selective presentation after approval
```

Examples:

```text
tax_refund_kiosk_verify:
  "환급을 위해 여권 확인 여부와 면세 구매 증명을 확인할게요"

hotel_stay_history:
  "{hotelName}에서 {nights}일 동안 머문 내역을 확인할게요"

rental_deposit_check:
  "렌터카 보증금 처리를 위해 면허 확인 여부와 보증금 상태를 확인할게요"
```

The consent screen should still include a details view for exact disclosed fields, withheld fields, requester identity, retention window, and expiration.

### 4-4. Trust Registry and Signing Operations

Signatures alone are not enough. A rogue vendor can create a key and sign fake events. The verifier also checks a trust registry and event-type authorization policy.

```text
E1 item_purchased:
  allowed signer = registered tax-free merchant/POS connector

E4 card_authorization_verified:
  allowed signer = registered card/PSP connector

E6 customs_export_confirmed:
  allowed signer = customs connector or approved mock for PoC
```

For production, merchant/POS private keys should not live directly on terminals. POS devices should request signatures from a merchant backend or HSM-backed signing service so only official transactions receive valid event signatures.

### 4-5. Backup and Recovery

The wallet needs two recovery layers:

| Layer | Recovery mechanism |
|---|---|
| Wallet keys | Passkey/Secure Enclave/StrongBox with cloud account recovery or MPC recovery share |
| Private proof chains | Encrypted cloud backup of the wallet event database |

Backups are encrypted to the user-controlled wallet key or recovery key. Toss may store ciphertext, but should not be able to read private proof-chain contents without the user path or regulated access process.

---

## 5. Tax-Refund Streamlining Flow

### 5-1. Immediate Refund Branch

Immediate refund stays with the merchant POS and refund counter operator/eTRS. Toss handles only:

1. Presenting passport proof or a passport-derived holder proof.
2. Passing the minimum merchant/POS-required identity data with user consent.
3. Saving the immediate-refund electronic sales confirmation or transaction event as a wallet receipt.
4. Warning about per-transaction and trip-total limits as UX guidance while leaving final approval to POS/refund-operator systems.

### 5-2. General Refund Branch

For normal tax-included purchases, the app organizes the regular flow:

| Step | Current process | Product feature |
|---|---|---|
| After purchase | Sales confirmation, refund slip, QR/barcode issued | Scan/receive slip, create purchase event, prevent loss |
| Downtown refund | Passport, slip/QR, goods/card/account presented | Wallet presentation, payout account linking, provisional status display |
| Before departure | Customs/kiosk export confirmation | Checklist, selected-for-inspection notice, failure-risk warning |
| After departure | Final approval/cancellation and settlement evidence | Status event receipt, payout completed/failed tracking |

### 5-3. What The Product Does Not Do

- It does not replace designated tax-free stores, refund counter operators, Customs, or the NTS.
- It does not independently determine tax-refund approval.
- It does not calculate, custody, or pay tax refunds by itself.
- It does not bypass airport/port export confirmation.
- It does not put full refund history on a public ledger.

---

## 6. Hotel, Rental, And Deposit Expansion

The same tax-refund MVP structure can support hotel and rental workflows: verified facts are reused with minimum disclosure.

| Service | Streamlined flow | Credential / event |
|---|---|---|
| Hotel check-in | Reduce passport resubmission, verify booking, track check-in/check-out receipt | `HotelGuestStatusCredential` |
| Hotel deposit | Track card/account deposit state and return/cancellation events | `EscrowStatusCredential` or off-chain deposit receipt |
| Rental application | Submit identity, residence validity, license, and deposit requirements together | `RentalEligibilityCredential`, `LicenseVerificationCredential` |
| Rental deposit | Demo conditional lock/release with XRPL Testnet escrow | `EscrowStatusCredential` |

Hotel-stay VAT refund or similar tax-special-case modules should be treated as future work until the active program, participating business type, and partner operator are verified. The MVP should focus on check-in, booking proof, and deposit streamlining.

---

## 7. Credential Model

Service credentials are designed as receipts for verified facts and workflow state, not as legal final decisions.

| Credential | Meaning | Store on public chain? |
|---|---|---|
| `ForeignerKycCredential` | Passport/face and optionally residence evidence verified | Usually no |
| `TaxRefundReadinessCredential` | Required proof/slips for a refund workflow are ready | No |
| `TaxRefundEventReceiptCredential` | Status receipt: purchase registered, pre-refunded, export confirmed, payout completed, etc. | No |
| `HotelGuestStatusCredential` | Booking/check-in/check-out state | No |
| `RentalEligibilityCredential` | Rental readiness, residence validity, risk tier | No |
| `LicenseVerificationCredential` | Driver or other license checked | No |
| `EscrowStatusCredential` | Deposit created/funded/released/cancelled | Optional |

Native XRPL Credentials expose public metadata, so use them only for coarse authorization such as `ComplianceTierA`, not detailed public labels like `TaxRefundEligibleVisaD2`.

---

## 8. Hackathon MVP Scope

### 8-1. Must

- [ ] Tax-refund journey based on the current flow: immediate refund / downtown pre-refund / airport refund branch selection
- [ ] Tax-refund proof-chain UI: passport check -> purchase -> tax-free status -> kiosk/card/operator/customs/settlement states
- [ ] Passport OCR or NFC mock + Face Pay/liveness mock
- [ ] `did:peer` pairwise relationship for the tax-refund connector, not an XRPL user DID
- [ ] Refund slip / QR import mock
- [ ] Issue and store `TaxRefundEventReceiptCredential`
- [ ] Anchor issuer DID or status-list hash on XRPL Testnet
- [ ] Encrypt receipt/passport/payout-account details off-chain; show only hash/commitment on public ledger

### 8-2. Should

- [ ] Mock refund-operator/eTRS connector
- [ ] Downtown pre-refund provisional -> export confirmation -> final/failed status transition
- [ ] Hotel check-in proof and rental application proof using the same wallet
- [ ] Payout partner account selection UI mock

### 8-3. Nice

- [ ] Real passport NFC read
- [ ] ZK proof for "valid passport" or "not expired" without revealing passport number/nationality
- [ ] Hotel/rental deposit demo using XRPL Testnet escrow
- [ ] RLUSD Testnet payment/settlement simulation

### 8-4. Explicitly Out Of Scope

- Claiming to operate tax refunds without designation or partnership
- Replacing customs export confirmation or NTS settlement
- Real-funds cross-border remittance outside licensed rails
- Lending, BNPL, or credit provision
- Resident-registration-number substitution
- Marketing copy claiming "full PASS replacement"
- Public-chain storage of personal data or detailed transaction records

---

## 9. Legal / Operating Positioning

| Risk | Conservative position |
|---|---|
| Tax-refund operator regulation | Assistant/connector for designated operators, merchants, and eTRS-style systems |
| Customs export confirmation | Receives or mirrors current departure customs/kiosk status events |
| Personal data | Passport number, nationality, receipt detail, hotel/rental records stay encrypted off-chain |
| Financial movement | Real funds route through Toss Bank or licensed partner rails |
| Credit regulation | Excluded from MVP |
| Toss Special Track fit | Improves foreigner financial UX and can become an App in Toss PoC |

Deployment language should stay conditional: Toss can sign refund-operator events only if Toss or its partner is operating under the required refund-operator authority. Otherwise Toss signs only wallet/orchestration events and routes operator events from licensed partners.

Safe wording:

> "Toss helps foreign users manage passport proof, refund slips, payout preferences, and departure checklists in one place, then records existing refund-operator and Customs results as wallet receipts."

Avoid:

> "Toss approves tax refunds and returns taxes directly."

---

## 10. Mapping To KFIP / Toss Criteria

| Criterion | Response |
|---|---|
| Problem clarity | Concrete workflow pain around repeated passport/slip/booking/license/deposit submission |
| XRPL usage | DID, status commitments, coarse credentials, optional escrow as public trust anchors |
| Feasibility | Starts as connector/assistant without replacing regulated actors |
| Scale | Reuses the same wallet/proof layer from tax refund to hotel, rental, and deposits |
| Toss synergy | Fits Toss app UX, Face Pay, Toss Bank/payment rails, and App in Toss PoC |

---

## 11. Open Decisions

1. **MVP persona**: short-stay tourist first, or incoming long-stay foreigner before ARC/PASS setup.
2. **Refund-operator integration**: use a mock eTRS/refund-operator connector unless a real API is available.
3. **Hotel scope**: check-in/deposit streamlining first; hotel VAT refund only as verified future module.
4. **Rental scope**: vehicle rental vs housing rental. Vehicle rental is more demoable for the hackathon.
5. **Native XRPL Credential depth**: MVP should emphasize DID/status-hash anchors; native Credentials are limited to coarse compliance tier demos.

---

## 12. Pitch Statements

- **Product**: "We do not reinvent tax refund. We help foreigners prepare, submit, and track the process they already have to complete."
- **Technical**: "XRPL is a public trust anchor, not a personal-data store."
- **Legal**: "Refund operators, Customs, and tax authorities keep their current roles; Toss streamlines consent and evidence flow."
- **Expansion**: "The same wallet proof extends to hotel check-in, rental applications, and deposit escrow."

---

## 13. Disclaimer

This is a product and engineering plan for a hackathon PoC, not legal advice. Production launch requires separate review with refund operators, tax/customs counsel, and financial-regulatory counsel.
