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
  text_name: "The Star of Bethlehem",
  txt_message: "https://takemearound.gallery/the-star-of-bethlehem",
}

describe("birmingham_conference scope", () => {
  it("is labelled and stays out of the combined dashboards", () => {
    expect(scopeLabel("birmingham_conference")).toBe("Birmingham Conference")
    expect(scopeSubtitle("birmingham_conference")).toBe("Live Birmingham Conference activity")
    expect(scopeDomainHint("birmingham_conference")).toBe(
      "takemearound.gallery + takemearound.museum"
    )
    expect(scopeBadgeLabel("birmingham_conference")).toBe("Birmingham Conference")
    expect(scopeOptionLabel("birmingham_conference")).toBe("Birmingham Conference")
    expect(PICKABLE_SITE_IDS).not.toContain("birmingham_conference")
  })

  it("counts two links and hides other artworks", () => {
    expect(trackedArtworkCount("birmingham_conference")).toBe(2)
    expect(trackedScansMeta("birmingham_conference")).toBe("tracked Birmingham Conference scans")
    expect(trackedLinksMeta("birmingham_conference")).toBe("of 2 tracked conference links")
    expect(trackedScansAcrossMeta("birmingham_conference")).toBe("across the two conference links")
    expect(sarTimelineDomainLabel("birmingham_conference")).toBe("Birmingham Conference")
    expect(sarTimelineDomainSuffix("birmingham_conference")).toBe("Birmingham Conference")
    expect(emptyActivityMessage("birmingham_conference")).toBe(
      "No Birmingham Conference scans yet."
    )
    expect(getScopedLogs([monaLisa, star], "birmingham_conference").map((row) => row.int_id)).toEqual([
      2,
    ])
    expect(buildActivityEntries([star], "birmingham_conference")[0]?.artworkTitle).toBe(
      "The Star of Bethlehem · .gallery"
    )
    expect(getGalleryLogs([star])).toEqual([])
    expect(getMuseumLogs([star])).toEqual([])
  })
})
