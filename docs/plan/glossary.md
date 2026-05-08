# 용어집 — 핵심 개념 69개

Toss Foreigner Flow Layer 학습에 필요한 핵심 용어를 카테고리별로 정리했습니다.
각 phase 본문에서 `[용어](glossary.md#id)` 형식으로 이 페이지의 anchor를 참조합니다.

## 카테고리

- [신원·자격증명](#cat-identity) (21)
- [XRPL](#cat-xrpl) (6)
- [암호 기술](#cat-crypto) (11)
- [보안·키 관리](#cat-security) (15)
- [서비스 워크플로우](#cat-workflow) (6)
- [웹·앱 기술](#cat-web) (6)
- [규제·법](#cat-regulation) (4)

---

<a id="cat-identity"></a>

## 신원·자격증명

<a id="did"></a>

### DID · _Decentralized Identifier_

중앙 등록기관 없이 검증 가능한 식별자. did:method:identifier 형식. 자기 키로 서명을 증명함.

> W3C DID Core 표준. method 부분이 어떤 원장/저장소에서 키를 가져올지 결정 (did:xrpl, did:peer, did:key 등).

**Reference**: [https://www.w3.org/TR/did-core/](https://www.w3.org/TR/did-core/)

<a id="did-xrpl"></a>

### did:xrpl

XRPL 계정에 묶인 공개 DID. issuer/connector 같은 "공개 기관"의 신원에만 사용.

> DIDSet 트랜잭션으로 XRPL ledger entry에 등록되며, DID 문서 URI나 공개키 reference를 담음. 사용자 개인 DID는 절대 여기에 올리지 않음.

**Reference**: [https://xrpl.org/docs/concepts/decentralized-storage/decentralized-identifiers](https://xrpl.org/docs/concepts/decentralized-storage/decentralized-identifiers)

<a id="did-peer"></a>

### did:peer

두 당사자 사이에서만 공유되는 비공개 DID. 공개 원장에 등록 안 됨.

> 사용자와 한 서비스 사이의 pairwise 관계에 사용. 다른 서비스가 같은 사용자의 활동을 자동 상관분석할 수 없게 만듦.

<a id="did-key"></a>

### did:key

public key 자체에서 deterministic하게 만든 self-contained DID. 등록·발급 절차 없음.

> 지갑의 로컬 holder 식별자로 자주 사용. 키만 있으면 누구나 검증 가능.

<a id="vc"></a>

### VC · _Verifiable Credential_

issuer가 holder에 발급한 검증 가능한 디지털 자격증명. JSON-LD 형식. 발급자 서명으로 위변조 검증.

> W3C VC Data Model 2.0. credentialSubject 안에 검증된 사실을 담고, proof 안에 issuer 서명을 담음.

**Reference**: [https://www.w3.org/TR/vc-data-model-2.0/](https://www.w3.org/TR/vc-data-model-2.0/)

<a id="vp"></a>

### VP · _Verifiable Presentation_

holder가 verifier에게 보내는 "선택 공개된 VC 묶음". holder 키로 서명되어 있음.

> 전체 VC를 그대로 보내지 않고 필요한 claim만 골라 노출 가능 (selective disclosure).

<a id="issuer"></a>

### Issuer

VC를 발급하는 주체. 자기 개인키로 VC에 서명. 예: Toss KYC issuer, refund operator connector.

<a id="holder"></a>

### Holder

VC를 자기 지갑에 보관하는 주체. 보통 사용자 본인.

<a id="verifier"></a>

### Verifier

holder에게 VP를 요청하고 issuer 서명·status·trust policy를 검증하는 주체. 예: 키오스크, 호텔 connector.

<a id="pairwise-id"></a>

### Pairwise ID

"한 쌍" 사이에서만 안정적인 식별자. 같은 사용자라도 서비스마다 다른 ID를 보여줘서 cross-service 추적을 막음.

> 이 프로젝트는 HKDF + HMAC-SHA256으로 holderMasterSecret + verifierDid + serviceDomain에서 파생.

<a id="relationship-id"></a>

### relationshipId

한 verifier 도메인 안에서 같은 사용자의 여러 이벤트를 묶는 비공개 ID. pairwise 파생값.

<a id="selective-disclosure"></a>

### Selective disclosure · _선택 공개_

VC에 들어있는 여러 사실 중 정말로 필요한 것만 골라 공개하는 기법. "여권 유효함" yes/no만 보여주고 여권번호는 숨김.

<a id="proof-chain"></a>

### Proof Chain

이전 event hash가 다음 event에 들어가는 hash-linked event 시퀀스. 중간 변조를 막음. (블록체인의 mini 버전)

<a id="proof-chain-root"></a>

### proofChainRoot

proof chain의 현재 마지막 event hash. 완료된 E7만 뜻하지 않고, E3까지 진행된
branch라면 `proofChainRoot = hash(E3)`. opaque 값으로 XRPL에 anchor → 체인 내용은
숨기고 무결성만 증명.

<a id="domain-tree-root"></a>

### domain treeRoot

tax, hotel, rental 같은 service domain 안의 여러 branch root를 묶은 Merkle root.
전체 wallet global root가 아니라, 해당 domain verifier가 볼 권한이 있는 범위의 root만
공개·서명한다.

<a id="status-list"></a>

### Status List · _Bitstring Status List_

VC가 revoke됐는지 비트 한 개로 표시한 압축 리스트. 개별 사용자 노출 없이 revocation 검증.

**Reference**: [https://www.w3.org/TR/vc-bitstring-status-list/](https://www.w3.org/TR/vc-bitstring-status-list/)

<a id="status-root"></a>

### statusRoot

status list의 Merkle root. opaque hash로 XRPL에 올림.

<a id="consent-descriptor"></a>

### Consent Descriptor

verifier가 보내는 "무엇을 왜 요청하는지"의 구조화된 서명 메타데이터. 임의 문구가 아니라 allowlist template과 매칭됨.

<a id="access-grant"></a>

### Holder Access Grant

verifier가 단순 presentation 이상의 정보를 요청할 때 holder가 발급하는 scope·만료 시간 포함 서명 grant.

<a id="event-payload-hash"></a>

### eventPayloadHash

비공개 event 본문(canonical JSON)의 SHA-256 hash. 이게 chain에 들어가서 본문 변조를 검증.

<a id="previous-event-hash"></a>

### previousEventHash

이전 event의 envelope hash. 다음 event 안에 들어가서 chain 순서·중간 삭제를 막음.

<a id="attestor-did"></a>

### attestorDid

이 event를 서명한 actor의 DID. 검증자가 이 DID에서 공개키를 가져와 서명을 검증.

<a id="cat-xrpl"></a>

## XRPL

<a id="xrpl"></a>

### XRPL · _XRP Ledger_

오픈소스 분산 원장. 송금·escrow·DID·credential 같은 금융 primitive를 트랜잭션 단위로 제공.

> 이 프로젝트는 XRPL을 사용자 행동 로그가 아니라 issuer 공개키와 schema/status hash 같은 "공개 신뢰 앵커"용으로만 씁니다.

**Reference**: [https://xrpl.org/](https://xrpl.org/)

<a id="didset"></a>

### DIDSet

XRPL 트랜잭션 종류. 계정에 DID entry를 만들거나 갱신함. URI, Data, DIDDocument 중 하나 이상 필요.

**Reference**: [https://xrpl.org/docs/references/protocol/transactions/types/didset](https://xrpl.org/docs/references/protocol/transactions/types/didset)

<a id="on-chain"></a>

### On-chain

블록체인 원장에 직접 기록되는 데이터. 누구나 조회 가능 → 개인정보를 올리면 안 됨.

<a id="off-chain"></a>

### Off-chain

블록체인 외부 (지갑·서버·암호화 vault) 에 저장되는 데이터. 민감 정보는 모두 여기.

<a id="escrow-create"></a>

### EscrowCreate / EscrowFinish

XRPL의 조건부 잠금/해제 트랜잭션. 시간·crypto-condition 만족 시 자금 이동. 보증금 demo에 사용.

**Reference**: [https://xrpl.org/docs/concepts/payment-types/escrow](https://xrpl.org/docs/concepts/payment-types/escrow)

<a id="rlusd"></a>

### RLUSD

Ripple이 발행하는 USD 페그 stablecoin. XRPL/EVM 양쪽에서 발행. 결제·환급 정산 시연용.

<a id="cat-crypto"></a>

## 암호 기술

<a id="zk-proof"></a>

### Zero-Knowledge Proof · _ZK 증명_

"내가 어떤 사실을 안다"는 것을 그 사실 자체를 노출하지 않고 증명. "여권이 유효하다" 만 증명, 여권번호는 비공개.

<a id="commitment"></a>

### Cryptographic Commitment

"내가 이 값을 정해뒀음"을 hash로 봉인하고, 나중에 원본을 공개해서 검증하게 하는 기법. status root, schema hash 등.

<a id="merkle-root"></a>

### Merkle Root

여러 hash를 트리로 묶어 만든 단일 root hash. 한 노드만 가지면 다수 항목의 변조를 검증 가능.

<a id="ed25519"></a>

### Ed25519

EdDSA 서명 알고리즘. 빠르고 작은 32B 공개키, 보안성 높음. 이 프로젝트의 모든 mock actor가 사용.

<a id="sha-256"></a>

### SHA-256

단방향 hash 함수. 임의 데이터를 32B 고정 길이 지문으로 만듦. eventPayloadHash·proofChainRoot에 사용.

<a id="hkdf"></a>

### HKDF · _HMAC-based Key Derivation Function_

하나의 master secret에서 여러 용도별 키를 안전하게 파생하는 표준. RFC 5869.

**Reference**: [https://datatracker.ietf.org/doc/html/rfc5869](https://datatracker.ietf.org/doc/html/rfc5869)

<a id="hmac"></a>

### HMAC

비밀 key + 해시 함수로 만드는 메시지 인증 코드. "이 메시지는 키 보유자가 만들었다"를 증명.

<a id="aes-gcm"></a>

### AES-256-GCM

대칭키 암호 + 무결성 검증을 동시에 하는 표준. envelope encryption의 데이터 키로 사용.

<a id="ecies"></a>

### ECIES · _Elliptic Curve Integrated Encryption Scheme_

공개키로 암호화하는 하이브리드 방식. ECDH로 세션키를 만들고 AES-GCM으로 본문 암호화.

<a id="ecdh"></a>

### ECDH · _Elliptic Curve Diffie-Hellman_

두 측이 자기 비밀키와 상대 공개키로 같은 공유 비밀을 만드는 키 교환 알고리즘.

<a id="canonical-json"></a>

### Canonical JSON

같은 객체가 항상 같은 byte 표현이 되도록 직렬화하는 규칙. hash·서명 검증의 전제.

<a id="cat-security"></a>

## 보안·키 관리

<a id="trust-anchor"></a>

### Trust Anchor · _신뢰 앵커_

검증 chain의 시작점이 되는 공개 entity. 이 프로젝트에선 XRPL에 등록된 issuer DID가 신뢰 앵커.

<a id="trust-registry"></a>

### Trust Registry

event type별로 어떤 DID가 서명할 권한이 있는지 정의한 정책. 서명만 검증하면 "rogue vendor"가 마음대로 서명할 수 있으므로 필수.

<a id="trust-policy"></a>

### Trust Policy

"이 actor가 이 eventType에 서명할 수 있는가" 를 검증자가 확인하는 규칙 집합. trust registry의 검증 단계.

<a id="allowlist-template"></a>

### Allowlist Template

wallet이 인정하는 동의 문구 템플릿. vendor가 보낸 임의 텍스트를 그대로 보여주지 않음 → phishing 방지.

<a id="envelope-encryption"></a>

### Envelope Encryption

데이터는 DEK로, DEK는 다시 KEK로 암호화하는 2단 구조. 키 회전·접근 제어가 깔끔.

<a id="dek-kek"></a>

### DEK / KEK

DEK = 데이터 암호화 키 (레코드마다 고유). KEK = 키 암호화 키 (HSM 안에서만 사용). 분리해서 dual control 가능.

<a id="hsm"></a>

### HSM · _Hardware Security Module_

키를 절대 외부로 내보내지 않는 전용 보안 하드웨어. FIPS 140-2 Level 3 이상이 금융 표준.

<a id="tee"></a>

### TEE · _Trusted Execution Environment_

CPU 안의 격리된 보안 영역. AWS Nitro Enclaves, Intel SGX 같은 곳에서 클라우드 운영자도 못 보는 코드 실행.

<a id="mpc"></a>

### MPC · _Multi-Party Computation_

키를 N개의 share로 나눠 두고 M명이 모여야만 서명할 수 있게 만드는 기술. 단일 장애점 제거.

<a id="crypto-shredding"></a>

### Crypto-Shredding

데이터 자체가 아니라 그 DEK만 삭제해서 영원히 복호화 불가능하게 만드는 파기 방식. NIST SP 800-88 표준.

<a id="secure-enclave"></a>

### Secure Enclave / StrongBox

iOS/Android의 하드웨어 격리 키 저장소. 개인키가 단말 밖으로 절대 나가지 않음. 생체 인증과 게이트.

<a id="passkey"></a>

### Passkey

WebAuthn 기반 phishing-resistant 로그인. 비밀번호 없이 생체 + 디바이스 키로 인증.

<a id="bip-39"></a>

### BIP-39

12·24개 단어로 표현되는 복구 구문 표준. 진보적 사용자용 옵션. default로 두면 phishing에 취약.

<a id="tls-1-3"></a>

### TLS 1.3

최신 TLS 표준. forward secrecy 강제, 세션 협상 단축. mTLS + cert pinning과 함께 써야 안전.

<a id="mtls"></a>

### mTLS · _Mutual TLS_

서버만 인증서 보여주는 보통 TLS와 달리 클라이언트도 인증서로 본인 증명. 백엔드 간 통신에 자주 사용.

<a id="cat-workflow"></a>

## 서비스 워크플로우

<a id="etrs"></a>

### eTRS · _electronic Tax Refund System_

한국의 외국인 관광객 부가세 환급 통합 시스템. 환급창구운영사업자가 운영.

<a id="refund-operator"></a>

### 환급창구운영사업자

면세점에서 환급전표를 받아 외국인에게 환급금을 지급하는 지정 사업자. Global Tax Free 등.

<a id="tax-free-store"></a>

### 지정 면세판매장

관할 세무서장이 지정한 사후면세점. 외국인에게 세금 포함가로 팔고 환급전표를 발급.

<a id="pos"></a>

### POS · _Point of Sale_

매장에서 결제·영수증·세무 기록을 처리하는 단말. 이 프로젝트에선 merchant connector 역할.

<a id="psp"></a>

### PSP · _Payment Service Provider_

카드 authorization·정산을 처리하는 결제대행사. 환급의 settlement event를 서명.

<a id="face-pay"></a>

### Toss Face Pay

얼굴 인식으로 결제·인증하는 토스 기능. 이 프로젝트에선 holder key 사용 시 step-up 인증 mock.

<a id="cat-web"></a>

## 웹·앱 기술

<a id="json-ld"></a>

### JSON-LD

JSON에 @context 같은 의미 정보를 더해서 단어를 전 세계적으로 식별 가능하게 만든 데이터 형식. VC가 이 위에 정의됨.

**Reference**: [https://www.w3.org/TR/json-ld11/](https://www.w3.org/TR/json-ld11/)

<a id="mini-app"></a>

### Mini-app

모기업 앱 (토스) 안에서 동작하는 작은 앱. 진입 즉시 핵심 기능을 보여주고, 별도 설치/로그인 없음.

**Reference**: [https://developers-apps-in-toss.toss.im/](https://developers-apps-in-toss.toss.im/)

<a id="apps-in-toss"></a>

### Apps in Toss

토스 앱 안에서 외부 파트너가 mini-app을 제공하는 플랫폼. 디자인 시스템·UX writing 가이드 별도.

**Reference**: [https://developers-apps-in-toss.toss.im/design/overview.html](https://developers-apps-in-toss.toss.im/design/overview.html)

<a id="react"></a>

### React

컴포넌트 기반 UI 라이브러리. 이 학습 사이트와 MVP 데모의 기본 프레임워크.

<a id="vite"></a>

### Vite

빠른 dev server + Rollup 기반 빌드. ESM native하게 동작해서 HMR이 거의 즉각.

**Reference**: [https://vite.dev/](https://vite.dev/)

<a id="indexeddb"></a>

### IndexedDB

브라우저 안의 NoSQL DB. localStorage보다 큰 데이터·트랜잭션 지원. 지갑 store로 사용.

<a id="cat-regulation"></a>

## 규제·법

<a id="kyc"></a>

### KYC · _Know Your Customer_

금융기관이 고객 신원을 확인하는 절차. 한국에서는 특금법·전자금융감독규정이 요구.

<a id="cdd"></a>

### CDD · _Customs Due Diligence_

고객확인의무. 신원 확인 결과를 5년 이상 보존해야 하는 한국 특금법 §5-2 ③ 의무.

<a id="arc"></a>

### ARC · _Alien Registration Card_

외국인등록증. 90일 이상 체류 외국인에게 발급. 체류자격·번호가 민감 PII.

<a id="kfip"></a>

### KFIP 2026 · _Korea Financial Innovation Program_

서울핀테크랩 + XRPL Korea가 운영하는 3개월 builder accelerator. 본 프로젝트가 출품한 토스 특별상의 모체.
