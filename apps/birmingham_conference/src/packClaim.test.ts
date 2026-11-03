import { describe, expect, it } from "vitest"
import {
  PACK_CLAIM_INTRO,
  PACK_CLAIM_SUBMIT,
  packClaimPayload,
  submitPackClaim,
  viewAfterPackTaken,
  viewFromPackLookup,
  type PackClaimForm,
} from "./packClaim"
import { CHECK_INBOX, REGISTRATION_UNAVAILABLE, outcomeFromResponse } from "./registrationFlow"
import type { ConfirmedRegistration } from "./scanRegistrations"

const valid: PackClaimForm = {
  name: "Ada",
  surname: "Lovelace",
  email: "Ada@Example.com",
  company: "Analytical Engines",
  consent: true,
}

describe("submitPackClaim", () => {
  it("rejects blank name, surname, company, email, and missing consent", () => {
    expect(submitPackClaim({ ...valid, name: "  " }).ok).toBe(false)
    expect(submitPackClaim({ ...valid, surname: "" })).toEqual({
      ok: false,
      errors: { surname: "Enter your surname." },
    })
    expect(submitPackClaim({ ...valid, company: "" })).toEqual({
      ok: false,
      errors: { company: "Enter your company." },
    })
    expect(submitPackClaim({ ...valid, email: "not-an-email" })).toEqual({
      ok: false,
      errors: { email: "Enter a valid email." },
    })
    expect(submitPackClaim({ ...valid, consent: false })).toEqual({
      ok: false,
      errors: { consent: "Confirm that we may store these details." },
    })
  })

  it("accepts the four fields and consent", () => {
    expect(submitPackClaim(valid)).toEqual({ ok: true })
  })

  it("rejects a name over 100 characters", () => {
    expect(submitPackClaim({ ...valid, name: "a".repeat(101) })).toEqual({
      ok: false,
      errors: { name: "Use 100 characters or fewer." },
    })
  })
})

describe("packClaimPayload", () => {
  it("sends tagCode with trimmed fields and does not send pack or artwork", () => {
    expect(packClaimPayload(valid, "MACTGB003")).toEqual({
      tagCode: "MACTGB003",
      name: "Ada",
      surname: "Lovelace",
      email: "Ada@Example.com",
      company: "Analytical Engines",
      consent: true,
    })
    expect(PACK_CLAIM_SUBMIT).toBe("View the full experience")
    expect(PACK_CLAIM_INTRO).toContain("confirm your email address")
  })
})

it("keeps the check-inbox outcome after a successful claim", () => {
  expect(outcomeFromResponse(201, { ok: true })).toEqual({
    type: "sent",
    message: CHECK_INBOX,
  })
})

const confirmedPack: ConfirmedRegistration = {
  name: "Ada",
  surname: "Lovelace",
  email: "ada@example.com",
  phoneDialCode: "",
  phoneNumber: "",
  phoneExtension: "",
  company: "Analytical Engines",
  position: "",
  town: "",
  country: "",
  artworkSlug: "the-star-of-betlehem",
  artworkTitle: "The Star of Betlehem",
  packNumber: "014",
}

describe("viewFromPackLookup", () => {
  it("ignores a cancelled lookup", () => {
    expect(viewFromPackLookup({ cancelled: true, ok: false, rows: [], packNumber: "014" })).toBeNull()
  })

  it("opens the claim form when the lookup fails", () => {
    expect(viewFromPackLookup({ cancelled: false, ok: false, rows: [], packNumber: "014" })).toEqual({
      claimed: false,
      notice: REGISTRATION_UNAVAILABLE,
    })
  })

  it("leaves the form clear when the pack has no confirmed row", () => {
    expect(viewFromPackLookup({ cancelled: false, ok: true, rows: [], packNumber: "014" })).toEqual({
      claimed: false,
      notice: "",
    })
  })

  it("marks the pack claimed when a confirmed row matches", () => {
    expect(
      viewFromPackLookup({
        cancelled: false,
        ok: true,
        rows: [confirmedPack],
        packNumber: "014",
      })
    ).toEqual({ claimed: true, notice: "" })
  })
})

describe("viewAfterPackTaken", () => {
  it("redirects when the re-fetch finds a confirmed row", () => {
    expect(viewAfterPackTaken({ ok: true, rows: [confirmedPack], packNumber: "014" })).toEqual({
      redirect: true,
    })
  })

  it("sets a modal notice when the re-fetch finds no confirmed row", () => {
    expect(viewAfterPackTaken({ ok: true, rows: [], packNumber: "014" })).toEqual({
      redirect: false,
      notice: "This pack number is already registered.",
    })
    expect(viewAfterPackTaken({ ok: false, rows: [], packNumber: "014" })).toEqual({
      redirect: false,
      notice: "This pack number is already registered.",
    })
  })
})
