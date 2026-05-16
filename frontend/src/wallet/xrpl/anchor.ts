import { Wallet, type AccountSet } from 'xrpl'
import { getClient } from './client'
import { getXrplSeed } from '../../mocks/connectors/xrplSeeds'
import { CONNECTORS, type ConnectorName } from '../../mocks/connectors/keys'

const MEMO_SCHEMA_BY_CONNECTOR: Record<ConnectorName, string> = {
  kycIssuer: 'tffl/v1/kyc-anchor',
  refundOperator: 'tffl/v1/refund-anchor',
  merchantPos: 'tffl/v1/purchase-anchor',
  cardPsp: 'tffl/v1/payment-anchor',
  customs: 'tffl/v1/customs-anchor',
}

export type AnchorResult = {
  txHash: string
  ledgerIndex: number | undefined
  account: string
  explorerTxUrl: string
  explorerAccountUrl: string
}

function strToHex(s: string): string {
  let out = ''
  for (let i = 0; i < s.length; i += 1) out += s.charCodeAt(i).toString(16).padStart(2, '0')
  return out.toUpperCase()
}

function stripHashPrefix(eventHash: string): string {
  return eventHash.startsWith('sha256:') ? eventHash.slice('sha256:'.length) : eventHash
}

export async function anchorEventHash(args: {
  connector: ConnectorName
  eventHash: string
}): Promise<AnchorResult> {
  const seed = getXrplSeed(args.connector)
  const wallet = Wallet.fromSeed(seed)
  if (wallet.classicAddress !== CONNECTORS[args.connector].account) {
    throw new Error(
      `seed for ${args.connector} derives ${wallet.classicAddress}, expected ${CONNECTORS[args.connector].account}`,
    )
  }

  const memoData = stripHashPrefix(args.eventHash).toUpperCase()
  if (!/^[0-9A-F]+$/.test(memoData)) throw new Error('eventHash must be hex')

  const client = await getClient()
  const tx: AccountSet = {
    TransactionType: 'AccountSet',
    Account: wallet.classicAddress,
    Memos: [
      {
        Memo: {
          MemoType: strToHex(MEMO_SCHEMA_BY_CONNECTOR[args.connector]),
          MemoData: memoData,
        },
      },
    ],
  }

  const prepared = await client.autofill(tx)
  const signed = wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)
  const meta = result.result.meta
  const code =
    typeof meta === 'object' && meta && 'TransactionResult' in meta
      ? (meta.TransactionResult as string)
      : 'unknown'
  if (code !== 'tesSUCCESS') throw new Error(`anchor failed: ${code}`)

  return {
    txHash: result.result.hash,
    ledgerIndex: result.result.ledger_index,
    account: wallet.classicAddress,
    explorerTxUrl: `https://testnet.xrpl.org/transactions/${result.result.hash}`,
    explorerAccountUrl: `https://testnet.xrpl.org/accounts/${wallet.classicAddress}`,
  }
}
