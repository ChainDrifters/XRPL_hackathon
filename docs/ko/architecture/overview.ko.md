# 체인 아키텍처 개요

이 문서는 XRPL을 어떤 정보의 공개 신뢰 앵커로 쓰고, 어떤 정보는 사용자 지갑 또는 오프체인 보관소에 남겨야 하는지 정의합니다.

## 핵심 결정

XRPL DID는 **Issuer의 공개 신뢰 앵커**로 사용합니다. 단, 한 사용자의 모든 활동을 하나의 영구 공개 DID에 직접 묶지 않습니다.

```text
사용자-facing 레이어:
  Toss Identity Wallet

비공개 신원 레이어:
  Holder DID
  Private identity graph
  서비스별 relationship ID
  Verifiable Credentials

공개 XRPL 레이어:
  Issuer DID
  공개 검증키
  스키마 참조
  Status-list commitment
  선택적 coarse Credential 객체
  선택적 escrow/payment tx hash

오프체인 규제 레이어:
  여권 / ARC / 비자 증거
  세금 환급 증거
  호텔 예약 기록
  렌탈 계약 기록
  면허 검증 기록
  에스크로 case file
```

설계 이유는 단순합니다. DID 문서와 XRPL ledger entry는 공개 조회될 수 있으므로, 여권번호, ARC 번호, 비자 유형, 호텔 체류 이력, 세금 환급 이력 같은 개인정보를 넣으면 안 됩니다.

## 역할

| 역할 | 책임 | 보유 데이터 |
|---|---|---|
| Holder | 외국인 사용자 | 지갑 키, VC, relationship ID, consent decision |
| Issuer | 현실 세계 사실을 검증하고 VC 발급 | Issuer DID, 서명키, schema, status list, 민감 증거 |
| Verifier | 사용자에게 증명을 요청 | proof request, issuer trust check, status check |
| XRPL | 공개 신뢰 및 선택적 결제/에스크로 레이어 | DID anchor, 공개키 참조, schema/status commitment |
| Off-chain store | 규제/민감 데이터 보관 | 원본 증거, 암호화 record, 접근 로그 |

## 온체인 / 오프체인 경계

| 객체 | XRPL 저장 | 오프체인 저장 | 사용자 지갑 저장 | 원칙 |
|---|---:|---:|---:|---|
| Issuer DID | 예 | 선택 | 아니오 | 공개 신뢰 앵커 |
| Issuer 공개키 | 예 / DID 문서 | 선택 | 아니오 | VC 검증용 |
| Holder DID | 선택 | 예 | 예 | 공개 재사용 지양 |
| 전체 VC | 보통 아니오 | 선택 암호화 백업 | 예 | 사용자 통제 |
| 여권 / ARC / 비자 원본 | 아니오 | 예 | 아니오 또는 암호화 사본 | 민감정보 |
| 세금 환급 상세 | 아니오 | 예 | 선택 receipt | 금융/상점 정보 |
| 호텔/렌탈/면허 상세 | 아니오 | 예 | VC 또는 receipt | 위치/주거/자격 정보 |
| 에스크로 tx hash | 필요 시 예 | 예 | 예 | 공개 hash도 linkability 주의 |
| Status-list root | 예 | 예 | 아니오 | privacy-preserving validity check |

## 공개 체인에 올려도 되는 정보

- Issuer DID
- Issuer public key reference
- schema hash 또는 URI
- status-list hash 또는 Merkle root
- coarse credential type
- escrow tx hash
- payment settlement tx hash

## 공개 체인에 올리면 안 되는 정보

- 여권번호
- ARC 번호
- 비자 유형
- 국적, 단 꼭 필요한 경우는 별도 privacy review
- 세금 환급 영수증 상세
- 호텔 체류 상세
- 렌탈 계약 상세
- 면허번호
- 전체 VC payload

## 설계 문장

> XRPL은 Issuer identity, credential schema integrity, revocation/status commitment의 공개 신뢰 앵커다. 사용자의 Toss Identity Wallet은 VC와 pairwise relationship ID를 비공개로 저장하고, 민감 문서와 거래 기록은 사용자 동의 기반 접근 제어가 걸린 오프체인 저장소에 둔다.

---

## References

- [XRPL DID](https://xrpl.org/docs/concepts/decentralized-storage/decentralized-identifiers)
- [XRPL Credential](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/credential)
