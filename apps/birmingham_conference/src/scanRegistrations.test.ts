import { describe, expect, it } from "vitest"
import type { PoiseLog } from "@tma/dashboard-scope"
import {
  ADMIN_REGISTRATIONS_PATH,
  PACK_REGISTRATION_PATH,
  adminScanLabel,
  filterLogsByUtcDay,
  macdPackNumbersNewestFirst,
  applyContactPrefill,
  contactPrefillFromRegistration,
  latestBoothArtwork,
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

  it("maps paired Star of Betlehem slates to the matching MACD pack", () => {
    expect(packNumberFromMacdTag("MACTSOB001")).toBe("001")
    expect(packNumberFromMacdTag("mactsob-1")).toBe("001")
    expect(packNumberFromMacdTag("MACTSOB050")).toBe("050")
    expect(packNumberFromMacdTag("MACTSOB100")).toBe("100")
  })

  it("maps paired Golden Boys slates to MACD packs 101-200", () => {
    expect(packNumberFromMacdTag("MACTGB001")).toBe("101")
    expect(packNumberFromMacdTag("mactgb-1")).toBe("101")
    expect(packNumberFromMacdTag("MACTGB050")).toBe("150")
    expect(packNumberFromMacdTag("MACTGB100")).toBe("200")
  })

  it("does not map other conference prefixes or unknown serials", () => {
    expect(packNumberFromMacdTag("MACF001")).toBeNull()
    expect(packNumberFromMacdTag("MACTSOB101")).toBeNull()
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
    expect(parseConfirmedRegistrations({ registrations: [{ ...john, email: "" }] })).toEqual([
      { ...john, email: "" },
    ])
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
    expect(adminScanLabel("MACTSOB001", john)).toBe("MACTSOB001 · John Doe")
    expect(adminScanLabel("MACTGB001", john)).toBe("MACTGB001")
    expect(adminScanLabel("MACF001", john)).toBe("MACF001")
  })

  it("names a Golden Boys slate scan from the paired MACD pack", () => {
    const ada: ConfirmedRegistration = { ...john, name: "Ada", surname: "Lovelace", packNumber: "101" }
    expect(adminScanLabel("MACTGB001", ada)).toBe("MACTGB001 · Ada Lovelace")
    expect(adminScanLabel("MACD101", ada)).toBe("MACD101 · Ada Lovelace")
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

  it("treats paired artwork slates as the same packs as their dashboard cards", () => {
    const starSlate = redirect({
      int_id: 1,
      text_name: "MACTSOB001",
      dtm_timestamp: "2026-10-29T12:00:00Z",
    })
    const goldenSlate = redirect({
      int_id: 2,
      text_name: "MACTGB001",
      dtm_timestamp: "2026-10-29T12:01:00Z",
    })
    expect(macdPackNumbersNewestFirst([starSlate, goldenSlate])).toEqual(["101", "001"])
    expect(latestConfirmedMacdRegistration([goldenSlate, starSlate], [john])).toEqual(john)
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

describe("filterLogsByUtcDay", () => {
  const first = redirect({
    int_id: 1,
    text_name: "MACD001",
    dtm_timestamp: "2026-11-01T20:09:00.000Z",
  })
  const second = redirect({
    int_id: 2,
    text_name: "MACD002",
    dtm_timestamp: "2026-10-31T23:00:00.000Z",
  })
  const third = redirect({
    int_id: 3,
    text_name: "MACD003",
    dtm_timestamp: "2026-10-30T12:00:00.000Z",
  })

  it("keeps only logs on the selected GMT calendar day", () => {
    expect(filterLogsByUtcDay([first, second], { from: "2026-11-01", to: "2026-11-01" }).map((log) => log.int_id)).toEqual([1])
    expect(filterLogsByUtcDay([first, second], { from: "2026-10-31", to: "2026-10-31" }).map((log) => log.int_id)).toEqual([2])
  })

  it("keeps logs from and to inclusive GMT calendar days", () => {
    expect(
      filterLogsByUtcDay([first, second, third], { from: "2026-10-31", to: "2026-11-01" }).map((log) => log.int_id)
    ).toEqual([1, 2])
    expect(
      filterLogsByUtcDay([first, second, third], { from: "2026-10-30", to: "2026-10-31" }).map((log) => log.int_id)
    ).toEqual([2, 3])
  })

  it("swaps an inverted range so from and to still include the days in between", () => {
    expect(
      filterLogsByUtcDay([first, second, third], { from: "2026-11-01", to: "2026-10-31" }).map((log) => log.int_id)
    ).toEqual([1, 2])
  })

  it("returns every log when no range is selected", () => {
    expect(filterLogsByUtcDay([first, second], { from: null, to: null })).toEqual([first, second])
  })
})

describe("latestBoothArtwork", () => {
  it("returns the newest redirected booth tag and canonicalizes MACTGB99", () => {
    const olderStar = redirect({
      int_id: 1,
      text_name: "MACTSOB100",
      dtm_timestamp: "2026-11-01T12:00:00Z",
    })
    const newerGolden = redirect({
      int_id: 2,
      text_name: "MACTGB99",
      dtm_timestamp: "2026-11-01T12:01:00Z",
      txt_message: "https://takemearound.museum/the-golden-boys",
    })
    expect(latestBoothArtwork([olderStar, newerGolden])).toEqual({
      code: "MACTGB099",
      title: "The Golden Boys",
      url: "https://takemearound.museum/the-golden-boys",
    })
    expect(latestBoothArtwork([olderStar])).toEqual({
      code: "MACTSOB100",
      title: "The Star of Betlehem",
      url: "https://takemearound.gallery/the-star-of-bethlehem",
    })
  })

  it("reads the code from txt_message when text_name is not a booth tag", () => {
    const fromMessage = redirect({
      int_id: 1,
      text_name: "The Star of Betlehem",
      txt_message: "mactsob-100",
    })
    expect(latestBoothArtwork([fromMessage])?.code).toBe("MACTSOB100")
  })

  it("ignores other tags, non-redirects, and missing timestamps", () => {
    const otherStar = redirect({ int_id: 1, text_name: "MACTSOB001" })
    const macd = redirect({ int_id: 2, text_name: "MACD001" })
    const seen = redirect({
      int_id: 3,
      text_name: "MACTSOB100",
      txt_message_type: "SEEN",
    })
    const untimed = redirect({
      int_id: 4,
      text_name: "MACTGB099",
      dtm_timestamp: "",
    })
    expect(latestBoothArtwork([otherStar, macd, seen, untimed])).toBeNull()
  })

  it("treats TSN002 as The Starry Night and TK002 as The Kiss", () => {
    const starryNight = redirect({
      int_id: 1,
      text_name: "TSN002",
      dtm_timestamp: "2026-11-01T12:00:00Z",
    })
    const kiss = redirect({
      int_id: 2,
      text_name: "tk-2",
      dtm_timestamp: "2026-11-01T12:01:00Z",
      txt_message: "https://takemearound.gallery/the-kiss",
    })
    expect(latestBoothArtwork([starryNight])).toEqual({
      code: "TSN002",
      title: "The Starry Night",
      url: "https://takemearound.gallery/the-starry-night",
    })
    expect(latestBoothArtwork([starryNight, kiss])).toEqual({
      code: "TK002",
      title: "The Kiss",
      url: "https://takemearound.gallery/the-kiss",
    })
  })

  it("returns the same artwork URL when the newest booth tag has not changed", () => {
    const first = redirect({
      int_id: 1,
      text_name: "MACTSOB100",
      dtm_timestamp: "2026-11-01T12:00:00Z",
    })
    const sameAgain = redirect({
      int_id: 2,
      text_name: "MACTSOB100",
      dtm_timestamp: "2026-11-01T12:02:00Z",
    })
    const firstMatch = latestBoothArtwork([first])
    const secondMatch = latestBoothArtwork([first, sameAgain])
    expect(firstMatch?.url).toBe(secondMatch?.url)
    expect(firstMatch?.url).toBe("https://takemearound.gallery/the-star-of-bethlehem")
  })
})
