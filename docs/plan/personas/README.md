# Phase 0 산출물 — Mock 신원 dataset

이 폴더는 [Phase 0](../phase-0.md) 가 정의한 산출물의 실제 구현체입니다.

## 모든 데이터는 mock입니다

```
SYNTHETIC TEST DATA — NOT A REAL PERSON / PASSPORT / RESIDENCE RECORD
```

- 여권번호 / ARC 번호 등 모든 식별자는 `MOCK-` prefix가 강제됩니다 (schema validation으로 검증).
- 얼굴 이미지는 합성 SVG placeholder (이니셜 + 국기색) — 실제 인물 사진 아님.
- 이름·주소·여권번호는 무작위 생성된 가짜 데이터.

## 폴더 구조

```text
personas/
├── README.md                ← 이 파일
├── schema/
│   ├── passport.schema.json     ← MOCK- prefix 강제
│   ├── residence.schema.json    ← isNonResident 필수
│   └── eligibility.schema.json  ← scenarios enum 강제
├── jane_doe/                ← USA · B-2 · 시내 선환급
├── wang_xiaolei/            ← CHN · C-3-1 · 즉시환급
├── sato_haruki/             ← JPN · B-1 · 공항 환급 + 렌터카
├── priya_iyer/              ← IND · D-2 · 환급 negative-case (90일+ 거주자)
└── mia_kovac/               ← HRV · D-10 · 입국 직후 시내 환급
```

각 페르소나 폴더에는 동일한 4개 파일:

| 파일 | 역할 |
|---|---|
| `passport.json` | 여권 MRZ + 기본 인적 사항 |
| `residence.json` | 비자/체류자격/입국일/`isNonResident` 플래그 |
| `eligibility.json` | 시연할 시나리오 + 환급 분류 + 지급 파트너 |
| `face.svg` | 합성 얼굴 placeholder (이니셜 + 국기색) |

## 시나리오 enum

eligibility.json 의 `scenarios` 배열은 다음 라벨을 사용합니다:

| 라벨 | 의미 |
|---|---|
| `immediate_refund` | 매장 POS에서 즉시 차감 (1회 100만원 미만 한도) |
| `downtown_pre_refund` | 일반환급의 시내 환급창구 분기 (출국 전 선환급, 반출 확인 후 확정) |
| `airport_refund` | 일반환급의 공항 환급창구 분기 (출국 시 한 번에) |
| `hotel_check_in` | 환급 외 호텔 체크인 시나리오 |
| `rental_car` | 환급 외 렌터카 신청 + 보증금 escrow |

## 5명 페르소나 매핑

| 페르소나 | 시나리오 | 지급 파트너 | 메모 |
|---|---|---|---|
| 🇺🇸 Jane Doe (B-2) | downtown_pre_refund + hotel_check_in | card_visa_mock | 미국인 단기 관광객 |
| 🇨🇳 王小雷 (C-3-1) | immediate_refund | alipay_mock | 중국인 단기 방문 |
| 🇯🇵 佐藤 春樹 (B-1) | airport_refund + rental_car | card_jcb_mock | 일본인 주말 여행 |
| 🇮🇳 Priya Iyer (D-2) | hotel_check_in + rental_car | cash_krw_account_mock | 90일+ 거주자, 환급 X |
| 🇭🇷 Mia Kovač (D-10) | downtown_pre_refund + hotel_check_in | wise_mock | 입국 직후 EU 사용자 |

## 검증 (Phase 0 acceptance criteria)

```bash
# JSON schema 검증 — ajv-cli로:
npx -y ajv-cli@5 --strict=false validate \
  -s plan/personas/schema/passport.schema.json \
  -d "plan/personas/*/passport.json"

npx -y ajv-cli@5 --strict=false validate \
  -s plan/personas/schema/residence.schema.json \
  -d "plan/personas/*/residence.json"

npx -y ajv-cli@5 --strict=false validate \
  -s plan/personas/schema/eligibility.schema.json \
  -d "plan/personas/*/eligibility.json"
```

체크리스트:
- [x] 모든 페르소나 폴더가 동일한 4개 파일 set을 가진다
- [x] 여권번호 / ARC 번호 등 모든 식별자가 `MOCK-` prefix를 가진다
- [x] 각 페르소나가 demo storyboard의 분기 중 최소 1개를 매핑한다
- [x] JSON schema validator로 각 파일이 valid함을 자동 검증할 수 있다
