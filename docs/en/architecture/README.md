# Architecture

This directory contains the build-level architecture split from the original chain structure draft.

## Pages

- [Overview](overview.en.md): public trust anchor, participant roles, and on-chain/off-chain boundaries
- [Identifiers](identifiers.en.md): holder DID, pairwise relationship IDs, event IDs, and private identity graph
- [Credentials](credentials.en.md): DID documents, DIDSet, W3C VC schemas, native XRPL Credentials, and status lists
- [Records and access](records-access.en.md): service event records, encrypted envelopes, holder access grants, and VPs
- [Implementation flow](implementation-flow.en.md): issuer/wallet/verification build phases, service checklist, Mermaid graph, and pitch wording

## Design Rule

XRPL stores issuer trust anchors, schema/status commitments, and optional coarse authorization metadata. Sensitive identity and service facts stay in the user wallet or encrypted off-chain stores under consent-based access control.
