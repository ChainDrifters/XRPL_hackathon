# Toss Passport Auth Layer — XRPL Credentials-Based Identity & Financial Onboarding for Foreign Residents

> **KFIP 2026 Hackathon / Toss Special Award Submission Plan (English)**
> Last updated: 2026-04-24

---

## 0. One-Liner

> **"A 60-second onboarding pipeline for foreign residents into Toss, powered by passport NFC tagging, Toss Face Pay, ZK proofs, and XRPL Credentials (XLS-70) — no Korean mobile number required."**

---

## 1. Project Identity (What)

- **Working name**: Toss Passport Auth Layer
- **Category**: A new identity-verification pipeline layered inside the Toss app
- **What it replaces**: The current 2–3 week flow where foreigners must open a Korean mobile line first, then complete PASS telco-based identity verification
- **New path**: Passport NFC tap + Toss Face Pay → 60-second onboarding
- **Credential storage**: XRPL Credentials (XLS-70) — protocol-native attestation objects, **not** Soulbound NFTs

---

## 2. Why We Build This (Why)

### 2-1. Problem Definition
- 2.5M+ foreign residents in Korea, growing steadily
- Fintech onboarding (Toss and peers) effectively requires **Korean mobile line + PASS app**
- Foreign residents must wait ~2–3 weeks (ARC issuance → telco subscription → PASS signup)
- During that window, **card payments, remittance, and app-based daily life** are blocked
- The Information & Communication Network Act (§23-3) grants identity-verification-agency status primarily to the three mobile carriers, structurally disadvantaging foreigners

### 2-2. Solution Hypothesis
- A passport's IC chip is an **ICAO 9303-compliant e-identity document signed by the issuing government (CSCA)**
- Every modern smartphone can read it over NFC; its Level of Assurance exceeds that of typical private KYC
- Toss Face Pay already provides production-grade liveness and face matching
- Combining the two enables **telco-independent non-face-to-face identity verification** with a **reusable credential**
- That credential lives on XRPL via Credentials, reusable for remittance, payments, and third-party verification

---

## 3. Target Users

| User | Scenario |
|---|---|
| **Primary** | Foreign residents in Korea (students, expats, migrant workers, working-holidayers) |
| **Secondary** | Short-stay foreigners (3+ months) with remittance needs |
| **Operator** | Toss (Issuer) |
| **Verifiers** | Toss's own services + partner merchants |

---

## 4. Design Philosophy

1. **Start without a telco.** Removing carrier dependency is the top-level principle.
2. **Originals stay local; proofs go over the wire.** Privacy is default; passport originals are stored encrypted **only** where legally required.
3. **Credentials, not tokens.** Identity is a *state being attested to*, not an *object held* → use XLS-70, **not** XLS-20 SBTs.
4. **Protocol-level guarantees beat app-level checks.** Avoid any design where a smart-contract or app-logic bug can break identity guarantees.
5. **Separate the three Korean legal layers.** Statutory identity verification ≠ internal app auth ≠ third-party voluntary KYC.
6. **Soulbound by design.** A non-transferable credential is structurally aligned with preventing immigration-status laundering.
7. **Reuse standards.** ICAO 9303, W3C VC, XLS-70, ISO 20022 — no bespoke formats.

---

## 5. Architecture

