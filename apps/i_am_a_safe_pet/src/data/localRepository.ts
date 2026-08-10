import { DEMO_PETS, DEMO_SEED_SCAN } from "./seed"
import type { PetEvent, PetProfile, SafePetRepository } from "./types"

const EVENTS_KEY = "tma-safe-pet-events-v1"

export type LocalRepoOptions = {
  storage?: Storage
  pets?: PetProfile[]
  now?: () => Date
  createId?: () => string
  /** When true (default), empty storage gets the demo seed scan. */
  seedDemoScan?: boolean
}

function readEvents(storage: Storage): PetEvent[] {
  try {
    const raw = storage.getItem(EVENTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PetEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeEvents(storage: Storage, events: PetEvent[]): void {
  storage.setItem(EVENTS_KEY, JSON.stringify(events))
}

function toStoredEvent(
  input: Omit<PetEvent, "id" | "createdAt"> & { createdAt?: string; id?: string },
  id: string,
  createdAt: string
): PetEvent {
  return {
    id,
    petId: input.petId,
    publicId: input.publicId,
    type: input.type,
    source: input.source,
    createdAt,
    userAgent: input.userAgent,
    device: input.device,
    language: input.language,
    pageUrl: input.pageUrl,
    referrer: input.referrer,
    sessionId: input.sessionId,
    tagUid: input.tagUid,
    ipAddress: input.ipAddress,
    petLocation: input.petLocation,
    petLocationDetails: input.petLocationDetails,
  }
}

export function createLocalSafePetRepository(
  options: LocalRepoOptions = {}
): SafePetRepository {
  const pets = options.pets ?? DEMO_PETS
  const storage =
    options.storage ??
    (typeof localStorage !== "undefined" ? localStorage : undefined)
  const memoryFallback: PetEvent[] = []
  const now = options.now ?? (() => new Date())
  const createId = options.createId ?? (() => crypto.randomUUID())
  const seedDemoScan = options.seedDemoScan !== false

  function loadEvents(): PetEvent[] {
    if (!storage) return [...memoryFallback]
    return readEvents(storage)
  }

  function saveEvents(events: PetEvent[]): void {
    if (!storage) {
      memoryFallback.length = 0
      memoryFallback.push(...events)
      return
    }
    writeEvents(storage, events)
  }

  function ensureSeed(): void {
    if (!seedDemoScan) return
    const events = loadEvents()
    if (events.length > 0) return
    saveEvents([DEMO_SEED_SCAN])
  }

  ensureSeed()

  return {
    async getPetByPublicId(publicId) {
      return pets.find((p) => p.publicId === publicId) ?? null
    },
    async listPetsForOwner(ownerAccountId) {
      return pets.filter((p) => p.ownerAccountId === ownerAccountId)
    },
    async listEventsForPet(petId) {
      ensureSeed()
      return loadEvents()
        .filter((e) => e.petId === petId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    async listEventsForOwner(ownerAccountId) {
      ensureSeed()
      const ownedIds = new Set(
        pets.filter((p) => p.ownerAccountId === ownerAccountId).map((p) => p.id)
      )
      return loadEvents()
        .filter((e) => ownedIds.has(e.petId))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    async recordEvent(input) {
      ensureSeed()
      const event = toStoredEvent(
        input,
        input.id ?? createId(),
        input.createdAt ?? now().toISOString()
      )
      const next = [event, ...loadEvents()]
      saveEvents(next)
      return event
    },
  }
}
