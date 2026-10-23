import { describe, expect, it } from "vitest"
import { submitInterestRegistration, type InterestRegistration } from "./interestForm"

const valid: InterestRegistration = {
  name: "Ada",
  surname: "Lovelace",
  email: "ada@example.com",
  position: "Curator",
  company: "Analytical Engines",
  town: "Birmingham",
  country: "United Kingdom",
  artworkSlug: "the-star-of-bethlehem",
}

describe("submitInterestRegistration", () => {
  it("rejects a blank name, surname, position, company, town, and country", () => {
    expect(submitInterestRegistration({ ...valid, name: "  " })).toEqual({
      ok: false,
      errors: { name: "Enter your name." },
    })
    expect(submitInterestRegistration({ ...valid, surname: "" })).toEqual({
      ok: false,
      errors: { surname: "Enter your surname." },
    })
    expect(submitInterestRegistration({ ...valid, position: " " })).toEqual({
      ok: false,
      errors: { position: "Enter your position." },
    })
    expect(submitInterestRegistration({ ...valid, company: "" })).toEqual({
      ok: false,
      errors: { company: "Enter your company." },
    })
    expect(submitInterestRegistration({ ...valid, town: "  " })).toEqual({
      ok: false,
      errors: { town: "Enter the town." },
    })
    expect(submitInterestRegistration({ ...valid, country: "" })).toEqual({
      ok: false,
      errors: { country: "Enter the country." },
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

  it("returns every field error when the registration is empty", () => {
    expect(
      submitInterestRegistration({
        name: "",
        surname: "",
        email: "",
        position: "",
        company: "",
        town: "",
        country: "",
        artworkSlug: "",
      })
    ).toEqual({
      ok: false,
      errors: {
        name: "Enter your name.",
        surname: "Enter your surname.",
        email: "Enter a valid email.",
        position: "Enter your position.",
        company: "Enter your company.",
        town: "Enter the town.",
        country: "Enter the country.",
        artworkSlug: "Choose an artwork.",
      },
    })
  })

  it("accepts a complete registration for each conference artwork", () => {
    expect(submitInterestRegistration(valid)).toEqual({ ok: true })
    expect(
      submitInterestRegistration({ ...valid, artworkSlug: "the-golden-boys" })
    ).toEqual({ ok: true })
  })
})
