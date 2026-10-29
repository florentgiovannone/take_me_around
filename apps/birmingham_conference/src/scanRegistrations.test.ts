import { describe, expect, it } from "vitest"
import type { PoiseLog } from "@tma/dashboard-scope"
import {
  adminScanLabel,
  applyContactPrefill,
  contactPrefillFromRegistration,
  latestConfirmedMacdRegistration,
  nextContactPrefillState,
  packNumberFromMacdTag,
  parseConfirmedRegistrations,
  registrationDetailFields,
  registrationForPack,
  registrationPhoneLabel,
  type ConfirmedRegistration,
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
