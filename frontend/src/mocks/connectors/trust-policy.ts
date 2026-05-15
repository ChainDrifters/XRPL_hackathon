import { CONNECTORS } from './keys'
import type { Did, EventType } from '../../wallet/identity/types'

export const trustPolicy: Record<EventType, Did[]> = {
  passport_verified: [CONNECTORS.kycIssuer.did],
  item_purchased: [CONNECTORS.merchantPos.did],
  purchase_record_registered: [CONNECTORS.merchantPos.did, CONNECTORS.refundOperator.did],
  tax_free_status_verified: [CONNECTORS.refundOperator.did],
  kiosk_refund_requested: [CONNECTORS.refundOperator.did],
  immediate_refund_verified: [CONNECTORS.refundOperator.did],
  immediate_refund_completed: [CONNECTORS.merchantPos.did, CONNECTORS.refundOperator.did],
  downtown_prerefunded: [CONNECTORS.refundOperator.did],
  card_authorization_verified: [CONNECTORS.cardPsp.did],
  refund_operator_accepted: [CONNECTORS.refundOperator.did],
  customs_export_confirmed: [CONNECTORS.customs.did],
  export_failed: [CONNECTORS.customs.did],
  card_settlement_completed: [CONNECTORS.cardPsp.did],
  payout_completed: [CONNECTORS.refundOperator.did, CONNECTORS.cardPsp.did],
  refund_cancelled: [CONNECTORS.refundOperator.did, CONNECTORS.cardPsp.did],
  chargeback_claimed: [CONNECTORS.refundOperator.did, CONNECTORS.cardPsp.did],
}

export function isAuthorized(eventType: EventType, signerDid: Did): boolean {
  return trustPolicy[eventType]?.includes(signerDid) ?? false
}
