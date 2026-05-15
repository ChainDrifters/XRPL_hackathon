import type { Did } from '../../wallet/identity/types'

export type ConnectorIdentity = {
  did: Did
  account: string
  publicKeyHex: string
  privateKeyHex: string
}

export const CONNECTORS = {
  kycIssuer: {
    did: 'did:xrpl:1:rs2arM5YhTAXspjgd7RbnefFLsoRTVgRRw',
    account: 'rs2arM5YhTAXspjgd7RbnefFLsoRTVgRRw',
    publicKeyHex: '7069b0b797082bbbbff574c00137227d7e59e7eb3341390ccd5cbe1e57a2a567',
    privateKeyHex: '963e6012ce79ebc570cf6bb264ba8950ba5d218c57a6a263550e1c75d66b7a88',
  },
  refundOperator: {
    did: 'did:xrpl:1:rN9VBtbAgAv8CjTZx6rFNRxr96BD2au6Sa',
    account: 'rN9VBtbAgAv8CjTZx6rFNRxr96BD2au6Sa',
    publicKeyHex: 'd268e77efefaeca8b09cac3526eeb7bceb4b9f748730ea8d95dea4bc2ec8923a',
    privateKeyHex: 'f25e2173d2079b39c6ced7d3470ed739f4d4db6ec6171dc08128ec94175b51c4',
  },
  merchantPos: {
    did: 'did:xrpl:1:rJnbbeEYSTWYbRVqKh3zzMeNeQACeaNsMN',
    account: 'rJnbbeEYSTWYbRVqKh3zzMeNeQACeaNsMN',
    publicKeyHex: 'c09f8f10fc46f68a5ba0c4213fe45ee9d0260f5aa0ec2193161636e0d1b970dc',
    privateKeyHex: '28dd10601e2052993335b1a69401c1b105931b2bde9b5ed851228e74c759df03',
  },
  cardPsp: {
    did: 'did:xrpl:1:rfcfLzansLLhHhmTzEFVxdoGyz5DZSbsGS',
    account: 'rfcfLzansLLhHhmTzEFVxdoGyz5DZSbsGS',
    publicKeyHex: 'e33fa373ccfd532a2ce21b1b34f2e75a9ec90cabf820fef7f1997b88aa2faf0f',
    privateKeyHex: '7e75454690a40275a62b07d54664dbfaf40b9f017b8d7aa6fa9f3d47e794aa4d',
  },
  customs: {
    did: 'did:xrpl:1:rsFeK7dYfoYbeXA7pbi9Nfk1jYCfxp4w9K',
    account: 'rsFeK7dYfoYbeXA7pbi9Nfk1jYCfxp4w9K',
    publicKeyHex: 'a6ce1db3c33856f7ca73fbb4078ee707900dfa416b79b01649bc53673a05bb47',
    privateKeyHex: '7f6749df778815f4200aa2d01277a5f9659a940e204d919c70c69b80f03f7541',
  },
} as const satisfies Record<string, ConnectorIdentity>

export type ConnectorName = keyof typeof CONNECTORS
