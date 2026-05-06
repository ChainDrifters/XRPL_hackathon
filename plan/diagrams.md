# 다이어그램 갤러리

이 프로젝트의 핵심 mermaid 다이어그램 5개를 한 곳에 모았습니다. 그림 하나씩
직접 그려보면서 학습하기 좋습니다.

## 1. 아키텍처 개요 — 4-layer 분리

사용자 / 비공개 / 공개 XRPL / 오프체인 규제 4개 레이어. 각 데이터가 어디
사는지 한눈에. 자세한 설명은 [`architecture.md`](architecture.md).

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

> **source**: `docs/ko/architecture/overview.ko.md` 기반 재구성

## 2. Privacy-Preserving Proof Chain

XRPL에는 opaque hash만, 비공개 chain에는 실제 event들. `attestorDid`가 누가
무엇을 서명했는지 검증. 자세한 설명은 [`phase-4.md`](phase-4.md).

```mermaid
flowchart TD
    subgraph XRPL["XRPL public ledger"]
        TOSS_DID["did:xrpl Toss KYC issuer"]
        REFUND_DID["did:xrpl Refund operator"]
        POS_DID["did:xrpl Merchant/POS"]
        PSP_DID["did:xrpl Card/PSP"]
        CUSTOMS_DID["did:xrpl Customs"]
        SCHEMA["schemaHash"]
        TRUST["trustPolicyHash"]
        PROOF_ROOT["proofChainRoot<br/>opaque hash"]
        STATUS_ROOT["statusRoot<br/>optional Merkle root"]
    end

    subgraph REL["Private wallet relationship"]
        WALLET["Toss Foreigner Flow Wallet"]
        PEER_TAX["did:peer for tax-refund"]
        REL_ID["relationshipId rel_tax_*"]
    end

    subgraph CHAIN["Private TaxRefundProofChain"]
        E0["E0 passport_verified"]
        E1["E1 item_purchased"]
        E2["E2 tax_free_status_verified"]
        E3["E3 kiosk_refund_requested"]
        E4["E4 card_authorization_verified"]
        E5["E5 refund_operator_accepted"]
        E6["E6 customs_export_confirmed"]
        E7["E7 card_settlement_completed"]
        PRIV["Encrypted private records"]
    end

    WALLET --> PEER_TAX
    PEER_TAX --> REL_ID
    REL_ID --> E0

    TOSS_DID -. attestor .-> E0
    POS_DID -. attestor .-> E1
    REFUND_DID -. attestor .-> E2
    REFUND_DID -. attestor .-> E3
    PSP_DID -. attestor .-> E4
    REFUND_DID -. attestor .-> E5
    CUSTOMS_DID -. attestor .-> E6
    PSP_DID -. attestor .-> E7

    E0 -->|previousEventHash| E1
    E1 -->|previousEventHash| E2
    E2 -->|previousEventHash| E3
    E3 -->|previousEventHash| E4
    E4 -->|previousEventHash| E5
    E5 -->|previousEventHash| E6
    E6 -->|previousEventHash| E7

    E0 -. eventPayloadHash .-> PRIV
    E1 -. eventPayloadHash .-> PRIV
    E3 -. eventPayloadHash .-> PRIV
    E4 -. eventPayloadHash .-> PRIV
    E6 -. eventPayloadHash .-> PRIV
    E7 -. eventPayloadHash .-> PRIV

    E7 -->|latest eventHash| PROOF_ROOT
    TRUST -. authorizes signer .-> E5
    SCHEMA -. defines event shape .-> E0
```

> **source**: [`docs/privacy-preserving-proof-chain.mmd`](../docs/privacy-preserving-proof-chain.mmd)

## 3. Multi-service E0 DAG

E0 `passport_verified`가 한 번 만들어지고 여러 서비스 case가 분기. pairwise
relationship으로 격리. 자세한 설명은 [`phase-3.md`](phase-3.md),
[`phase-6.md`](phase-6.md).

