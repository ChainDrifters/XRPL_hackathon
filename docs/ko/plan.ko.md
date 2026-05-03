# Toss Passport Auth Layer — XRPL Credentials 기반 외국인 인증·금융 온보딩

> **KFIP 2026 해커톤 / 토스 특별상 출품 계획서 (한국어)**
> 최종 수정: 2026-05-03

---

## 0. 한 줄 요약

> **"여권 NFC + 토스 페이스페이 + ZK 증명으로, 한국 휴대전화가 없는 외국인이 토스에 즉시 온보딩되도록 하는 XRPL Credentials 기반 인증 레이어."**

---

## 1. 프로젝트 정체성 (What)

- **정식 명칭 (가칭)**: Toss Passport Auth Layer
- **유형**: 토스 내부에 탑재되는 **신규 본인확인 파이프라인**
- **대체 대상**: 현재 외국인이 토스를 쓰려면 거쳐야 하는 **"한국 휴대전화 개통 → 통신사 PASS 인증"** 2~3주 플로우
- **대체 방식**: "여권 NFC 태깅 + 토스 페이스페이" 60초 플로우로 축약
- **저장 매체**: XRPL Credentials (XLS-70) — 체인 네이티브 자격증명 객체

---

## 2. 왜 이걸 만드는가 (Why)

### 2-1. 문제 정의
- 국내 거주 외국인 250만 명 이상, 꾸준히 증가
- 토스 등 핀테크 온보딩은 **한국 휴대전화 + PASS 본인확인**이 사실상 전제
- 외국인은 ARC(외국인등록증) 발급 → 통신사 개통 대기 → PASS 가입까지 평균 2~3주 소요
- 그 기간 동안 **카드 결제·송금·앱 기반 생활** 전반이 차단됨
- 정보통신망법상 **본인확인기관은 이동통신 3사 중심**으로 설계되어 있어, 외국인에게 구조적으로 불리

### 2-2. 해결 가설
- 여권 IC칩은 **국가(CSCA)가 서명한 ICAO 9303 표준 전자 신원 문서**
- 모든 스마트폰이 NFC로 읽을 수 있고, 민간 KYC보다 신뢰도(LoA)가 높음
- 토스 페이스페이는 라이브니스·얼굴 매칭을 이미 상용 수준으로 보유
- 두 가지를 결합 → **통신사 비의존 비대면 실명확인 + 재사용 가능한 자격증명 발급**이 가능
- 자격증명은 XRPL Credentials로 발급하여, 이후 **송금·결제·제휴 서드파티 제시**에 반복 활용

---

## 3. 타겟 사용자

| 사용자 | 시나리오 |
|---|---|
| **주 타겟** | 재한 외국인 (유학생, 주재원, 이주노동자, 워홀러) |
| **2차 타겟** | 단기 방문 외국인 (3개월 이상 체류, 송금 니즈 있음) |
| **운영 주체** | 토스 (Issuer) |
| **검증 주체** | 토스 자체 서비스 + 제휴 가맹점(Verifier) |

---

## 4. 설계 철학 (Philosophy)

1. **통신사 없이도 시작한다** — 휴대전화 본인확인 의존성을 제거하는 것이 최상위 원칙.
2. **원본은 로컬, 증명은 ZK** — 프라이버시는 기본값. 여권 원본 데이터는 법적 의무가 있을 때만 암호화 보관.
3. **토큰이 아니라 자격증명** — 신원은 "가지는 물건"이 아니라 "증명되는 상태". 그래서 SBT(XLS-20)이 아니라 Credentials(XLS-70).
4. **프로토콜 레벨 보장 > 앱 레벨 체크** — 스마트컨트랙트·앱 로직 버그로 인증이 뚫리는 구조 자체를 회피.
5. **법정 본인확인 ≠ 앱 내부 인증 ≠ 서드파티 자율 KYC** — 한국 법체계의 세 레이어를 분리 설계.
6. **Soulbound by design** — 양도·대여·판매 불가능한 구조가 불법체류 신분세탁 방지와 정합.
7. **표준 재사용** — ICAO 9303 / W3C VC / XLS-70 / ISO 20022. 새 표준 만들지 않는다.

