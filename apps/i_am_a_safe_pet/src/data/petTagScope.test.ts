import { describe, expect, it } from "vitest"
import { canonicalPetTagName, isStoreCode } from "@tma/analytics-store-codes"

describe("Pet Tag scope", () => {
  it("keeps tag names that start with Pet Tag", () => {
    expect(canonicalPetTagName("Pet Tag 1")).toBe("Pet Tag 1")
    expect(canonicalPetTagName("  pet tag mochi ")).toBe("Pet Tag mochi")
    expect(isStoreCode("i_am_a_safe_pet", "PET TAG")).toBe(true)
  })

  it("ignores other names, including PV codes and lookalikes", () => {
    expect(canonicalPetTagName("PV001")).toBeNull()
    expect(canonicalPetTagName("Pet Tagging")).toBeNull()
    expect(canonicalPetTagName("PetTag")).toBeNull()
    expect(isStoreCode("i_am_a_safe_pet", "W001")).toBe(false)
  })
})
