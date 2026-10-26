import { describe, expect, it } from "vitest"
import {
  CHECK_INBOX,
  NO_ARTWORKS_AVAILABLE,
  REGISTRATION_UNAVAILABLE,
  artworkSlugAfterReload,
  artworksToShow,
  outcomeFromResponse,
  resolveRegistrationBaseUrl,
} from "./registrationFlow"

describe("resolveRegistrationBaseUrl", () => {
  it("uses localhost when blank in dev", () => {
    expect(resolveRegistrationBaseUrl(undefined, true)).toBe("http://127.0.0.1:5051")
    expect(resolveRegistrationBaseUrl("  ", true)).toBe("http://127.0.0.1:5051")
  })

  it("returns null when blank outside dev", () => {
    expect(resolveRegistrationBaseUrl(undefined, false)).toBeNull()
    expect(resolveRegistrationBaseUrl("", false)).toBeNull()
  })

  it("normalizes absolute http and https URLs", () => {
    expect(resolveRegistrationBaseUrl("http://127.0.0.1:5051/", true)).toBe("http://127.0.0.1:5051")
    expect(resolveRegistrationBaseUrl("http://52.18.254.191:5051/", false)).toBe("/registration-api")
    expect(resolveRegistrationBaseUrl("https://register.example/", false)).toBe(
      "https://register.example"
    )
  })

  it("rejects relative and non-http URLs", () => {
    expect(resolveRegistrationBaseUrl("/", false)).toBeNull()
    expect(resolveRegistrationBaseUrl("api", false)).toBeNull()
    expect(resolveRegistrationBaseUrl("ftp://example.com", false)).toBeNull()
  })
})

describe("NO_ARTWORKS_AVAILABLE", () => {
  it("uses the expected copy", () => {
    expect(NO_ARTWORKS_AVAILABLE).toBe("No artworks are available right now.")
  })
})

describe("artworksToShow", () => {
  it("hides an artwork whose stock is zero", () => {
    expect(
      artworksToShow([
        { slug: "the-star-of-bethlehem", title: "The Star of Bethlehem", stock: 0, available: false },
        { slug: "the-golden-boys", title: "The Golden Boys", stock: 2, available: true },
      ]).map((artwork) => artwork.slug)
    ).toEqual(["the-golden-boys"])
  })
})

describe("artworkSlugAfterReload", () => {
  const list = [
    { slug: "the-star-of-bethlehem", title: "The Star of Bethlehem", stock: 0, available: false },
    { slug: "the-golden-boys", title: "The Golden Boys", stock: 2, available: true },
  ]

  it("clears a slug whose artwork is unavailable or out of stock", () => {
    expect(artworkSlugAfterReload("the-star-of-bethlehem", list)).toBe("")
    expect(
      artworkSlugAfterReload("the-golden-boys", [
        { slug: "the-golden-boys", title: "The Golden Boys", stock: 0, available: true },
      ])
    ).toBe("")
  })

  it("keeps a slug that is still available", () => {
    expect(artworkSlugAfterReload("the-golden-boys", list)).toBe("the-golden-boys")
  })
})

describe("outcomeFromResponse", () => {
  it("shows the check-your-inbox message after a successful response", () => {
    expect(outcomeFromResponse(201, { ok: true })).toEqual({
      type: "sent",
      message: CHECK_INBOX,
    })
    expect(CHECK_INBOX).toBe(
      "Thank you. Your interest is registered. Please check your inbox and confirm your email address."
    )
  })

  it("reloads the artwork list when the choice is no longer available", () => {
    expect(
      outcomeFromResponse(409, {
        ok: false,
        error: "unavailable",
        message: "That artwork is no longer available.",
      })
    ).toEqual({ type: "reload", message: "That artwork is no longer available." })
  })

  it("uses the unavailable copy when the artwork list cannot be loaded", () => {
    expect(REGISTRATION_UNAVAILABLE).toBe("Registration is unavailable.")
  })
})
