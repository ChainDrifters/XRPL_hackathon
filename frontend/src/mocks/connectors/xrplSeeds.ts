import type { ConnectorName } from './keys'

const ENV_KEY: Record<ConnectorName, string> = {
  kycIssuer: 'VITE_XRPL_SEED_KYC_ISSUER',
  refundOperator: 'VITE_XRPL_SEED_REFUND_OPERATOR',
  merchantPos: 'VITE_XRPL_SEED_MERCHANT_POS',
  cardPsp: 'VITE_XRPL_SEED_CARD_PSP',
  customs: 'VITE_XRPL_SEED_CUSTOMS',
}

export function getXrplSeed(name: ConnectorName): string {
  const env = import.meta.env as Record<string, string | undefined>
  const seed = env[ENV_KEY[name]]
  if (!seed) {
    throw new Error(
      `XRPL seed for ${name} missing. Set ${ENV_KEY[name]} in frontend/.env.local`,
    )
  }
  return seed
}

export function hasXrplSeed(name: ConnectorName): boolean {
  const env = import.meta.env as Record<string, string | undefined>
  return Boolean(env[ENV_KEY[name]])
}
