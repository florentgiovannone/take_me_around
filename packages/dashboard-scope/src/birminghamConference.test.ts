import { describe, expect, it } from "vitest"
import { canonicalBirminghamTagName, isReservedSiteTagName } from "@tma/config"
import { getGalleryLogs } from "@tma/analytics-gallery"
import { getMuseumLogs } from "@tma/analytics-museum"
import {
  BIRMINGHAM_CONFERENCE_ARTWORKS,
  buildBirminghamActivityEntries,
  buildBirminghamAudienceAnalytics,
  buildBirminghamOverviewAnalytics,
  buildBirminghamSarTimelinePlot,
  buildBirminghamSarTimelineRowMetaMap,
  buildBirminghamTrackedArtworkScanGroups,
  buildBirminghamWeeklySeries,
  getBirminghamConferenceLogs,
  matchBirminghamConferenceArtwork,
} from "./birminghamConference"

const star = BIRMINGHAM_CONFERENCE_ARTWORKS[0]
const golden = BIRMINGHAM_CONFERENCE_ARTWORKS[1]

function log(id: number, message: string, name = "tag") {
  return {
    int_id: id,
    dtm_timestamp: "2026-10-19T15:04:00.000Z",
    txt_uid: null,
    text_name: name,
    txt_message_type: "REDIRECTED",
    txt_message: message,
  }
}

function seen(
  id: number,
  sar: string,
  extras: { visitor_number?: string | null; dtm_timestamp?: string } = {}
) {
  return {
    int_id: id,
    dtm_timestamp: extras.dtm_timestamp ?? "2026-10-19T15:04:00.200Z",
    txt_uid: null,
    text_name: "",
    txt_message_type: "SEEN",
    txt_message: JSON.stringify({ HTTP_COOKIE: `sar=${sar}` }),
    visitor_number: extras.visitor_number ?? null,
  }
}

describe("canonicalBirminghamTagName", () => {
  it("canonicalizes MACD, MACF, MACTSOB, and MACTGB serials and rejects other codes", () => {
    expect(canonicalBirminghamTagName("MACD001")).toBe("MACD001")
    expect(canonicalBirminghamTagName("macd-1")).toBe("MACD001")
    expect(canonicalBirminghamTagName("MACD1")).toBe("MACD001")
    expect(canonicalBirminghamTagName("MACF001")).toBe("MACF001")
    expect(canonicalBirminghamTagName("macf-1")).toBe("MACF001")
    expect(canonicalBirminghamTagName("MACF1")).toBe("MACF001")
    expect(canonicalBirminghamTagName("MACTSOB001")).toBe("MACTSOB001")
    expect(canonicalBirminghamTagName("MACTSOB1")).toBe("MACTSOB001")
    expect(canonicalBirminghamTagName("mactsob-1")).toBe("MACTSOB001")
    expect(canonicalBirminghamTagName("MACTGB001")).toBe("MACTGB001")
    expect(canonicalBirminghamTagName("MACTGB2")).toBe("MACTGB002")
    expect(canonicalBirminghamTagName("mactgb-2")).toBe("MACTGB002")
    expect(canonicalBirminghamTagName("MACD")).toBeNull()
    expect(canonicalBirminghamTagName("MACF")).toBeNull()
    expect(canonicalBirminghamTagName("MACTSOB")).toBeNull()
    expect(canonicalBirminghamTagName("MACTGB")).toBeNull()
    expect(canonicalBirminghamTagName("MACDABC")).toBeNull()
    expect(canonicalBirminghamTagName("MACFABC")).toBeNull()
    expect(canonicalBirminghamTagName("BD001")).toBeNull()
    expect(canonicalBirminghamTagName("W001")).toBeNull()
    expect(canonicalBirminghamTagName("{MACD001}")).toBeNull()
    expect(canonicalBirminghamTagName("{MACF001}")).toBeNull()
    expect(canonicalBirminghamTagName("{MACTSOB001}")).toBeNull()
    expect(isReservedSiteTagName("MACD001")).toBe(true)
    expect(isReservedSiteTagName("MACF001")).toBe(true)
    expect(isReservedSiteTagName("MACTSOB001")).toBe(true)
    expect(isReservedSiteTagName("MACTGB002")).toBe(true)
    expect(isReservedSiteTagName("BD001")).toBe(false)
    expect(isReservedSiteTagName("W001")).toBe(false)
  })
})

