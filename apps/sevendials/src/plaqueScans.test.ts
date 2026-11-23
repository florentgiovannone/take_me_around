import { beforeEach, describe, expect, it } from "vitest"
import {
  canonicalSevenDialsTagName,
  sevenDialsCode,
  sevenDialsDisplayTitle,
  storeAnalytics,
} from "@tma/analytics-store-codes"
import {
  buildActivityEntries,
  buildOverviewAnalytics,
  buildTrackedArtworkScanGroups,
} from "@tma/dashboard-scope"
import {
  clearPlaqueScansMemoryCache,
  logPlaqueScan,
  mergePlaqueScans,
  readPlaqueScans,
} from "./plaqueScans"

class MemoryStorage {
  private map = new Map<string, string>()
  getItem(key: string): string | null {
    return this.map.get(key) ?? null
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value)
  }
  clear(): void {
    this.map.clear()
  }
}

describe("Seven Dials analytics & local plaque scan store", () => {
  beforeEach(() => {
    const storage = new MemoryStorage()
    Object.defineProperty(globalThis, "localStorage", {
      value: storage,
      configurable: true,
      writable: true,
    })
    clearPlaqueScansMemoryCache()
  })

  it("canonicalizes SD tag codes and plaque URLs", () => {
    expect(canonicalSevenDialsTagName("SD001")).toBe("SD001")
    expect(canonicalSevenDialsTagName("sd-2")).toBe("SD002")
    expect(canonicalSevenDialsTagName("/charles-boon")).toBe("SD001")
    expect(canonicalSevenDialsTagName("https://sevendials.com/peoples-plaques/brian-epstein")).toBe(
      "SD002"
    )
    expect(sevenDialsDisplayTitle("SD001")).toBe("SD001 — Charles Boon (1877–1943)")
    expect(sevenDialsDisplayTitle("SD002")).toBe("SD002 — Brian Epstein (1934–1967)")
  })

  it("resolves sevenDialsCode from text_name or txt_message", () => {
    expect(sevenDialsCode({ text_name: "SD001", txt_message: "" })).toBe("SD001")
    expect(
      sevenDialsCode({
        text_name: "People's Plaque",
        txt_message: "https://sevendials.com/peoples-plaques/charles-boon",
      })
    ).toBe("SD001")
    expect(
      sevenDialsCode({
        text_name: null,
        txt_message: "/brian-epstein",
      })
    ).toBe("SD002")
  })

  it("records, deduplicates, and merges plaque scans into sevendials dashboard scope", () => {
    logPlaqueScan("SD001", "/charles-boon")
    logPlaqueScan("SD001", "/charles-boon")
    logPlaqueScan("SD002", "/brian-epstein")

    const stored = readPlaqueScans()
    expect(stored).toHaveLength(2)

    const merged = mergePlaqueScans([
      {
        int_id: 99,
        dtm_timestamp: new Date().toISOString(),
        txt_uid: "uid-1",
        text_name: "SD001",
        txt_message_type: "REDIRECTED",
        txt_message: "/charles-boon",
      },
    ])
    expect(merged).toHaveLength(3)

    const entries = buildActivityEntries(merged, "sevendials")
    expect(entries.length).toBeGreaterThanOrEqual(2)
    expect(entries.map((entry) => entry.artworkTitle)).toContain(
      "SD001 — Charles Boon (1877–1943)"
    )

    const groups = buildTrackedArtworkScanGroups(merged, "sevendials")
    expect(groups.map((group) => group.title)).toEqual([
      "SD001 — Charles Boon (1877–1943)",
      "SD002 — Brian Epstein (1934–1967)",
    ])

    const overview = buildOverviewAnalytics(merged, "sevendials")
    expect(overview.totalTaps).toBe(3)
    expect(overview.activeTags).toBe(2)
    expect(overview.topTagName).toBe("SD001 — Charles Boon (1877–1943)")
    expect(storeAnalytics("sevendials").countCodes(merged)).toBe(2)
  })
})
