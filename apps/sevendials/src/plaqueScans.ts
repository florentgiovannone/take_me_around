import { canonicalSevenDialsTagName } from "@tma/analytics-store-codes"
import type { PoiseLog } from "@tma/dashboard-scope"

const STORAGE_KEY = "sevendials-plaque-scans"
const DEDUPE_MS = 1500
const recent = new Map<string, number>()
let lastAssignedId = 0

export function clearPlaqueScansMemoryCache(): void {
  recent.clear()
  lastAssignedId = 0
}

export function readPlaqueScans(): PoiseLog[] {
  try {
    if (typeof localStorage === "undefined") return []
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PoiseLog[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (log) =>
        canonicalSevenDialsTagName(log?.text_name) !== null ||
        canonicalSevenDialsTagName(log?.txt_message) !== null
    )
  } catch {
    return []
  }
}

export function logPlaqueScan(textName: string, path: string): void {
  const canonical = canonicalSevenDialsTagName(textName) ?? canonicalSevenDialsTagName(path)
  if (!canonical) return

  const now = Date.now()
  const last = recent.get(canonical) ?? 0
  if (now - last < DEDUPE_MS) return
  recent.set(canonical, now)

  const id = Math.max(now, lastAssignedId + 1)
  lastAssignedId = id

  const entry: PoiseLog = {
    int_id: id,
    dtm_timestamp: new Date(now).toISOString(),
    txt_uid: null,
    text_name: canonical,
    txt_message_type: "REDIRECTED",
    txt_message: path,
  }
  try {
    if (typeof localStorage === "undefined") return
    const next = [entry, ...readPlaqueScans()].slice(0, 200)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore storage quota or SSR errors
  }
}

export function mergePlaqueScans(remote: PoiseLog[]): PoiseLog[] {
  const seen = new Set<number>()
  const merged: PoiseLog[] = []
  for (const log of [...readPlaqueScans(), ...remote]) {
    if (seen.has(log.int_id)) continue
    seen.add(log.int_id)
    merged.push(log)
  }
  return merged
}
