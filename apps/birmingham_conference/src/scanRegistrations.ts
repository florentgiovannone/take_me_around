import { canonicalBirminghamTagName, canonicalTmaDemoTagName } from "@tma/config"
import { BIRMINGHAM_CONFERENCE_ARTWORKS, parseLogTimestampGmt, type PoiseLog } from "@tma/dashboard-scope"

export const ADMIN_REGISTRATIONS_PATH = "/api/admin/registrations"
export const PACK_REGISTRATION_PATH = "/api/pack-registration"

export type ConfirmedRegistration = {
  name: string
  surname: string
  email: string
  phoneDialCode: string
  phoneNumber: string
  phoneExtension: string
  company: string
  position: string
  town: string
  country: string
  artworkSlug: string
  artworkTitle: string
  packNumber: string
}

const PACK_DIGITS = /^\d{3}$/

function asText(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function isConfirmedRegistration(value: unknown): value is ConfirmedRegistration {
  if (!value || typeof value !== "object") return false
  const row = value as ConfirmedRegistration
  return PACK_DIGITS.test(asText(row.packNumber)) && asText(row.name) !== "" && asText(row.email) !== ""
}

function threeDigitPack(serial: number): string | null {
  if (!Number.isInteger(serial) || serial < 1 || serial > 200) return null
  return String(serial).padStart(3, "0")
}

function serialFromCanonical(code: string, prefix: string): number | null {
  if (!code.startsWith(prefix)) return null
  const digits = code.slice(prefix.length)
  if (!PACK_DIGITS.test(digits)) return null
  return Number(digits)
}

export function utcDayKey(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function todayUtcDayKey(now = new Date()): string {
  return utcDayKey(now)
}

export type UtcDayRange = {
  from: string | null
  to: string | null
}

export function normalizeUtcDayRange(range: UtcDayRange): UtcDayRange {
  const from = range.from || null
  const to = range.to || null
  if (from && to && from > to) return { from: to, to: from }
  return { from, to }
}

export function filterLogsByUtcDay<T extends { dtm_timestamp?: string | null }>(
  logs: T[],
  range: UtcDayRange
): T[] {
  const { from, to } = normalizeUtcDayRange(range)
  if (!from && !to) return logs
  return logs.filter((log) => {
    const date = parseLogTimestampGmt(log.dtm_timestamp)
    if (!date) return false
    const day = utcDayKey(date)
    if (from && day < from) return false
    if (to && day > to) return false
    return true
  })
}

export function packNumberFromMacdTag(value: string | null | undefined): string | null {
  const code = canonicalBirminghamTagName(value)
  if (!code) return null
  const macd = serialFromCanonical(code, "MACD")
  if (macd != null) return threeDigitPack(macd)
  const starSlate = serialFromCanonical(code, "MACTSOB")
  if (starSlate != null && starSlate <= 100) return threeDigitPack(starSlate)
  const goldenSlate = serialFromCanonical(code, "MACTGB")
  if (goldenSlate != null && goldenSlate <= 100) return threeDigitPack(goldenSlate + 100)
  return null
}

export function parseConfirmedRegistrations(body: unknown): ConfirmedRegistration[] {
  if (!body || typeof body !== "object" || !Array.isArray((body as { registrations?: unknown }).registrations)) {
    return []
  }
  return (body as { registrations: unknown[] }).registrations.filter(isConfirmedRegistration)
}

export function registrationForPack(
  rows: ConfirmedRegistration[],
  packNumber: string
): ConfirmedRegistration | undefined {
  return rows.find((row) => row.packNumber === packNumber)
}

export function adminScanLabel(code: string, row: ConfirmedRegistration | undefined): string {
  const pack = packNumberFromMacdTag(code)
  if (!pack || !row || row.packNumber !== pack) return code
  return `${code} · ${row.name} ${row.surname}`.trim()
}

export function registrationPhoneLabel(row: ConfirmedRegistration): string {
  if (!row.phoneNumber) return ""
  const label = `${row.phoneDialCode} ${row.phoneNumber}`.trim()
  return row.phoneExtension ? `${label} ext. ${row.phoneExtension}` : label
}

export function registrationDetailFields(
  row: ConfirmedRegistration
): { label: string; value: string }[] {
  return [
    { label: "Name", value: row.name },
    { label: "Surname", value: row.surname },
    { label: "Email", value: row.email },
    { label: "Phone", value: registrationPhoneLabel(row) },
    { label: "Company", value: row.company },
    { label: "Role within the company", value: row.position },
    { label: "Town", value: row.town },
    { label: "Country", value: row.country },
    { label: "Artwork", value: row.artworkTitle },
    { label: "Pack number", value: `MACD${row.packNumber}` },
  ]
}

export function contactPrefillFromRegistration(row: ConfirmedRegistration): {
  name: string
  email: string
  organisation: string
} {
  return {
    name: `${row.name} ${row.surname}`.trim(),
    email: row.email,
    organisation: row.company,
  }
}

export function applyContactPrefill<
  T extends { name: string; email: string; organisation: string; message: string },
>(form: T, row: ConfirmedRegistration): T {
  const prefill = contactPrefillFromRegistration(row)
  return {
    ...form,
    name: form.name.trim() ? form.name : prefill.name,
    email: form.email.trim() ? form.email : prefill.email,
    organisation: form.organisation.trim() ? form.organisation : prefill.organisation,
  }
}

export function nextContactPrefillState(args: {
  contactOpen: boolean
  alreadyApplied: boolean
  form: { name: string; email: string; organisation: string; message: string }
  match: ConfirmedRegistration | null
}): { applied: boolean; form: typeof args.form } {
  const { contactOpen, alreadyApplied, form, match } = args
  if (!contactOpen) {
    return { applied: false, form }
  }
  if (alreadyApplied) {
    return { applied: true, form }
  }
  if (!match) {
    return { applied: false, form }
  }
  return {
    applied: true,
    form: applyContactPrefill(form, match),
  }
}

function timestampMs(value: string | null | undefined): number {
  const ms = Date.parse(value ?? "")
  return Number.isNaN(ms) ? 0 : ms
}

export type BoothArtwork = {
  code: string
  title: string
  url: string
}

function boothCodeFromValue(value: string | null | undefined): string | null {
  const birmingham = canonicalBirminghamTagName(value)
  if (birmingham === "MACTSOB100" || birmingham === "MACTGB099") return birmingham
  const demo = canonicalTmaDemoTagName(value, { allowTitleAliases: false })
  if (demo === "TSN002" || demo === "TK002") return demo
  return null
}

function boothArtworkForCode(code: string): BoothArtwork | null {
  if (code === "TSN002") {
    return { code, title: "The Starry Night", url: "https://takemearound.gallery/the-starry-night" }
  }
  if (code === "TK002") {
    return { code, title: "The Kiss", url: "https://takemearound.gallery/the-kiss" }
  }
  const artwork =
    code === "MACTSOB100"
      ? BIRMINGHAM_CONFERENCE_ARTWORKS.find((item) => item.slug === "the-star-of-betlehem")
      : code === "MACTGB099"
        ? BIRMINGHAM_CONFERENCE_ARTWORKS.find((item) => item.slug === "the-golden-boys")
        : undefined
  return artwork ? { code, title: artwork.title, url: artwork.url } : null
}

export function latestBoothArtwork(logs: PoiseLog[]): BoothArtwork | null {
  const redirects = logs
    .filter((log) => (log.txt_message_type ?? "").trim().toUpperCase() === "REDIRECTED")
    .filter((log) => timestampMs(log.dtm_timestamp) > 0)
    .sort((left, right) => timestampMs(right.dtm_timestamp) - timestampMs(left.dtm_timestamp))
  for (const log of redirects) {
    const code = boothCodeFromValue(log.text_name) ?? boothCodeFromValue(log.txt_message)
    const artwork = code ? boothArtworkForCode(code) : null
    if (artwork) return artwork
  }
  return null
}

export function macdPackNumbersNewestFirst(logs: PoiseLog[]): string[] {
  const redirects = logs
    .filter((log) => (log.txt_message_type ?? "").trim().toUpperCase() === "REDIRECTED")
    .sort((left, right) => timestampMs(right.dtm_timestamp) - timestampMs(left.dtm_timestamp))
  const packs: string[] = []
  const seen = new Set<string>()
  for (const log of redirects) {
    const pack =
      packNumberFromMacdTag(log.text_name) ?? packNumberFromMacdTag(log.txt_message)
    if (!pack || seen.has(pack)) continue
    seen.add(pack)
    packs.push(pack)
  }
  return packs
}

export function latestConfirmedMacdRegistration(
  logs: PoiseLog[],
  rows: ConfirmedRegistration[]
): ConfirmedRegistration | null {
  for (const pack of macdPackNumbersNewestFirst(logs)) {
    const row = registrationForPack(rows, pack)
    if (row) return row
  }
  return null
}

export type PackLookupCache = Record<string, ConfirmedRegistration | null>

export type PackLookupMode = "untilConfirmed" | "all"

export function packsNeedingLookup(
  packsNewestFirst: string[],
  cache: PackLookupCache,
  mode: PackLookupMode
): string[] {
  if (mode === "all") {
    const next = packsNewestFirst.find((pack) => !(pack in cache))
    return next ? [next] : []
  }
  const needed: string[] = []
  for (const pack of packsNewestFirst) {
    if (pack in cache) {
      if (cache[pack]) return needed
      continue
    }
    needed.push(pack)
    return needed
  }
  return needed
}

export function rowsFromPackCache(cache: PackLookupCache): ConfirmedRegistration[] {
  return Object.values(cache).filter((row): row is ConfirmedRegistration => row !== null)
}

export function registrationFromCache(
  cache: PackLookupCache,
  packNumber: string
): ConfirmedRegistration | undefined {
  return cache[packNumber] ?? undefined
}
