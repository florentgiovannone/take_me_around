import { canonicalBirminghamTagName } from "@tma/config"
import type { PoiseLog } from "@tma/dashboard-scope"

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

export function packNumberFromMacdTag(value: string | null | undefined): string | null {
  const code = canonicalBirminghamTagName(value)
  if (!code?.startsWith("MACD")) return null
  const digits = code.slice("MACD".length)
  return PACK_DIGITS.test(digits) ? digits : null
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

const packLookupCache = new Map<string, ConfirmedRegistration | null>()

export function resetPackLookupCache() {
  packLookupCache.clear()
}

export function rememberPackLookup(packNumber: string, row: ConfirmedRegistration | null) {
  packLookupCache.set(packNumber, row)
}

export function uncachedPacks(packNumbers: string[]): string[] {
  return packNumbers.filter((packNumber) => !packLookupCache.has(packNumber))
}

export function registrationsFromCache(packNumbers: string[]): ConfirmedRegistration[] {
  const rows: ConfirmedRegistration[] = []
  for (const packNumber of packNumbers) {
    const row = packLookupCache.get(packNumber)
    if (row) rows.push(row)
  }
  return rows
}
