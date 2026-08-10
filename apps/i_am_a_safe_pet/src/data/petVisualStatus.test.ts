import { describe, expect, it } from "vitest"
import { resolvePetVisualStatus } from "./petVisualStatus"
import type { PetEvent } from "./types"

function event(partial: Pick<PetEvent, "type"> & Partial<PetEvent>): PetEvent {
  return {
    id: partial.id ?? "e1",
    petId: "pet-mochi",
    publicId: "demo-mochi",
    type: partial.type,
    createdAt: partial.createdAt ?? "2026-08-08T10:00:00.000Z",
    source: partial.source ?? (partial.type === "found" ? "finder_cta" : "page_view"),
  }
}

describe("resolvePetVisualStatus", () => {
  it("returns neutral when there are no events", () => {
    expect(resolvePetVisualStatus([])).toBe("neutral")
  })

  it("returns scanned (orange) when only scan events exist", () => {
    expect(
      resolvePetVisualStatus([
        event({ type: "scan", id: "s1", createdAt: "2026-08-08T12:00:00.000Z" }),
      ])
    ).toBe("scanned")
  })

  it("returns found (green) when a found event exists", () => {
    expect(
      resolvePetVisualStatus([
        event({ type: "found", id: "f1", createdAt: "2026-08-08T13:00:00.000Z" }),
      ])
    ).toBe("found")
  })

  it("prefers found over scan when both exist", () => {
    expect(
      resolvePetVisualStatus([
        event({ type: "scan", id: "s1", createdAt: "2026-08-08T14:00:00.000Z" }),
        event({ type: "found", id: "f1", createdAt: "2026-08-08T12:00:00.000Z" }),
      ])
    ).toBe("found")
  })
})