describe("birmingham conference urls", () => {
  it("keeps the two domain urls and labels them", () => {
    expect(matchBirminghamConferenceArtwork(star.url)?.domainLabel).toBe(".gallery")
    expect(matchBirminghamConferenceArtwork(`${golden.url}/`)?.domainLabel).toBe(".museum")
    expect(matchBirminghamConferenceArtwork(`${star.url}?src=tag#top`)?.slug).toBe(star.slug)
    expect(
      matchBirminghamConferenceArtwork("https://takemearound.gallery/the-star-of-betlehem")?.slug
    ).toBe("the-star-of-betlehem")
  })

  it("drops other sites, bare paths, and the wrong host", () => {
    const logs = [
      log(1, star.url),
      log(2, golden.url),
      log(3, "https://takemearound.gallery/mona-lisa"),
      log(4, "https://takemearound.museum/the-rosetta-stone"),
      log(5, "FD001"),
      log(6, star.path),
      log(7, "https://takemearound.museum/the-star-of-bethlehem"),
      log(8, "https://takemearound.gallery/the-golden-boys"),
    ]
    expect(getBirminghamConferenceLogs(logs).map((row) => row.int_id)).toEqual([1, 2])
  })

  it("does not treat a conference url as a gallery or museum artwork", () => {
    const logs = [log(1, star.url, "The Star of Betlehem"), log(2, golden.url)]
    expect(getGalleryLogs(logs)).toEqual([])
    expect(getMuseumLogs(logs)).toEqual([])
  })

  it("names activity rows and count groups with the domain title", () => {
    const logs = [
      log(1, star.url),
      { ...log(2, golden.url), dtm_timestamp: "2026-10-19T15:05:00.000Z" },
    ]
    expect(buildBirminghamActivityEntries(logs).map((entry) => entry.artworkTitle)).toEqual([
      "The Golden Boys · .museum",
      "The Star of Betlehem · .gallery",
    ])
    expect(buildBirminghamActivityEntries(logs).map((entry) => entry.link)).toEqual([
      golden.url,
      star.url,
    ])
    expect(buildBirminghamTrackedArtworkScanGroups(logs).map((group) => group.title).sort()).toEqual([
      "The Golden Boys · .museum",
      "The Star of Betlehem · .gallery",
    ])
  })

  it("counts only conference redirects in overview, week, audience, and timeline", () => {
    const logs = [log(1, star.url), log(2, star.url), log(3, "https://takemearound.gallery/mona-lisa")]
    const overview = buildBirminghamOverviewAnalytics(logs)
    expect(overview.totalTaps).toBe(2)
    expect(overview.topTagName).toBe("The Star of Betlehem · .gallery")
    const week = buildBirminghamWeeklySeries(
      [{ ...log(4, golden.url), dtm_timestamp: new Date().toISOString() }],
      0
    )
    expect(week.series.reduce((sum, point) => sum + point.count, 0)).toBe(1)
    const audience = buildBirminghamAudienceAnalytics(logs)
    expect(audience.hourly.reduce((sum, point) => sum + point.count, 0)).toBe(2)
    expect(audience.hasDeviceData).toBe(false)
    expect(buildBirminghamSarTimelinePlot(logs)).toBeNull()
  })
})

