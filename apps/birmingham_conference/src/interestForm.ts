import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"

export type InterestRegistration = {
  name: string
  surname: string
  email: string
  company: string
  position: string
  town: string
  country: string
  artworkSlug: string
  consent: boolean
}

export type InterestFormErrors = {
  name?: string
  surname?: string
  email?: string
  company?: string
  position?: string
  town?: string
  country?: string
  artworkSlug?: string
  consent?: string
}

export type InterestFormResult =
  | { ok: true }
  | { ok: false; errors: InterestFormErrors }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LIMITS = {
  name: 100,
  surname: 100,
  email: 254,
  company: 200,
  position: 200,
  town: 100,
  country: 100,
} as const
const BLANK = {
  name: "Enter your name.",
  surname: "Enter your surname.",
  email: "Enter a valid email.",
  company: "Enter your company.",
  position: "Enter your position.",
  town: "Enter the town.",
  country: "Enter the country.",
} as const
const ARTWORK_SLUGS = new Set<string>(
  BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => artwork.slug)
)

export function submitInterestRegistration(values: InterestRegistration): InterestFormResult {
  const errors: InterestFormErrors = {}
  for (const field of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    const text = values[field].trim()
    const limit = LIMITS[field]
    if (text.length > limit) {
      errors[field] = `Use ${limit} characters or fewer.`
      continue
    }
    if (field === "email") {
      if (!EMAIL.test(text)) errors.email = BLANK.email
      continue
    }
    if (!text) errors[field] = BLANK[field]
  }
  if (!ARTWORK_SLUGS.has(values.artworkSlug)) errors.artworkSlug = "Choose an artwork."
  if (values.consent !== true) errors.consent = "Confirm that we may store these details."
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true }
}
