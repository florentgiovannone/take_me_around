import type { PetEvent } from "./types"

/** Owner dashboard glance status: found wins over scanned. */
export type PetVisualStatus = "neutral" | "scanned" | "found"

export function resolvePetVisualStatus(events: PetEvent[]): PetVisualStatus {
  if (events.some((e) => e.type === "found")) return "found"
  if (events.some((e) => e.type === "scan")) return "scanned"
  return "neutral"
}

export function labelPetVisualStatus(status: PetVisualStatus): string {
  switch (status) {
    case "found":
      return "Found"
    case "scanned":
      return "Scanned"
    default:
      return "No activity"
  }
}
