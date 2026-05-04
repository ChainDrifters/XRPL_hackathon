# 암호화 아키텍처 (Encryption Architecture)

> Toss Foreigner Flow Layer / Passport Auth module — 여권 원본·CDD 증거 데이터 보호 설계
> [`plan.ko.md §9`](../plan.ko.md)에서 참조

---

## 0. 문제 정의

체인에는 해시·URI·만료일만 기록되고, Verifier는 ZK 증명만 수신합니다.
그러나 **특금법 §5-2③**는 CDD 근거 원본을 **5년 보존**하도록 강제하므로, 토스는 여권 원본 데이터를 어떤 형태로든 보관해야 합니다.

결론부터:
- ❌ 토스로부터의 **완전한** Zero-Knowledge는 법적으로 불가능
- ✅ 대신 **"암호학적으로 통제된 최소 노출"** (minimum disclosure enforced by cryptography)

---

## 1. 데이터 흐름 3분할

| 경로 | 내용 | 저장 위치 | 암호화 필요성 |
|---|---|---|---|
| **A. ZK 증명** | 증명(π) + public inputs | Verifier 메모리 (휘발) | Transport만 |
| **B. 법정 보관 원본** | 여권 DG1/DG2 바이트, 얼굴 사진 | 토스 Regulated Vault | **⭐ 다층 암호화** |
| **C. 온체인** | Credential 메타(해시·URI·만료일) | XRPL 원장 | 해시만이므로 불필요 |

→ 본 문서는 **B 경로**를 다룹니다.

---

## 2. 7층 Defense in Depth

```
┌─── 사용자 단말 ─────────────────────────────────┐
│ ①  Secure Enclave에서 세션키 생성              │
│ ②  여권 원본을 토스 공개키로 ECIES 하이브리드   │
│    암호화 (AES-256-GCM + X25519 ECDH)          │
└──────────┬─────────────────────────────────────┘
           │ ③ TLS 1.3 + mTLS + Cert Pinning
           ▼
┌─── 토스 Edge ──────────────────────────────────┐
│ ④  Edge에선 복호화 불가 (application-layer     │
│    암호화가 TLS 너머까지 유지됨)                │
└──────────┬─────────────────────────────────────┘
           │ 전용 VPC 내부망 (IAM 최소권한)
           ▼
┌─── Regulated Enclave (토스 KYC Vault) ─────────┐
│ ⑤  HSM (FIPS 140-2 Level 3)에서만 복호화       │
│ ⑥  Envelope Encryption                         │
│     - DEK (데이터키): 레코드마다 고유 AES-256  │
│     - KEK (키암호화키): HSM 내부, 반출 불가    │
│ ⑦  Field-level 암호화 (항목별 다른 키)         │
│     - 얼굴 사진 ≠ 여권번호 ≠ MRZ 원문          │
└─────────────────────────────────────────────────┘
```

### 층별 상세

#### ① 디바이스 키 (Secure Enclave / StrongBox)
- iOS `SecureEnclave` / Android `StrongBox` / ARM TEE
- 사용자 개인키는 **단말 하드웨어 밖으로 나오지 않음**
- Face Pay 인증이 있어야만 키 사용 승인 (`LAContext` 또는 `BiometricPrompt`)

#### ② 애플리케이션 레이어 E2E (ECIES)
- 알고리즘: **X25519 ECDH + HKDF-SHA256 + AES-256-GCM**
- 토스 Issuer 공개키로 매 요청마다 ephemeral 세션키 파생
- 한국 규제 대응: 국산 알고리즘 병용 가능 — **ARIA-256-GCM / SEED / LEA** (KISA 권고)

#### ③ Transport (TLS 1.3)
- mTLS (상호 인증)
- Certificate Pinning (앱 바이너리에 토스 인증서 핀 고정)
- HSTS, Perfect Forward Secrecy 필수

#### ④ TLS 너머 보호
- 로드밸런서에서 TLS 종료되더라도 payload는 여전히 암호문
- 중간 서버·로깅 시스템이 평문에 접근 불가 (정보보호 감사 시 핵심 증거)

