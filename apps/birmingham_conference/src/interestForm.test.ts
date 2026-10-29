import { describe, expect, it } from "vitest"
import {
  CONSENT_LABEL,
  privacyAccessHint,
  registrationPayload,
  submitInterestRegistration,
  type InterestRegistration,
} from "./interestForm"

const valid: InterestRegistration = {
  name: "Ada",
  surname: "Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  position: "Curator",
  town: "Birmingham",
  country: "United Kingdom",
  phoneCountry: "GB",
  phoneNumber: "7700 900123",
  artworkSlug: "the-star-of-betlehem",
  packNumber: "001",
  consent: true,
}

describe("submitInterestRegistration", () => {
  it("rejects a blank name, surname, company, position, town, and country", () => {
    expect(submitInterestRegistration({ ...valid, name: "  " })).toEqual({
      ok: false,
      errors: { name: "Enter your name." },
    })
    expect(submitInterestRegistration({ ...valid, surname: "" })).toEqual({
      ok: false,
      errors: { surname: "Enter your surname." },
    })
    expect(submitInterestRegistration({ ...valid, company: "" })).toEqual({
      ok: false,
      errors: { company: "Enter your company." },
    })
    expect(submitInterestRegistration({ ...valid, position: " " })).toEqual({
      ok: false,
      errors: { position: "Enter your position." },
    })
    expect(submitInterestRegistration({ ...valid, town: "  " })).toEqual({
      ok: false,
      errors: { town: "Enter the town." },
    })
    expect(submitInterestRegistration({ ...valid, country: "" })).toEqual({
      ok: false,
      errors: { country: "Choose a country." },
    })
  })

  it("rejects a missing artwork and an invalid email", () => {
    expect(submitInterestRegistration({ ...valid, artworkSlug: "" })).toEqual({
      ok: false,
      errors: { artworkSlug: "Choose an artwork." },
    })
    expect(submitInterestRegistration({ ...valid, email: "not-an-email" })).toEqual({
      ok: false,
      errors: { email: "Enter a valid email." },
    })
    expect(submitInterestRegistration({ ...valid, email: "  " })).toEqual({
      ok: false,
      errors: { email: "Enter a valid email." },
    })
  })

  it("rejects a missing consent checkbox", () => {
    expect(submitInterestRegistration({ ...valid, consent: false })).toEqual({
      ok: false,
      errors: { consent: "Confirm that we may store these details." },
    })
  })

  it("rejects a name over 100 characters", () => {
    expect(submitInterestRegistration({ ...valid, name: "a".repeat(101) })).toEqual({
      ok: false,
      errors: { name: "Use 100 characters or fewer." },
    })
  })

  it("returns every field error when the registration is empty", () => {
    expect(
      submitInterestRegistration({
        name: "",
        surname: "",
        email: "",
        company: "",
        position: "",
        town: "",
        country: "",
        phoneCountry: "",
        phoneNumber: "",
        artworkSlug: "",
        packNumber: "",
        consent: false,
      })
    ).toEqual({
      ok: false,
      errors: {
        name: "Enter your name.",
        surname: "Enter your surname.",
        email: "Enter a valid email.",
        company: "Enter your company.",
        position: "Enter your position.",
        town: "Enter the town.",
        country: "Choose a country.",
        artworkSlug: "Choose an artwork.",
        packNumber: "Enter a 3-digit pack number.",
        consent: "Confirm that we may store these details.",
      },
    })
  })

  it("accepts a complete registration for each conference artwork", () => {
    expect(submitInterestRegistration({ ...valid, phoneNumber: "" })).toEqual({ ok: true })
    expect(
      submitInterestRegistration({
        ...valid,
        artworkSlug: "the-golden-boys",
        packNumber: "101",
      })
    ).toEqual({ ok: true })
  })

  it("rejects a pack number that is not three digits", () => {
    for (const packNumber of ["", "7", "12", "0077", "MACD007"]) {
      expect(submitInterestRegistration({ ...valid, packNumber })).toEqual({
        ok: false,
        errors: { packNumber: "Enter a 3-digit pack number." },
      })
    }
  })

  it("rejects a pack number outside the chosen artwork range", () => {
    expect(submitInterestRegistration({ ...valid, packNumber: "000" })).toEqual({
      ok: false,
      errors: { packNumber: "Enter a pack number from 001 to 100." },
    })
    expect(submitInterestRegistration({ ...valid, packNumber: "101" })).toEqual({
      ok: false,
      errors: { packNumber: "Enter a pack number from 001 to 100." },
    })
    expect(submitInterestRegistration({ ...valid, packNumber: "100" })).toEqual({ ok: true })
    expect(
      submitInterestRegistration({
        ...valid,
        artworkSlug: "the-golden-boys",
        packNumber: "101",
      })
    ).toEqual({ ok: true })
    expect(
      submitInterestRegistration({
        ...valid,
        artworkSlug: "the-golden-boys",
        packNumber: "200",
      })
    ).toEqual({ ok: true })
    expect(
      submitInterestRegistration({
        ...valid,
        artworkSlug: "the-golden-boys",
        packNumber: "100",
      })
    ).toEqual({
      ok: false,
      errors: { packNumber: "Enter a pack number from 101 to 200." },
    })
    expect(
      submitInterestRegistration({
        ...valid,
        artworkSlug: "the-golden-boys",
        packNumber: "201",
      })
    ).toEqual({
      ok: false,
      errors: { packNumber: "Enter a pack number from 101 to 200." },
    })
  })

  it("includes the trimmed pack number in the payload", () => {
    expect(registrationPayload({ ...valid, packNumber: " 001 " }).packNumber).toBe("001")
  })
})

describe("consent and privacy copy", () => {
  it("describes pack matching, contact, and keeping details until deletion is asked", () => {
    expect(CONSENT_LABEL).toContain("pack number")
    expect(CONSENT_LABEL).toContain("phone number")
    expect(CONSENT_LABEL).toContain("scan dashboard")
    expect(CONSENT_LABEL).toContain("until I ask them to delete them")
    expect(CONSENT_LABEL).toContain("20 minutes")
    expect(CONSENT_LABEL).not.toContain("5 minutes")
  })

  it("tells people which email to use for access or deletion", () => {
    expect(privacyAccessHint("privacy@example.com")).toBe(
      "Email privacy@example.com to ask for access or deletion."
    )
  })
})
