# Key & State Recovery Architecture

> Toss Foreigner Flow Layer / Identity + Custodial Funds model — recovery design for device loss/replacement
> Related: [`encryption-architecture.en.md`](encryption-architecture.en.md), [`identifiers.en.md`](../architecture/identifiers.en.md)

---

## 0. Core Principle — Two-Axis Separation

Recovery is built on **two independent axes**. Both must succeed for the user to fully recover their state.

| Axis | What it recovers | Who is responsible |
|---|---|---|
| **A. Key Recovery** | Master private key (signing/decryption authority) | User + device OS |
| **B. State Recovery** | Event chain (E0–E7), VCs, relationship data | User + Toss/cloud (ciphertext only) |

> **Why separate them**: Keys without data are useless, and data without keys is meaningless. Splitting these axes ensures that if one is compromised, the other still functions as a safety net.

---

## A. Key Recovery (Master Private Key Recovery)

### A-1. Default: Hardware-Backed + Cloud Backup ⭐ (Recommended for foreigner users)

```
Platform-specific hardware-bound key + OS-level cloud sync:

iOS:
  - Secure Enclave (P-256, non-exportable)
  - iCloud Keychain backup (protected by Apple ID account + device passcode)

Android:
  - StrongBox / TEE (P-256, non-exportable)
  - Google Password Manager / Samsung Knox Vault backup
  - Block Store API (app data sync)

Recovery flow:
  1. User signs in with the same Apple ID / Google account on the new device
  2. iCloud Keychain / Google Password Manager auto-syncs
  3. Decryption gated by device passcode + biometric
  4. Master key restored instantly (user does NOT type a seed phrase)
```

**Pros**:
- No mnemonic for the user to write down (overwhelming UX win for non-technical foreigner users)
- Phishing-resistant: a fake screen cannot directly receive the key
- Multi-layer auth at OS level (account + device + biometric)

**Cons**:
- Apple/Google account takeover can bypass this → **step-up auth required**
- Platform lock-in (hard to migrate iCloud → Google)

**Risk mitigation**:
- On first restore on a new device, **mandatory Toss identity step-up** (re-run passport NFC)
- Device attestation (App Attest / Play Integrity) verification
- 24–72h cooling-off before first withdrawal on a new device

---

### A-2. Advanced Option: BIP-39 Seed Phrase (opt-in, gated)

```
Exposed only via "Advanced" menu:

Settings → Advanced → Security → "View recovery phrase"
  ↓
Forced warning screen:
  - "Anyone who sees these 12 words can take all your funds and identity"
  - "Toss staff will NEVER ask for these words"
  - "No screenshots, no clipboard, no photos"
  ↓
Re-authentication (Face ID + Toss identity verification)
  ↓
Displayed only once (re-auth required to view again)
```

**Why keep it as an option**:
- Some advanced users want self-sovereign guarantees
- User can recover their identity even if Toss disappears
- Final escape hatch against regulatory/business risk

**Why not default**:
- 80%+ of foreigner users cannot reliably manage 12 words
- Phishing target ("This is Toss customer support, please confirm your words…")
- All risks documented in [`encryption-architecture.en.md`](encryption-architecture.en.md)

**Constraints**:
- Once BIP-39 is exported, the key is flagged as **"compromised potential"**
- All service relationships derived from that key are logged in audit log as "exportable mode"
- Auto-disable recommended above a certain custody amount

---

### A-3. Production-Grade: MPC 2-of-3 (Long-term recommendation)

```
Split secp256k1 / Ed25519 key into 3 shares:

Share A: User device (Secure Enclave + iCloud sync)
Share B: Toss server (HSM, regulated key)
Share C: Independent recovery agent (3rd-party custody, or user's family device)

Signing threshold: 2-of-3
The key itself never exists anywhere (TSS protocol)

On device loss:
  Share B (Toss) + Share C (recovery agent) → re-distribute shares to new device
```