---

## 5. 전체 아키텍처

```
┌────────────────────── 사용자 디바이스 (iOS/Android) ──────────────────────┐
│                                                                           │
│  [1] 여권 NFC 태깅          [2] Toss Face Pay           [3] ZK Prover    │
│   │                          │                            │              │
│   ├─ BAC/PACE 키 파생        ├─ Active Liveness          ├─ Circom/Noir  │
│   ├─ DG1(MRZ), DG2(사진)    ├─ DG2 vs 셀피 매칭         │   회로 실행    │
│   └─ SOD 국가 서명 추출     └─ FAR<1e-6 임계치           │   (로컬)       │
│                                                           │              │
└───────────────┬───────────────────────────────────────────┴──────────────┘
                │  ZK Proof (π) + Public Inputs만 전송
                ▼
┌──────────────────────── 토스 백엔드 (Verifier) ──────────────────────────┐
│                                                                          │
│  • Verifier.verify(π, pub) → ICAO PKD Master List 대조                  │
│  • 법적 의무 기록: 암호화 원본 5년 보관 (특금법 §5-2③)                  │
│  • Issuer 서명으로 CredentialCreate 트랜잭션 제출                       │
│                                                                          │
└───────────────┬──────────────────────────────────────────────────────────┘
                ▼
┌────────────────────────── XRPL Mainnet ──────────────────────────────────┐
│                                                                          │
│  ① 사용자 지갑 (HD derivation, Face Pay로 서명 승인)                    │
│  ② Credential Ledger Entry (XLS-70)                                     │
│     { Issuer: rToss, Subject: rUser,                                    │
│       CredentialType: "TOSS_PASSPORT_KYC_L3",                           │
│       Expiration: <여권만료>, URI: ipfs://<VC>, Flags: lsfAccepted }    │
│  ③ DepositPreauth 기반 가맹점 게이팅                                    │
│  ④ (옵션) Payment.CredentialIDs로 Travel Rule 메타 첨부                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

구현 단위의 상세 아키텍처는 [아키텍처](architecture/README.md) 아래에 분리되어 있습니다. [식별자 파생](architecture/identifiers.ko.md), [자격증명 스키마](architecture/credentials.ko.md), [기록 및 접근 제어](architecture/records-access.ko.md)를 함께 확인하세요.

---

## 6. 인증 플로우

### 6-1. Phase 1 — 최초 등록 (1회성, 약 60초)

| # | 단계 | 기술 | 소요 |
|---|---|---|---|
| 1 | MRZ 하단 OCR (여권 개인정보면) | Vision Kit / ML Kit | 3s |
| 2 | NFC 태깅 → BAC/PACE 세션 수립 | `NFCPassportReader`(iOS) / `jmrtd`(Android) | 5s |
| 3 | DG1·DG2·SOD 추출 | ICAO 9303 | 5s |
| 4 | Passive Authentication (SOD 서명 검증 ↔ ICAO PKD) | BouncyCastle | 2s |
| 5 | Chip Authentication (복제 방지) | ECDH | 2s |
| 6 | 셀피 + Toss Face Pay 라이브니스 | 기존 SDK | 5s |
| 7 | DG2 ↔ 셀피 얼굴 매칭 | FaceNet/ArcFace | 2s |
| 8 | ZK Proof 로컬 생성 | Circom WASM | 15~30s |
| 9 | Verifier에 π 전송 → CredentialCreate | XRPL.js | 5s |
| 10 | 사용자 CredentialAccept 서명 | Face Pay 승인 | 3s |

**원칙**: 여권 원본(MRZ 원문, 사진 바이트)은 ZK 검증 이외 경로로는 서버에 송신되지 않는다. 단, 특금법 CDD 기록 보존 의무 대응을 위해 **암호화된 원본은 별도 보관소**에 1회 저장한다 (9-3 참조).

### 6-2. Phase 2 — 재인증 (일상 사용)

| 모드 | 트리거 | 기술 |
|---|---|---|
| **A. 토스 내부 재인증** | 송금 한도 상향 등 | Face Pay → 단말 개인키 서명 → Credential 조회 |
| **B. 외부 서드파티 제시** | 부동산 계약·오프라인 상점 등 | NFC/QR로 DID 전달 → 상대방이 `account_objects` 조회 → 유효성 확인 |
| **C. 해외 송금 (RLUSD)** | 본국 송금 | `CredentialIDs` 필드에 Travel Rule 메타 자동 첨부 |
| **D. 갱신/폐기** | 여권 만료, 탈퇴, 허위 KYC | Expiration 자동 무효 / 양측 `CredentialDelete` |

---

## 7. XRPL Credentials (XLS-70) 설계

### 7-1. 왜 Credentials인가 (SBT 대신)

| 항목 | XLS-20 SBT | **XLS-70 Credentials** |
|---|---|---|
| 소유자 동의 | 일방적 민팅 | **Create → Accept 2-phase** |
| 만료 | 수동 Burn | **Expiration 필드 네이티브** |
| 결제 게이팅 | 앱 레벨 | **DepositPreauth 네이티브** |
| 결제 메타 첨부 | 불가 | **Payment.CredentialIDs 필드** |
| 양도 방지 | 플래그 설정 | **스펙상 구조적 불가** |
| W3C VC 호환 | 커스텀 | **URI 필드로 JSON-LD 연결** |

→ 신원은 "토큰"이 아니라 "자격증명" 원시 타입이 필요. **SBT는 완전히 배제**.

### 7-2. Credential 객체

```typescript
{
  LedgerEntryType: "Credential",
  Issuer:        "rTossIssuerAddress...",
  Subject:       "rForeignUserAddress...",
  CredentialType: "544F53535F50415353504F52545F4B59435F4C33", // hex("TOSS_PASSPORT_KYC_L3")
  Expiration:     <여권 만료일 (Ripple Epoch)>,
  URI:            "ipfs://<W3C VC JSON-LD>",
  Flags:          lsfAccepted
}
```

### 7-3. CredentialType 네이밍 컨벤션
- `TOSS_PASSPORT_KYC_L3` — 여권+Face Pay 기반 Level 3 KYC
- `TOSS_VISA_D2` — 체류자격 연동 (향후 법무부 연계 시)
- `TOSS_AGE_19PLUS` — 파생 자격 (성인 인증용)
- `TOSS_KYC_INCOME_VERIFIED` — 한도 상향용

### 7-4. DepositPreauth 데모
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
→ **"토스 KYC 통과한 외국인만 이 상점 결제 가능"**이 프로토콜 규칙이 됨.

---

## 8. 기술 스택

### 8-1. 모바일 (사용자 단말)
- **iOS**: Swift + CoreNFC + `NFCPassportReader` (OSS)
- **Android**: Kotlin + `android.nfc` + `jmrtd`
- **얼굴 매칭**: ArcFace / FaceNet-lite on-device
- **ZK Prover**: Circom WASM (zkPassport 포크) 또는 Noir (Aztec)
- **XRPL 서명**: xrpl.js (React Native bridge) or Swift/Kotlin XRPL SDK

### 8-2. 백엔드 (토스 Verifier)
- **Verifier**: Node.js/TypeScript, snarkjs or barretenberg
- **ICAO PKD 연동**: BouncyCastle + 국가별 CSCA 마스터 리스트
- **암호화 원본 보관소**: AWS KMS + S3 (envelope encryption, 5년 보존)
- **XRPL 제출**: xrpl.js, 전용 Issuer 주소 운영

### 8-3. 온체인 (XRPL)
- **네트워크**: Testnet(해커톤) → Mainnet(상용)
- **표준**: XLS-70 Credentials, XLS-40 DID (옵션), RLUSD 통합
- **결제**: Native XRP / RLUSD / DepositPreauth

### 8-4. 참고 선행 연구 / 오픈소스
- [zkPassport](https://zkpassport.id/) — Aztec Noir 기반 동일 컨셉
- [AnonAadhaar](https://anon-aadhaar.pse.dev/) — 인도판, Circom 구현
- [NFCPassportReader](https://github.com/AndyQ/NFCPassportReader) — iOS 여권 리딩
- [JMRTD](https://jmrtd.org/) — Java/Android ICAO 9303

---

## 9. 법적 프레임워크 (Legal Framework)

### 9-1. 한국 신원인증 3계층

| Layer | 명칭 | 근거 법령 | 강제력 | 본 프로젝트 대체 가능? |
|---|---|---|---|---|
| **L1** | 법정 본인확인 | 정보통신망법 §23-3 | 방통위 지정 본인확인기관 독점 | ❌ **불가** |
| **L2** | 금융실명확인 + CDD | 금융실명법 §3, 특금법 §5-2 | 금융회사 자체 수행 | ✅ **가능** (조건부) |
| **L3** | 사업자 자율 KYC | 없음 | 강제력 없음 | ✅ **자유** |

→ **커버 영역**: L2 + L3. **L1은 명시적으로 커버하지 않는다.**
→ 마케팅 문구는 **"PASS 대체"가 아니라 "PASS 미커버 외국인 영역 신설"**.

### 9-2. 합법성 매트릭스

| 기능 | 근거 법 | 리스크 | 대응 |
|---|---|---|---|
| 여권 NFC + Face Pay 본인확인 | 금융실명법 비대면 실명확인 5택2 | 🟢 없음 | 2-factor 요건 충족 |
| 토스 내부 계정 개설 | 금융실명법, 전금법 | 🟢 없음 | — |
| **특금법 CDD 원본 5년 보존** | 특금법 §5-2③ | 🟡 **주의** | **암호화 원본 별도 보관 필수** |
| XRPL Credentials 발급·제시 | 사적 자치 | 🟢 없음 | — |
| DepositPreauth 게이팅 | 없음 | 🟢 없음 | — |
| Payment.CredentialIDs (Travel Rule) | 특금법 §5-3 | 🟡 상용화 시 공식 프로토콜 병행 | MVP는 개념증명 |
| RLUSD 해외 송금 | 외국환거래법 §3 | 🔴 | **토스뱅크(외국환은행) 경유 필수** |
| VASP 영업 | 특금법 §7 | 🟢 PoC 무관 / 🔴 상용 신고 | — |
| "PASS 완전 대체" 주장 | 정보통신망법 §23-3 | 🟡 표현 주의 | "외국인 전용 신규 경로" |
| 신용카드 발급 | 여전법 §14-2 | 🟢 없음 | 여권 = 합법 확인수단 |
| **소액대출·BNPL** | 여전법 §3, §50 | 🔴 **절대 금지** | MVP 스코프에서 제외 |
| 주민번호 대체 발급 | 주민등록법 | 🔴 금지 | — |

### 9-3. 특금법 §5-2③ 대응 — 이중 저장 + 7층 암호화

원본 데이터는 토스가 법적 의무로 보관하지만, 접근 경로는 암호학으로 극단적으로 좁힌다.

```
평상시 UX  : ZK Proof만 Verifier로 → 토스 서버에 평문 원본 無
최초 등록  : 단말 Secure Enclave에서 암호화 (X25519 + AES-256-GCM)
             ↓ TLS 1.3 / mTLS / Cert Pinning
             ↓ 토스 Edge는 복호화 불가 (app-layer 암호문 유지)
             ↓ Regulated Enclave HSM (FIPS 140-2 L3)에서만 복호화
             ↓ Envelope Encryption (DEK per-record, KEK in HSM)
             ↓ Field-level: 얼굴사진·여권번호·MRZ 각각 다른 DEK
