import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"

export type InterestRegistration = {
  name: string
  surname: string
  email: string
  company: string
  position: string
  country: string
  artworkSlug: string
}

export type InterestFormErrors = {
  name?: string
  surname?: string
  email?: string
  company?: string
  position?: string
  country?: string
  artworkSlug?: string
}

export type InterestFormResult =
  | { ok: true }
  | { ok: false; errors: InterestFormErrors }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ARTWORK_SLUGS = new Set<string>(
  BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => artwork.slug)
)

export function submitInterestRegistration(values: InterestRegistration): InterestFormResult {
  const errors: InterestFormErrors = {}
  if (!values.name.trim()) errors.name = "Enter your name."
  if (!values.surname.trim()) errors.surname = "Enter your surname."
  if (!EMAIL.test(values.email.trim())) errors.email = "Enter a valid email."
  if (!values.company.trim()) errors.company = "Enter your company."
  if (!values.position.trim()) errors.position = "Enter your position."
  if (!values.country.trim()) errors.country = "Enter the country."
  if (!ARTWORK_SLUGS.has(values.artworkSlug)) errors.artworkSlug = "Choose an artwork."
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true }
}
