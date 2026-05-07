# Phase 7 — 백업·복구 데모 + 영상·IR 마무리

> **분류**: Polish · **시간**: 90분 · **사전 phase**: [P4](phase-4.md), [P5](phase-5.md), [P6](phase-6.md)
> **다음 phase**: 없음 (마지막)

## 한 줄 요약

거의 새 코드 없이, "기기 분실" 시뮬레이션 + 2~3분 영상 + IR 한 페이지 +
README를 마무리한다.

## 이 phase의 목표

처음 보는 사람이 `git clone` → `npm i` → `npm run dev` 한 번으로 영상 그대로
reproduce 가능.

## 핵심 용어

[Secure Enclave](glossary.md#secure-enclave) · [MPC](glossary.md#mpc) ·
[Crypto-Shredding](glossary.md#crypto-shredding) · [KFIP 2026](glossary.md#kfip)

## 복구 데모 — 새 페르소나로 "분실" 시뮬레이션

- 시나리오: Phase 4까지 마친 페르소나 A의 vault → encrypted blob 다운로드
- 새 브라우저 (또는 다른 페르소나 슬롯) → 같은 master key로 vault 복호화
- 결과: wallet state가 그대로 복구. event chain·VC·relationship 다 복원.
- 진짜 핵심: **Toss는 ciphertext만 보관 가능, 복호화는 사용자 키로만 가능.**

> 관련 용어: [Crypto-Shredding](glossary.md#crypto-shredding) ·
> [Envelope Encryption](glossary.md#envelope-encryption)

## 영상 storyboard (2~3분)

1. 외국인 visitor의 friction: 여권/영수증/키오스크 반복
2. Toss-style 지갑 진입: "여권 확인을 마쳤어요"
3. 구매 + 면세 자격 시뮬레이션
4. QR을 키오스크에 제시
5. 키오스크가 proof chain 검증
6. operator/customs/PSP가 각자 event 서명
7. XRPL inspector에 opaque root만 anchor
8. "잘못된 서명" 시도 → trust policy reject
9. 호텔/렌탈 재사용 preview

## IR 한 페이지 (KFIP 심사 기준 매핑)

| 심사 기준 | 어필 포인트 |
|---|---|
| 문제 정의 | 외국인 250만+ 의 반복 제출 pain point |
| XRPL 활용도 | DID + status commitment + escrow |
| 실현 가능성 | 기존 actor 대체 안 함, connector로 시작 |
| 확장성 | 세금 → 호텔 → 렌탈 → 보증금 같은 wallet 재사용 |
| 토스 시너지 | Apps in Toss / Face Pay / Toss Bank rail |

> 관련 용어: [KFIP 2026](glossary.md#kfip)

## 검증 방법

- [ ] 다른 브라우저에서 vault 복호화 → 모든 event/VC 복원
- [ ] 영상 길이 2~3분 + 9개 컷 모두 포함
- [ ] README 한 줄 명령으로 데모 진입
- [ ] IR 한 페이지가 5개 심사 기준에 매핑됨
- [ ] 법적 면책 문구 ([`docs/ko/plan.ko.md`](../docs/ko/plan.ko.md) §13) 명시