접근 통제  : 금감원/FIU 공문 + Compliance Officer + CISO = 3승인
             HSM 복호화 세션 최대 1시간, 감사 로그 영구 보존
파기       : 5년 경과 시 Crypto-Shredding (DEK만 HSM에서 물리 삭제)
             → 원본 암호문 남아도 수학적 복호화 불가 (NIST SP 800-88 Rev.1)
```

**Zero-Knowledge 범위 (정직한 표기)**:
- ✅ 체인(XRPL)으로부터 — 완벽 (해시·만료일·URI만 공개)
- ✅ 제3자 Verifier로부터 — 완벽 (ZK 증명만 수신)
- ❌ 토스 자체로부터 — 불가능 (특금법 원본 보존 의무)
- 🟡 토스 내부 직원으로부터 — 최소화 (HSM + Dual Control + Field-level)

**준거 규정**: 개인정보보호법 §29, 전자금융감독규정 §17, 특금법 §5-2③, 금융보안원 암호기술 활용안내서, FIPS 140-2 L3, NIST SP 800-88 Rev.1.

→ 상세 설계는 **[암호화 아키텍처](security/encryption-architecture.ko.md)** 참조.

### 9-4. 여신전문금융업법 (여전법)
- **본 프로젝트 스코프에선 적용 없음** (신원·지갑·송금만).
- **경고**: 대출·후불결제 기능은 여전법 §3 인허가 필요, 미인가 영업은 §50 5년 이하 징역.
- → **MVP에 절대 포함하지 말 것.**

### 9-5. 외국환거래법
- 해외 송금은 외국환은행(토스뱅크) 경유만 합법.
- 순수 XRPL → 해외 계좌 직접 송금은 현행법상 불가.
- 데모에서 RLUSD는 "실자금이 아닌 Testnet 시뮬레이션"으로 명시.

---

## 10. 해커톤 MVP 범위

### 10-1. Must (Day 1~2)
- [ ] iOS NFC 여권 리딩 (NFCPassportReader 기반 래퍼)
- [ ] DG2 + 셀피 얼굴 매칭 (ArcFace 경량 모델)
- [ ] XRPL Testnet에 CredentialCreate / CredentialAccept 송출
- [ ] 더미 Verifier (서명만, ZK는 스텁)

### 10-2. Should (Day 3)
- [ ] zkPassport 회로 포크 → "만료일 > 오늘" 최소 증명
- [ ] Face Pay 라이브니스 SDK 연동 (모의)
- [ ] DepositPreauth 데모 (가상 가맹점 계정으로 시연)

### 10-3. Nice (Day 4, 임팩트용)
- [ ] RLUSD Testnet 송금 데모 (본국 송금 시나리오)
- [ ] 여권 만료 → Credential 자동 무효 시나리오 시연
- [ ] 불법체류 방지(신분 세탁 불가) 스토리 시연

### 10-4. 🚫 MVP에서 절대 건들지 않을 것
- 대출·BNPL·신용 제공 기능
- 토스뱅크 우회 실자금 해외송금
- 주민번호 생성·대체
- "PASS 대체" 명시적 마케팅 문구
- VASP 상용 영업 주장

---

## 11. KFIP 토스 특별상 심사 기준 매핑

| 심사 기준 | 본 프로젝트 대응 |
|---|---|
| ① 문제 정의 명확성 | 재한 외국인 250만+, 온보딩 2~3주 문제 정량화 |
| ② XRPL 활용도 | **XLS-70 네이티브 + DepositPreauth + RLUSD 통합** — 컨트랙트 없이 프로토콜 레벨 |
| ③ 실현 가능성 | 금융실명법 비대면 실명확인 요건 충족, CDD 이중 저장 구조로 특금법 대응 |
| ④ 확장성·임팩트 | 여권 글로벌 표준 → 다른 나라 외국인 대상 확장 가능 |
| ⑤ 토스 시너지 | **페이스페이 재사용 + 토스뱅크 연동 + 본인확인 파이프라인 신설** |

---

## 12. 열린 결정 사항 (Open Decisions)

1. **Verifier 모델**: 토스 단독 중앙 Verifier vs 탈중앙 Verifier 풀
   → 해커톤은 중앙 Verifier로 확정 (현실성)
2. **사용자 지갑 Custody**: 토스 custodial vs MPC(2-of-2) vs 완전 자가수탁
   → MPC(Face Pay ↔ 토스 서버) 추천
3. **ZK 회로 범위**: 최소(만료일만) vs 풀(서명+얼굴+나이+국적)
   → MVP는 최소, 발표 데모에선 "확장 로드맵" 제시
4. **RLUSD 포함 여부**: 임팩트 ↑, 구현 난이도 ↑
   → Nice-to-have. Testnet 시뮬만 포함
5. **CredentialType 스키마**: 단일 레벨 vs 계층형 (L1~L4)
   → MVP는 단일 `TOSS_PASSPORT_KYC_L3`, 확장은 발표 설명

---

## 13. 저장소 구조 (앞으로 만들 파일들)

```
XRPL hackathon/
├── README.md
├── docs/
│   ├── README.md
│   ├── chain-structure.md     # 호환용 진입점
│   ├── en/
│   │   ├── README.md
│   │   ├── plan.en.md
│   │   ├── architecture/
│   │   └── security/
│   └── ko/
│       ├── README.md
│       ├── plan.ko.md
│       ├── architecture/
│       └── security/
├── apps/
│   ├── mobile-ios/            # Swift, NFC + Face Pay
│   └── mobile-android/        # Kotlin, jmrtd
├── packages/
│   ├── verifier/              # TypeScript Verifier
│   ├── zk-circuit/            # Circom/Noir
│   └── xrpl-client/           # xrpl.js 래퍼
└── scripts/
    └── testnet/               # Credential 발급·조회 스크립트