#### ⑤ HSM 기반 복호화
- Regulated Enclave 내부 HSM에서만 복호화
- **FIPS 140-2 Level 3** (탬퍼 감지 시 키 자동 소멸)
- 한국 상용: 금융보안원 CC인증 HSM (Penta, NSHC 등)

#### ⑥ Envelope Encryption (2단 키)

```
평문 (여권 원본)
    │  AES-256-GCM (DEK, 레코드마다 고유)
    ▼
암호문 + AAD (associated data)

DEK
    │  AES-KW (KEK)
    ▼
Wrapped DEK (암호문 옆에 저장)

KEK
    │  HSM 내부 CMK로 래핑
    ▼
HSM 내부에만 존재, 반출 불가
```

→ 일반 복호화 작업자는 KEK를 **볼 수 없고** HSM에 "이 암호문을 풀어달라"고 요청만 가능.

#### ⑦ Field-level Encryption (Zero-Trust Internal)
각 PII 필드마다 **다른 DEK**:

| 필드 | 키 ID | 복호화 트리거 |
|---|---|---|
| 얼굴 사진 (DG2) | `K_face` | 금감원 검사 요청 시만 |
| 여권번호 | `K_passportNo` | CDD 조회 시만 |
| MRZ 원문 | `K_mrz` | 오프라인 감사용 |
| ZK commitment | `K_commit` | 상시 (재검증용) |
| 생체 인증 해시 | `K_bio` | Face Pay 재인증 시 |

→ 내부 직원의 "얼굴 사진 열람 권한"과 "여권번호 열람 권한"이 **분리**됨. 감사관은 필요한 필드만 수령.

---

## 3. 키 관리 — Dual Control (4-Eyes Principle)

"토스 한 명이 열 수 있으면 안 된다" 원칙:

```
복호화 요청
    │
    ├─ 요청자 인증: 금감원 공문 or FIU 영장
    ├─ 1차 승인: 토스 Compliance Officer
    ├─ 2차 승인: 토스 CISO
    └─ HSM 복호화 세션 열림 (최대 1시간, 감사 로그 영구 보존)
```

- **4-eyes principle**: 2명 이상 동시 승인
- **Quorum 승인**: 관리자 N명 중 M명 (예: 3-of-5)
- **Hardware Security Officer Card**: 물리 스마트카드로 HSM 활성화
- 금융보안원 「암호기술 활용안내서」 §5.3 준수

---

## 4. 5년 보존 데이터의 수명 주기

```
T=0            Enrollment → 암호화 저장 (K_face, K_passportNo 등 생성)
    ↓
T+1일          모니터링 시작 (접근 로그 영구 보존)
    ↓
T+3일          암호화 검증 스크립트 (데이터 손상 감지)
    ↓
T+여권만료일    Credential 자동 무효 (XRPL `Expiration`)
    ↓
T+5년          법정 보존 기간 종료 → **Crypto-Shredding**
               해당 record의 DEK를 HSM에서 **물리적 삭제**
    ↓
               원본 암호문은 남아있어도 **수학적으로 복호화 불가**
               (cryptographic erasure, NIST SP 800-88 Rev.1)
```

### Crypto-Shredding의 의미
- 원본 파일을 지우는 게 아니라 **DEK만 삭제**
- 삭제 증명이 훨씬 쉬움 (HSM 감사 로그로 입증 가능)
- GDPR "잊힐 권리"·개인정보보호법 §21 파기의무 대응 표준

---

## 5. 한국 규제 기준 매핑

| 규제 | 요구사항 | 본 설계 대응 |
|---|---|---|
| **개인정보보호법 §29 + 시행령 §30** | 고유식별정보 암호화, 접근통제, 접속기록 | ①~⑦ 전층 ✅ |
| **전자금융감독규정 §17** | 중요정보 암호화 (전송·저장 모두) | ② + ⑥ ✅ |
| **금융보안원 암호기술 활용안내서** | KISA 승인 알고리즘 + CC인증 HSM | ⑤ + ⑥ ✅ |
| **특금법 §5-2③** | CDD 기록 5년 보존 | §4 수명주기 ✅ |
| **개인정보보호위 가이드** | 개인정보 영향평가(PIA) | 상용화 전 수행 |
| **ISO 27001 / ISO 27701** | 정보보호·프라이버시 관리체계 | 상용화 전 인증 |
| **FIPS 140-2 Level 3** | HSM 물리적 보안 | ⑤ ✅ |
| **NIST SP 800-88 Rev.1** | 데이터 파기 표준 | Crypto-Shredding ✅ |