```mermaid
flowchart TD
    subgraph WALLET["Toss Foreigner Flow Wallet"]
        E0["E0 passport_verified<br/>ForeignerKycCredential"]

        subgraph TAXA["Tax case A"]
            TA1["E1a item_purchased"]
            TA2["E2a tax_free_status"]
            TA3["E3a payout_done"]
        end

        subgraph TAXB["Tax case B"]
            TB1["E1b item_purchased"]
            TB2["E2b operator_accepted"]
            TB3["E3b settlement_done"]
        end

        subgraph HOTEL["Hotel case"]
            H1["E1 booking_verified"]
            H2["E2 checked_in"]
            H3["E3 checked_out"]
        end

        subgraph RENTAL["Rental case"]
            R1["E1 license_verified"]
            R2["E2 deposit_authorized"]
            R3["E3 vehicle_returned"]
        end
    end

    subgraph PAIRWISE["Pairwise off-ledger relationships"]
        P_TAX_A["did:peer tax A"]
        P_TAX_B["did:peer tax B"]
        P_HOTEL["did:peer hotel"]
        P_RENTAL["did:peer rental"]
    end

    subgraph XRPL["XRPL public ledger"]
        ORG_DIDS["Organization did:xrpl entries"]
        ROOTS["Opaque proof / status roots"]
    end

    E0 --> TA1 --> TA2 --> TA3
    E0 --> TB1 --> TB2 --> TB3
    E0 --> H1 --> H2 --> H3
    E0 --> R1 --> R2 --> R3

    P_TAX_A -. scopes A .-> TA1
    P_TAX_B -. scopes B .-> TB1
    P_HOTEL -. scopes hotel .-> H1
    P_RENTAL -. scopes rental .-> R1

    TA3 -. optional root .-> ROOTS
    TB3 -. optional root .-> ROOTS
    H3 -. optional root .-> ROOTS
    R3 -. optional root .-> ROOTS

    ORG_DIDS -. resolve keys .-> WALLET
```

> **source**: [`docs/multi-service-e0-dag.mmd`](../docs/multi-service-e0-dag.mmd)

## 4. 현행 세금환급 flow

제품이 streamline해야 할 현실의 환급 분기 — 즉시환급 / 시내 선환급 / 공항
환급. 한국 외국인 부가세 환급의 실제 절차.

```mermaid
flowchart TD
    START([외국인 고객<br/>tax-free purchase])
    START --> TYPE{구매 유형}

    TYPE -->|즉시환급| I1[POS 세액 차감 결제]
    I1 --> I2[전자판매확인서 생성]
    I2 --> IO[환급사업자/eTRS 수신]
    IO --> END_I([즉시환급 완료])

    TYPE -->|일반환급| R0[세금 포함 정상가 결제]
    R0 --> R1[환급전표/QR 발급]
    R1 --> LOC{환급 장소}

    LOC -->|시내 환급창구| D1[여권+전표 제시]
    D1 --> D2[환급사업자 검증<br/>1회 KRW 6M 이하]
    D2 --> D6[pre-refund 상태]
    D6 --> KD1[출국 시 세관 반출 확인]
    KD1 --> KD3{반출 OK?}
    KD3 -->|Yes| D_FINAL[시내 선환급 최종 확정]
    KD3 -->|No| D_FAIL[환급 취소/담보 청구]

    LOC -->|공항 환급창구| A1[공항 키오스크에서 제시]
    A1 --> A2[세관 반출 확인]
    A2 --> A3{반출 OK?}
    A3 -->|Yes| A4[환급 승인]
    A3 -->|No| A_FAIL[환급 불가]
    A4 --> A_FINAL[공항 환급 완료]
```

> **source**: [`docs/current-context/tax-refund-flow.mmd`](../docs/current-context/tax-refund-flow.mmd) 요약

## 5. 현행 세금환급 sequence

6명의 actor — 고객 / 매장 / 환급사업자 / 세관 / 국세청 / 지급파트너 — 사이의
메시지 흐름.

```mermaid
sequenceDiagram
    autonumber
    actor C as 외국인관광객
    participant S as 면세판매장
    participant O as 환급사업자/eTRS
    participant K as 세관
    participant N as 국세청
    participant P as 지급 파트너

    C->>S: 물품 구매 + 여권 제시
    S->>S: 여권 / 면세 자격 확인

    alt 즉시환급
        S->>S: 즉시환급 한도 확인
        S-->>C: 세액 차감 가격 결제
        S->>O: 즉시환급 전자판매확인서
        O->>K: 거래 연계
        S->>N: 면세매출 증빙
    else 일반환급 + 시내 선환급
        S-->>C: 정상가 결제 + 환급전표
        S->>O: 판매기록 등록
        C->>O: 여권 + 전표 제시
        O-->>C: 현금 또는 파트너 송금
        C->>K: 출국 시 반출 확인
        K-->>O: 반출 결과 통보
        O-->>S: 환급 정산
    end
```

> **source**: [`docs/current-context/tax-refund-sequence.mmd`](../docs/current-context/tax-refund-sequence.mmd) 요약