```
┌────────────────────── User Device (iOS/Android) ──────────────────────┐
│                                                                       │
│  [1] Passport NFC tap      [2] Toss Face Pay         [3] ZK Prover   │
│   │                         │                         │              │
│   ├─ BAC/PACE session       ├─ Active liveness        ├─ Circom/Noir │
│   ├─ DG1 (MRZ), DG2 (photo) ├─ DG2 ↔ selfie match     │   (WASM)     │
│   └─ SOD (gov signature)    └─ FAR < 1e-6             │   (local)    │
│                                                        │              │
└───────────────┬────────────────────────────────────────┴──────────────┘
                │  Only ZK proof π + public inputs leave the device
                ▼
┌──────────────────────── Toss Backend (Verifier) ──────────────────────┐
│                                                                       │
│  • Verifier.verify(π, pub) → compare against ICAO PKD Master List    │
│  • Legal duty: store encrypted originals for 5 years                  │
│    (per 특금법 §5-2③, Korean AML/CFT Act)                            │
│  • As Issuer, submit CredentialCreate tx                              │
│                                                                       │
└───────────────┬───────────────────────────────────────────────────────┘
                ▼
┌────────────────────────── XRPL Mainnet ───────────────────────────────┐
│                                                                       │
│  ① User wallet (HD-derived, signing gated by Face Pay)               │
│  ② Credential ledger entry (XLS-70):                                 │
│     { Issuer: rToss, Subject: rUser,                                 │
│       CredentialType: "TOSS_PASSPORT_KYC_L3",                        │
│       Expiration: <passport expiry>, URI: ipfs://<VC>,               │
│       Flags: lsfAccepted }                                           │
│  ③ DepositPreauth-based merchant gating                              │
│  ④ (Optional) Payment.CredentialIDs for Travel Rule metadata         │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 6. Authentication Flows

### 6-1. Phase 1 — First-Time Enrollment (~60s, one-time)

| # | Step | Tech | Time |
|---|---|---|---|
| 1 | OCR the MRZ lines on the passport's personal page | Vision Kit / ML Kit | 3s |
| 2 | NFC tap → BAC/PACE session | `NFCPassportReader` (iOS) / `jmrtd` (Android) | 5s |
| 3 | Extract DG1, DG2, SOD | ICAO 9303 | 5s |
| 4 | Passive Authentication (SOD signature ↔ ICAO PKD) | BouncyCastle | 2s |
| 5 | Chip Authentication (anti-cloning) | ECDH | 2s |
| 6 | Selfie + Toss Face Pay liveness | Existing SDK | 5s |
| 7 | DG2 ↔ selfie face match | ArcFace / FaceNet-lite | 2s |
| 8 | ZK proof generated locally | Circom WASM | 15–30s |
| 9 | Send π to Verifier → CredentialCreate | xrpl.js | 5s |
| 10 | User submits CredentialAccept (Face Pay-gated signature) | — | 3s |

**Invariant**: Raw passport bytes (MRZ text, face image) never cross the wire *except* once, as an encrypted blob to the regulated-storage bucket, to satisfy the Korean AML/CFT record-keeping rule (§9-3).

### 6-2. Phase 2 — Recurring Authentication

| Mode | Trigger | Mechanism |
|---|---|---|
| **A. In-Toss re-auth** | Limit upgrades, etc. | Face Pay → local key signature → on-ledger Credential lookup |
| **B. External third-party** | Real-estate leases, offline stores | DID over NFC/QR → verifier queries `account_objects` → checks validity |
| **C. Cross-border (RLUSD)** | Remittance home | Auto-attach Travel Rule metadata via `CredentialIDs` |
| **D. Renewal / revocation** | Passport expiry, withdrawal, KYC fraud found | Expiration auto-invalidates / either side calls `CredentialDelete` |

---

## 7. XRPL Credentials (XLS-70) Design

### 7-1. Why Credentials (not SBT)

| Concern | XLS-20 SBT | **XLS-70 Credentials** |
|---|---|---|
| User consent | Unilateral mint | **Create → Accept (2-phase)** |
| Expiration | Manual burn | **Native `Expiration` field** |
| Payment gating | App-level | **Native `DepositPreauth`** |
| Metadata on payment | Not possible | **`Payment.CredentialIDs`** |
| Transfer prevention | Flag setting | **Structurally impossible** |
| W3C VC compatibility | Bespoke | **`URI` field links JSON-LD** |

→ Identity is an attestation primitive, not a token. **SBT is explicitly rejected** for this layer.

### 7-2. Credential Object

```typescript
{
  LedgerEntryType: "Credential",
  Issuer:         "rTossIssuerAddress...",
  Subject:        "rForeignUserAddress...",
  CredentialType: "544F53535F50415353504F52545F4B59435F4C33", // hex("TOSS_PASSPORT_KYC_L3")
  Expiration:     <passport expiry (Ripple Epoch)>,
  URI:            "ipfs://<W3C VC JSON-LD>",
  Flags:          lsfAccepted
}
```

### 7-3. CredentialType Naming Convention
- `TOSS_PASSPORT_KYC_L3` — Passport + Face Pay L3 KYC
- `TOSS_VISA_D2` — Visa-status-linked (future Ministry of Justice integration)
- `TOSS_AGE_19PLUS` — Derived credential (adult check)
- `TOSS_KYC_INCOME_VERIFIED` — For limit upgrades

### 7-4. DepositPreauth Demo
```typescript
{
  TransactionType: "DepositPreauth",
  Account: "rMerchantAddress...",
  AuthorizeCredentials: [{
    Credential: {
      Issuer: "rTossIssuerAddress...",
      CredentialType: "544F53535F50415353504F52545F4B59435F4C33"
    }
  }]
}
```
→ **"Only foreigners with a valid Toss KYC credential can settle at this merchant"** becomes a protocol-level rule.

---

## 8. Tech Stack

### 8-1. Mobile (client)
- **iOS**: Swift + CoreNFC + `NFCPassportReader` (OSS)
- **Android**: Kotlin + `android.nfc` + `jmrtd`
- **Face match**: ArcFace / FaceNet-lite, on-device
- **ZK Prover**: Circom WASM (fork of zkPassport) or Noir (Aztec)
- **XRPL signing**: xrpl.js (RN bridge) or native Swift/Kotlin XRPL SDKs

### 8-2. Backend (Toss Verifier)
- **Verifier**: Node.js / TypeScript, snarkjs or barretenberg
- **ICAO PKD**: BouncyCastle + per-country CSCA master list
- **Regulated-origin storage**: AWS KMS + S3 envelope encryption, 5-year retention
- **XRPL tx submission**: xrpl.js, dedicated Issuer account

### 8-3. On-chain (XRPL)
- **Network**: Testnet for hackathon → Mainnet for production
- **Standards**: XLS-70 Credentials, optional XLS-40 DID, RLUSD integration
- **Payments**: Native XRP / RLUSD, gated by DepositPreauth

### 8-4. Prior art / OSS to reuse
- [zkPassport](https://zkpassport.id/) — Noir-based same concept
- [AnonAadhaar](https://anon-aadhaar.pse.dev/) — Indian analogue, Circom
- [NFCPassportReader](https://github.com/AndyQ/NFCPassportReader) — iOS passport reader
- [JMRTD](https://jmrtd.org/) — Java/Android ICAO 9303

---

## 9. Legal Framework (Korea)

### 9-1. Three-Tier Identity-Verification System

| Layer | Name | Legal basis | Enforcement | Replaceable by this project? |
|---|---|---|---|---|
| **L1** | Statutory identity verification | Info-Comm Network Act §23-3 | KCC-designated identity-verification agencies only (the 3 mobile carriers, a few others) | ❌ **No** |
| **L2** | Financial real-name + CDD | Real-Name Financial Act §3; AML/CFT Act §5-2 | Financial institutions self-perform | ✅ **Yes** (with conditions) |
| **L3** | Vendor-voluntary KYC | None | Not enforced | ✅ **Yes** (free hand) |

→ **Coverage**: L2 + L3. **L1 is explicitly out of scope.**
→ Positioning: **"Not a PASS replacement, but a new path for the foreign-resident segment PASS cannot serve."**

### 9-2. Compliance Matrix

| Feature | Governing law | Risk | Mitigation |
|---|---|---|---|
| Passport NFC + Face Pay identity verification | Real-Name Financial Act (non-face-to-face 2-of-5 rule) | 🟢 None | Two-factor satisfied |
| Toss-internal account opening | Real-Name Financial Act, E-Finance Act | 🟢 None | — |
| **AML/CFT CDD 5-year retention** | AML/CFT Act §5-2③ | 🟡 **Caution** | **Encrypted-originals store, separate from ZK path** |
| XRPL Credentials issuance & presentation | Private-autonomy | 🟢 None | — |
| DepositPreauth gating | — | 🟢 None | — |
| Payment.CredentialIDs (Travel Rule) | AML/CFT Act §5-3 | 🟡 Supplement with recognized protocol at launch | MVP is proof-of-concept |
| RLUSD cross-border remittance | Foreign Exchange Transactions Act §3 | 🔴 | **Must route via Toss Bank (licensed FX bank)** |
| VASP operations | AML/CFT Act §7 | 🟢 PoC exempt / 🔴 file upon commercialization | — |
| Claiming "full PASS replacement" | Info-Comm Network Act §23-3 | 🟡 Phrasing risk | Use "new path for foreigners" |
| Credit-card issuance | Specialized Credit Finance Act §14-2 | 🟢 None | Passport is a legal ID source |
| **Lending / BNPL features** | Specialized Credit Finance Act §3, §50 | 🔴 **Forbidden** | **Not in MVP scope** |
| Resident-number substitution | Resident Registration Act | 🔴 Forbidden | — |

### 9-3. AML/CFT §5-2③ Mitigation — Dual-Store + 7-Layer Encryption

Originals must be retained by Toss, but access is squeezed cryptographically to the narrowest possible path.

```
Day-to-day : only ZK proof reaches the Verifier → no plaintext on Toss servers
Enrollment : encrypted on-device in Secure Enclave (X25519 + AES-256-GCM)
             ↓ TLS 1.3 / mTLS / cert pinning
             ↓ Toss edge cannot decrypt (app-layer ciphertext survives past TLS)
             ↓ Decryption only inside Regulated Enclave HSM (FIPS 140-2 L3)
             ↓ Envelope encryption (per-record DEK, KEK lives in HSM)
             ↓ Field-level keys: face / passport# / MRZ each have distinct DEK
