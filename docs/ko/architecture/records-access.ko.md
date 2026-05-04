# 기록, 접근 제어, 프레젠테이션

이 문서는 서비스 이벤트 기록, 암호화된 오프체인 record envelope, holder access grant, verifiable presentation을 정의합니다.

## Service Event Record

세금 환급, 호텔 상태, 렌탈 상태, 면허 검증, 에스크로 lifecycle을 같은 이벤트 모델로 표현합니다.

```json
{
  "type": "ServiceEventRecord",
  "version": "1.0",
  "eventId": "evt_taxrefund_01J8TXA",
  "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
  "serviceDomain": "tax_refund",
  "eventType": "tax_refund_state_update",
  "status": "purchase_record_registered",
  "occurredAt": "2026-05-02T05:00:00Z",
  "actor": {
    "holderDid": "did:peer:2.taxPairwiseExample",
    "issuerDid": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR",
    "verifierDid": "did:xrpl:1:rMERCHANT_OR_REFUND_COUNTER"
  },
  "references": {
    "vcId": "urn:vc:tax-refund-event:01J8TXEVENT",
    "offchainRecordRef": "offrec_tax_claim_01J8TXA",
    "offchainRecordHash": "sha256:3bc4c1...",
    "xrplTxHash": null,
    "publicAnchorId": "anchor_tax_status_root_20260502"
  },
  "privacy": {
    "containsPersonalData": true,
    "publiclyLinkable": false,
    "defaultDisclosure": ["status", "issuerDid", "validity"],
    "restrictedDisclosure": ["merchantId", "amount", "receipt", "passportEvidence", "taxEvidence"]
  }
}
```

## Encrypted Record Envelope

DID/VC는 민감 데이터 자체가 아니라 암호화된 record를 가리키는 참조와 hash만 포함합니다.

```json
{
  "type": "EncryptedRecordEnvelope",
  "version": "1.0",
  "offchainRecordRef": "offrec_tax_claim_01J8TXA",
  "recordHash": "sha256:3bc4c1...",
  "contentAddress": "s3://private-bucket/tenant/records/offrec_tax_claim_01J8TXA.enc",
  "encryption": {
    "algorithm": "AES-256-GCM",
    "keyManagement": "envelope_encryption",
    "encryptedDataKeyForIssuer": "base64...",
    "encryptedDataKeyForHolder": "base64..."
  },
  "accessPolicy": {
    "defaultAccess": ["issuer", "holder"],
    "requiresHolderConsent": true,
    "allowedScopes": ["read_status", "read_minimal_claims", "read_full_evidence"],
    "fullEvidenceRequires": [
      "holderConsent",
      "verifierAuthentication",
      "legalBasis",
      "shortLivedAccessToken"
    ]
  },
  "audit": {
    "createdAt": "2026-05-02T05:00:00Z",
    "lastAccessedAt": null,
    "accessLogRef": "auditlog_01J8TXA"
  }
}
```

## Holder Access Grant

Verifier가 최소 presentation 이상의 정보를 요구하면, holder가 scope와 만료시간이 있는 grant에 서명합니다.

```json
{
  "type": "HolderAccessGrant",
  "version": "1.0",
  "grantId": "grant_01J8ACCESS",
  "holderDid": "did:peer:2.taxPairwiseExample",
  "verifierDid": "did:xrpl:1:rTAX_REFUND_OPERATOR_CONNECTOR",
  "issuerDid": "did:xrpl:1:rISSUER_TAX_REFUND_OPERATOR_CONNECTOR",
  "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
  "eventId": "evt_taxrefund_01J8TXA",
  "scope": ["read_status", "read_tax_refund_status_summary"],
  "deniedScope": ["read_passport_number", "read_arc_number", "read_full_visa_record"],
  "purpose": "tax_refund_processing",
  "expiresAt": "2026-05-02T06:00:00Z",
  "nonce": "n_7e92...",
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:peer:2.taxPairwiseExample#key-1",
    "proofPurpose": "authentication",
    "proofValue": "z..."
  }
}
```

접근 허용 조건:

```text
Verifier can read off-chain data only if:
  verifier DID is trusted
  + verifier request is signed
  + holder signed an access grant
  + requested scope is allowed
  + grant is not expired
  + credential is valid and not revoked
  + access is logged
```

## Presentation Request 동의 문구

Holder가 VP 또는 access grant에 서명하기 전에, wallet은 서명된 presentation request를 자연어 동의 문구로 렌더링합니다.

renderer는 rule-based입니다.

```text
purpose + requesterDisplayName + requestedSummaryFields + retention
  -> allowlisted template
  -> 자연어 동의 문장
```

request descriptor 예시:

```json
{
  "type": "ConsentDescriptor",
  "templateId": "hotel_stay_history_v1",
  "locale": "ko-KR",
  "requesterDisplayName": "XXX 호텔",
  "requestedSummaryFields": [
    "숙박 기간",
    "체크아웃 완료 여부"
  ],
  "withheldSummaryFields": [
    "여권번호",
    "카드 원문",
    "다른 호텔 이용 내역"
  ],
  "variables": {
    "hotelName": "XXX 호텔",
    "nights": 5
  },
  "retention": "session_only"
}
```

렌더링 문구:

```text
XXX 호텔에서 5일 동안 머문 내역을 확인할게요
```

규칙:

- vendor가 보내는 임의의 최종 문구를 그대로 렌더링하지 않습니다.
- allowlist에 있는 `templateId`만 사용합니다.
- 동의 CTA를 보여주기 전에 requester DID와 request signature를 검증합니다.
- details view에는 실제 공개 필드와 숨기는 필드를 보여줍니다.
- 생성된 문구와 signed descriptor를 local audit log에 저장합니다.

## Verifiable Presentation

사용자가 호텔, 상점, 렌탈 사업자, 에스크로 서비스에 보내는 기본 형태입니다.

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vp:01J8VP",
  "type": ["VerifiablePresentation"],
  "holder": "did:peer:2.rentalPairwiseExample",
  "verifiableCredential": [
    {
      "id": "urn:vc:rental-eligibility:01J8RENT",
      "type": ["VerifiableCredential", "RentalEligibilityCredential"],
      "issuer": "did:xrpl:1:rISSUER_RENTAL_PLATFORM",
      "credentialSubject": {
        "id": "did:peer:2.rentalPairwiseExample",
        "relationshipId": "rel_rental_X8mw21",
        "claims": {
          "rentalEligible": true,
          "licenseVerified": true,
          "residenceStatusChecked": true
        }
      }
    }
  ],
  "presentationSubmission": {
    "requestedPurpose": "rental_application",
    "disclosedFields": ["rentalEligible", "licenseVerified", "residenceStatusChecked"],
    "withheldFields": ["passportNumber", "arcNumber", "visaType", "licenseNumber", "nationality"]
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:peer:2.rentalPairwiseExample#key-1",
    "proofPurpose": "authentication",
    "challenge": "verifier_nonce_abc123",
    "domain": "rental.example.com",
    "proofValue": "z..."
  }
}
```

## 기본 공개 정책

- 기본 presentation은 yes/no claim, validity, issuer DID, status만 공개합니다.
- passport number, ARC number, visa type, license number, nationality는 기본 공개하지 않습니다.
- 상세 증거는 holder grant + verifier authentication + legal basis + short-lived token이 모두 있을 때만 접근합니다.
- 모든 접근은 audit log에 남깁니다.
