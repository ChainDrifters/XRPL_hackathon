# 키 복구 및 상태 복구 아키텍처 (Key & State Recovery)

> Toss Foreigner Flow Layer / Identity + Custodial Funds 모델의 디바이스 분실/변경 시 복구 설계
> 관련: [`encryption-architecture.ko.md`](encryption-architecture.ko.md), [`identifiers.ko.md`](../architecture/identifiers.ko.md)

---

## 0. 핵심 원칙 — 두 축의 분리

복구는 **독립된 두 축**으로 구성합니다. 둘이 합쳐져야 사용자가 모든 것을 되찾습니다.

| 축 | 무엇을 복구하나 | 누가 책임지나 |
|---|---|---|
| **A. Key Recovery** | 마스터 개인키 (서명/복호화 권한) | 사용자 + 단말 OS |
| **B. State Recovery** | 이벤트 체인 (E0~E7), VC, 관계 데이터 | 사용자 + Toss/클라우드 (단 ciphertext만) |

> **왜 분리하는가**: 키만 있어도 데이터가 없으면 무의미하고, 데이터만 있어도 키가 없으면 못 푼다. 두 축이 분리되어 있어야 **한 곳이 뚫려도 다른 한 곳이 안전판**이 된다.

---

## A. Key Recovery (마스터 개인키 복구)

### A-1. Default: Hardware-Backed + Cloud Backup ⭐ (외국인 사용자 권장)

```
플랫폼별 hardware-bound 키 + OS-level cloud sync:

iOS:
  - Secure Enclave (P-256, non-exportable)
  - iCloud Keychain backup (Apple ID 계정 + device passcode 보호)

Android:
  - StrongBox / TEE (P-256, non-exportable)
  - Google Password Manager / Samsung Knox Vault backup
  - Block Store API (앱 데이터 sync)

복구 방식:
  1. 새 디바이스에서 동일 Apple ID / Google 계정 로그인
  2. iCloud Keychain / Google Password Manager 자동 sync
  3. 디바이스 비밀번호 + biometric으로 복호화
  4. 마스터키 즉시 복구 (사용자가 seed 입력 ❌)
```

**장점**:
- 사용자가 단어 적을 필요 없음 (외국인 비기술 사용자에게 압도적 UX 우위)
- Phishing 저항: 가짜 화면이 키를 직접 받아갈 수 없음
- OS 수준의 다층 인증 (계정 + 디바이스 + 생체)

**단점**:
- Apple/Google 계정 takeover 시 우회 위험 → **step-up 인증 필수**
- 플랫폼 lock-in (iCloud → Google 이전 어려움)

**위험 완화**:
- 새 디바이스 첫 복구 시 **토스 본인인증 step-up** (여권 NFC 재실행)
- Device attestation (App Attest / Play Integrity) 검증
- 신규 디바이스 첫 출금까지 24-72h cooling-off

---

### A-2. Advanced Option: BIP-39 Seed Phrase (선택형, gated)

```
"고급 사용자 전용" 메뉴에서만 노출:

Settings → 고급 → 보안 → "복구 구문 보기"
  ↓
강제 경고 화면:
  - "이 12단어를 본 사람은 누구나 모든 자금/신원을 가져갈 수 있습니다"
  - "Toss 직원은 이 단어를 절대 묻지 않습니다"
  - "스크린샷 ❌, 클립보드 ❌, 사진 ❌"
  ↓
재인증 (Face ID + 토스 본인인증)
  ↓
한 번만 표시 (다시 보려면 재인증)
```

**왜 옵션으로 두는가**:
- 일부 진보적 사용자는 self-sovereign 보장을 원함
- 토스가 사라져도 사용자가 자기 신원을 회수 가능
- 규제/사업적 리스크에 대한 final escape hatch

**왜 default 아닌가**:
- 외국인 사용자의 80%+는 단어 12개 관리 불가
- Phishing 표적 ("토스 고객센터입니다, 단어 확인…")
- 이전 분석의 모든 위험 ([`encryption-architecture.ko.md`](encryption-architecture.ko.md) 참조)

**제약**:
- BIP-39를 export한 시점부터 그 키는 **"compromised potential"** 로 표시
- 그 키로 derive된 모든 service relationship은 audit log에 "exportable mode"로 기록
- 일정 금액 이상 보관 시 자동 비활성화 권장

---

### A-3. Production-grade: MPC 2-of-3 (장기 권장)

