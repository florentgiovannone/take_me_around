import { describe, expect, it } from "vitest"
import { getSectionAudio } from "./assets/sevendials"
import { plaqueBySlug, plaques } from "./plaques"

describe("Seven Dials plaques dataset", () => {
  it("contains Charles Boon (1877–1943) with in-situ Castle Street / Little White Lion Street context", () => {
    const boon = plaqueBySlug("charles-boon")
    expect(boon).toBeDefined()
    expect(boon?.lifeDates).toBe("1877–1943")
    expect(boon?.tagCode).toBe("SD001")
    expect(boon?.historicAddress).toContain("47 Castle Street")
    expect(boon?.historicAddress).toContain("12 Little White Lion Street")
    expect(boon?.inSituSummary.buildingContext).toContain("Combe")
    expect(boon?.sections.length).toBeGreaterThanOrEqual(3)
    expect(boon?.timeline.length).toBeGreaterThanOrEqual(6)
    expect(boon?.sources.some((s) => s.href?.includes("sevendials.com/peoples-plaques/charles-boon"))).toBe(true)
  })

  it("contains Brian Epstein (1934–1967) with in-situ 13 Monmouth Street NEMS context", () => {
    const epstein = plaqueBySlug("brian-epstein")
    expect(epstein).toBeDefined()
    expect(epstein?.lifeDates).toBe("1934–1967")
    expect(epstein?.tagCode).toBe("SD002")
    expect(epstein?.locationTitle).toContain("13 Monmouth Street")
    expect(epstein?.inSituSummary.buildingContext).toContain("NEMS")
    expect(epstein?.sections.length).toBeGreaterThanOrEqual(3)
    expect(epstein?.timeline.length).toBeGreaterThanOrEqual(6)
    expect(epstein?.sources.some((s) => s.href === "https://sevendials.com/peoples-plaques/brian-epstein")).toBe(true)
  })

  it("exports exactly two featured plaques in order", () => {
    expect(plaques.map((p) => p.slug)).toEqual(["charles-boon", "brian-epstein"])
  })

  it("provides generated section audio MP3s for every section of Charles Boon and Brian Epstein", () => {
    for (const person of plaques) {
      expect(getSectionAudio(person.slug, "in-situ")).toBeTruthy()
      for (const section of person.sections) {
        expect(getSectionAudio(person.slug, section.id)).toBeTruthy()
      }
      expect(getSectionAudio(person.slug, "timeline")).toBeTruthy()
    }
  })
})
