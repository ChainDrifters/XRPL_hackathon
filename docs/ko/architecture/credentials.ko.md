# DID 및 자격증명 모델

이 문서는 Issuer DID, DIDSet, W3C Verifiable Credential, XRPL native Credential, revocation/status 구조를 정의합니다.

## DID 문서 원칙

DID 문서에는 검증 재료와 공개 service endpoint만 넣습니다.

넣어도 되는 정보:

- Issuer public key
- assertion/authentication verification method
- schema endpoint
- status-list endpoint
- trust metadata endpoint

넣으면 안 되는 정보:

```json
{
  "passportNumber": "M12345678",
  "visaType": "D-2",
  "arcNumber": "123456-1234567",
  "taxRefundHistory": "https://..."
}
```

## Issuer DID 문서 예시

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:xrpl:1:rISSUER_TOSS_KYC",
  "verificationMethod": [
    {
      "id": "did:xrpl:1:rISSUER_TOSS_KYC#key-1",
      "type": "JsonWebKey2020",
      "controller": "did:xrpl:1:rISSUER_TOSS_KYC",
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "P-256",
        "x": "BASE64URL_X",
        "y": "BASE64URL_Y"
      }
    }
  ],
  "assertionMethod": ["did:xrpl:1:rISSUER_TOSS_KYC#key-1"],
  "authentication": ["did:xrpl:1:rISSUER_TOSS_KYC#key-1"],
  "service": [
    {
      "id": "did:xrpl:1:rISSUER_TOSS_KYC#schemas",
      "type": "CredentialSchemaService",
      "serviceEndpoint": "https://issuer.example.com/.well-known/vc-schemas"
    },
    {
      "id": "did:xrpl:1:rISSUER_TOSS_KYC#status",
      "type": "CredentialStatusService",
      "serviceEndpoint": "https://issuer.example.com/status-lists"
    }
  ]
}
```

## XRPL DIDSet

XRPL `DIDSet`은 DID entry를 생성 또는 갱신합니다. `Data`, `DIDDocument`, `URI` 중 최소 하나가 필요합니다.

```json
{
  "TransactionType": "DIDSet",
  "Account": "rISSUER_TOSS_KYC",
  "Fee": "10",
  "Sequence": 391,
  "URI": "68747470733a2f2f6973737565722e6578616d706c652e636f6d2f6469642f746f73732e6a736f6e",
  "Data": "",
  "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020"
}
```

권장: `DIDSet.Data`에는 개인정보를 넣지 말고, DID 문서 URI 또는 공개 issuer metadata reference만 저장합니다.

## Credential Taxonomy

하나의 "foreigner credential"에 모든 사실을 넣지 않습니다. 서비스별로 별도 credential type을 둡니다.

| Credential | 목적 | 공개 체인 저장 |
|---|---|---|
| `ForeignerKycCredential` | 신원 및 외국인/체류 상태 검증 | 보통 아니오 |
| `TaxRefundEligibilityCredential` | 세금 환급 가능성 증명 | 보통 아니오 |
| `HotelGuestStatusCredential` | 예약/체크인/체크아웃 상태 증명 | 보통 아니오 |
| `RentalEligibilityCredential` | 렌탈 신청 가능성, 체류 유효성 증명 | 보통 아니오 |
| `LicenseVerificationCredential` | 운전면허 등 자격 검증 | 보통 아니오 |
| `EscrowStatusCredential` | 에스크로 created/funded/released/cancelled 증명 | 선택 |
| `ServiceEventReceiptCredential` | 이벤트 receipt를 relationship ID에 연결 | 아니오 |

## 기본 VC 구조

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemas.example.com/korea-foreigner-finance/v1"
  ],
  "id": "urn:vc:tax-refund-eligibility:01J8TAX123",
  "type": ["VerifiableCredential", "TaxRefundEligibilityCredential"],
  "issuer": "did:xrpl:1:rISSUER_TAX_REFUND",
  "validFrom": "2026-05-01T00:00:00Z",
  "validUntil": "2026-12-31T23:59:59Z",
  "credentialSubject": {
    "id": "did:xrpl:1:rHOLDER_PAIRWISE_TAX",
    "relationshipId": "rel_tax_2vBq9F7L8Qx3mZpT",
    "claims": {
      "taxRefundEligible": true,
      "eligibilityJurisdiction": "KR",
      "minDisclosureMode": "eligible_only"
    }
  },
  "credentialStatus": {
    "type": "BitstringStatusListEntry",
    "statusPurpose": "revocation",
    "statusListIndex": "39201",
    "statusListCredential": "https://issuer.example.com/status-lists/tax-refund-2026"
  },
  "evidence": {
    "type": "IssuerInternalEvidence",
    "evidenceRef": "offrec_tax_eligibility_01J8...",
    "evidenceHash": "sha256:c40e0f...",
    "accessPolicy": "issuer-only-unless-holder-grants"
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rISSUER_TAX_REFUND#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

## Native XRPL Credential 사용 범위

XRPL native Credential은 공개 metadata를 포함합니다. 따라서 세부 tax, visa, hotel, rental, license 사실을 직접 표현하지 말고 coarse authorization에만 사용합니다.

나쁜 예:

```text
ForeignResidentTaxRefundEligibleVisaD2
```

나은 예:

```text
ComplianceTierA
```

```json
{
  "LedgerEntryType": "Credential",
  "Subject": "rHOLDER_PAIRWISE_OR_SERVICE_ACCOUNT",
  "Issuer": "rISSUER_TOSS_KYC",
  "CredentialType": "436f6d706c69616e63655469657241",
  "Expiration": 875664000,
  "URI": "68747470733a2f2f6973737565722e6578616d706c652e636f6d2f76632f636f6d706c69616e63652d746965722d61"
}
```

## Status / Revocation

Revocation은 공개적으로 individual user를 노출하지 않도록 status list 또는 Merkle commitment로 처리합니다.

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/vc/status-list/2021/v1"
  ],
  "id": "https://issuer.example.com/status-lists/tax-refund-2026",
  "type": ["VerifiableCredential", "BitstringStatusListCredential"],
  "issuer": "did:xrpl:1:rISSUER_TAX_REFUND",
  "credentialSubject": {
    "id": "https://issuer.example.com/status-lists/tax-refund-2026#list",
    "type": "BitstringStatusList",
    "statusPurpose": "revocation",
    "encodedList": "H4sIAAAAA..."
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:xrpl:1:rISSUER_TAX_REFUND#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

선택적으로 XRPL에는 status list hash 또는 Merkle root만 anchor합니다.

---

## References

- [W3C DID Core](https://www.w3.org/TR/did-core/)
- [W3C VC Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/)
- [W3C Bitstring Status List](https://www.w3.org/TR/vc-bitstring-status-list/)
- [XRPL DIDSet](https://xrpl.org/docs/references/protocol/transactions/types/didset)
- [XRPL Credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials)