```
secp256k1 / Ed25519 키를 3 share로 분산:

Share A: 사용자 디바이스 (Secure Enclave + iCloud sync)
Share B: Toss 서버 (HSM, regulated key)
Share C: Independent recovery agent (제3자 custody, 또는 사용자 가족 디바이스)

서명 임계값: 2-of-3
키 자체는 어디에도 존재하지 않음 (TSS 프로토콜)

디바이스 분실 시:
  Share B (Toss) + Share C (recovery agent) → 새 디바이스에 share 재분배
```

**장점**:
- 진정한 "추출 불가능" — 개인키가 어디에도 reconstitute되지 않음
- 한 share 노출돼도 단독으로 사용 불가
- 외국인이 본국에서도 Share C 통해 복구 가능

**단점**:
- 구현 복잡도 ↑ (해커톤 MVP에는 부담)
- 3rd-party recovery agent 신뢰 모델 필요

**라이브러리**:
- ZenGo `multi-party-ecdsa`
- Fireblocks MPC-CMP
- Web3Auth (한국 사례 있음)

---

## B. State Recovery (이벤트 체인 + VC + 관계 데이터 복구) ⭐

### B-1. 메커니즘 — Continuous Encrypted Vault Backup

**핵심 아이디어**: 매번 새로운 이벤트가 추가될 때마다, 전체 wallet state를 사용자 마스터 공개키로 암호화해서 클라우드에 silent upload.

```
[새 이벤트 발생: E1 item_purchased 추가됨]
        ↓
[Toss App: 전체 wallet DB 직렬화]
        ↓
[ECIES 암호화 (사용자 master public key 사용)]
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
[Toss 서버: ciphertext 그대로 저장 (못 봄)]
```

### B-2. Storage Options

| 저장소 | 장점 | 단점 |
|---|---|---|
| **사용자 iCloud Drive / Google Drive** | 사용자 통제, 토스 의존 ↓ | 사용자 계정 takeover = 단일 장애점 |
| **Toss 중앙 백업 서버** | 안정적, 즉시 가용 | 토스 의존 ↑ (단 ciphertext라 토스도 못 봄) |
| **분산 (둘 다)** | 이중 안전판 | 동기화 복잡 |

**권장**: **둘 다 (분산 백업)**. 토스 서버를 primary, iCloud/Google을 secondary.

### B-3. Zero-Knowledge 보장

```
Toss / Apple / Google이 보는 것:
  - 암호화된 blob (의미 없는 ciphertext)
  - blob 크기, 업로드 timestamp, user ID

Toss / Apple / Google이 못 보는 것:
  - 어떤 환급 이벤트가 있었는지
  - 어떤 VC를 가지고 있는지
  - 어떤 서비스와 관계가 있는지
  - 환급 금액, 영수증, 카드 정보, 여권 정보

복호화 가능한 주체:
  - 사용자 자신 (master private key 보유 시 단독 가능)
  - 그 외 누구도 불가능 (수학적으로)
```

이게 "**Toss는 백업을 보관할 수 있지만, 내용을 읽을 수는 없다**"의 cryptographic 강제.

### B-4. Restoration Flow

```
[사용자 새 디바이스 setup]
        ↓
[A축: Key Recovery]
  방식 1: iCloud/Google 자동 sync → 마스터키 자동 복구
  방식 2: BIP-39 입력 → 마스터키 derive
  방식 3: MPC share 재분배 → 마스터키 reconstitute
        ↓
[Toss 앱 설치 + 토스 로그인]
        ↓
[B축: State Recovery]
  - 토스 서버에서 latest encrypted_blob 다운로드
  - 사용자 master private key로 ECIES 복호화
  - wallet DB에 restore
        ↓
[검증]
  - lastEventHash가 chain의 마지막과 일치하는지 확인
  - 각 event signature 재검증
  - VC 만료/revocation 체크
        ↓
[복구 완료 — 모든 state 즉시 복원]
```

---

## C. Combined Recovery Matrix

| 시나리오 | A. Key 복구 | B. State 복구 | 사용자 경험 |
|---|---|---|---|
| **폰 변경 (iCloud sync)** | iCloud Keychain 자동 | 자동 다운로드 + 복호화 | 토스 로그인 → "복구 중..." → 끝 |
| **폰 분실, Apple ID 살아있음** | iCloud Keychain (다른 디바이스에서) | 자동 | 새 폰 + Apple ID = 즉시 복구 |
| **폰 분실, BIP-39 export 한 사용자** | seed 입력 | 다운로드 + 복호화 | 12단어 입력 → 끝 |
| **폰 + Apple ID 둘 다 분실** | MPC share B + C로 재구성 | 다운로드 + 복호화 | 토스 본인인증 + recovery agent | 
| **모든 디바이스 + 계정 + seed 전부 분실** | issuer re-proofing (passport NFC) | issuer가 새 holder DID로 VC 재발급 | 토스 + 여권 재인증 → 새 신원 발급 |

