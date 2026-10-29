import { describe, expect, it } from "vitest"
import {
  DEFAULT_REGISTRATION_API_ORIGIN,
  registrationReadHeaders,
  resolveRegistrationBase,
  stripWrappingQuotes,
} from "./registrationsReadEnv"

describe("stripWrappingQuotes", () => {
  it("removes matching quotes that dotenv and Netlify env files often keep", () => {
    expect(stripWrappingQuotes("  'read-key'  ")).toBe("read-key")
    expect(stripWrappingQuotes('"read-key"')).toBe("read-key")
    expect(stripWrappingQuotes("read-key")).toBe("read-key")
  })
})

describe("resolveRegistrationBase", () => {
  it("prefers the configured origin and falls back to the live registration host", () => {
    expect(resolveRegistrationBase(" http://127.0.0.1:5051/ ")).toBe("http://127.0.0.1:5051")
    expect(resolveRegistrationBase("")).toBe(DEFAULT_REGISTRATION_API_ORIGIN)
    expect(resolveRegistrationBase(undefined)).toBe(DEFAULT_REGISTRATION_API_ORIGIN)
  })
})

describe("registrationReadHeaders", () => {
  it("omits the read key so pack lookups can succeed when Netlify does not have it", () => {
    expect(registrationReadHeaders("")).toEqual({
      "ngrok-skip-browser-warning": "true",
    })
    expect(registrationReadHeaders("  'secret'  ")).toEqual({
      "X-Registrations-Key": "secret",
      "ngrok-skip-browser-warning": "true",
    })
  })
})
