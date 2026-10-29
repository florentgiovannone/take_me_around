import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"
import { COUNTRIES } from "./countries"

export type InterestRegistration = {
  name: string
  surname: string
  email: string
  company: string
  position: string
  town: string
  country: string
  phoneCountry: string
  phoneNumber: string
  artworkSlug: string
  packNumber: string
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
  phoneCountry?: string
  phoneNumber?: string
  artworkSlug?: string
  packNumber?: string
  consent?: string
}

export type InterestFormResult =
  | { ok: true }
  | { ok: false; errors: InterestFormErrors }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_DIGITS = /^[0-9]{4,15}$/
const COUNTRY_NAMES = new Set<string>(COUNTRIES.map((country) => country.name))
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
  country: "Choose a country.",
} as const
const ARTWORK_SLUGS = new Set<string>(
  BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => artwork.slug)
)
const PACK_DIGITS = /^[0-9]{3}$/
const PACK_RANGES: Record<string, { min: string; max: string; message: string }> = {
  "the-star-of-betlehem": {
    min: "001",
    max: "100",
    message: "Enter a pack number from 001 to 100.",
  },
  "the-golden-boys": {
    min: "101",
    max: "200",
    message: "Enter a pack number from 101 to 200.",
  },
}

function packNumberError(packNumber: string, artworkSlug: string): string | undefined {
  const text = packNumber.trim()
  if (!PACK_DIGITS.test(text)) return "Enter a 3-digit pack number."
  const range = PACK_RANGES[artworkSlug]
  if (range && (text < range.min || text > range.max)) return range.message
  return undefined
}

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
    if (field === "country") {
      if (!COUNTRY_NAMES.has(text)) errors.country = BLANK.country
      continue
    }
    if (!text) errors[field] = BLANK[field]
  }
  const phoneCountry = COUNTRIES.find((country) => country.code === values.phoneCountry)
  const digits = values.phoneNumber.replace(/[\s-]/g, "")
  if (digits && !phoneCountry) errors.phoneCountry = "Choose a country code."
  if (digits && !PHONE_DIGITS.test(digits)) errors.phoneNumber = "Enter a valid phone number."
  if (!ARTWORK_SLUGS.has(values.artworkSlug)) errors.artworkSlug = "Choose an artwork."
  const packError = packNumberError(values.packNumber, values.artworkSlug)
  if (packError) errors.packNumber = packError
  if (values.consent !== true) errors.consent = "Confirm that we may store these details."
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true }
}

export function registrationPayload(values: InterestRegistration) {
  const phoneCountry = COUNTRIES.find((country) => country.code === values.phoneCountry)
  return {
    name: values.name.trim(),
    surname: values.surname.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    position: values.position.trim(),
    town: values.town.trim(),
    country: values.country.trim(),
    phoneDialCode: phoneCountry?.dial ?? "",
    phoneNumber: values.phoneNumber.replace(/[\s-]/g, ""),
    artworkSlug: values.artworkSlug,
    packNumber: values.packNumber.trim(),
    consent: values.consent,
  }
}
