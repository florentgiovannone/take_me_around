import { describe, expect, it } from "vitest"
import { getGalleryLogs } from "@tma/analytics-gallery"
import { getMuseumLogs } from "@tma/analytics-museum"
import {
  BIRMINGHAM_CONFERENCE_ARTWORKS,
  buildBirminghamActivityEntries,
  buildBirminghamAudienceAnalytics,
  buildBirminghamOverviewAnalytics,
  buildBirminghamSarTimelinePlot,
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

describe("birmingham conference urls", () => {
  it("keeps the two domain urls and labels them", () => {
    expect(matchBirminghamConferenceArtwork(star.url)?.domainLabel).toBe(".gallery")
    expect(matchBirminghamConferenceArtwork(`${golden.url}/`)?.domainLabel).toBe(".museum")
    expect(matchBirminghamConferenceArtwork(`${star.url}?src=tag#top`)?.slug).toBe(star.slug)
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
    const logs = [log(1, star.url, "The Star of Bethlehem"), log(2, golden.url)]
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
      "The Star of Bethlehem · .gallery",
    ])
    expect(buildBirminghamActivityEntries(logs).map((entry) => entry.link)).toEqual([
      golden.url,
      star.url,
    ])
    expect(buildBirminghamTrackedArtworkScanGroups(logs).map((group) => group.title).sort()).toEqual([
      "The Golden Boys · .museum",
      "The Star of Bethlehem · .gallery",
    ])
  })

  it("counts only conference redirects in overview, week, audience, and timeline", () => {
    const logs = [log(1, star.url), log(2, star.url), log(3, "https://takemearound.gallery/mona-lisa")]
    const overview = buildBirminghamOverviewAnalytics(logs)
    expect(overview.totalTaps).toBe(2)
    expect(overview.topTagName).toBe("The Star of Bethlehem · .gallery")
    const week = buildBirminghamWeeklySeries(
      [{ ...log(4, golden.url), dtm_timestamp: new Date().toISOString() }],
      0
    )
    expect(week.series.reduce((sum, point) => sum + point.count, 0)).toBe(1)
    const audience = buildBirminghamAudienceAnalytics(logs)
    expect(audience.hourly.reduce((sum, point) => sum + point.count, 0)).toBe(2)
    expect(audience.hasDeviceData).toBe(false)
    const plot = buildBirminghamSarTimelinePlot(logs)
    expect(plot?.sars).toEqual(["The Star of Bethlehem · .gallery"])
    expect(plot?.points.every((point) => point.link === star.url)).toBe(true)
  })
})
