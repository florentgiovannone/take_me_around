export const CHECK_INBOX =
  "Thank you. Your interest is registered. Please check your inbox and confirm your email address."

export const REGISTRATION_PATH = "/museumassociationconferenceregistration"

const ARTWORK_MEDIUMS: Record<string, "Painting" | "Sculpture"> = {
  "the-star-of-betlehem": "Painting",
  "the-golden-boys": "Sculpture",
}

export function artworkMediumLabel(slug: string): "Painting" | "Sculpture" | "" {
  return ARTWORK_MEDIUMS[slug] ?? ""
}

export const REGISTRATION_UNAVAILABLE = "Registration is unavailable."

export const NO_ARTWORKS_AVAILABLE = "No artworks are available right now."

export type StockedArtwork = {
  slug: string
  title: string
  stock: number
  available: boolean
}

export function resolveRegistrationBaseUrl(
  configured: string | undefined,
  dev: boolean
): string | null {
  const trimmed = (configured ?? "").trim().replace(/\/$/, "")
  if (trimmed === "") {
    return dev ? "http://127.0.0.1:5051" : null
  }
  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null
  }
  if (!dev && url.protocol === "http:") {
    return "/registration-api"
  }
  const path = url.pathname.replace(/\/$/, "")
  return path && path !== "/" ? `${url.origin}${path}` : url.origin
}

export function registrationBaseUrl(): string | null {
  return resolveRegistrationBaseUrl(
    import.meta.env.VITE_BIRMINGHAM_REGISTRATION_URL as string | undefined,
    import.meta.env.DEV
  )
}

export function artworksToShow<T extends { available: boolean; stock: number }>(artworks: T[]): T[] {
  return artworks.filter((artwork) => artwork.available && artwork.stock > 0)
}

export function artworkSlugAfterReload(slug: string, artworks: StockedArtwork[]): string {
  if (!slug) return ""
  return artworksToShow(artworks).some((artwork) => artwork.slug === slug) ? slug : ""
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
