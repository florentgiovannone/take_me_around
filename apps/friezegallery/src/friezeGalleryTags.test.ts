import { describe, expect, it } from "vitest"
import {
  canonicalFriezeGalleryTagName,
  friezeGallery,
  isStoreCode,
} from "@tma/analytics-store-codes"

describe("Frieze Gallery tag scope", () => {
  it("keeps text names that start with FG", () => {
    expect(canonicalFriezeGalleryTagName("FG001")).toBe("FG001")
    expect(canonicalFriezeGalleryTagName("fg 12")).toBe("FG012")
    expect(canonicalFriezeGalleryTagName("FG-3")).toBe("FG003")
    expect(isStoreCode("frieze_gallery", "FG001")).toBe(true)
  })

  it("ignores names that do not start with FG", () => {
    expect(canonicalFriezeGalleryTagName("F001")).toBeNull()
    expect(canonicalFriezeGalleryTagName("YF001")).toBeNull()
    expect(canonicalFriezeGalleryTagName("FG")).toBeNull()
    expect(isStoreCode("frieze_gallery", "YF001")).toBe(false)
  })

  it("builds activity only from FG text names", () => {
    const entries = friezeGallery.buildActivityEntries([
      {
        int_id: 1,
        dtm_timestamp: "2026-10-06T13:42:00.000Z",
        txt_uid: "044778A2472090",
        text_name: "FG001",
        txt_message_type: "REDIRECTED",
        txt_message: "https://friezegallery.example/visit",
      },
      {
        int_id: 2,
        dtm_timestamp: "2026-10-06T13:42:00.000Z",
        txt_uid: "044778A2472091",
        text_name: "YF001",
        txt_message_type: "REDIRECTED",
        txt_message: "https://yesterdayforever.example/watch",
      },
    ])

    expect(entries.map((entry) => entry.artworkTitle)).toEqual(["FG001"])
  })
})
