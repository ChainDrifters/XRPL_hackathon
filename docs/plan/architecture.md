# 아키텍처 — 데이터가 어디 사는지 4-layer로 분리한다

[XRPL](glossary.md#xrpl)은 사용자 행동 로그가 아니라 발급자 공개키와
[commitment](glossary.md#commitment)의 공개 신뢰 앵커입니다. 사용자 데이터는
[did:peer](glossary.md#did-peer) + [VC](glossary.md#vc) + 암호화 vault에 분산
저장됩니다.

## 4-layer 분리

```mermaid
flowchart TB
    subgraph A["사용자 레이어"]
        WALLET["Toss Foreigner Flow Wallet"]
    end
    subgraph B["비공개 신원 레이어"]
        PEER["did:peer pairwise DID"]
        VC["W3C Verifiable Credentials"]
        CHAIN["Private hash-linked chain"]
    end
    subgraph C["공개 XRPL 레이어"]
        IDID["Issuer did:xrpl"]
        SCHEMA["schemaHash + trustPolicyHash"]
        ROOT["proofChainRoot · statusRoot"]
        ESC["Escrow tx hash"]
    end
    subgraph D["오프체인 규제 레이어"]
        VAULT["Encrypted Vault<br/>여권/ARC/영수증"]
    end

    WALLET --> PEER
    WALLET --> VC
    WALLET --> CHAIN
    VC -. issued by .-> IDID
    CHAIN -. anchor root .-> ROOT
    CHAIN -. eventPayloadHash .-> VAULT
    SCHEMA -. defines .-> VC
    IDID -. resolve keys .-> WALLET
```

### 1. Toss Foreigner Flow Wallet (User-facing)

| | |
|---|---|
| **포함되는 것** | holder keypair (`did:key`) · 암호화 store + private identity graph · 서비스별 `relationshipId` · Toss-style mini-app UI |
| **어디서 등장** | [Phase 2](phase-2.md), [Phase 3](phase-3.md), [Phase 5](phase-5.md) |
| **규칙** | 사용자 통제. 모든 PII는 여기서 사용자 키로 암호화돼 있다가 vault로 백업된다. |

### 2. Private Identity Layer (Off-chain, holder-controlled)

| | |
|---|---|
| **포함되는 것** | [`did:peer`](glossary.md#did-peer) pairwise DID · W3C [Verifiable Credentials](glossary.md#vc) · private hash-linked event chain · consent / access-grant 기록 |
| **어디서 등장** | [Phase 4 proof chain E0~E7](phase-4.md), [Phase 5 VP](phase-5.md), [Phase 6 hotel/rental 분기](phase-6.md) |
| **규칙** | 서비스 도메인별로 격리. 같은 사용자의 tax/hotel/rental chain이 자동으로 연결되지 않는다. |

### 3. Public XRPL Trust Layer

| | |
|---|---|
| **포함되는 것** | Issuer/Connector [`did:xrpl`](glossary.md#did-xrpl) · `verificationMethod` 공개키 · schema hash · trust policy hash · optional [`proofChainRoot`](glossary.md#proof-chain-root) · `statusRoot` · optional [escrow tx hash](glossary.md#escrow-create) |
| **어디서 등장** | [Phase 1 DIDSet 5개](phase-1.md), [Phase 4 final proofChainRoot anchor](phase-4.md), [Phase 6 EscrowCreate Testnet tx](phase-6.md) |
| **규칙** | opaque commitment만. event type, user DID, 영수증 detail, kiosk 번호, 카드 token, 어떤 timestamp도 절대 올리지 않는다. |

### 4. Regulated Encrypted Off-chain Vault

| | |
|---|---|
| **포함되는 것** | 여권 · [ARC](glossary.md#arc) · 비자 원본 · 면세 영수증 · 환급 case file · 호텔 예약 · 렌탈 계약 · 면허 검증 로그 · 에스크로 case file · audit log |
| **어디서 등장** | [Phase 3 KYC vault 진입](phase-3.md), [Phase 7 crypto-shredding 시연](phase-7.md) |
| **규칙** | 특금법 §5-2 ③ 5년 보존 의무. [envelope encryption](glossary.md#envelope-encryption) + [HSM](glossary.md#hsm) + dual control. 사용자 grant 없이 verifier가 못 본다. |

## On-chain / Off-chain 경계

가장 자주 헷갈리는 지점. 아래 표는 [on-chain](glossary.md#on-chain)에 올려도
되는 것과 [off-chain](glossary.md#off-chain)에 둬야 하는 것을 정확히 분리합니다.

### XRPL에 올려도 OK

- Issuer / Connector DID
- `verificationMethod` 공개키 (DID document)
- schema hash 또는 URI
- status-list hash 또는 Merkle root
- coarse credential type (`ComplianceTierA` 같은 것)
- 최종 `proofChainRoot` (옵션)
- `EscrowCreate` / `EscrowFinish` tx hash
- payment settlement tx hash

### 절대 XRPL에 올리지 말 것

- 여권번호
- ARC 번호
- 비자 유형
- 국적 (특별 검토 없으면)
- 세금 환급 영수증 detail
- 환급 금액
- 호텔/렌탈 계약 detail
- 면허번호
- 전체 VC payload
- 사용자 DID
- event type / case ID
- per-event timestamp

> [DID](glossary.md#did) 문서나 ledger entry는 **누구나 조회 가능**합니다.
> 여권번호·체류자격 같은 PII를 한 번이라도 올리면 영구 공개. 그래서 사용자
> 식별자는 [`did:peer`](glossary.md#did-peer)로 비공개 처리하고, XRPL에는 issuer
> 공개키와 opaque hash만 둡니다.

## 식별자 구분표

| 식별자 | 공개? | 목적 |
|---|---|---|
| [`did:xrpl`](glossary.md#did-xrpl) | **Yes** | Issuer / Connector 공개키 발견용 |
| [`did:key`](glossary.md#did-key) | No | 지갑의 로컬 holder root, 단말 안에서만 |
| [`did:peer`](glossary.md#did-peer) + [`relationshipId`](glossary.md#relationship-id) | No | 한 verifier 와의 비공개 관계 |
| [`proofChainRoot`](glossary.md#proof-chain-root) | **Opaque only** | 비공개 chain의 무결성 증명용 |
| `statusRoot` | **Opaque only** | validity / revocation Merkle root |

## 원본 문서 참조

- [`docs/ko/architecture/overview.ko.md`](../docs/ko/architecture/overview.ko.md) — 4-layer 원본
- [`docs/ko/architecture/identifiers.ko.md`](../docs/ko/architecture/identifiers.ko.md) — 식별자 모델
- [`docs/ko/architecture/credentials.ko.md`](../docs/ko/architecture/credentials.ko.md) — DID·VC·status list
- [`docs/ko/architecture/records-access.ko.md`](../docs/ko/architecture/records-access.ko.md) — 접근 제어
- [`docs/ko/security/encryption-architecture.ko.md`](../docs/ko/security/encryption-architecture.ko.md) — 암호화 7층
- [`docs/ko/security/key-and-state-recovery.ko.md`](../docs/ko/security/key-and-state-recovery.ko.md) — 키·상태 복구
