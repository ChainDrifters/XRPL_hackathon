# MVP Video Demo Plan - Toss-Style Foreigner Flow

Last updated: 2026-05-04

## Goal

Build a working web demo that can be recorded as a polished video. The demo should look like a Toss mini-app experience while proving the revised architecture:

- A foreign visitor verifies passport/KYC once.
- Tax-refund events are signed by mock merchant, kiosk/refund operator, customs, and PSP actors.
- The private proof chain verifies locally.
- XRPL only receives opaque public anchors such as `proofChainRoot`, `schemaHash`, and `trustPolicyHash`.
- The same verified wallet state can branch later into hotel, rental, and escrow workflows.

The demo is not a production wallet, legal refund system, passport reader, card processor, or customs integration.

## Toss UI/UX Interpretation

This MVP follows the Apps in Toss design direction as closely as possible without relying on unavailable licensed assets.

References:

- Apps in Toss design overview: https://developers-apps-in-toss.toss.im/design/overview.html
- Mini-app branding guide: https://developers-apps-in-toss.toss.im/design/miniapp-branding-guide.html
- UX writing guide: https://developers-apps-in-toss.toss.im/design/ux-writing.html
- Dark-pattern prevention policy: https://developers-apps-in-toss.toss.im/design/consumer-ux-guide.html
- TDS overview: https://developers-apps-in-toss.toss.im/design/components.html

Design implications for the demo:

- Use a mini-app frame, not a landing page.
- Keep the first screen immediately useful: refund status, passport-ready state, and next action.
- Use TDS-like structure: top navigation, list rows, status badges, bottom CTA, simple cards, clear dividers, and restrained color.
- Use Korean UI copy in Toss-style `해요체`.
- Prefer active, positive, plain copy.
- CTA labels must say what happens next, for example `키오스크에 보여주기`, `환급 상태 확인하기`, `증명 만들기`.
- Do not show an interruptive bottom sheet on entry.
- Consent screens must have an obvious back/close path and explain what is shared before the CTA.
- If this is presented as an Apps-in-Toss partner mini-app, the brand should be clearly separated from Toss. If it is pitched as a Toss first-party concept for the Toss special award, the shell can say `토스 외국인 플로우` but should still avoid pretending that a real Toss product exists.

## Recommended Demo Form

Implement one browser app with three synchronized areas:

| Area | Purpose | Audience value |
|---|---|---|
| Phone wallet mock | Shows the Toss-style user flow | Makes the service easy to understand |
| Kiosk/operator mock | Shows the existing refund process being streamlined | Shows legal/process realism |
| Proof/XRPL inspector | Shows signatures, trust policy, hashes, and anchors | Shows why XRPL/DID matter |

For video recording, use a desktop layout:

```text
┌──────────────────┬────────────────────┬────────────────────────────┐
│ Phone Wallet     │ Kiosk / Operator   │ Proof Chain + XRPL Anchor  │
│ Toss-style app   │ refund workflow    │ technical proof panel      │
└──────────────────┴────────────────────┴────────────────────────────┘
```

The phone panel should be the visual lead. The proof panel is allowed to be more technical because it is for judges and architecture explanation.

## User Flow

### 1. Wallet Home

Phone UI:

- Title: `외국인 환급`
- Status row: `여권 확인을 마쳤어요`
- Main card: `환급 받을 수 있는 구매 내역`
- CTA: `환급 상태 확인하기`

Behind the scenes:

- Create holder wallet key.
- Create private `did:peer` relationship for the tax-refund operator.
- Create `E0 passport_verified`.
- Store passport evidence as mocked encrypted off-chain payload.

### 2. Purchase Added

Phone UI:

- Add a purchase from a mock merchant.
- Show merchant, amount, expected refund, and refund path.
- CTA: `키오스크에서 환급받기`

Behind the scenes:

- Merchant/POS mock signs `E1 item_purchased`.
- Refund connector signs `E2 tax_free_status_verified`.
- Event hashes update.

### 3. Kiosk Presentation

Phone UI:

- Show a QR-style presentation screen.
- Natural-language request copy rendered from the PE request: `환급을 위해 여권 확인 여부와 면세 구매 증명을 확인할게요`
- Short reassurance copy: `필요한 정보만 보여줄게요`
- Disclosure list:
  - `여권 확인 여부`
  - `면세 구매 증명`
  - `환급 진행 상태`
- Non-disclosure list:
  - `여권 원본 정보`
  - `카드 인증 원문`
  - `다른 서비스 이용 내역`
- CTA: `키오스크에 보여주기`

Kiosk UI:

- Shows QR received / presentation received.
- Verifies chain and displays `검증했어요`.

Behind the scenes:

- Wallet creates a selective presentation.
- Wallet renders the consent sentence from a signed, structured `consentDescriptor`.
- Kiosk verifies event signatures, chain links, and trust policy.
- Kiosk/refund operator signs `E3 kiosk_refund_requested`.

### 4. Operator Approval

Kiosk/operator UI:

- Current process step: `환급창구운영자 확인`
- CTA: `운영자 승인하기`
- Result: `환급 요청을 접수했어요`

Behind the scenes:

- Refund operator mock signs `E4 refund_operator_accepted`.

### 5. Customs Check

Kiosk/operator UI:

- Current process step: `공항 세관 확인`
- CTA: `반출 확인하기`
- Result: `세관 확인을 마쳤어요`

