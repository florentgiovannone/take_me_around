import { describe, expect, it } from "vitest"
import {
  PET_LOCATION_OPTIONS,
  detailsForPetLocationChange,
  labelPetLocation,
  petLocationDetailsLabel,
  validateFoundLocationForm,
} from "./petLocation"

describe("petLocation helpers", () => {
  it("exposes the three finder location choices", () => {
    expect(PET_LOCATION_OPTIONS.map((o) => o.value)).toEqual([
      "with_me",
      "with_his_vet",
      "with_another_vet",
    ])
  })

  it("labels petLocation values for owner display", () => {
    expect(labelPetLocation("with_me")).toBe("With me")
    expect(labelPetLocation("with_his_vet")).toBe("With his vet")
    expect(labelPetLocation("with_another_vet")).toBe("With another vet")
  })

  it("returns field prompts for each location choice", () => {
    expect(petLocationDetailsLabel("with_me")).toMatch(/location|meet|notes/i)
    expect(petLocationDetailsLabel("with_his_vet")).toMatch(/vet|confirm|contact/i)
    expect(petLocationDetailsLabel("with_another_vet")).toMatch(/clinic|phone|address/i)
  })

  it("requires location and useful details before submit", () => {
    expect(validateFoundLocationForm(null, "")).toMatch(/where/i)
    expect(validateFoundLocationForm("with_me", "   ")).toMatch(/detail/i)
    expect(validateFoundLocationForm("with_another_vet", "Greenfield")).toMatch(
      /phone|address|contact/i
    )
    expect(
      validateFoundLocationForm(
        "with_another_vet",
        "Oak Vet Clinic, 01234 567890, 2 Oak Road"
      )
    ).toBeNull()
    expect(
      validateFoundLocationForm("with_me", "Near the park gate on High Street")
    ).toBeNull()
    expect(
      validateFoundLocationForm("with_his_vet", "At Greenfield Vets — ask for reception")
    ).toBeNull()
  })

  it("prefills details with vetContact for with_his_vet and clears when leaving unchanged", () => {
    const vetContact = "Greenfield Vets\n+44 1234 567890\n14 High Street"

    expect(detailsForPetLocationChange("with_his_vet", "", vetContact)).toBe(
      vetContact
    )
    expect(
      detailsForPetLocationChange("with_me", vetContact, vetContact)
    ).toBe("")
    expect(
      detailsForPetLocationChange("with_another_vet", vetContact, vetContact)
    ).toBe("")
    expect(
      detailsForPetLocationChange(
        "with_me",
        "At Greenfield — left a note",
        vetContact
      )
    ).toBe("At Greenfield — left a note")
    expect(detailsForPetLocationChange("with_another_vet", "", vetContact)).toBe(
      ""
    )
  })
})