---

## 6. "진짜 Zero-Knowledge인가?" — 정직한 논의

| 대상 | Zero-Knowledge 여부 |
|---|---|
| 체인(XRPL)으로부터 | ✅ **완벽** — 해시·만료일·URI만 공개 |
| 제3자 Verifier로부터 | ✅ **완벽** — ZK 증명만 수신 |
| 토스로부터 | ❌ **불가능** — 법적 의무로 원본 필요 |
| 토스 내부 직원으로부터 | 🟡 **최소화** — HSM + Dual Control + Field-level |

### 왜 토스로부터 완전 ZK가 불가능한가
- 특금법은 CDD 증거 원본을 요구
- ZK만 남기면 금감원 검사에서 "원본 미보관" 위반
- 따라서 **"토스는 볼 수 있지만, 볼 수 있는 경로가 극히 제한적"**인 설계가 현실적 최선

### 상용 단계 대안
- **옵션 1. Threshold Encryption**: DEK을 토스 + FIU에 분산 → 동시 승인 필요
- **옵션 2. TEE (Trusted Execution Environment)**: AWS Nitro Enclaves / Intel SGX → 클라우드 운영자도 못 봄
- **옵션 3. MPC Custody**: DEK을 2-of-3으로 토스/사용자/감사자 분산

→ 상용화 시 **옵션 2 (TEE)** 가 가장 현실적. 해커톤 MVP엔 과잉.

---

## 7. 해커톤 MVP vs 상용

| 층 | MVP (해커톤) | 상용 |
|---|---|---|
| ① Secure Enclave | ✅ iOS Keychain | ✅ |
| ② ECIES E2E | ✅ 단순 구현 | ✅ ARIA 병용 |
| ③ TLS 1.3 | ✅ Let's Encrypt | ✅ + Cert Pinning |
| ④ TLS 너머 보호 | ⏩ 생략 | ✅ 필수 |
| ⑤ HSM | ⏩ **KMS 시뮬레이션** | ✅ CC인증 HSM |
| ⑥ Envelope (DEK/KEK) | ✅ AWS KMS 기본 기능 | ✅ 전용 HSM |
| ⑦ Field-level | ⏩ 단일 키 | ✅ 필드별 분리 |
| Dual Control | ⏩ 생략 | ✅ 필수 |
| Crypto-Shredding | ⏩ 생략 | ✅ 필수 |

### MVP 최소 구현 (해커톤 시연 기준)
1. **Mobile → Server**: `libsodium`의 `crypto_box` (X25519 + XChaCha20-Poly1305) — 약 10줄
2. **Server Storage**: AWS KMS로 DEK 래핑, S3에 암호문 저장 — SDK 기본 기능
3. **Face Pay 승인 → 복호화 요청 로그**: API Gateway 로그
4. **On-chain**: `URI` 필드에 **IPFS 해시만** (IPFS 내용도 암호문)

---

## 8. 발표용 한 줄

> **"체인은 해시만, Verifier는 ZK만, 토스는 HSM·이중키·필드별 분리·5년 후 크립토쉬레딩으로 '볼 수 있는 권한'을 구조적으로 제한합니다. 완전 제로 지식 대신, 법이 허용하는 최소 노출을 암호학으로 강제합니다."**

---

## 9. 참고 표준

- NIST SP 800-57 (Key Management)
- NIST SP 800-88 Rev.1 (Media Sanitization)
- FIPS 140-2 / 140-3 (HSM)
- RFC 5869 (HKDF)
- RFC 8439 (ChaCha20-Poly1305)
- KISA 「암호기술 구현 안내서」
- 금융보안원 「암호기술 활용안내서」
- ISO/IEC 27001, 27701, 27018
