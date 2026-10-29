export const DEFAULT_REGISTRATION_API_ORIGIN = "http://52.18.254.191:5051"

export function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim()
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"')))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

export function resolveRegistrationBase(value: string | undefined | null): string {
  const origin = stripWrappingQuotes(value || "").replace(/\/$/, "")
  return origin || DEFAULT_REGISTRATION_API_ORIGIN
}

export function registrationReadHeaders(readKey: string): Record<string, string> {
  const key = stripWrappingQuotes(readKey)
  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
  }
  if (key) {
    headers["X-Registrations-Key"] = key
  }
  return headers
}