**Pros**:
- True "non-exportable" — the private key is never reconstituted anywhere
- Single share leak does not enable signing
- Foreigners can recover from their home country via Share C

**Cons**:
- Higher implementation complexity (overkill for hackathon MVP)
- Requires trust model for 3rd-party recovery agent

**Libraries**:
- ZenGo `multi-party-ecdsa`
- Fireblocks MPC-CMP
- Web3Auth (Korean deployment cases exist)

---

## B. State Recovery (Event Chain + VCs + Relationship Data) ⭐

### B-1. Mechanism — Continuous Encrypted Vault Backup

**Core idea**: Every time a new event is added, silently upload the entire wallet state to cloud storage, encrypted with the user's master public key.

```
[New event added: E1 item_purchased]
        ↓
[Toss App: serialize entire wallet DB]
        ↓
[ECIES encryption (using user master public key)]
  payload = {
    "version": 1,
    "events": [E0, E1, ...],
    "credentials": [VC_KYC, VC_TaxRefund, ...],
    "relationships": [rel_tax_*, rel_hotel_*, ...],
    "metadata": { "lastEventHash": "...", "timestamp": "..." }
  }
  encrypted_blob = ECIES_encrypt(master_pubkey, payload)
        ↓
[Silent upload to cloud storage]
  POST /vault/users/{userId}/snapshots
  body: { blob: encrypted_blob, version: N }
        ↓
[Toss server: stores ciphertext as-is (cannot read it)]
```

### B-2. Storage Options