Access ctl : FSS/FIU subpoena + Compliance Officer + CISO = 3 approvals
             HSM session ≤1h, audit log retained permanently
Disposal   : after 5 years → crypto-shredding (DEK physically destroyed in HSM)
             → ciphertext may remain, but is mathematically unrecoverable
             (NIST SP 800-88 Rev.1)
```

**Honest scope of zero-knowledge**:
- ✅ From the chain (XRPL) — complete (only hashes, expiration, URI)
- ✅ From third-party Verifiers — complete (only ZK proofs received)
- ❌ From Toss itself — impossible (AML/CFT retention mandate)
- 🟡 From Toss's own staff — minimized (HSM + dual control + field-level)

**Regulatory anchors**: PIPA §29, Electronic Finance Supervisory Regs §17, AML/CFT Act §5-2③, KFSI Cryptographic Technology Guide, FIPS 140-2 L3, NIST SP 800-88 Rev.1.

→ Full design: see **[`docs/encryption-architecture.en.md`](docs/encryption-architecture.en.md)**.

### 9-4. Specialized Credit Finance Act (여전법)
- **Not applicable in current scope** (identity, wallet, remittance only).
- **Warning**: Lending / BNPL would require §3 licensing; unlicensed operation → up to 5 years imprisonment under §50.
- → **Do not include such features in the MVP.**

### 9-5. Foreign Exchange Transactions Act
- Cross-border remittance is legal only via licensed FX banks (e.g., Toss Bank).
- Direct XRPL → overseas accounts is currently not permitted in Korea.
- In demos, RLUSD must be clearly labeled as **Testnet simulation, not real funds**.

---

## 10. Hackathon MVP Scope

### 10-1. Must (Day 1–2)
- [ ] iOS NFC passport reader (wrapping NFCPassportReader)
- [ ] DG2 + selfie face match (lightweight ArcFace)
- [ ] Submit CredentialCreate / CredentialAccept to XRPL Testnet
- [ ] Stub Verifier (signatures only, ZK stubbed out)

### 10-2. Should (Day 3)
- [ ] Fork a zkPassport circuit → prove at minimum "expiration > today"
- [ ] Integrate Face Pay liveness SDK (mock is fine)
- [ ] DepositPreauth demo (fake merchant account)

### 10-3. Nice (Day 4 — storytelling impact)
- [ ] RLUSD Testnet remittance demo (home-country scenario)
- [ ] Passport-expiry → Credential auto-invalidation demo
- [ ] "No identity laundering possible" narrative walkthrough

### 10-4. 🚫 Explicitly out of MVP
- Lending / BNPL / any credit provision
- Real-funds cross-border remittance bypassing Toss Bank
- Resident-registration-number substitution
- Marketing copy claiming "PASS replacement"
- Claims of commercial VASP operation

---

## 11. Mapping to KFIP Toss Special Award Criteria

| Criterion | Our response |
|---|---|
| ① Problem definition | Quantified 2.5M+ foreign residents, 2–3 week onboarding gap |
| ② XRPL utilization | **XLS-70 native + DepositPreauth + RLUSD** — protocol-level, no smart contracts |
| ③ Feasibility | Non-face-to-face real-name rule satisfied; AML/CFT dual-store design |
| ④ Scale / impact | Passport is a global standard → generalizable to foreigners in other countries |
| ⑤ Toss synergy | **Reuse Face Pay + Toss Bank FX rails + new identity pipeline** |

---

## 12. Open Decisions

1. **Verifier topology**: single centralized Toss Verifier vs federated pool
   → Hackathon: centralized (realism).
2. **Wallet custody**: custodial vs MPC (2-of-2) vs self-custody
   → MPC (Face Pay ↔ Toss server) recommended.
3. **ZK circuit surface**: minimum (expiration only) vs full (signature + face + age + nationality)
   → MVP: minimum; roadmap for full in the pitch.
4. **RLUSD inclusion**: high impact, higher effort
   → Nice-to-have; Testnet sim only.
5. **CredentialType taxonomy**: single vs tiered (L1–L4)
   → MVP uses single `TOSS_PASSPORT_KYC_L3`; tiering covered in pitch.

---

## 13. Planned Repository Layout

```
XRPL hackathon/
├── plan.ko.md                 # Korean plan
├── plan.en.md                 # this file
├── docs/
│   ├── architecture.md        # detailed diagrams
│   ├── zk-circuit.md          # circuit design
│   ├── legal-notes.md         # statute quotes / interpretations
│   └── pitch-deck.md          # presentation structure
├── apps/
│   ├── mobile-ios/            # Swift, NFC + Face Pay
│   └── mobile-android/        # Kotlin, jmrtd
├── packages/
│   ├── verifier/              # TypeScript Verifier
│   ├── zk-circuit/            # Circom / Noir
│   └── xrpl-client/           # xrpl.js wrapper
└── scripts/
    └── testnet/               # Credential issuance / query scripts
