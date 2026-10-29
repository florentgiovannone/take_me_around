import { describe, expect, it } from "vitest"
import type { PoiseLog } from "@tma/dashboard-scope"
import {
  ADMIN_REGISTRATIONS_PATH,
  PACK_REGISTRATION_PATH,
  adminScanLabel,
  macdPackNumbersNewestFirst,
  applyContactPrefill,
  contactPrefillFromRegistration,
  latestConfirmedMacdRegistration,
  nextContactPrefillState,
  packNumberFromMacdTag,
  packsNeedingLookup,
  parseConfirmedRegistrations,
  registrationDetailFields,
  registrationForPack,
  registrationFromCache,
  registrationPhoneLabel,
  rowsFromPackCache,
  type ConfirmedRegistration,
  type PackLookupCache,
} from "./scanRegistrations"

const john: ConfirmedRegistration = {
  name: "John",
  surname: "Doe",
  email: "john@example.com",
  phoneDialCode: "+44",
  phoneNumber: "7700900123",
  phoneExtension: "12",
  company: "Analytical Engines",
  position: "Curator",
  town: "Birmingham",
  country: "United Kingdom",
  artworkSlug: "the-star-of-betlehem",
  artworkTitle: "The Star of Betlehem",
  packNumber: "001",
}

function redirect(overrides: Partial<PoiseLog> & Pick<PoiseLog, "int_id" | "text_name">): PoiseLog {
  return {
    dtm_timestamp: "2026-10-29T12:00:00Z",
    txt_uid: null,
    txt_message_type: "REDIRECTED",
    txt_message: "https://takemearound.gallery/the-star-of-bethlehem",
    ...overrides,
  }
}

describe("packNumberFromMacdTag", () => {
  it("maps canonical MACD serials to three-digit packs", () => {
    expect(packNumberFromMacdTag("MACD001")).toBe("001")
    expect(packNumberFromMacdTag("macd-1")).toBe("001")
    expect(packNumberFromMacdTag("MACD100")).toBe("100")
  })

  it("does not map other conference prefixes or unknown serials", () => {
    expect(packNumberFromMacdTag("MACF001")).toBeNull()
    expect(packNumberFromMacdTag("MACTSOB001")).toBeNull()
    expect(packNumberFromMacdTag("MACTGB101")).toBeNull()
    expect(packNumberFromMacdTag("MACD1000")).toBeNull()
    expect(packNumberFromMacdTag("The Star of Betlehem")).toBeNull()
  })
})

describe("parseConfirmedRegistrations and lookup", () => {
  it("reads confirmed rows from the admin-gated registrations path", () => {
    expect(ADMIN_REGISTRATIONS_PATH).toBe("/api/admin/registrations")
    expect(PACK_REGISTRATION_PATH).toBe("/api/pack-registration")
  })

  it("reads the GET /api/registrations body and ignores junk", () => {
    expect(parseConfirmedRegistrations({ registrations: [john] })).toEqual([john])
    expect(parseConfirmedRegistrations({ registrations: [{ name: "Ada" }] })).toEqual([])
    expect(parseConfirmedRegistrations(null)).toEqual([])
    expect(registrationForPack([john], "001")).toEqual(john)
    expect(registrationForPack([john], "002")).toBeUndefined()
  })
})

describe("admin labels and detail fields", () => {
  it("keeps the serial when there is no match and adds the name when there is", () => {
    expect(adminScanLabel("MACD001", undefined)).toBe("MACD001")
    expect(adminScanLabel("MACD001", john)).toBe("MACD001 · John Doe")
    expect(adminScanLabel("MACF001", john)).toBe("MACF001")
  })

  it("formats phone like the registration admin list", () => {
    expect(registrationPhoneLabel(john)).toBe("+44 7700900123 ext. 12")
    expect(registrationPhoneLabel({ ...john, phoneNumber: "", phoneExtension: "" })).toBe("")
  })

  it("lists registration fields for the expanded visit panel", () => {
    expect(registrationDetailFields(john)).toEqual([
      { label: "Name", value: "John" },
      { label: "Surname", value: "Doe" },
      { label: "Email", value: "john@example.com" },
      { label: "Phone", value: "+44 7700900123 ext. 12" },
      { label: "Company", value: "Analytical Engines" },
      { label: "Role within the company", value: "Curator" },
      { label: "Town", value: "Birmingham" },
      { label: "Country", value: "United Kingdom" },
      { label: "Artwork", value: "The Star of Betlehem" },
      { label: "Pack number", value: "MACD001" },
    ])
  })
})

