# Toss Foreigner Flow Layer - XRPL Credentials 기반 외국인 생활금융 워크플로우

> **KFIP 2026 해커톤 / 토스 특별상 출품 계획서 (한국어)**
> 최종 수정: 2026-05-04

---

## 0. 한 줄 요약

> **"여권 확인, 서비스별 자격증명, XRPL 신뢰 앵커로 외국인의 세금환급, 호텔, 렌탈, 보증금 절차를 기존 제도 안에서 더 빠르고 덜 반복적으로 만드는 Toss 내 워크플로우 레이어."**

---

## 1. 이번 리비전의 핵심

기존 문서는 "토스 온보딩/PASS 대체"에 가까운 인증 레이어로 읽혔습니다. 이번 방향은 법적 마찰을 줄이기 위해 **기존 세금환급, 호텔, 렌탈 절차를 대체하지 않고 streamlining 하는 구조**로 바꿉니다.

| 이전 톤 | 개정 톤 |
|---|---|
| PASS 대체 또는 신규 본인확인 파이프라인 | PASS가 닿지 않는 외국인 서비스 절차의 보조 경로 |
| 토스가 신원/환급/정산을 주도 | 지정 사업자, 환급창구운영사업자, 세관, 세무당국의 현행 역할 유지 |
| 세금환급 가능 여부를 자체 판정 | 환급 절차 준비 상태 점검, 서류/QR 보관, 상태 추적, 지급수단 연결 |
| 자격증명을 목적 그 자체로 제시 | 반복 제출을 줄이는 reusable proof와 audit trail로 사용 |

**원칙**: "새로운 법적 권한"을 만들지 않고, 이미 있는 절차의 입력, 동의, 증빙, 상태 확인을 정리한다.

---

## 2. 프로젝트 정체성

- **정식 명칭 (가칭)**: Toss Foreigner Flow Layer
- **내부 모듈명**: Passport Auth Layer
- **유형**: Toss 앱 안의 외국인 생활금융 워크플로우 지갑
- **1차 MVP**: 외국인 관광객 세금환급 절차 보조
- **확장 서비스**: 호텔 체크인/숙박 증빙, 렌탈 신청/면허 확인, 호텔/렌탈 보증금 escrow
- **XRPL 사용 이유**: 공개 원장에 개인정보를 올리기 위해서가 아니라, Issuer 신뢰 앵커, 스키마/상태 commitment, 선택적 settlement/escrow hash를 검증 가능하게 만들기 위해서

---

## 3. 문제 정의

### 3-1. 세금환급의 현재 흐름

새로 추가된 [tax-refund-flow.mmd](../current-context/tax-refund-flow.mmd)와 [tax-refund-sequence.mmd](../current-context/tax-refund-sequence.mmd)를 기준으로 현행 흐름은 다음 actor를 유지합니다.

| Actor | 현행 책임 | 제품이 도울 수 있는 부분 |
|---|---|---|
| 고객 / 외국인관광객 | 여권 제시, 물품 구매, 환급전표 보관, 출국 시 반출 확인 | 여권 proof 재사용, 전표/QR 보관, 체크리스트, 상태 추적 |
| 지정 면세판매장 | 여권/면세 자격 확인, 판매확인서 발급, 거래 등록 | Toss proof로 입력 반복 축소, 전자전표 wallet 전달 |
| 환급창구운영사업자 / eTRS | 거래 수신, 환급 승인/지급, 정산 증빙 | wallet presentation 검증, 지급수단 연결, 상태 event 발급 |
| 관세청 / 출국항 세관 | 국외반출 확인, 선별 검사 | 앱에서 미리 준비물 안내, 반출 확인 결과 수신 후 상태 업데이트 |
| 국세청 / 세무서 | 세무 증빙, 정산 데이터 반영 | 직접 대체하지 않음. 환급사업자/가맹점의 기존 보고 흐름 유지 |

현행 제도상 핵심 조건은 비거주 외국인 관광객, 지정 면세판매장, 대상 물품, 최소 구매금액, 3개월 내 국외반출, 미개봉/미사용 물품 확인 등입니다. 앱은 이 조건을 **보조적으로 안내**하고, 최종 판단은 현행 actor에게 남깁니다.

### 3-2. 사용자 pain point

