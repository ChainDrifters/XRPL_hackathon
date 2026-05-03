# 아키텍처

이 디렉터리는 기존 `chain-structure.md`의 설계를 구현 단위로 나눈 한국어 문서입니다.

## 문서 목록

- [개요](overview.ko.md): 공개 신뢰 앵커, 역할, 온체인/오프체인 경계
- [식별자](identifiers.ko.md): Holder DID, pairwise relationship ID, event ID, private identity graph
- [자격증명](credentials.ko.md): DID 문서, DIDSet, W3C VC 스키마, XRPL Credential, Status List
- [기록 및 접근 제어](records-access.ko.md): 서비스 이벤트, 암호화 레코드 envelope, 접근 grant, VP
- [구현 흐름](implementation-flow.ko.md): Issuer/Wallet/Verifier 단계, 서비스 체크리스트, Mermaid 그래프, 발표용 문구

## 핵심 설계 원칙

XRPL에는 Issuer 신뢰 앵커, 스키마/상태 commitment, 선택적 coarse authorization metadata만 둡니다. 민감한 신원 정보와 서비스 사실은 사용자 지갑 또는 암호화된 오프체인 저장소에 두고, 사용자 동의 기반 접근 제어로만 노출합니다.
