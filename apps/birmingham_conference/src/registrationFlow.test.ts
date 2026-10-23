import { describe, expect, it } from "vitest"
import {
  CHECK_INBOX,
  REGISTRATION_UNAVAILABLE,
  artworksToShow,
  outcomeFromResponse,
} from "./registrationFlow"

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