```

---

## 14. 발표용 한 줄 (Positioning Statements)

- **기술**: "Soulbound NFT가 아니라 XRPL Credentials — 토큰이 아닌 자격증명이 필요한 영역이기 때문."
- **법**: "특금법 CDD는 암호화 원본으로, 프라이버시는 ZK로 — 이중 레이어 설계."
- **제품**: "PASS 대체가 아니라, PASS가 못 닿는 외국인 영역에 새 경로를 신설합니다."
- **시장**: "외국인 250만이 2~3주 기다리던 온보딩을, 60초로 줄입니다."

---

## 15. 용어집 (Glossary)

| 용어 | 정의 |
|---|---|
| **ICAO 9303** | 국제민간항공기구 전자여권 표준. DG1(MRZ), DG2(얼굴사진), SOD(서명) 등 규정 |
| **BAC / PACE** | 여권 MRZ를 키로 쓰는 NFC 세션 수립 프로토콜 |
| **Passive Authentication** | SOD 서명을 발급국 CSCA 인증서로 검증 |
| **Chip Authentication** | 여권 칩 복제 방지 프로토콜 |
| **ICAO PKD** | 국가별 여권 서명 인증서 공유 디렉토리 |
| **XLS-70** | XRPL Credentials 표준 (2024 활성화) |
| **XLS-40** | XRPL DID 표준 |
| **XLS-20** | XRPL NFT 표준 (SBT 구현 가능, 단 본 프로젝트 채택 안 함) |
| **DepositPreauth** | XRPL 네이티브 수신 허용 목록 기능 |
| **RLUSD** | Ripple 발행 USD 스테이블코인 (NYDFS 승인) |
| **W3C VC** | Verifiable Credentials 데이터 모델 (JSON-LD) |
| **CDD** | Customer Due Diligence, 고객확인의무 (특금법 §5-2) |
| **Travel Rule** | FATF 권고 16 — 가상자산 송금 시 발·수신자 정보 제공 |
| **LoA** | Level of Assurance (NIST 800-63). 여권 IC칩은 LoA 3+ |

---

## 16. 면책 고지

본 문서는 공개 법령·표준·오픈소스 기반의 엔지니어링 계획서이며, 법률 자문이 아닙니다. 실제 상용화 전에는 변호사·금융위·FIU 사전 유권해석이 필수입니다. 해커톤 PoC 단계에서는 본 문서 수준의 검토로 충분합니다.
