import { describe, expect, it } from "vitest"
import { submitInterestRegistration, type InterestRegistration } from "./interestForm"

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
  artworkSlug: "the-star-of-bethlehem",
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
        consent: "Confirm that we may store these details.",
      },
    })
  })

  it("accepts a complete registration for each conference artwork", () => {
    expect(submitInterestRegistration({ ...valid, phoneNumber: "" })).toEqual({ ok: true })
    expect(
      submitInterestRegistration({ ...valid, artworkSlug: "the-golden-boys" })
    ).toEqual({ ok: true })
  })
})
