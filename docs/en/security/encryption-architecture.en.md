# Encryption Architecture

> Toss Passport Auth Layer — protecting passport originals and CDD evidence
> Referenced from [`plan.en.md §9-3`](../plan.en.md)

---

## 0. Problem Statement

The chain holds only hashes, URIs, and expirations. The Verifier sees only ZK proofs.
However, Korea's **AML/CFT Act §5-2③** mandates a **5-year retention** of CDD evidence, so Toss must keep passport originals in some form.

Upfront conclusion:
- ❌ **Complete** zero-knowledge *from Toss itself* is legally impossible
- ✅ What we enforce instead: **minimum disclosure enforced by cryptography**

---

## 1. Three Data Paths

| Path | Content | Storage | Encryption need |
|---|---|---|---|
| **A. ZK proofs** | Proof π + public inputs | Verifier memory (volatile) | Transport-only |
| **B. Retained originals** | DG1/DG2 bytes, face photo | Toss Regulated Vault | **⭐ Multi-layer** |
| **C. On-chain** | Credential metadata (hashes, URI, expiration) | XRPL ledger | Not needed (hashes only) |

→ This document focuses on **Path B**.

---

## 2. Defense in Depth — 7 Layers

```
┌─── User Device ────────────────────────────────┐
│ ①  Keypair generated inside Secure Enclave     │
│ ②  Passport bytes encrypted to Toss public key │
│    ECIES hybrid (AES-256-GCM + X25519 ECDH)    │
└──────────┬─────────────────────────────────────┘
           │ ③ TLS 1.3 + mTLS + Cert Pinning
           ▼
┌─── Toss Edge ──────────────────────────────────┐
│ ④  No decryption at edge — app-layer ciphertext│
│    persists past TLS termination               │
└──────────┬─────────────────────────────────────┘
           │ Private VPC + least-privilege IAM
           ▼
┌─── Regulated Enclave (Toss KYC Vault) ─────────┐
│ ⑤  Decryption only inside HSM (FIPS 140-2 L3)  │
│ ⑥  Envelope Encryption                         │
│     - DEK (data key): per-record AES-256       │
│     - KEK (key-encrypting key): inside HSM     │
│ ⑦  Field-level encryption (distinct keys)      │
│     face photo ≠ passport# ≠ MRZ text          │
└─────────────────────────────────────────────────┘
```

### Layer-by-layer

#### ① Device keypair (Secure Enclave / StrongBox)
- iOS `SecureEnclave` / Android `StrongBox` / ARM TEE
- The user private key **never leaves device hardware**
- Key usage gated by Face Pay authentication (`LAContext` / `BiometricPrompt`)

#### ② Application-layer E2E (ECIES)
- Algorithm: **X25519 ECDH + HKDF-SHA256 + AES-256-GCM**
- Per-request ephemeral session key derived from Toss issuer's public key
- For Korea-regulated paths, Korean algorithms may also be used: **ARIA-256-GCM / SEED / LEA** (KISA-recommended)

#### ③ Transport (TLS 1.3)
- mTLS (mutual authentication)
- Certificate Pinning baked into the app bundle
- HSTS and Perfect Forward Secrecy required

#### ④ Beyond-TLS protection
- Even after the load balancer terminates TLS, the payload remains ciphertext
- Intermediate services and logging systems cannot read plaintext — critical evidence in infosec audits

#### ⑤ HSM-bound decryption
- Decryption happens only inside a Regulated Enclave HSM
- **FIPS 140-2 Level 3** (keys auto-destroyed on tamper detection)
- For Korean production: KFSI-CC-certified HSMs (Penta, NSHC, etc.)

#### ⑥ Envelope Encryption (two-tier keys)

```
Plaintext (passport original)
    │  AES-256-GCM (DEK, unique per record)
    ▼
Ciphertext + AAD (associated data)

DEK
    │  AES-KW (KEK)
    ▼
Wrapped DEK (stored next to ciphertext)

KEK
    │  wrapped by the HSM's internal CMK
    ▼
Lives only inside the HSM — never exported
```

→ A human decryption operator **never sees the KEK**; they can only ask the HSM to decrypt a given ciphertext.

#### ⑦ Field-level encryption (zero-trust internal)
Each PII field uses a **different DEK**:

| Field | Key ID | Decryption trigger |
|---|---|---|
| Face photo (DG2) | `K_face` | FSS audit request only |
| Passport number | `K_passportNo` | CDD lookup only |
| MRZ text | `K_mrz` | Offline audit |
| ZK commitment | `K_commit` | Always (for re-verification) |
| Biometric hash | `K_bio` | Face Pay re-auth |

→ A staff member's "view face photo" privilege is **separate** from their "view passport number" privilege. Auditors receive only the fields they need.

---

## 3. Key Management — Dual Control (4-Eyes Principle)

Principle: "No single person at Toss can unlock a record."

```
Decryption request
    │
    ├─ Requester auth: FSS/FIU subpoena or court order
    ├─ Approval #1:  Toss Compliance Officer
    ├─ Approval #2:  Toss CISO
    └─ HSM decryption session opens (≤1h, audit log is permanent)
```

- **4-eyes principle**: two concurrent approvals
- **Quorum approvals**: M-of-N administrators (e.g. 3-of-5)
- **Hardware Security Officer cards**: physical smart cards to activate HSM
- Aligned with KFSI's "Cryptographic Technology Utilization Guide" §5.3

