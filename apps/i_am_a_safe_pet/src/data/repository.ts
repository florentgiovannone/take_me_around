import { createLocalSafePetRepository } from "./localRepository"
import type { SafePetRepository } from "./types"

let singleton: SafePetRepository | null = null

export function getSafePetRepository(): SafePetRepository {
  if (!singleton) singleton = createLocalSafePetRepository()
  return singleton
}

/** Test helper */
export function __resetSafePetRepositoryForTests(): void {
  singleton = null
}
