export const CHECK_IN_STORAGE_KEY = "frieze-gallery-checked-in"

export type CheckInInput = {
  email: string
  acceptedTerms: boolean
  acceptedPrivacy: boolean
}

export type CheckInField = "email" | "terms" | "privacy"

export type CheckInErrorCode = "required" | "invalid"

export type CheckInErrors = Partial<Record<CheckInField, CheckInErrorCode>>

export type CheckInResult = { ok: true } | { ok: false; errors: CheckInErrors }

export function isValidEmail(value: string): boolean {
  const email = value.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateCheckIn(input: CheckInInput): CheckInResult {
  const errors: CheckInErrors = {}
  const email = input.email.trim()

  if (!email) errors.email = "required"
  else if (!isValidEmail(email)) errors.email = "invalid"
  if (!input.acceptedTerms) errors.terms = "required"
  if (!input.acceptedPrivacy) errors.privacy = "required"

  if (errors.email || errors.terms || errors.privacy) return { ok: false, errors }
  return { ok: true }
}

export function isCheckedIn(): boolean {
  try {
    return sessionStorage.getItem(CHECK_IN_STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

export function markCheckedIn(): void {
  sessionStorage.setItem(CHECK_IN_STORAGE_KEY, "1")
}

export function clearCheckIn(): void {
  sessionStorage.removeItem(CHECK_IN_STORAGE_KEY)
}