---

## 4. Lifecycle of the 5-Year Retained Record

```
T=0              Enrollment → encrypted storage (K_face, K_passportNo, ...)
    ↓
T+1 day          Monitoring begins (access logs kept permanently)
    ↓
T+3 days         Integrity-check script (detects data corruption)
    ↓
T+passport-exp.  Credential auto-invalidated (XRPL `Expiration`)
    ↓
T+5 years        Legal retention expires → **Crypto-Shredding**
                 The record's DEK is physically destroyed in HSM
    ↓
                 Ciphertext may remain, but is **mathematically unrecoverable**
                 (cryptographic erasure per NIST SP 800-88 Rev.1)
```

### Why crypto-shredding
- Instead of wiping files, **we destroy the DEK**
- Destruction is far easier to prove (HSM audit log is evidence)
- Standard approach to GDPR "right to erasure" and Korea's Personal Information Protection Act §21 disposal duty

---

## 5. Korean Regulation Mapping

| Regulation | Requirement | Our design |
|---|---|---|
| **PIPA §29 + Enforcement Decree §30** | Unique-ID encryption, access control, access logs | Layers ①–⑦ ✅ |
| **Electronic Finance Supervisory Regs §17** | Encrypt sensitive data in transit & at rest | ② + ⑥ ✅ |
| **KFSI Cryptographic Technology Guide** | KISA-approved algos + CC-certified HSM | ⑤ + ⑥ ✅ |
| **AML/CFT Act §5-2③** | 5-year CDD retention | §4 lifecycle ✅ |
| **PIPC guidance** | Privacy Impact Assessment (PIA) | Before commercial launch |
| **ISO 27001 / 27701** | Infosec + privacy management | Before commercial launch |
| **FIPS 140-2 Level 3** | HSM physical security | ⑤ ✅ |
| **NIST SP 800-88 Rev.1** | Data sanitization | Crypto-shredding ✅ |

---

## 6. Is This Really Zero-Knowledge? — An Honest Take

| Party | Zero-knowledge? |
|---|---|
| Chain (XRPL) | ✅ **Complete** — only hashes, expiration, URI visible |
| Third-party Verifiers | ✅ **Complete** — only ZK proofs received |
| Toss (the operator) | ❌ **Impossible** — law requires originals |
| Toss's own staff | 🟡 **Minimized** — HSM + dual control + field-level |

### Why full ZK-from-Toss is impossible
- AML/CFT requires original CDD evidence
- A ZK-only design would fail FSS/FIU inspection for "missing originals"
- Therefore the realistic optimum is **"Toss can see it, but only via extremely narrow paths."**

### Commercial-grade alternatives
- **Option 1. Threshold encryption** — DEK split between Toss and FIU; both must approve decryption
- **Option 2. TEE (Trusted Execution Environment)** — AWS Nitro Enclaves / Intel SGX; even the cloud operator is blind
- **Option 3. MPC custody** — DEK split 2-of-3 among Toss / user / auditor

→ Commercial path: **Option 2 (TEE)** is most realistic. Overkill for a hackathon MVP.

---

## 7. Hackathon MVP vs Production

| Layer | MVP (hackathon) | Production |
|---|---|---|
| ① Secure Enclave | ✅ iOS Keychain | ✅ |
| ② ECIES E2E | ✅ Simple | ✅ ARIA alongside |
| ③ TLS 1.3 | ✅ Let's Encrypt | ✅ + cert pinning |
| ④ Beyond-TLS protection | ⏩ Skipped | ✅ Required |
| ⑤ HSM | ⏩ **KMS simulation** | ✅ CC-certified HSM |
| ⑥ Envelope (DEK/KEK) | ✅ AWS KMS native | ✅ Dedicated HSM |
| ⑦ Field-level | ⏩ Single key | ✅ Per-field keys |
| Dual control | ⏩ Skipped | ✅ Required |
| Crypto-shredding | ⏩ Skipped | ✅ Required |

### Minimum MVP implementation (hackathon-showable)
1. **Mobile → server**: `libsodium`'s `crypto_box` (X25519 + XChaCha20-Poly1305) — ~10 lines
2. **Server storage**: DEK wrapped via AWS KMS; ciphertext in S3 — SDK-native
3. **Face Pay approval → decryption request log**: API Gateway logs
4. **On-chain**: `URI` field points to **IPFS hash only** (IPFS content is also ciphertext)

---

## 8. Pitch-Ready One-Liner

> **"The chain sees only hashes, the Verifier sees only ZK proofs, and inside Toss we constrain 'who can see what' via HSMs, two-tier keys, per-field separation, and post-5-year crypto-shredding. Instead of full zero-knowledge, we enforce the minimum disclosure the law permits — with cryptography."**

---

## 9. Reference Standards

- NIST SP 800-57 (Key Management)
- NIST SP 800-88 Rev.1 (Media Sanitization)
- FIPS 140-2 / 140-3 (HSM)
- RFC 5869 (HKDF)
- RFC 8439 (ChaCha20-Poly1305)
- KISA "Cryptographic Implementation Guide"
- KFSI "Cryptographic Technology Utilization Guide"
- ISO/IEC 27001, 27701, 27018
