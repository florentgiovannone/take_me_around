import { describe, expect, it } from "vitest"
import { validateCheckIn } from "./checkIn"

const accepted = { acceptedTerms: true, acceptedPrivacy: true }

describe("validateCheckIn", () => {
  it("accepts an email when both boxes are ticked", () => {
    expect(validateCheckIn({ email: "visitor@gallery.test", ...accepted })).toEqual({ ok: true })
  })

  it("rejects a missing or invalid email", () => {
    expect(validateCheckIn({ email: "  ", ...accepted }).ok).toBe(false)
    const invalid = validateCheckIn({ email: "not-an-email", ...accepted })
    expect(invalid.ok).toBe(false)
    if (!invalid.ok) expect(invalid.errors.email).toBeTruthy()
  })

  it("requires both consent boxes", () => {
    const result = validateCheckIn({
      email: "visitor@gallery.test",
      acceptedTerms: false,
      acceptedPrivacy: false,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.terms).toBeTruthy()
      expect(result.errors.privacy).toBeTruthy()
    }
  })
})
