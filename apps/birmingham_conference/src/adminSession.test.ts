import { describe, expect, it } from "vitest"
import { readAdminSession } from "./adminSession"

function fetchWithStatus(status: number): typeof fetch {
  return (async () => new Response(null, { status })) as typeof fetch
}

describe("readAdminSession", () => {
  it("treats 204 as an open session", async () => {
    expect(await readAdminSession(fetchWithStatus(204))).toBe("open")
  })

  it("treats 401 as denied", async () => {
    expect(await readAdminSession(fetchWithStatus(401))).toBe("denied")
  })

  it("treats 503 as unconfigured", async () => {
    expect(await readAdminSession(fetchWithStatus(503))).toBe("unconfigured")
  })

  it("treats a network failure as an error", async () => {
    const failing = (async () => {
      throw new Error("offline")
    }) as typeof fetch
    expect(await readAdminSession(failing)).toBe("error")
  })
})
