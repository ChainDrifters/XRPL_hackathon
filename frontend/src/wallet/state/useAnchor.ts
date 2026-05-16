import { useState } from 'react'
import { useWalletStore } from './walletStore'
import type { ConnectorName } from '../../mocks/connectors/keys'
import type { ProofEvent } from '../identity/types'

type RunnerInput =
  | { kind: 'e0' }
  | {
      kind: 'event'
      connector: ConnectorName
      eventType: ProofEvent['eventType']
      serviceDomain: string
      branchId: string
      caseId: string
      payload: unknown
      bypassTrustPolicy?: boolean
    }

export function useAnchoredAction() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [latestAnchor, setLatestAnchor] = useState<ProofEvent['anchor'] | null>(null)

  async function run(input: RunnerInput): Promise<ProofEvent | null> {
    setPending(true)
    setError(null)
    try {
      const actions = useWalletStore.getState().actions
      if (input.kind === 'e0') {
        const { event } = await actions.issueE0()
        setLatestAnchor(event.anchor ?? null)
        return event
      }
      const event = await actions.recordEvent({
        connector: input.connector,
        eventType: input.eventType,
        payload: input.payload,
        branchId: input.branchId,
        caseId: input.caseId,
        serviceDomain: input.serviceDomain,
        bypassTrustPolicy: input.bypassTrustPolicy,
        anchorOnChain: true,
      })
      setLatestAnchor(event.anchor ?? null)
      return event
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      return null
    } finally {
      setPending(false)
    }
  }

  return { run, pending, error, latestAnchor }
}
