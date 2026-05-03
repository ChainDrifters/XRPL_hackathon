# 식별자 모델

이 문서는 identity, relationship, transaction/event를 분리하는 방법을 정의합니다.

## 식별자 계층

```text
Holder DID
  └── private identity graph
        ├── tax_refund relationship ID
        │     ├── tax refund event 1
        │     └── tax refund event 2
        ├── hotel relationship ID
        │     ├── hotel stay event 1
        │     └── hotel stay event 2
        ├── rental relationship ID
        │     ├── rental application event
        │     ├── license verification event
        │     └── rental escrow event
        └── escrow relationship ID
              ├── escrow created
              ├── escrow funded
              ├── escrow released
              └── escrow cancelled
```

## 식별자 타입

| 식별자 | 예시 | 공개 범위 | 목적 |
|---|---|---|---|
| `holderDid` | `did:xrpl:1:rHOLDER...` | 비공개 또는 선택 공개 | 사용자 지갑의 root identity controller |
| `issuerDid` | `did:xrpl:1:rISSUER...` | 공개 | Verifier가 발급자 키와 신뢰 정보를 검증 |
| `verifierDid` | `did:xrpl:1:rHOTEL...` | 공개 또는 partner registry | 증명을 요청하는 서비스 식별 |
| `relationshipId` | `rel_tax_01J8...` | 비공개 또는 pairwise | 한 서비스 도메인 안에서 여러 이벤트 연결 |
| `eventId` | `evt_taxrefund_01J8...` | 승인된 당사자에게만 공유 | 단일 환급, 호텔, 렌탈, 면허, 에스크로 이벤트 식별 |
| `publicAnchorId` | `anchor_7b0c2c...` | 공개 | XRPL에 올린 hash/Merkle commitment 식별 |
| `offchainRecordId` | `offrec_01J8...` | 비공개 | Issuer/Toss 내부 record lookup |

## Relationship ID 파생

동일 사용자가 세금, 호텔, 렌탈, 에스크로에서 자동 상관분석되지 않도록 pairwise ID를 사용합니다.

```text
relationshipSecret = HKDF(holderMasterSecret, verifierDid || serviceDomain)

relationshipId = base64url(
  HMAC-SHA256(
    relationshipSecret,
    serviceDomain || ":" || verifierDid || ":" || holderDid
  )
)
```

효과:

```text
동일 사용자 + 동일 verifier + 동일 service domain
  -> 안정적인 relationship ID

동일 사용자 + 다른 verifier/service domain
  -> 다른 relationship ID
```

즉, 세금 환급 사업자는 같은 사용자의 여러 세금 환급 이벤트를 연결할 수 있지만, 호텔 사업자는 그 사용자의 세금 환급 이력을 자동으로 알 수 없습니다.

## Private Identity Graph

사용자 지갑은 서비스별 relationship과 credential/event를 비공개 graph로 관리합니다.

```json
{
  "type": "PrivateIdentityGraph",
  "version": "1.0",
  "identityGraphId": "igr_01J8ROOT",
  "holderDid": "did:xrpl:1:rHOLDER_CORE",
  "walletAccountId": "toss_wallet_user_opaque_123",
  "serviceRelationships": [
    {
      "serviceDomain": "tax_refund",
      "verifierDid": "did:xrpl:1:rTAX_OPERATOR",
      "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
      "pairwiseHolderDid": "did:xrpl:1:rHOLDER_PAIRWISE_TAX",
      "credentials": ["urn:vc:tax-refund-eligibility:01J8TAX123"],
      "events": ["evt_taxrefund_01J8TXA", "evt_taxrefund_01J8TXB"]
    },
    {
      "serviceDomain": "rental",
      "verifierDid": "did:xrpl:1:rRENTAL_PLATFORM",
      "relationshipId": "rel_rental_X8mw21",
      "pairwiseHolderDid": "did:xrpl:1:rHOLDER_PAIRWISE_RENTAL",
      "credentials": ["urn:vc:rental-eligibility:01J8RENT"],
      "events": ["evt_rental_application_01J8R1", "evt_license_check_01J8L1"]
    }
  ],
  "security": {
    "storage": "encrypted_wallet_plus_encrypted_cloud_backup",
    "linkageVisibility": "holder_and_authorized_services_only"
  }
}
```

## 구현 규칙

- `holderMasterSecret`은 단말 보안 영역 또는 MPC custody 경계 밖으로 노출하지 않습니다.
- `relationshipId`는 서버가 임의 생성하지 않고, 지갑 또는 holder-controlled key material에서 파생합니다.
- Verifier는 자기 도메인의 pairwise ID만 볼 수 있어야 합니다.
- 여러 서비스 도메인 간 linkage는 사용자가 명시 동의한 경우에만 허용합니다.
- 로그에는 전역 holder DID 대신 relationship ID 또는 opaque event ID를 기록합니다.