| Storage | Pros | Cons |
|---|---|---|
| **User's iCloud Drive / Google Drive** | User-controlled, less Toss dependency | User account takeover = single point of failure |
| **Toss central backup server** | Reliable, immediately available | Toss dependency ↑ (but ciphertext, so Toss can't read) |
| **Distributed (both)** | Dual safety net | Sync complexity |

**Recommendation**: **Both (distributed backup)**. Toss server as primary, iCloud/Google as secondary.

### B-3. Zero-Knowledge Guarantee

```
What Toss / Apple / Google CAN see:
  - Encrypted blob (meaningless ciphertext)
  - Blob size, upload timestamp, user ID

What Toss / Apple / Google CANNOT see:
  - Which refund events occurred
  - Which VCs are held
  - Which service relationships exist
  - Refund amounts, receipts, card info, passport info

Who CAN decrypt:
  - The user themselves (with master private key, alone)
  - No one else (mathematically impossible)
```

This is the cryptographic enforcement of "**Toss can store your backup but cannot read its contents**".

### B-4. Restoration Flow

```
[User sets up new device]
        ↓
[Axis A: Key Recovery]
  Method 1: iCloud/Google auto-sync → master key restored automatically
  Method 2: BIP-39 entry → master key derived
  Method 3: MPC share redistribution → master key reconstituted
        ↓
[Install Toss app + Toss login]
        ↓
[Axis B: State Recovery]
  - Download latest encrypted_blob from Toss server
  - ECIES decrypt with user's master private key
  - Restore wallet DB
        ↓
[Verification]
  - Verify lastEventHash matches the chain's tail
  - Re-verify each event signature
  - Check VC expiration / revocation
        ↓
[Recovery complete — full state restored instantly]
```

---

## C. Combined Recovery Matrix

| Scenario | A. Key recovery | B. State recovery | User experience |
|---|---|---|---|
| **Phone replacement (iCloud sync)** | iCloud Keychain auto | Auto download + decrypt | Toss login → "Restoring..." → done |
| **Phone lost, Apple ID alive** | iCloud Keychain (from another device) | Auto | New phone + Apple ID = instant restore |
| **Phone lost, BIP-39 exported user** | Enter seed | Download + decrypt | 12 words → done |
| **Phone + Apple ID both lost** | MPC shares B + C | Download + decrypt | Toss identity verification + recovery agent |
| **Everything lost (devices + accounts + seed)** | Issuer re-proofing (passport NFC) | Issuer re-issues VCs to new holder DID | Toss + passport re-verification → new identity issued |

→ **5-tier fallback**. Each scenario has an appropriate path.

---

## D. Default Recommended Profile for Foreigner Users

```
Default profile (non-technical users, 95%):
  A. Hardware-backed + iCloud/Google sync
  B. Encrypted Vault to Toss server (primary) + user cloud (secondary)
  + Toss identity step-up (new device)
  + Device attestation
  + 24-72h cooling-off

Advanced profile (sophisticated users, 5%):
  A. Above + BIP-39 export option enabled
  B. Above + backup to user's own cloud
  + Self-sovereign guarantee

Production future:
  A. MPC 2-of-3 (Toss + user device + recovery agent)
  B. Distributed backup (Toss + IPFS / Filecoin / Arweave)
```

---

## E. Threat Scenarios — How This Model Holds Up

### E-1. Device theft + lock screen attack
- A: Hardware key gated by biometric, thief cannot use it
- B: Even if vault is downloaded, no key means only ciphertext
- Result: ✅ Safe

### E-2. iCloud account takeover
- A: iCloud Keychain key potentially exposed ⚠️
- B: Attacker can pull vault from Toss server → download → decrypt with key
- **Defense**: First-time use on new device requires **mandatory Toss identity step-up** → iCloud takeover alone cannot enable withdrawal
- Result: ⚠️ → ✅ (defended by step-up)

### E-3. Toss server breach
- A: Toss never holds the key → ✅
- B: Entire ciphertext leaks → meaningless (mathematically unreadable) ✅
- Result: ✅ Safe

### E-4. User loses BIP-39 to phishing
- A: Key compromised → attacker can download vault ❌
- B: Vault is decryptable ❌
- **Defense**: Quarantine BIP-39 to advanced (non-default) menu + notify all services upon export
- Result: ❌ (this is exactly why BIP-39 must NOT be the default)

### E-5. User death / permanent non-recovery
- A: Pre-designated family contacts the MPC recovery agent
- B: Agent recovery also restores the vault
- Result: ✅ Estate planning supported

---

## F. Implementation Checklist (MVP → Production)

### MVP (Hackathon)
- [x] Hardware-backed key generation (Secure Enclave / StrongBox mock)
- [ ] Encrypted vault upload (per event)
- [ ] iCloud Keychain / Google Block Store integration
- [ ] New-device recovery demo flow
- [ ] BIP-39 export as hidden menu (optional)

### Production
- [ ] MPC 2-of-3 key splitting
- [ ] Recovery agent partnership
- [ ] Step-up auth (passport NFC re-verify)
- [ ] Device attestation (App Attest / Play Integrity)
- [ ] Cooldown / velocity / geo checks
- [ ] Vault versioning + rollback protection
- [ ] Periodic vault integrity verification

---

## G. References

- [W3C DID Core - Key Rotation](https://www.w3.org/TR/did-core/#verification-method-rotation)
- [BIP-39 Mnemonic Specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) (reference only, not recommended as default)
- [iCloud Keychain Security](https://support.apple.com/guide/security/icloud-keychain-security-overview-secdeb202947/web)
- [Android Block Store API](https://developers.google.com/identity/blockstore/android)
- [Apple App Attest](https://developer.apple.com/documentation/devicecheck/establishing_your_app_s_integrity)
- [Google Play Integrity](https://developer.android.com/google/play/integrity)
- [Web3Auth MPC Documentation](https://web3auth.io/docs/product/mpc-core-kit)
- NIST SP 800-63 (Identity Assurance)
- Virtual Asset User Protection Act (Korea, 2024)
- Act on Reporting and Using Specified Financial Transaction Information (특금법) §5-2

---

## H. One-Line Summary

> **Axis A (Key Recovery)** defaults to hardware-backed + cloud sync with BIP-39 as opt-in only, and **Axis B (State Recovery)** continuously snapshots wallet state encrypted to the user's key as a zero-knowledge backup — together forming a **dual safety net** where losing your device does not lose your identity, and losing your data does not lose your key.
