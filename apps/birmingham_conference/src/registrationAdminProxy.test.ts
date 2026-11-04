import { describe, expect, it } from "vitest"
import { registrationAdminHomeTarget } from "./registrationAdminProxy"

describe("registrationAdminHomeTarget", () => {
  it("keeps the Flask /admin path so Netlify cannot strip it", () => {
    expect(registrationAdminHomeTarget("http://backend.example:5051")).toBe(
      "http://backend.example:5051/admin"
    )
    expect(registrationAdminHomeTarget("http://backend.example:5051/", "?next=1")).toBe(
      "http://backend.example:5051/admin?next=1"
    )
  })
})