- 매장, 시내 환급창구, 공항/항만에서 여권과 전표를 반복 제출한다.
- 종이 전표, QR, 카드 authorization, 지급 파트너 계정이 흩어진다.
- 즉시환급, 시내 선환급, 공항/항만 환급의 차이를 사용자가 이해하기 어렵다.
- 시내 선환급은 출국 시 반출 확인 실패 시 취소/청구가 가능하지만, 사용자는 상태를 명확히 보기 어렵다.
- 호텔 체크인, 렌탈 신청, 운전면허 확인, 보증금 처리도 같은 신원/자격 증빙을 반복 요구한다.

---

## 4. 해결 가설

**Toss Foreigner Flow Layer**는 외국인이 한 번 검증한 여권/얼굴/체류 관련 proof를 서비스별로 최소 공개해, 기존 절차의 반복 입력을 줄입니다.

```text
사용자 단말 / Toss 앱
  - 여권 NFC 또는 여권 OCR
  - Face Pay / liveness
  - 서비스별 wallet: tax, hotel, rental, escrow
  - 서비스 관계별 did:peer
  - 전표/QR/예약/면허 evidence 보관

Toss / Partner backend
  - proof 검증
  - 환급사업자, 호텔, 렌탈 사업자 connector
  - encrypted off-chain record store
  - consent/access grant

XRPL
  - 공개 issuer/connector DID
  - schema/trust-policy/status-list hash
  - 선택적 proofChainRoot
  - 선택적 coarse XRPL Credential
  - 선택적 escrow/payment tx hash
```

중요한 점은 세금환급 자체를 온체인화하지 않는 것입니다. 환급액, 영수증, 여권번호, 체류자격, 호텔 체류 이력, 렌탈 계약 정보는 공개 체인에 저장하지 않습니다.

### 4-1. 개정된 신원 / 원장 경계

사용자의 세금, 호텔, 렌탈, 에스크로 활동을 하나의 공개 XRPL DID에 묶지 않습니다. 사용자와 서비스 사이의 관계는 off-ledger pairwise identifier로 처리합니다.

| 레이어 | 식별자 | 저장 위치 | 목적 |
|---|---|---|---|
| 사용자 지갑 root | local holder key / `did:key` | 단말 + 암호화 백업 | 지갑 서명과 복구 제어 |
| 사용자-서비스 관계 | `did:peer` + `relationshipId` | 한 verifier와 off-chain 교환 | 서비스 간 상관분석 방지 |
| 공개 기관/사업자 신뢰 | `did:xrpl` | XRPL | issuer/connector 공개키 resolve |
| 증명 무결성 | `proofChainRoot` / `statusRoot` | XRPL opaque hash | 비공개 record가 변경되지 않았음을 증명 |

따라서 XRPL은 public PKI와 notary로 사용하고, 사용자별 event log로 사용하지 않습니다. 원장에는 event type, 사용자 DID, case ID, 영수증 상세, kiosk ID, 카드 상태, event별 timestamp를 올리지 않습니다.

### 4-2. 재사용 가능한 E0와 서비스 DAG

여권/KYC event를 구매마다 새로 만들면 UX와 privacy가 모두 나빠집니다. 지갑은 한 번만 기본 신원 anchor를 만듭니다.

```text
E0 = passport_verified / ForeignerKycCredential
```

그 다음 서비스별 proof chain이 E0에서 갈라집니다.

```text
E0 passport_verified
  ├── Tax refund chain A: E1_tax_purchase -> E2_tax_status -> E3_tax_payout
  ├── Tax refund chain B: E1_tax_purchase -> E2_tax_status -> E3_tax_payout
  ├── Hotel chain: E1_booking_verified -> E2_check_in -> E3_check_out
  └── Rental chain: E1_license_verified -> E2_deposit_authorized -> E3_vehicle_returned
```

따라서 구조는 하나의 공개 사용자 chain이 아니라 비공개 서비스 DAG입니다. 각 branch는 별도 `did:peer` 관계와 proof root를 사용합니다.

### 4-3. Presentation Exchange 기반 scope query

검증된 operator/vendor가 raw wallet data를 직접 조회하면 안 됩니다. 대신 필요한 proof를 명시한 presentation request를 보냅니다.

```text
환급사업자 요청:
  passport proof valid
  refund slip exists
  card authorization status exists

호텔 요청:
  passport proof valid
  booking belongs to this holder

렌탈 요청:
  passport proof valid
  license proof valid
  deposit authorization exists
```

지갑은 selective presentation으로만 응답하고, 무관한 chain은 숨깁니다.