Behind the scenes:

- Customs connector mock signs `E5 customs_export_confirmed`.

### 6. Card Settlement

Kiosk/operator UI:

- Current process step: `카드 정산`
- CTA: `정산 완료하기`
- Result: `환급이 완료됐어요`

Behind the scenes:

- PSP/card mock signs `E6 card_settlement_completed`.
- Final `proofChainRoot` is computed.

### 7. XRPL Anchor

Proof panel:

- Display public anchor contents only:
  - `proofChainRoot`
  - `schemaHash`
  - `trustPolicyHash`
  - optional `statusRoot`
  - mock or Testnet transaction hash

Do not display user DID, event type, merchant details, kiosk number, receipt detail, card payload, or customs payload as public ledger content.

### 8. Forged Signer Demo

Add one explicit security moment:

- Button: `잘못된 서명 넣어보기`
- Action: merchant key signs a fake `customs_export_confirmed` event.
- Result: cryptographic signature is valid for the merchant key, but trust policy rejects it because merchants cannot sign customs events.

This is the clearest proof that the system checks both signature validity and actor authorization.

### 9. Future Flow Preview

Phone UI:

- Show compact rows:
  - `호텔 체크인에도 쓸 수 있어요`
  - `렌터카 보증금에도 쓸 수 있어요`

Behind the scenes:

- Do not implement full hotel/rental flows in MVP.
- Show that both would branch from the same private E0 with different `did:peer` relationships.

## Technical MVP Scope

Required:

- React/Vite/TypeScript single-page app.
- Rule-based PE consent copy renderer for Korean natural-language summaries.
- Deterministic event canonicalization using stable JSON serialization.
- SHA-256 `eventPayloadHash`.
- SHA-256 `eventHash` over canonical event envelope.
- `previousEventHash` chain validation.
- Ed25519 signatures for mock actors.
- Trust registry that maps actor DID to allowed event types.
- Local fake DID resolver for demo actors.
- Proof-chain inspector with valid/invalid states.
- XRPL anchor panel with mocked transaction by default.

Recommended libraries:

- `@noble/ed25519`
- `@noble/hashes`
- `qrcode`
- `lucide-react`
- Optional: `xrpl` for Testnet anchor if time permits.

Mock actor DIDs:

```text
did:mock:toss-kyc-issuer
did:mock:merchant-pos-001
did:mock:refund-operator-001
did:mock:customs-connector-001
did:mock:card-psp-001
```

The demo may label these as future `did:xrpl` connector identities in the proof panel, but the first implementation can resolve them from local static keys.

Consent copy renderer:

```text
signed PE request
  -> verifier DID + trust policy check
  -> allowlisted templateId + structured variables
  -> Korean consent sentence
  -> scoped VP or access grant after user approval
```

Example templates:

| Purpose | Template output |
|---|---|
| `tax_refund_kiosk_verify` | `환급을 위해 여권 확인 여부와 면세 구매 증명을 확인할게요` |
| `hotel_stay_history` | `{hotelName}에서 {nights}일 동안 머문 내역을 확인할게요` |
| `rental_deposit_check` | `렌터카 보증금 처리를 위해 면허 확인 여부와 보증금 상태를 확인할게요` |

The runtime app should not trust arbitrary vendor-provided copy. Vendors send signed structured fields such as purpose, requested scopes, service name, date range, and retention window. The wallet maps those fields to allowlisted copy templates and shows a details view with exact requested claims and withheld fields.

## Out Of Scope For MVP

- iOS Keychain / Android StrongBox.
- HSM-backed vendor or operator signing.
- Real passport NFC reading.
- Real face match.
- Real card authorization API.
- Real customs API.
- Production Toss Login.
- Production Apps-in-Toss bundle submission.
- Production XRPL mainnet account creation.

## Optional Phase 2

After the web demo works:

- Replace the simulated QR handoff with real QR scan between phone and laptop browser.
- Use a local WebSocket server for phone-to-kiosk message passing.
- Add XRPL Testnet transaction anchoring.
- Add a simple hotel/rental branch screen.
- Package as a WebView/Apps-in-Toss style app if SDK setup time is available.

Avoid starting with Capacitor. It adds camera, HTTPS, device, and deployment complexity before the core proof-chain story is visible.

## Video Storyboard

Target length: 2 to 3 minutes.

1. Show the current friction: visitor has passport, receipts, kiosk, card, and customs steps.
2. Open Toss-style phone wallet: `여권 확인을 마쳤어요`.
3. Simulate purchase and tax-free eligibility.
4. Present QR to kiosk.
5. Kiosk verifies proof chain.
6. Operator, customs, and PSP sign their events.
7. Show XRPL anchor with only opaque roots.
8. Try forged customs event and show trust-policy rejection.
9. End with hotel/rental reuse preview.

## Acceptance Criteria

- The page works from a clean install and one dev-server command.
- The demo can be run without a phone, camera, HSM, or external API.
- Every event card shows signer, short hash, signature state, and trust-policy state.
- The public XRPL panel never shows private user/event fields.
- The main phone flow uses Toss-style Korean copy and clear CTAs.
- The PE consent screen explains the request in natural Korean and also lists exact disclosed/withheld fields.
- A forged signer failure is visible in the recording.
- The final state clearly says the refund flow is complete.
