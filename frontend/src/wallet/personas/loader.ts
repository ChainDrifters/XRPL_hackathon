import type { Persona, PassportJson, ResidenceJson, EligibilityJson } from './types'

const passports = import.meta.glob<{ default: PassportJson }>(
  '@personas/*/passport.json',
  { eager: true },
)
const residences = import.meta.glob<{ default: ResidenceJson }>(
  '@personas/*/residence.json',
  { eager: true },
)
const eligibilities = import.meta.glob<{ default: EligibilityJson }>(
  '@personas/*/eligibility.json',
  { eager: true },
)
const faces = import.meta.glob<string>(
  '@personas/*/face.svg',
  { eager: true, query: '?url', import: 'default' },
)

const ID_REGEX = /\/personas\/([^/]+)\//

function personaIdFromPath(path: string): string {
  const match = ID_REGEX.exec(path)
  if (!match) throw new Error(`cannot parse persona id from ${path}`)
  return match[1]
}

export function listPersonas(): Persona[] {
  const ids = new Set<string>()
  for (const p of Object.keys(passports)) ids.add(personaIdFromPath(p))
  return [...ids].sort().map((id) => loadPersona(id))
}

export function loadPersona(id: string): Persona {
  const passportEntry = Object.entries(passports).find(([p]) => personaIdFromPath(p) === id)
  const residenceEntry = Object.entries(residences).find(([p]) => personaIdFromPath(p) === id)
  const eligibilityEntry = Object.entries(eligibilities).find(([p]) => personaIdFromPath(p) === id)
  const faceEntry = Object.entries(faces).find(([p]) => personaIdFromPath(p) === id)
  if (!passportEntry || !residenceEntry || !eligibilityEntry || !faceEntry) {
    throw new Error(`persona ${id} is missing one or more files`)
  }
  return {
    id,
    passport: passportEntry[1].default,
    residence: residenceEntry[1].default,
    eligibility: eligibilityEntry[1].default,
    faceSvgUrl: faceEntry[1],
  }
}

export const HERO_PERSONA_ID = 'jane_doe'