사용자 동의 화면은 scope request를 자연어로 풀어서 보여줘야 합니다. 이 문장은 vendor가 임의로 보내는 문구를 그대로 쓰지 않고, 서명된 structured request를 allowlist template에 넣어 만드는 rule-based renderer로 처리합니다.

```text
signed presentation request
  -> verifier trust check
  -> allowlisted consent template
  -> natural Korean sentence
  -> 사용자 승인 후 selective presentation
```

예시:

```text
tax_refund_kiosk_verify:
  "환급을 위해 여권 확인 여부와 면세 구매 증명을 확인할게요"

hotel_stay_history:
  "{hotelName}에서 {nights}일 동안 머문 내역을 확인할게요"

rental_deposit_check:
  "렌터카 보증금 처리를 위해 면허 확인 여부와 보증금 상태를 확인할게요"
```

동의 화면에는 자연어 요약과 함께 실제 공개 필드, 숨기는 필드, 요청자 신원, 보관 기간, 만료 시간을 details view로 보여줍니다.

### 4-4. Trust Registry와 signing operation

서명만으로는 충분하지 않습니다. rogue vendor도 키를 만들고 fake event에 서명할 수 있기 때문에, verifier는 trust registry와 event-type authorization policy를 함께 확인해야 합니다.

```text
E1 item_purchased:
  allowed signer = 등록된 tax-free merchant/POS connector

E4 card_authorization_verified:
  allowed signer = 등록된 card/PSP connector

E6 customs_export_confirmed:
  allowed signer = customs connector 또는 PoC용 approved mock
```

상용 단계에서는 merchant/POS private key를 단말에 직접 두지 않습니다. POS는 merchant backend 또는 HSM-backed signing service에 서명을 요청하고, 공식 거래만 유효한 event signature를 받도록 합니다.

### 4-5. 백업과 복구

지갑은 두 가지 복구 레이어가 필요합니다.

| 레이어 | 복구 방식 |
|---|---|
| 지갑 키 | Passkey/Secure Enclave/StrongBox + cloud account recovery 또는 MPC recovery share |
| Private proof chain | 지갑 event database의 암호화 cloud backup |

백업은 사용자 지갑 키 또는 recovery key로 암호화합니다. Toss가 ciphertext를 보관할 수는 있지만, 사용자 복구 경로 또는 규제 접근 절차 없이는 private proof-chain 내용을 읽을 수 없어야 합니다.

---

## 5. 세금환급 streamlining 플로우

### 5-1. 즉시환급 branch

현행 즉시환급은 가맹점 POS와 환급창구운영사업자/eTRS가 처리합니다. Toss 앱은 다음만 담당합니다.

1. 여권 proof 또는 passport-derived holder proof 제시
2. 매장 POS가 요구하는 최소 식별정보를 사용자 동의로 전달
3. 즉시환급 전자판매확인서/거래 event를 wallet에 receipt로 저장
4. 체류기간 총액/거래 한도는 "사용자 안내 및 사전 경고"로 표시하고, 최종 승인권은 POS/환급사업자에 둠

### 5-2. 일반환급 branch

세금 포함 정상가 결제 후, 앱은 일반환급을 다음처럼 정리합니다.

| 단계 | 현행 절차 | 제품 기능 |
|---|---|---|
| 구매 직후 | 물품판매확인서, 환급전표, QR/바코드 발급 | 전표 스캔/수신, 구매 event 생성, 분실 방지 |
| 시내 환급 | 여권, 전표/QR, 물품/카드/계정 제시 | wallet presentation, 지급 파트너 계정 연결, provisional 상태 표시 |
| 출국 전 | 세관/kiosk에서 반출 확인 | 준비물 체크리스트, selected-for-inspection 안내, 미확인 리스크 경고 |
| 출국 후 | 환급 확정/취소, 정산 증빙 | 상태 event receipt, 지급 완료/실패 추적 |

### 5-3. 제품이 하지 않는 것

- 지정 면세판매장, 환급창구운영사업자, 세관, 국세청 역할을 대체하지 않는다.
- 토스가 단독으로 환급 가능 여부를 확정하지 않는다.
- 토스가 세액을 직접 산정하거나 환급금을 보관/지급한다고 주장하지 않는다.
- 공항/항만 반출 확인을 우회하지 않는다.
- 환급 내역 전체를 public chain에 올리지 않는다.

---

