import { describe, expect, it } from "vitest"
import {
  canonicalFriezeGalleryTagName,
  friezeGallery,
  isStoreCode,
} from "@tma/analytics-store-codes"

describe("Frieze Gallery tag scope", () => {
  it("keeps text names that start with FD, FCI, FO, FSFT, or FSWIF", () => {
    expect(canonicalFriezeGalleryTagName("FD001")).toBe("FD001")
    expect(canonicalFriezeGalleryTagName("fci 12")).toBe("FCI012")
    expect(canonicalFriezeGalleryTagName("FO-3")).toBe("FO003")
    expect(canonicalFriezeGalleryTagName("FSFT001")).toBe("FSFT001")
    expect(canonicalFriezeGalleryTagName("fswif 4")).toBe("FSWIF004")
    expect(isStoreCode("frieze_gallery", "FO001")).toBe(true)
  })

  it("ignores names outside those prefixes", () => {
    expect(canonicalFriezeGalleryTagName("FG001")).toBeNull()
    expect(canonicalFriezeGalleryTagName("F001")).toBeNull()
    expect(canonicalFriezeGalleryTagName("YF001")).toBeNull()
    expect(canonicalFriezeGalleryTagName("FO")).toBeNull()
    expect(canonicalFriezeGalleryTagName("FSFT")).toBeNull()
    expect(isStoreCode("frieze_gallery", "FG001")).toBe(false)
  })

  it("builds activity only from those text names", () => {
    const entries = friezeGallery.buildActivityEntries([
      {
        int_id: 1,
        dtm_timestamp: "2026-10-06T13:42:00.000Z",
        txt_uid: "044778A2472090",
        text_name: "FSWIF001",
        txt_message_type: "REDIRECTED",
        txt_message: "https://friezegallery.example/visit",
      },
      {
        int_id: 2,
        dtm_timestamp: "2026-10-06T13:42:00.000Z",
        txt_uid: "044778A2472091",
        text_name: "FG001",
        txt_message_type: "REDIRECTED",
        txt_message: "https://friezegallery.example/old",
      },
    ])

    expect(entries.map((entry) => entry.artworkTitle)).toEqual(["FSWIF001"])
  })
})
