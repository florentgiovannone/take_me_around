import { afterEach, describe, expect, it, vi } from "vitest"
import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"
import {
  logArtworkScan,
  mergeArtworkScans,
  readArtworkScans,
  resetArtworkScanDedupeForTests,
} from "./artworkScans"

const store = new Map<string, string>()

afterEach(() => {
  store.clear()
  resetArtworkScanDedupeForTests()
  vi.useRealTimers()
})

Object.assign(globalThis, {
  localStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
  },
})

describe("artwork scans", () => {
  it("writes one full gallery url", () => {
    logArtworkScan("the-star-of-betlehem")
    const [scan] = readArtworkScans()
    expect(scan.txt_message).toBe("https://takemearound.gallery/the-star-of-betlehem")
    expect(scan.text_name).toBe("The Star of Betlehem")
    expect(scan.txt_message_type).toBe("REDIRECTED")
  })

  it("ignores a second visit inside 1.5 seconds", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-19T15:04:00.000Z"))
    logArtworkScan("the-golden-boys")
    vi.setSystemTime(new Date("2026-10-19T15:04:01.000Z"))
    logArtworkScan("the-golden-boys")
    expect(readArtworkScans()).toHaveLength(1)
    expect(readArtworkScans()[0]?.txt_message).toBe(BIRMINGHAM_CONFERENCE_ARTWORKS[1].url)
  })

  it("reads a broken list as empty and keeps local rows when the remote list is empty", () => {
    store.set("birmingham-conference-artwork-scans", "{")
    expect(readArtworkScans()).toEqual([])
    store.clear()
    logArtworkScan("the-star-of-betlehem")
    const merged = mergeArtworkScans([])
    expect(merged).toHaveLength(1)
    expect(merged[0]?.txt_message).toBe("https://takemearound.gallery/the-star-of-betlehem")
  })
})