## 6. 호텔, 렌탈, 보증금 확장

세금환급 MVP의 구조는 호텔/렌탈에도 재사용됩니다. 핵심은 "사용자가 이미 검증한 fact를 서비스별로 최소 공개"하는 것입니다.

| 서비스 | Streamlined flow | Credential / event |
|---|---|---|
| 호텔 체크인 | 여권 재제출 축소, 예약 확인, 체크인/체크아웃 상태 receipt | `HotelGuestStatusCredential` |
| 호텔 보증금 | 카드/계정 보증금 상태, 취소/반환 event 추적 | `EscrowStatusCredential` 또는 off-chain deposit receipt |
| 렌탈 신청 | 신원/체류 유효성, 운전면허, 보증금 조건을 한 번에 제출 | `RentalEligibilityCredential`, `LicenseVerificationCredential` |
| 렌탈 보증금 | XRPL Testnet escrow로 조건부 lock/release 데모 | `EscrowStatusCredential` |

호텔 숙박 VAT 환급처럼 별도 세제 특례가 필요한 기능은 **해당 제도와 참여 사업자 확인 후 future module**로 둡니다. MVP에서는 호텔 체크인/보증금/예약 증빙 streamlining에 집중합니다.

---

## 7. 자격증명 모델

서비스별 credential은 "법적 최종 판정"이 아니라 "검증된 사실과 절차 상태의 영수증"으로 설계합니다.

| Credential | 의미 | 공개 체인 저장 |
|---|---|---|
| `ForeignerKycCredential` | 여권/얼굴/필요 시 체류 evidence가 검증됨 | 보통 아니오 |
| `TaxRefundReadinessCredential` | 환급 절차에 필요한 기본 proof와 전표가 준비됨 | 아니오 |
| `TaxRefundEventReceiptCredential` | purchase registered, pre-refunded, export confirmed, payout completed 등 상태 receipt | 아니오 |
| `HotelGuestStatusCredential` | 예약/체크인/체크아웃 상태 | 아니오 |
| `RentalEligibilityCredential` | 렌탈 신청 가능성, 체류 유효성, 위험 등급 | 아니오 |
| `LicenseVerificationCredential` | 운전면허 등 자격 확인 | 아니오 |
| `EscrowStatusCredential` | 보증금 created/funded/released/cancelled 상태 | 선택 |

XRPL native Credential은 public metadata가 노출되므로, `TaxRefundEligibleVisaD2` 같은 세부 사실 대신 `ComplianceTierA` 같은 coarse authorization에만 씁니다.

---

## 8. 해커톤 MVP 범위

### 8-1. Must

- [ ] 세금환급 현재 흐름 기반 demo journey: 즉시환급 / 시내 선환급 / 공항 환급 branch 선택
- [ ] 여권 확인 -> 구매 -> 환급상태 확인 -> kiosk/card/operator/customs/settlement로 이어지는 tax-refund proof chain UI
- [ ] 여권 OCR 또는 NFC mock + Face Pay/liveness mock
- [ ] 세금환급 connector와의 사용자 관계는 XRPL user DID가 아니라 `did:peer` pairwise 관계로 처리
- [ ] 환급전표/QR import mock
- [ ] `TaxRefundEventReceiptCredential` 발급 및 wallet 저장
- [ ] XRPL Testnet에 issuer DID 또는 status-list hash anchor
- [ ] off-chain record에는 영수증/여권/지급계정 정보를 암호화 저장하고, public chain에는 hash/commitment만 표시

### 8-2. Should

- [ ] Mock 환급창구운영사업자/eTRS connector
- [ ] 시내 선환급 provisional -> 출국 반출 확인 -> final/failed 상태 전환
- [ ] 호텔 체크인 proof와 렌탈 신청 proof의 같은 wallet 재사용 demo
- [ ] 지급 파트너 계정 선택 UI mock

### 8-3. Nice

- [ ] 여권 NFC 실제 리딩
- [ ] ZK proof: 국적/여권번호 비공개 상태로 "유효 여권" 또는 "만료 전" 증명
- [ ] XRPL Testnet escrow를 활용한 호텔/렌탈 보증금 demo
- [ ] RLUSD Testnet 결제/정산 시뮬레이션

### 8-4. 명시적 제외

