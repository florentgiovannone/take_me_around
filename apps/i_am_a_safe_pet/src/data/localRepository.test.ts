import { beforeEach, describe, expect, it } from "vitest"
import { createLocalSafePetRepository } from "./localRepository"
import {
  DEMO_OWNER_ACCOUNT_ID,
  DEMO_PET_PUBLIC_ID,
  DEMO_SEED_SCAN,
  DEMO_SEED_SCAN_ID,
} from "./seed"

function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear() {
      map.clear()
    },
    getItem(key) {
      return map.has(key) ? map.get(key)! : null
    },
    key() {
      return null
    },
    removeItem(key) {
      map.delete(key)
    },
    setItem(key, value) {
      map.set(key, value)
    },
  }
}

describe("createLocalSafePetRepository", () => {
  let storage: Storage

  beforeEach(() => {
    storage = memoryStorage()
  })

  it("returns the demo pet by publicId", async () => {
    const repo = createLocalSafePetRepository({ storage })
    const pet = await repo.getPetByPublicId(DEMO_PET_PUBLIC_ID)
    expect(pet?.name).toBe("Mochi")
  })

  it("returns null for unknown publicId", async () => {
    const repo = createLocalSafePetRepository({ storage })
    expect(await repo.getPetByPublicId("nope")).toBeNull()
  })

  it("seeds one demo scan when storage is empty", async () => {
    const repo = createLocalSafePetRepository({ storage })
    const events = await repo.listEventsForOwner(DEMO_OWNER_ACCOUNT_ID)
    expect(events).toHaveLength(1)
    expect(events[0].id).toBe(DEMO_SEED_SCAN_ID)
    expect(events[0].type).toBe("scan")
    expect(events[0].device).toBe(DEMO_SEED_SCAN.device)
    expect(events[0].tagUid).toBe(DEMO_SEED_SCAN.tagUid)
    expect(events[0].sessionId).toBe(DEMO_SEED_SCAN.sessionId)
    expect(events[0].ipAddress).toBe(DEMO_SEED_SCAN.ipAddress)
    expect(events[0].pageUrl).toContain("/pet/demo-mochi")
    expect(events[0].browser).toBeUndefined()
    expect(events[0].os).toBeUndefined()
    expect(events[0].visitorNumber).toBeUndefined()
    expect(events[0].host).toBeUndefined()
    expect(events[0].siteLabel).toBeUndefined()
    expect(events[0].android).toBeUndefined()
    expect(events[0].path).toBeUndefined()
  })

  it("records scan and found events with optional context fields", async () => {
    const repo = createLocalSafePetRepository({ storage, seedDemoScan: false })
    const pet = await repo.getPetByPublicId(DEMO_PET_PUBLIC_ID)
    expect(pet).not.toBeNull()

    await repo.recordEvent({
      petId: pet!.id,
      publicId: pet!.publicId,
      type: "scan",
      source: "page_view",
      device: "mobile",
      language: "English",
    })
    await repo.recordEvent({
      petId: pet!.id,
      publicId: pet!.publicId,
      type: "found",
      source: "finder_cta",
      device: "mobile",
      petLocation: "with_me",
      petLocationDetails: "Outside the cafe on High Street — happy to wait 20 min",
    })

    const events = await repo.listEventsForOwner(DEMO_OWNER_ACCOUNT_ID)
    expect(events).toHaveLength(2)
    expect(events[0].type).toBe("found")
    expect(events[0].petLocation).toBe("with_me")
    expect(events[0].petLocationDetails).toContain("High Street")
    expect(events[1].type).toBe("scan")
    expect(events[1].device).toBe("mobile")
  })

  it("does not duplicate the seed when events already exist", async () => {
    const repo = createLocalSafePetRepository({ storage })
    await repo.listEventsForOwner(DEMO_OWNER_ACCOUNT_ID)
    const again = createLocalSafePetRepository({ storage })
    const events = await again.listEventsForOwner(DEMO_OWNER_ACCOUNT_ID)
    expect(events.filter((e) => e.id === DEMO_SEED_SCAN_ID)).toHaveLength(1)
  })
})
