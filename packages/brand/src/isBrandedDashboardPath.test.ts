import { describe, expect, it } from "vitest"
import { isBrandedDashboardPath } from "./isBrandedDashboardPath"

describe("isBrandedDashboardPath", () => {
  it("brands the combined, demo, gallery, and museum dashboards", () => {
    expect(isBrandedDashboardPath("/")).toBe(true)
    expect(isBrandedDashboardPath("/demodashboard")).toBe(true)
    expect(isBrandedDashboardPath("/dashboard")).toBe(true)
    expect(isBrandedDashboardPath("/dashboard/museum")).toBe(true)
  })

  it("leaves the Church of England route unbranded", () => {
    expect(isBrandedDashboardPath("/dashboard/church-of-england")).toBe(false)
  })

  it("does not treat a query string as a pathname", () => {
    expect(isBrandedDashboardPath("/dashboard?x=1")).toBe(false)
  })
})