- 미지정 사업자로서 세금환급업을 수행한다는 주장
- 세관 반출 확인 또는 국세청 정산을 대체한다는 주장
- 실자금 해외송금, 외국환은행 우회
- 대출, BNPL, 신용 제공
- 주민등록번호 대체 발급
- "PASS 완전 대체" 마케팅
- 개인정보 또는 거래 상세의 public-chain 저장

---

## 9. 법적/운영 포지셔닝

| 리스크 | 보수적 포지셔닝 |
|---|---|
| 세금환급업 규제 | 지정 환급사업자/가맹점/eTRS와 연동하는 assistant/connector |
| 세관 반출 확인 | 출국항 세관/kiosk의 현행 confirmation을 상태 event로 수신 |
| 개인정보 | 여권번호, 국적, 영수증 상세, 호텔/렌탈 기록은 off-chain encrypted store |
| 금융/송금 | 실자금 이동은 Toss Bank 또는 인허가 partner rail 경유 |
| 신용/여신 | MVP에서 제외 |
| Toss 특별상 적합성 | 재한/방한 외국인의 금융생활 UX를 개선하고, Toss 앱 내 PoC로 연결 가능 |

운영 문구는 조건부로 둡니다. Toss 또는 제휴사가 필요한 환급사업자 권한으로 운영하는 경우에만 Toss/partner가 환급사업자 event에 서명합니다. 그렇지 않으면 Toss는 wallet/orchestration event만 서명하고, 환급사업자 event는 인가된 partner에서 받아옵니다.

현행 세금환급에 대한 제품 문구는 다음처럼 제한합니다.

> "Toss는 외국인 사용자가 세금환급에 필요한 여권 proof, 전표, 지급수단, 출국 전 체크리스트를 한 곳에서 관리하도록 돕고, 지정 환급사업자와 세관의 기존 확인 결과를 wallet receipt로 정리합니다."

피해야 할 문구:

> "Toss가 세금환급을 승인하고 세금을 직접 돌려줍니다."

---

## 10. KFIP / 토스 특별상 심사 기준 매핑

| 심사 기준 | 대응 |
|---|---|
| 문제 정의 | 외국인이 한국에서 반복 제출하는 여권/전표/예약/면허/보증금 절차를 세금환급 중심으로 구체화 |
| XRPL 활용도 | DID, status commitment, coarse credential, optional escrow로 "공개 신뢰 앵커" 역할을 명확화 |
| 실현 가능성 | 현행 actor를 대체하지 않고 connector/assistant로 시작 |
| 확장성 | 세금환급 -> 호텔 -> 렌탈 -> 보증금으로 같은 wallet/proof 구조 재사용 |
| Toss 시너지 | Toss 앱 UX, Face Pay, Toss Bank/결제 rail, App in Toss PoC와 연결 가능 |

---

## 11. 열린 결정 사항

1. **MVP persona**: 단기 관광객 중심으로 갈지, 입국 직후 장기체류 예정 외국인까지 포함할지 결정 필요.
2. **환급사업자 연동**: 실제 API가 없으면 eTRS/refund-operator mock을 사용하고, 발표에서는 partner connector로 표현.
3. **호텔 범위**: 체크인/보증금 streamlining을 먼저 할지, 숙박 VAT 환급까지 future module로 언급할지 결정.
4. **렌탈 범위**: 차량 렌탈/부동산 렌탈 중 하나를 demo 중심으로 고정해야 함. 해커톤은 차량 렌탈이 더 구현 가능.
5. **XRPL native Credential 사용 수준**: MVP는 DID/status hash anchor 중심, native Credential은 coarse compliance tier demo로 제한.

---

## 12. 발표용 문구

- **제품**: "세금환급 절차를 새로 만들지 않고, 외국인이 이미 거쳐야 하는 절차를 Toss 안에서 한 번에 준비하고 추적하게 합니다."
- **기술**: "XRPL은 개인정보 저장소가 아니라 issuer 신뢰와 상태 commitment의 공개 앵커입니다."
- **법**: "환급사업자, 세관, 세무당국의 현행 역할은 그대로 두고, 사용자 consent와 증빙 흐름만 정리합니다."
- **확장**: "같은 wallet proof가 호텔 체크인, 렌탈 신청, 보증금 escrow로 확장됩니다."

---

## 13. 면책 고지

본 문서는 해커톤 PoC를 위한 제품/엔지니어링 계획이며 법률 자문이 아닙니다. 상용화 전에는 환급창구운영사업자, 세무/관세 전문가, 금융규제 전문가와 별도 검토가 필요합니다.