→ **5단계 fallback**. 각 시나리오마다 적합한 경로 존재.

---

## D. 외국인 사용자 기본 권장 조합

```
Default profile (비기술 사용자, 95%):
  A. Hardware-backed + iCloud/Google sync
  B. Encrypted Vault to Toss server (primary) + user cloud (secondary)
  + 토스 본인인증 step-up (신규 디바이스)
  + Device attestation
  + 24-72h cooling-off

Advanced profile (진보적 사용자, 5%):
  A. 위 + BIP-39 export 옵션 활성화
  B. 위 + 사용자 자체 cloud로 백업
  + Self-sovereign 보장

Production future:
  A. MPC 2-of-3 (Toss + user device + recovery agent)
  B. 분산 백업 (Toss + IPFS / Filecoin / Arweave)
```

---

## E. Threat Scenarios — 이 모델이 어떻게 견디는가

### E-1. 디바이스 도난 + 잠금해제 시도
- A: Hardware key는 biometric 게이트, 도난자 못 씀
- B: vault 다운로드해도 key 없으면 ciphertext만
- 결과: ✅ 안전

### E-2. iCloud 계정 takeover
- A: iCloud Keychain의 키 노출 가능 ⚠️
- B: 토스 서버 vault에 접근 → 다운로드 → key로 복호화 가능
- **방어**: 신규 디바이스 첫 사용 시 **토스 본인인증 step-up** 필수 → iCloud takeover만으로는 출금 불가
- 결과: ⚠️ → ✅ (step-up으로 방어)

### E-3. 토스 서버 해킹
- A: 토스가 키를 안 가지므로 ✅
- B: ciphertext 통째로 노출 → 의미 없음 (수학적으로 못 풀음) ✅
- 결과: ✅ 안전

### E-4. 사용자가 BIP-39를 phishing으로 빼앗김
- A: 키 노출 → 공격자가 vault 다운로드 가능 ❌
- B: vault 복호화 가능 ❌
- **방어**: BIP-39를 default 아닌 advanced로 격리 + export 시점에 모든 service에 알림
- 결과: ❌ (이게 BIP-39를 default로 두면 안 되는 핵심 이유)

### E-5. 사용자 사망 / 영구 미복구
- A: MPC recovery agent에 사전 지정한 가족이 contact
- B: agent 복구 시 vault도 같이 복구
- 결과: ✅ Estate planning 가능

---

## F. 구현 체크리스트 (MVP → Production)

### MVP (해커톤)
- [x] Hardware-backed key generation (Secure Enclave / StrongBox mock)
- [ ] Encrypted vault upload (매 이벤트마다)
- [ ] iCloud Keychain / Google Block Store integration
- [ ] 신규 디바이스 복구 demo flow
- [ ] BIP-39 export는 hidden menu (선택 구현)

### Production
- [ ] MPC 2-of-3 키 분산
- [ ] Recovery agent 파트너십
- [ ] Step-up 인증 (passport NFC re-verify)
- [ ] Device attestation (App Attest / Play Integrity)
- [ ] Cooldown / velocity / geo check
- [ ] Vault versioning + rollback protection
- [ ] Periodic vault integrity verification

---

## G. References

- [W3C DID Core - Key Rotation](https://www.w3.org/TR/did-core/#verification-method-rotation)
- [BIP-39 Mnemonic Specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) (참고용, default 비권장)
- [iCloud Keychain Security](https://support.apple.com/guide/security/icloud-keychain-security-overview-secdeb202947/web)
- [Android Block Store API](https://developers.google.com/identity/blockstore/android)
- [Apple App Attest](https://developer.apple.com/documentation/devicecheck/establishing_your_app_s_integrity)
- [Google Play Integrity](https://developer.android.com/google/play/integrity)
- [Web3Auth MPC Documentation](https://web3auth.io/docs/product/mpc-core-kit)
- NIST SP 800-63 (Identity Assurance)
- 가상자산이용자보호법 (2024)
- 특금법 §5-2

---

## H. 한 문장 요약

> **A축 (키 복구)** 은 hardware-backed + cloud sync를 default로 두고 BIP-39는 옵션화하며, **B축 (상태 복구)** 는 매 이벤트마다 사용자 키로 암호화한 vault를 zero-knowledge 백업으로 유지하면, 디바이스를 잃어도 신원을 잃지 않고 데이터를 잃어도 키를 잃지 않는 **이중 안전판** 이 완성됩니다.
