import { REGISTRATION_UNAVAILABLE } from "./registrationFlow"
import { registrationForPack, type ConfirmedRegistration } from "./scanRegistrations"

export const PACK_CLAIM_INTRO =
  "To view the whole experience, please enter your email address, name, and organisation name. We will send you an email to confirm your email address. You will enjoy permanent access to the full content. Thank you for your interest."

export const PACK_ALREADY_REGISTERED = "This pack number is already registered."

export const PACK_CLAIM_SUBMIT = "View the full experience"

export type PackClaimForm = {
  name: string
  surname: string
  email: string
  company: string
  consent: boolean
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LIMITS = { name: 100, surname: 100, email: 254, company: 200 } as const
const BLANK = {
  name: "Enter your name.",
  surname: "Enter your surname.",
  email: "Enter a valid email.",
  company: "Enter your company.",
} as const

export function submitPackClaim(
  values: PackClaimForm
): { ok: true } | { ok: false; errors: Partial<Record<keyof PackClaimForm, string>> } {
  const errors: Partial<Record<keyof PackClaimForm, string>> = {}
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
  if (values.consent !== true) errors.consent = "Confirm that we may store these details."
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true }
}

export function viewFromPackLookup(args: {
  cancelled: boolean
  ok: boolean
  rows: ConfirmedRegistration[]
  packNumber: string
}): { claimed: boolean; notice: string } | null {
  if (args.cancelled) return null
  if (!args.ok) return { claimed: false, notice: REGISTRATION_UNAVAILABLE }
  return {
    claimed: Boolean(registrationForPack(args.rows, args.packNumber)),
    notice: "",
  }
}

export function viewAfterPackTaken(args: {
  ok: boolean
  rows: ConfirmedRegistration[]
  packNumber: string
}): { redirect: true } | { redirect: false; notice: string } {
  if (args.ok && registrationForPack(args.rows, args.packNumber)) return { redirect: true }
  return { redirect: false, notice: PACK_ALREADY_REGISTERED }
}

export function packClaimPayload(values: PackClaimForm, tagCode: string) {
  return {
    tagCode,
    name: values.name.trim(),
    surname: values.surname.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    consent: values.consent,
  }
}
