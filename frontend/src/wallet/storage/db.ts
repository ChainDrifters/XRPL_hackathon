import { openDB, type IDBPDatabase } from 'idb'
import type { EncryptedEnvelope } from './encrypted'

const DB_NAME = 'tffl-wallet'
const DB_VERSION = 1

export type StoreName = 'holders' | 'relationships' | 'events' | 'credentials' | 'vault' | 'checkpoints'

type Schema = {
  holders: { key: string; value: EncryptedEnvelope }
  relationships: { key: string; value: EncryptedEnvelope }
  events: { key: string; value: EncryptedEnvelope }
  credentials: { key: string; value: EncryptedEnvelope }
  vault: { key: string; value: EncryptedEnvelope }
  checkpoints: { key: string; value: EncryptedEnvelope }
}

let cached: Promise<IDBPDatabase> | null = null

export function db(): Promise<IDBPDatabase> {
  if (!cached) {
    cached = openDB(DB_NAME, DB_VERSION, {
      upgrade(database) {
        for (const store of [
          'holders',
          'relationships',
          'events',
          'credentials',
          'vault',
          'checkpoints',
        ] as const) {
          if (!database.objectStoreNames.contains(store)) {
            database.createObjectStore(store)
          }
        }
      },
    })
  }
  return cached
}

export async function putRaw<S extends StoreName>(
  store: S,
  key: string,
  value: Schema[S]['value'],
): Promise<void> {
  const d = await db()
  await d.put(store, value, key)
}

export async function getRaw<S extends StoreName>(
  store: S,
  key: string,
): Promise<Schema[S]['value'] | undefined> {
  const d = await db()
  return d.get(store, key) as Promise<Schema[S]['value'] | undefined>
}

export async function listRaw<S extends StoreName>(store: S): Promise<Schema[S]['value'][]> {
  const d = await db()
  return d.getAll(store) as Promise<Schema[S]['value'][]>
}

export async function deleteRaw(store: StoreName, key: string): Promise<void> {
  const d = await db()
  await d.delete(store, key)
}

export async function clearAll(): Promise<void> {
  const d = await db()
  for (const store of [
    'holders',
    'relationships',
    'events',
    'credentials',
    'vault',
    'checkpoints',
  ] as const) {
    await d.clear(store)
  }
}