```

---

## 14. Positioning Statements (for the pitch)

- **Technical**: "We chose XRPL Credentials over Soulbound NFTs — because this is an *attestation* layer, not a token."
- **Legal**: "Encrypted originals for AML/CFT, zero-knowledge proofs for privacy — two layers, one design."
- **Product**: "Not a PASS replacement. A new path into Toss for the 2.5M foreigners PASS cannot reach."
- **Market**: "A 2–3 week onboarding delay, compressed into 60 seconds."

---

## 15. Glossary

| Term | Definition |
|---|---|
| **ICAO 9303** | ICAO e-passport standard (DG1/MRZ, DG2/face, SOD/signature, etc.) |
| **BAC / PACE** | NFC session-establishment protocols using MRZ as key material |
| **Passive Authentication** | Verifying the SOD signature against the issuing country's CSCA |
| **Chip Authentication** | Anti-cloning protocol for passport chips |
| **ICAO PKD** | Public Key Directory — international repo of country signing certs |
| **XLS-70** | XRPL Credentials standard (amendment activated 2024) |
| **XLS-40** | XRPL DID standard |
| **XLS-20** | XRPL NFT standard (could implement SBTs — **not used here**) |
| **DepositPreauth** | Native XRPL allow-list for incoming payments |
| **RLUSD** | USD stablecoin issued by Ripple (NYDFS-approved) |
| **W3C VC** | Verifiable Credentials data model (JSON-LD) |
| **CDD** | Customer Due Diligence (Korean AML/CFT Act §5-2) |
| **Travel Rule** | FATF Recommendation 16 — info-sharing on virtual-asset transfers |
| **LoA** | Level of Assurance (NIST 800-63) — passport IC chips clear LoA 3+ |

---

## 16. Disclaimer

This document is an engineering plan based on publicly available statutes, standards, and open-source artifacts. It is **not legal advice**. Before any production launch, formal opinions from counsel, the Financial Services Commission, and the FIU are required. For the hackathon PoC stage, this level of analysis is sufficient.