describe("contact prefill", () => {
  it("fills name, email, and organisation and leaves message blank", () => {
    expect(contactPrefillFromRegistration(john)).toEqual({
      name: "John Doe",
      email: "john@example.com",
      organisation: "Analytical Engines",
    })
  })

  it("does not overwrite fields that already have text", () => {
    expect(
      applyContactPrefill(
        { name: "Ada", email: "", organisation: "Typed Co", message: "Hello" },
        john
      )
    ).toEqual({
      name: "Ada",
      email: "john@example.com",
      organisation: "Typed Co",
      message: "Hello",
    })
  })

  it("applies prefill once per panel open", () => {
    const empty = { name: "", email: "", organisation: "", message: "" }
    const prefilled = {
      name: "John Doe",
      email: "john@example.com",
      organisation: "Analytical Engines",
      message: "",
    }

    expect(
      nextContactPrefillState({
        contactOpen: false,
        alreadyApplied: true,
        form: prefilled,
        match: john,
      })
    ).toEqual({ applied: false, form: prefilled })

    expect(
      nextContactPrefillState({
        contactOpen: true,
        alreadyApplied: false,
        form: empty,
        match: john,
      })
    ).toEqual({ applied: true, form: prefilled })

    const clearedEmail = { ...prefilled, email: "" }
    expect(
      nextContactPrefillState({
        contactOpen: true,
        alreadyApplied: true,
        form: clearedEmail,
        match: john,
      })
    ).toEqual({ applied: true, form: clearedEmail })

    expect(
      nextContactPrefillState({
        contactOpen: true,
        alreadyApplied: false,
        form: empty,
        match: john,
      })
    ).toEqual({ applied: true, form: prefilled })
  })
})

describe("latestConfirmedMacdRegistration", () => {
  it("lists unique MACD packs newest first so the public dashboard can look up one person", () => {
    const older = redirect({
      int_id: 1,
      text_name: "MACD001",
      dtm_timestamp: "2026-10-29T12:00:00Z",
    })
    const newerUnknown = redirect({
      int_id: 2,
      text_name: "MACD199",
      dtm_timestamp: "2026-10-29T12:01:00Z",
    })
    const macf = redirect({
      int_id: 3,
      text_name: "MACF001",
      dtm_timestamp: "2026-10-29T12:02:00Z",
    })
    expect(macdPackNumbersNewestFirst([older, newerUnknown, macf])).toEqual(["199", "001"])
  })

  it("uses the most recent MACD redirect that has a confirmed pack", () => {
    const older = redirect({
      int_id: 1,
      text_name: "MACD001",
      dtm_timestamp: "2026-10-29T12:00:00Z",
    })
    const newerUnknown = redirect({
      int_id: 2,
      text_name: "MACD199",
      dtm_timestamp: "2026-10-29T12:01:00Z",
    })
    const macf = redirect({
      int_id: 3,
      text_name: "MACF001",
      dtm_timestamp: "2026-10-29T12:02:00Z",
    })
    expect(latestConfirmedMacdRegistration([older, newerUnknown, macf], [john])).toEqual(john)
    expect(latestConfirmedMacdRegistration([macf], [john])).toBeNull()
  })
})

describe("packsNeedingLookup", () => {
  const empty: PackLookupCache = {}
  const johnCache: PackLookupCache = { "001": john }
  const empty199: PackLookupCache = { "199": null }

  it("looks up MACD001 once when the cache is empty", () => {
    expect(packsNeedingLookup(["001"], empty, "untilConfirmed")).toEqual(["001"])
    expect(packsNeedingLookup(["001"], empty, "all")).toEqual(["001"])
  })

  it("requests nothing on a later poll once that pack is cached", () => {
    expect(packsNeedingLookup(["001"], johnCache, "untilConfirmed")).toEqual([])
    expect(packsNeedingLookup(["001"], johnCache, "all")).toEqual([])
    expect(packsNeedingLookup(["001"], { "001": null }, "untilConfirmed")).toEqual([])
    expect(packsNeedingLookup(["001"], { "001": null }, "all")).toEqual([])
  })

  it("requests only a newly scanned pack", () => {
    expect(packsNeedingLookup(["002", "001"], johnCache, "all")).toEqual(["002"])
  })

  it("public mode fetches the newest uncached pack and waits before older ones", () => {
    expect(packsNeedingLookup(["199", "001"], empty, "untilConfirmed")).toEqual(["199"])
    expect(packsNeedingLookup(["199", "001"], empty199, "untilConfirmed")).toEqual(["001"])
    expect(packsNeedingLookup(["199", "001"], { ...empty199, "001": john }, "untilConfirmed")).toEqual([])
  })

  it("public mode still looks up a newer uncached pack after a confirmed match", () => {
    expect(packsNeedingLookup(["002", "001"], johnCache, "untilConfirmed")).toEqual(["002"])
  })

  it("admin mode looks up the next uncached pack one at a time", () => {
    expect(packsNeedingLookup(["199", "001"], empty, "all")).toEqual(["199"])
    expect(packsNeedingLookup(["199", "001"], empty199, "all")).toEqual(["001"])
    expect(packsNeedingLookup(["199", "001"], { "199": null, "001": john }, "all")).toEqual([])
  })
})

describe("pack cache rows", () => {
  it("reads confirmed rows and ignores empty lookups", () => {
    const cache: PackLookupCache = { "001": john, "199": null }
    expect(rowsFromPackCache(cache)).toEqual([john])
    expect(registrationFromCache(cache, "001")).toEqual(john)
    expect(registrationFromCache(cache, "199")).toBeUndefined()
    expect(registrationFromCache(cache, "002")).toBeUndefined()
  })
})
