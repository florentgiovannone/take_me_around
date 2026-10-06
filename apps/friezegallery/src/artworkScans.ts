import type { PoiseLog } from "@tma/dashboard-scope"

const STORAGE_KEY = "frieze-gallery-artwork-scans"
const DEDUPE_MS = 1500
const recent = new Map<string, number>()

export function readArtworkScans(): PoiseLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PoiseLog[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((log) => typeof log?.text_name === "string" && log.text_name.startsWith("FG"))
  } catch {
    return []
  }
}

export function logArtworkScan(textName: string, path: string): void {
  const now = Date.now()
  const last = recent.get(textName) ?? 0
  if (now - last < DEDUPE_MS) return
  recent.set(textName, now)

  const entry: PoiseLog = {
    int_id: now,
    dtm_timestamp: new Date(now).toISOString(),
    txt_uid: null,
    text_name: textName,
    txt_message_type: "REDIRECTED",
    txt_message: path,
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
