export type PetId = string
export type PublicPetId = string

export type PetProfile = {
  id: PetId
  publicId: PublicPetId
  name: string
  species: "dog" | "cat" | "other"
  breed?: string
  ownerName: string
  contactNumber: string
  personality: string
  allergies: string
  vetContact: string
  photoUrl?: string
  ownerAccountId: string
}

export type PetEventType = "scan" | "found"

/** Where the finder reports the pet is, when recording a found event. */
export type PetLocation = "with_me" | "with_his_vet" | "with_another_vet"

/**
 * Scan / found activity. Optional analytics-shaped fields may exist on older
 * localStorage events but are not shown in the owner UI and are not collected
 * on new events (except device, language, session, tag, page URL).
 */
export type PetEvent = {
  id: string
  petId: PetId
  publicId: PublicPetId
  type: PetEventType
  createdAt: string
  source: "page_view" | "finder_cta"
  userAgent?: string
  device?: "mobile" | "desktop" | "tablet"
  /** @deprecated Not collected or shown; kept for older stored events. */
  browser?: string
  /** @deprecated Not collected or shown; kept for older stored events. */
  os?: string
  language?: string
  /** @deprecated Not collected or shown; kept for older stored events. */
  path?: string
  pageUrl?: string
  referrer?: string
  sessionId?: string
  /** @deprecated Not collected or shown; kept for older stored events. */
  visitorNumber?: string
  tagUid?: string
  /** REMOTE_ADDR when available (seeded for demo; not collected in-browser). */
  ipAddress?: string
  /** @deprecated Not collected or shown; kept for older stored events. */
  host?: string
  /** @deprecated Not collected or shown; kept for older stored events. */
  siteLabel?: string
  /** @deprecated Not collected or shown; kept for older stored events. */
  android?: boolean
  /** Finder-reported location for found events. */
  petLocation?: PetLocation
  /** Free-text details for the chosen petLocation (meet notes, clinic, etc.). */
  petLocationDetails?: string
}

export type SafePetRepository = {
  getPetByPublicId(publicId: string): Promise<PetProfile | null>
  listPetsForOwner(ownerAccountId: string): Promise<PetProfile[]>
  listEventsForPet(petId: string): Promise<PetEvent[]>
  listEventsForOwner(ownerAccountId: string): Promise<PetEvent[]>
  recordEvent(
    input: Omit<PetEvent, "id" | "createdAt"> & { createdAt?: string; id?: string }
  ): Promise<PetEvent>
}
