# Toss Foreigner Flow Layer

XRPL hackathon project for a passport-based workflow wallet that streamlines tax-refund, hotel, rental, and deposit flows for foreigners in Korea.

The project combines passport verification, Toss Face Pay, verifiable credentials, and XRPL trust anchors so users can prepare and track existing service workflows without exposing passport, ARC, visa, tax, hotel, rental, or license records on a public ledger.

## Documentation

- [Documentation index](docs/README.md)
- [Revised plan summary](docs/revised-plan-summary.md)
- [MVP video demo plan](docs/mvp-video-demo-plan.md)
- [Privacy-preserving proof-chain diagram](docs/privacy-preserving-proof-chain.mmd)
- [Multi-service E0 DAG diagram](docs/multi-service-e0-dag.mmd)
- [English docs](docs/en/README.md)
- [Korean docs](docs/ko/README.md)

## Phase Execution Plan

8단계 실행 계획과 Phase 0의 mock 페르소나 dataset (Korean):

- [Plan index](plan/README.md) — 8 phase 의존성 그래프 + 전체 표
- [Architecture overview](plan/architecture.md) — 4-layer 분리
- [Phase 0 — Personas](plan/phase-0.md) → [Phase 7 — Polish](plan/phase-7.md)
- [Glossary](plan/glossary.md) — 69 핵심 용어
- [Diagrams gallery](plan/diagrams.md) — 5 mermaid 다이어그램
- [Mock personas (Phase 0 산출물)](plan/personas/README.md) — 5명 dataset

## Current Scope

- XRPL DID as the public issuer trust anchor
- Pairwise relationship IDs for privacy-preserving service links
- W3C Verifiable Credentials stored in the user wallet
- Optional coarse XRPL Credentials for protocol-level authorization
- Encrypted off-chain evidence storage for regulated records
- Tax-refund assistant, hotel, rental, license verification, and deposit/escrow service flows
