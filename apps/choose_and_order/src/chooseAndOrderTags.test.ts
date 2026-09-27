import { describe, expect, it } from "vitest"
import {
  canonicalChooseAndOrderTagName,
  canonicalMmeBettyScan,
  chooseAndOrder,
  isStoreCode,
} from "@tma/analytics-store-codes"

describe("Choose and Order tag scope", () => {
  it("keeps text names that start with CAO", () => {
    expect(canonicalChooseAndOrderTagName("CAO001")).toBe("CAO001")
    expect(canonicalChooseAndOrderTagName("cao 12")).toBe("CAO012")
    expect(canonicalChooseAndOrderTagName("CAO-3")).toBe("CAO003")
    expect(isStoreCode("choose_and_order", "CAO001")).toBe(true)
  })

  it("ignores C, CO, and other tag names", () => {
    expect(canonicalChooseAndOrderTagName("C005")).toBeNull()
    expect(canonicalChooseAndOrderTagName("CO001")).toBeNull()
    expect(canonicalChooseAndOrderTagName("CP001")).toBeNull()
    expect(canonicalChooseAndOrderTagName("CAO")).toBeNull()
    expect(isStoreCode("choose_and_order", "W001")).toBe(false)
  })

  it("includes scans that open mme-betty, including the paired seen log", () => {
    expect(canonicalMmeBettyScan("https://chooseandorder.restaurant/mme-betty")).toBe("mme-betty")
    expect(canonicalMmeBettyScan("https://takemearound.church/dashboard")).toBeNull()

    const entries = chooseAndOrder.buildActivityEntries([
      {
        int_id: 1,
        dtm_timestamp: "2026-09-27T13:42:00.000Z",
        txt_uid: "044778A2472090",
        text_name: null,
        txt_message_type: "REDIRECTED",
        txt_message: "https://chooseandorder.restaurant/mme-betty",
      },
      {
        int_id: 2,
        dtm_timestamp: "2026-09-27T13:42:00.100Z",
        txt_uid: "044778A2472090",
        text_name: null,
        txt_message_type: "SEEN",
        txt_message: "{\"REMOTE_ADDR\":\"86.136.167.23\"}",
      },
      {
        int_id: 3,
        dtm_timestamp: "2026-09-27T13:42:00.000Z",
        txt_uid: null,
        text_name: "C005",
        txt_message_type: "REDIRECTED",
        txt_message: "https://takemearound.church/dashboard",
      },
    ])

    expect(entries.map((entry) => entry.artworkTitle)).toEqual(["mme-betty"])
    expect(entries[0]?.seen).toHaveLength(1)
    expect(entries[0]?.link).toBe("https://chooseandorder.restaurant/mme-betty")
  })
})
