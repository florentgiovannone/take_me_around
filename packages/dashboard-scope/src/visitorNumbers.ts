import type { SiteScope } from "@tma/config"
import * as gallery from "@tma/analytics-gallery"
import * as museum from "@tma/analytics-museum"
import * as arkin from "@tma/analytics-arkin"

type PoiseLog = gallery.PoiseLog & { visitor_number?: string | null }

function getSarForLog(log: PoiseLog, scope: SiteScope): string | null {
  if (scope === "arkin") return arkin.getSarFromLog(log)
  if (scope === "museum") return museum.getSarFromLog(log)
  if (scope === "gallery") return gallery.getSarFromLog(log)
  return (
    gallery.getSarFromLog(log) ??
    museum.getSarFromLog(log) ??
    arkin.getSarFromLog(log)
  )
}

function getScopedLogs(logs: PoiseLog[], scope: SiteScope): PoiseLog[] {
  if (scope === "gallery") return gallery.getGalleryLogs(logs)
  if (scope === "arkin") return arkin.getArkinLogs(logs)
  if (scope === "museum") return museum.getMuseumLogs(logs)
  const seen = new Set<number>()
  const merged: PoiseLog[] = []
  for (const row of gallery.getGalleryLogs(logs)) {
    if (seen.has(row.int_id)) continue
    seen.add(row.int_id)
    merged.push(row)
  }
  for (const row of museum.getMuseumLogs(logs)) {
    if (seen.has(row.int_id)) continue
    seen.add(row.int_id)
    merged.push(row)
  }
  for (const row of arkin.getArkinLogs(logs)) {
    if (seen.has(row.int_id)) continue
    seen.add(row.int_id)
    merged.push(row)
  }
  return merged
}

export function buildVisitorNumberBySar(logs: PoiseLog[], scope: SiteScope): Map<string, string> {
  const map = new Map<string, string>()
  for (const log of getScopedLogs(logs, scope)) {
    const sar = getSarForLog(log, scope)
    const visitorNumber = log.visitor_number?.trim()
    if (!sar || !visitorNumber || map.has(sar)) continue
    map.set(sar, visitorNumber)
  }
  return map
}

export function lookupVisitorNumber(sar: string, visitorBySar: Map<string, string>): string | null {
  return visitorBySar.get(sar) ?? null
}

function visitorNumberSortKey(visitorNumber: string): number {
  const match = /(\d{8})$/.exec(visitorNumber)
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER
}

export function sortSarsByVisitorNumber(sars: string[], visitorBySar: Map<string, string>): string[] {
  return [...sars].sort((a, b) => {
    const aVisitor = visitorBySar.get(a)
    const bVisitor = visitorBySar.get(b)
    if (aVisitor && bVisitor) {
      const byNumber = visitorNumberSortKey(aVisitor) - visitorNumberSortKey(bVisitor)
      return byNumber !== 0 ? byNumber : aVisitor.localeCompare(bVisitor)
    }
    if (aVisitor) return -1
    if (bVisitor) return 1
    return a.localeCompare(b)
  })
}

export function formatVisitorNumber(visitorNumber: string | null | undefined): string {
  if (!visitorNumber?.trim()) return "—"
  return visitorNumber.trim()
}
