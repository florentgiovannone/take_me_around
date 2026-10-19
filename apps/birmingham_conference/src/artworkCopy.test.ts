import { describe, expect, it } from "vitest"
import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"
import { ARTWORK_COPY } from "./artworkCopy"

describe("artwork copy", () => {
  it("covers every canonical slug", () => {
    expect(Object.keys(ARTWORK_COPY).sort()).toEqual(
      BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => artwork.slug).sort()
    )
  })
})
