import { encryptJson, decryptJson } from './encrypted'
import { putRaw, getRaw, listRaw, deleteRaw, type StoreName } from './db'

export async function put<T>(store: StoreName, key: string, value: T): Promise<void> {
  await putRaw(store, key, await encryptJson(value))
}

export async function get<T>(store: StoreName, key: string): Promise<T | undefined> {
  const env = await getRaw(store, key)
  return env ? decryptJson<T>(env) : undefined
}

export async function list<T>(store: StoreName): Promise<T[]> {
  const envs = await listRaw(store)
  return Promise.all(envs.map((e) => decryptJson<T>(e)))
}

export async function remove(store: StoreName, key: string): Promise<void> {
  await deleteRaw(store, key)
}
