import { describe, expect, it } from "vitest"
import {
  PICKABLE_SITE_IDS,
  scopeBadgeLabel,
  scopeDomainHint,
  scopeLabel,
  scopeOptionLabel,
  scopeSubtitle,
} from "@tma/config"
import { getGalleryLogs } from "@tma/analytics-gallery"
import { getMuseumLogs } from "@tma/analytics-museum"
import {
  buildActivityEntries,
  emptyActivityMessage,
  getScopedLogs,
  sarTimelineDomainLabel,
  sarTimelineDomainSuffix,
  trackedArtworkCount,
  trackedLinksMeta,
  trackedScansAcrossMeta,
  trackedScansMeta,
} from "./index"

const monaLisa = {
  int_id: 1,
  dtm_timestamp: "2026-10-19T15:04:00.000Z",
  txt_uid: null,
  text_name: "Mona Lisa",
  txt_message_type: "REDIRECTED",
  txt_message: "https://takemearound.gallery/mona-lisa",
}
const star = {
  ...monaLisa,
  int_id: 2,
  text_name: "The Star of Betlehem",
  txt_message: "https://takemearound.gallery/the-star-of-bethlehem",
}

describe("birmingham_conference scope", () => {
  it("is labelled and stays out of the combined dashboards", () => {
    expect(scopeLabel("birmingham_conference")).toBe("Museum Association Conference")
    expect(scopeSubtitle("birmingham_conference")).toBe("Live Museum Association Conference activity")
    expect(scopeDomainHint("birmingham_conference")).toBe(
      "takemearound.gallery + takemearound.museum"
    )
    expect(scopeBadgeLabel("birmingham_conference")).toBe("Museum Association Conference")
    expect(scopeOptionLabel("birmingham_conference")).toBe("Museum Association Conference")
    expect(PICKABLE_SITE_IDS).not.toContain("birmingham_conference")
  })

  it("counts two links and hides other artworks", () => {
    expect(trackedArtworkCount("birmingham_conference")).toBe(2)
    expect(trackedArtworkCount("birmingham_conference", [
      {
        ...star,
        int_id: 3,
        text_name: "MACD001",
        txt_message: "https://example.com/macd",
      },
    ])).toBe(3)
    expect(trackedArtworkCount("birmingham_conference", [
      {
        ...star,
        int_id: 3,
        text_name: "MACD001",
        txt_message: "https://example.com/macd",
      },
      {
        ...star,
        int_id: 4,
        text_name: "MACF001",
        txt_message: "https://example.com/macf",
      },
    ])).toBe(4)
    expect(trackedScansMeta("birmingham_conference")).toBe("tracked Museum Association Conference scans")
    expect(trackedLinksMeta("birmingham_conference")).toBe(
      "of 2 tracked conference links and MACD and MACF tags"
    )
    expect(trackedScansAcrossMeta("birmingham_conference")).toBe(
      "across the two conference links and MACD and MACF tags"
    )
    expect(sarTimelineDomainLabel("birmingham_conference")).toBe("Museum Association Conference")
    expect(sarTimelineDomainSuffix("birmingham_conference")).toBe("Museum Association Conference")
    expect(emptyActivityMessage("birmingham_conference")).toBe(
      "No Museum Association Conference scans yet."
    )
    const macd = {
      ...star,
      int_id: 3,
      text_name: "MACD001",
      txt_message: "https://example.com/macd",
    }
    const macf = {
      ...star,
      int_id: 4,
      text_name: "MACF001",
      txt_message: "https://example.com/macf",
    }
    expect(
      getScopedLogs([monaLisa, star, macd, macf], "birmingham_conference").map((row) => row.int_id)
    ).toEqual([2, 3, 4])
    expect(buildActivityEntries([star], "birmingham_conference")[0]?.artworkTitle).toBe(
      "The Star of Betlehem · .gallery"
    )
    expect(getGalleryLogs([star])).toEqual([])
    expect(getMuseumLogs([star])).toEqual([])
  })
})
