export const CHECK_INBOX =
  "Thank you. Your interest is registered. Please check your inbox and confirm your email address."

export const REGISTRATION_UNAVAILABLE = "Registration is unavailable."

export type StockedArtwork = {
  slug: string
  title: string
  stock: number
  available: boolean
}

export function registrationBaseUrl(): string {
  const configured = import.meta.env.VITE_BIRMINGHAM_REGISTRATION_URL as string | undefined
  return (configured || "http://127.0.0.1:5051").replace(/\/$/, "")
}

export function artworksToShow<T extends { available: boolean; stock: number }>(artworks: T[]): T[] {
  return artworks.filter((artwork) => artwork.available && artwork.stock > 0)
}

export type SubmitOutcome =
  | { type: "sent"; message: string }
  | { type: "reload"; message: string }
  | { type: "message"; message: string }
  | { type: "fields"; errors: Record<string, string> }

export function outcomeFromResponse(
  status: number,
  body: { ok: boolean; error?: string; message?: string; errors?: Record<string, string> }
): SubmitOutcome {
  if (status === 201 && body.ok) return { type: "sent", message: CHECK_INBOX }
  if (body.errors) return { type: "fields", errors: body.errors }
  if (body.error === "unavailable") {
    return { type: "reload", message: body.message || "That artwork is no longer available." }
  }
  return { type: "message", message: body.message || REGISTRATION_UNAVAILABLE }
}
