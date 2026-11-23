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
  listDistinctSars,
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

describe("Seven Dials analytics & 4-tag slate behavior", () => {
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

  it("makes 4 physical tags on the same slate with the same text_name behave as one slate and pairs REDIRECTED + SEEN like other dashboards", () => {
    const logs = [
      // A single tap on slate SD001 triggers two of the 4 physical tags within 1 second, plus a SEEN log
      {
        int_id: 101,
        dtm_timestamp: "2026-11-23T12:00:00.100Z",
        txt_uid: "04A11101",
        text_name: "SD001",
        txt_message_type: "REDIRECTED",
        txt_message: "https://sevendials.takemearound.com/charles-boon",
      },
      {
        int_id: 102,
        dtm_timestamp: "2026-11-23T12:00:00.450Z",
        txt_uid: "04A11102",
        text_name: "SD001",
        txt_message_type: "REDIRECTED",
        txt_message: "https://sevendials.takemearound.com/charles-boon",
      },
      {
        int_id: 103,
        dtm_timestamp: "2026-11-23T12:00:00.800Z",
        txt_uid: null,
        text_name: "SD001",
        txt_message_type: "SEEN",
        txt_message: JSON.stringify({
          HTTP_USER_AGENT:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
          HTTP_ACCEPT_LANGUAGE: "en-GB,en;q=0.9",
          HTTP_COOKIE: "sar=sar_visitor_1",
          REMOTE_ADDR: "81.2.69.142",
        }),
      },
      // Later scans across the remaining two physical tags on the same SD001 slate
      {
        int_id: 104,
        dtm_timestamp: "2026-11-23T12:05:10.000Z",
        txt_uid: "04A11103",
        text_name: "SD001",
        txt_message_type: "REDIRECTED",
        txt_message: "https://sevendials.takemearound.com/charles-boon",
      },
      {
        int_id: 105,
        dtm_timestamp: "2026-11-23T12:05:11.000Z",
        txt_uid: "04A11104",
        text_name: "SD001",
        txt_message_type: "SEEN",
        txt_message: JSON.stringify({
          HTTP_USER_AGENT:
            "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/122.0.0.0 Mobile Safari/537.36",
          HTTP_ACCEPT_LANGUAGE: "fr-FR,fr;q=0.9",
          HTTP_COOKIE: "sar=sar_visitor_2",
          REMOTE_ADDR: "82.45.12.9",
        }),
      },
    ]

    // Activity: burst of 2 tags (04A11101 + 04A11102) collapsed into 1 scan, paired with SEEN (int_id 103)
    // Plus second scan (04A11103) paired with SEEN (int_id 105, even though it reported 04A11104 on same slate)
    const entries = buildActivityEntries(logs, "sevendials")
    expect(entries).toHaveLength(2)
    expect(entries[0].redirect?.txt_message_type).toBe("REDIRECTED")
    expect(entries[0].seen).toHaveLength(1)
    expect(entries[0].artworkTitle).toBe("SD001 — Charles Boon (1877–1943)")
    expect(entries[1].redirect?.txt_message_type).toBe("REDIRECTED")
    expect(entries[1].seen).toHaveLength(1)

    // Counts: all 4 hardware tags on SD001 roll into the single SD001 slate card
    const groups = buildTrackedArtworkScanGroups(logs, "sevendials")
    expect(groups).toHaveLength(1)
    expect(groups[0].path).toBe("/charles-boon")
    expect(groups[0].title).toBe("SD001 — Charles Boon (1877–1943)")
    expect(groups[0].scans).toHaveLength(2)

    // Overview: activeTags counts slates (1 active slate with scans), totalTaps = 2
    const overview = buildOverviewAnalytics(logs, "sevendials")
    expect(overview.totalTaps).toBe(2)
    expect(overview.activeTags).toBe(1)
    expect(overview.topTagName).toBe("SD001 — Charles Boon (1877–1943)")

    // Live Sessions (SAR timeline): links REDIRECTED to SEEN's sar cookie
    const sars = listDistinctSars(logs, "sevendials")
    expect(sars.sort()).toEqual(["sar_visitor_1", "sar_visitor_2"])
  })

  it("still supports local plaque scan persistence helpers", () => {
    logPlaqueScan("SD001", "/charles-boon")
    logPlaqueScan("SD001", "/charles-boon")
    logPlaqueScan("SD002", "/brian-epstein")

    const stored = readPlaqueScans()
    expect(stored).toHaveLength(2)

    const merged = mergePlaqueScans([])
    expect(merged).toHaveLength(2)
    expect(storeAnalytics("sevendials").countCodes(merged)).toBe(2)
  })
})
