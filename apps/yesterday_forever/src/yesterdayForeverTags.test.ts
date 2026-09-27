import { describe, expect, it } from "vitest"
import {
  canonicalYesterdayForeverTagName,
  isStoreCode,
  yesterdayForever,
} from "@tma/analytics-store-codes"

describe("Yesterday Forever tag scope", () => {
  it("keeps text names that start with YF", () => {
    expect(canonicalYesterdayForeverTagName("YF001")).toBe("YF001")
    expect(canonicalYesterdayForeverTagName("yf 12")).toBe("YF012")
    expect(canonicalYesterdayForeverTagName("YF-3")).toBe("YF003")
    expect(isStoreCode("yesterday_forever", "YF001")).toBe(true)
  })

  it("ignores names that do not start with YF", () => {
    expect(canonicalYesterdayForeverTagName("Y001")).toBeNull()
    expect(canonicalYesterdayForeverTagName("CAO001")).toBeNull()
    expect(canonicalYesterdayForeverTagName("PV001")).toBeNull()
    expect(canonicalYesterdayForeverTagName("YF")).toBeNull()
    expect(isStoreCode("yesterday_forever", "W001")).toBe(false)
  })

  it("builds activity only from YF text names", () => {
    const entries = yesterdayForever.buildActivityEntries([
      {
        int_id: 1,
        dtm_timestamp: "2026-09-27T13:42:00.000Z",
        txt_uid: "044778A2472090",
        text_name: "YF001",
        txt_message_type: "REDIRECTED",
        txt_message: "https://yesterdayforever.example/watch",
      },
      {
        int_id: 2,
        dtm_timestamp: "2026-09-27T13:42:00.000Z",
        txt_uid: "044778A2472091",
        text_name: "CAO001",
        txt_message_type: "REDIRECTED",
        txt_message: "https://chooseandorder.restaurant/mme-betty",
      },
    ])

    expect(entries.map((entry) => entry.artworkTitle)).toEqual(["YF001"])
  })
})
