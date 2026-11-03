import { describe, expect, it } from "vitest"
import {
  PACK_CLAIM_INTRO,
  PACK_CLAIM_SUBMIT,
  packClaimPayload,
  submitPackClaim,
  type PackClaimForm,
} from "./packClaim"
import { CHECK_INBOX, outcomeFromResponse } from "./registrationFlow"

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
