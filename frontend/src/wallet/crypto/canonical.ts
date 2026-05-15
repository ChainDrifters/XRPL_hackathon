// Layer 1 — JCS-style canonical JSON serializer.
// Sorts object keys, no whitespace, deterministic across runs.
// We hash and sign over canonical JSON bytes so verifiers reproduce the same digest.

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

function stringify(value: JsonValue): string {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('non-finite number is not canonical')
    return JSON.stringify(value)
  }
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) {
    return '[' + value.map(stringify).join(',') + ']'
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value).sort()
    const parts = keys.map((k) => JSON.stringify(k) + ':' + stringify(value[k]))
    return '{' + parts.join(',') + '}'
  }
  throw new Error('unsupported value in canonical JSON')
}

export function canonicalize(value: unknown): string {
  return stringify(value as JsonValue)
}

export function canonicalBytes(value: unknown): Uint8Array {
  return new TextEncoder().encode(canonicalize(value))
}
