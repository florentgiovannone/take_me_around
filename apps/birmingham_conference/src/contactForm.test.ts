import { describe, expect, it } from "vitest"
import { validateContactForm } from "./contactForm"

const valid = {
  name: "Ada",
  email: "ada@example.com",
  organisation: "",
  message: "We host a sculpture trail.",
}

describe("validateContactForm", () => {
  it("rejects an empty name, a bad email, and an empty message", () => {
    expect(validateContactForm({ ...valid, name: "  " })).toEqual({
      ok: false,
      errors: { name: "Enter your name." },
    })
    expect(validateContactForm({ ...valid, email: "not-an-email" })).toEqual({
      ok: false,
      errors: { email: "Enter a valid email." },
    })
    expect(validateContactForm({ ...valid, email: "  " })).toEqual({
      ok: false,
      errors: { email: "Enter a valid email." },
    })
    expect(validateContactForm({ ...valid, message: "" })).toEqual({
      ok: false,
      errors: { message: "Enter a message." },
    })
  })

  it("accepts a blank organisation", () => {
    expect(validateContactForm(valid)).toEqual({ ok: true })
  })
})