describe("birmingham public vs admin grouping", () => {
  it("rolls every MACTSOB serial into one public Star of Betlehem slate", () => {
    const logs = Array.from({ length: 100 }, (_, index) =>
      log(index + 1, "https://example.com/star", `MACTSOB${index + 1}`)
    )
    expect(getBirminghamConferenceLogs(logs).map((row) => row.int_id)).toHaveLength(100)
    expect(buildBirminghamActivityEntries(logs).map((entry) => entry.artworkTitle)).toEqual(
      Array(100).fill("The Star of Betlehem · .gallery")
    )
    expect(buildBirminghamTrackedArtworkScanGroups(logs).map((group) => group.title)).toEqual([
      "The Star of Betlehem · .gallery",
      "The Golden Boys · .museum",
    ])
    expect(buildBirminghamTrackedArtworkScanGroups(logs)[0]?.scans).toHaveLength(100)
    expect(buildBirminghamOverviewAnalytics(logs).totalTaps).toBe(100)
    expect(buildBirminghamOverviewAnalytics(logs).activeTags).toBe(1)
    expect(buildBirminghamOverviewAnalytics(logs).topTagName).toBe("The Star of Betlehem · .gallery")
  })

  it("lists each MACTSOB serial on the admin dashboard", () => {
    const logs = Array.from({ length: 100 }, (_, index) =>
      log(index + 1, "https://example.com/star", `MACTSOB${index + 1}`)
    )
    expect(getBirminghamConferenceLogs(logs, "admin").map((row) => row.int_id)).toHaveLength(100)
    expect(
      buildBirminghamTrackedArtworkScanGroups(logs, "admin").map((group) => group.title)
    ).toHaveLength(100)
    expect(buildBirminghamTrackedArtworkScanGroups(logs, "admin")[0]?.title).toBe("MACTSOB001")
    expect(buildBirminghamActivityEntries(logs, "admin").map((entry) => entry.artworkTitle)[99]).toBe(
      "MACTSOB100"
    )
    expect(buildBirminghamOverviewAnalytics(logs, "admin").activeTags).toBe(100)
  })

  it("rolls MACD and MACF into public artworks only when the redirect is an artwork url", () => {
    const logs = [
      log(1, star.url, "The Star of Betlehem"),
      log(2, star.url, "MACD001"),
      log(3, "https://example.com/macd", "MACD002"),
      log(4, "https://takemearound.gallery/mona-lisa", "W001"),
      log(5, "MACD", "MACD"),
      log(6, "https://example.com/macf", "MACF001"),
      log(7, golden.url, "MACF002"),
      log(8, "https://example.com/golden", "MACTGB001"),
    ]
    expect(getBirminghamConferenceLogs(logs).map((row) => row.int_id)).toEqual([1, 2, 7, 8])
    expect(buildBirminghamActivityEntries(logs).map((entry) => entry.artworkTitle)).toEqual([
      "The Star of Betlehem · .gallery",
      "The Star of Betlehem · .gallery",
      "The Golden Boys · .museum",
      "The Golden Boys · .museum",
    ])
    expect(buildBirminghamTrackedArtworkScanGroups(logs).map((group) => group.title)).toEqual([
      "The Star of Betlehem · .gallery",
      "The Golden Boys · .museum",
    ])
    expect(buildBirminghamOverviewAnalytics(logs).totalTaps).toBe(4)
    expect(buildBirminghamOverviewAnalytics(logs).activeTags).toBe(2)
    expect(getGalleryLogs([logs[1]])).toEqual([])
    expect(getMuseumLogs([logs[1]])).toEqual([])
    expect(getGalleryLogs([logs[7]])).toEqual([])
    expect(getMuseumLogs([logs[7]])).toEqual([])
  })

  it("keeps MAC serials as their own admin rows including non-artwork urls", () => {
    const logs = [
      log(1, star.url, "The Star of Betlehem"),
      log(2, star.url, "MACD001"),
      log(3, "https://example.com/macd", "MACD002"),
      log(4, "https://example.com/macf", "MACF001"),
      log(5, golden.url, "MACF002"),
      log(6, "https://example.com/golden", "MACTGB001"),
    ]
    expect(getBirminghamConferenceLogs(logs, "admin").map((row) => row.int_id)).toEqual([
      2, 3, 4, 5, 6,
    ])
    expect(buildBirminghamActivityEntries(logs, "admin").map((entry) => entry.artworkTitle)).toEqual([
      "MACD001",
      "MACD002",
      "MACF001",
      "MACF002",
      "MACTGB001",
    ])
    expect(buildBirminghamTrackedArtworkScanGroups(logs, "admin").map((group) => group.title)).toEqual([
      "MACD001",
      "MACD002",
      "MACF001",
      "MACF002",
      "MACTGB001",
    ])
    expect(buildBirminghamOverviewAnalytics(logs, "admin").totalTaps).toBe(5)
    expect(buildBirminghamOverviewAnalytics(logs, "admin").activeTags).toBe(5)
  })
})

describe("birmingham live sessions", () => {
  it("keys a public session by the visitor SAR from a nearby SEEN, not the tag text_name", () => {
    const logs = [
      log(10, star.url, "MACD001"),
      seen(11, "sar-user-1", { visitor_number: "SAR00000001" }),
    ]
    const plot = buildBirminghamSarTimelinePlot(logs)
    expect(plot?.sars).toEqual(["sar-user-1"])
    expect(plot?.points[0]?.artworkTitle).toBe("The Star of Betlehem · .gallery")
    expect(buildBirminghamActivityEntries(logs).map((entry) => entry.artworkTitle)).toEqual([
      "The Star of Betlehem · .gallery",
    ])
    expect(buildBirminghamSarTimelineRowMetaMap(logs).get("sar-user-1")?.visitorNumber).toBe(
      "SAR00000001"
    )
    expect(buildBirminghamActivityEntries(logs)[0]?.seen.map((row) => row.int_id)).toEqual([11])
  })

  it("keeps admin activity titled by the MAC serial", () => {
    const logs = [
      log(10, "https://example.com/macd", "MACD001"),
      seen(11, "sar-user-1", { visitor_number: "SAR00000001" }),
    ]
    const plot = buildBirminghamSarTimelinePlot(logs, "admin")
    expect(plot?.sars).toEqual(["sar-user-1"])
    expect(plot?.points[0]?.artworkTitle).toBe("MACD001")
    expect(buildBirminghamActivityEntries(logs, "admin").map((entry) => entry.artworkTitle)).toEqual([
      "MACD001",
    ])
  })

  it("uses the same SAR for an artwork redirect paired with a nearby SEEN", () => {
    const logs = [log(20, star.url, "The Star of Betlehem"), seen(21, "sar-user-2")]
    expect(buildBirminghamSarTimelinePlot(logs)?.sars).toEqual(["sar-user-2"])
  })

  it("pairs a SEEN that already carries the same tag text_name", () => {
    const namedSeen = {
      ...seen(31, "sar-user-3"),
      text_name: "MACD001",
    }
    const logs = [log(30, star.url, "MACD001"), namedSeen]
    expect(buildBirminghamSarTimelinePlot(logs)?.sars).toEqual(["sar-user-3"])
  })

  it("leaves unpaired redirects without a seen visit", () => {
    expect(buildBirminghamActivityEntries([log(1, star.url)])[0]?.seen).toEqual([])
  })
})
