import { describe, expect, it } from "vitest"
import {
  CONTACT_THANKS,
  CONTACT_UNAVAILABLE,
  contactOutcomeFromResponse,
  contactPayload,
  validateContactForm,
} from "./contactForm"

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

  it("rejects fields over their character limits", () => {
    expect(validateContactForm({ ...valid, name: "a".repeat(101) })).toEqual({
      ok: false,
      errors: { name: "Use 100 characters or fewer." },
    })
    expect(validateContactForm({ ...valid, email: `${"a".repeat(243)}@example.com` })).toEqual({
      ok: false,
      errors: { email: "Use 254 characters or fewer." },
    })
    expect(validateContactForm({ ...valid, organisation: "a".repeat(201) })).toEqual({
      ok: false,
      errors: { organisation: "Use 200 characters or fewer." },
    })
    expect(validateContactForm({ ...valid, message: "a".repeat(2001) })).toEqual({
      ok: false,
      errors: { message: "Use 2000 characters or fewer." },
    })
  })
})

describe("contactPayload and contactOutcomeFromResponse", () => {
  it("trims all contact form fields", () => {
    expect(
      contactPayload({
        name: "  Ada Lovelace ",
        email: " Ada@Example.com ",
        organisation: " Analytical Engines ",
        message: "  Hello there. ",
      })
    ).toEqual({
      name: "Ada Lovelace",
      email: "Ada@Example.com",
      organisation: "Analytical Engines",
      message: "Hello there.",
    })
  })

  it("maps API responses to sent, field errors, or message outcomes", () => {
    expect(contactOutcomeFromResponse(201, { ok: true })).toEqual({
      type: "sent",
      message: CONTACT_THANKS,
    })
    expect(
      contactOutcomeFromResponse(400, {
        ok: false,
        errors: { email: "Enter a valid email." },
      })
    ).toEqual({
      type: "fields",
      errors: { email: "Enter a valid email." },
    })
    expect(
      contactOutcomeFromResponse(429, {
        ok: false,
        error: "too_many_requests",
        message: "Please try again later.",
      })
    ).toEqual({
      type: "message",
      message: "Please try again later.",
    })
    expect(contactOutcomeFromResponse(502, { ok: false })).toEqual({
      type: "message",
      message: CONTACT_UNAVAILABLE,
    })
  })
})
