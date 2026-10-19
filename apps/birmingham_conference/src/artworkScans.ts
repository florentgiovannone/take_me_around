import {
  BIRMINGHAM_CONFERENCE_ARTWORKS,
  matchBirminghamConferenceArtwork,
  type BirminghamConferenceArtwork,
} from "@tma/dashboard-scope"
import type { PoiseLog } from "@tma/dashboard-scope"

const STORAGE_KEY = "birmingham-conference-artwork-scans"
const DEDUPE_MS = 1500
const recent = new Map<string, number>()

export function resetArtworkScanDedupeForTests(): void {
  recent.clear()
}

export function readArtworkScans(): PoiseLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PoiseLog[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((log) => matchBirminghamConferenceArtwork(log?.txt_message) !== null)
  } catch {
    return []
  }
}

function artworkBySlug(slug: BirminghamConferenceArtwork["slug"]): BirminghamConferenceArtwork {
  const artwork = BIRMINGHAM_CONFERENCE_ARTWORKS.find((item) => item.slug === slug)
  if (!artwork) throw new Error(`Unknown Birmingham artwork: ${slug}`)
  return artwork
}

export function logArtworkScan(slug: BirminghamConferenceArtwork["slug"]): void {
  const artwork = artworkBySlug(slug)
  const now = Date.now()
  const last = recent.get(artwork.url) ?? 0
  if (now - last < DEDUPE_MS) return
  recent.set(artwork.url, now)
  const entry: PoiseLog = {
    int_id: now,
    dtm_timestamp: new Date(now).toISOString(),
    txt_uid: null,
    text_name: artwork.title,
    txt_message_type: "REDIRECTED",
    txt_message: artwork.url,
  }
  const next = [entry, ...readArtworkScans()].slice(0, 200)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function mergeArtworkScans(remote: PoiseLog[]): PoiseLog[] {
  const seen = new Set<number>()
  const merged: PoiseLog[] = []
  for (const log of [...readArtworkScans(), ...remote]) {
    if (seen.has(log.int_id)) continue
    seen.add(log.int_id)
    merged.push(log)
  }
  return merged
}
