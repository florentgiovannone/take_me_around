import type { PetLocation } from "./types"

export const PET_LOCATION_OPTIONS: ReadonlyArray<{
  value: PetLocation
  label: string
}> = [
  { value: "with_me", label: "With me" },
  { value: "with_his_vet", label: "With his vet" },
  { value: "with_another_vet", label: "With another vet" },
]

export function labelPetLocation(location: PetLocation): string {
  return (
    PET_LOCATION_OPTIONS.find((option) => option.value === location)?.label ??
    location
  )
}

export function petLocationDetailsLabel(location: PetLocation): string {
  switch (location) {
    case "with_me":
      return "Location, how to meet, or notes"
    case "with_his_vet":
      return "Confirm the visit or add vet contact notes"
    case "with_another_vet":
      return "Clinic name, phone, and address"
  }
}

/**
 * Next details value when the finder changes petLocation.
 * Prefills with_his_vet from the pet profile; clears that prefill when leaving if unchanged.
 */
export function detailsForPetLocationChange(
  nextLocation: PetLocation,
  currentDetails: string,
  vetContact: string
): string {
  if (nextLocation === "with_his_vet") return vetContact
  if (currentDetails === vetContact) return ""
  return currentDetails
}

/**
 * Returns an error message, or null when the found-location form is ready to submit.
 */
export function validateFoundLocationForm(
  location: PetLocation | null,
  details: string
): string | null {
  if (!location) return "Choose where the pet is."
  const trimmed = details.trim()
  if (!trimmed) return "Add a few details so the owner knows what to do next."
  if (location === "with_another_vet") {
    const hasPhone = /\d/.test(trimmed)
    const looksLikeAddress =
      /\b(st|street|rd|road|ave|avenue|lane|ln|way|close|drive|dr|clinic|vets?)\b/i.test(
        trimmed
      ) || trimmed.includes(",")
    if (!hasPhone && !looksLikeAddress) {
      return "Include clinic phone or address so the owner can follow up."
    }
  }
  return null
}
