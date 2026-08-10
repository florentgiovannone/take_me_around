import {
  parseDevice,
  parseLanguageLabel,
} from "./deviceHints"
import type { PetEvent } from "./types"

const SESSION_KEY = "tma-safe-pet-session-id"

/** Provisional public host for seed / docs (not shown in owner UI). */
export const SAFE_PET_HOST = "safe-pet.takemearound.gallery"

function getOrCreateId(storage: Storage, key: string, prefix: string): string {
  const existing = storage.getItem(key)?.trim()
  if (existing) return existing
  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `${prefix}-${crypto.randomUUID().slice(0, 8)}`
      : `${prefix}-${Date.now().toString(36)}`
  storage.setItem(key, next)
  return next
}

export type BrowserEventContext = Pick<
  PetEvent,
  | "userAgent"
  | "device"
  | "language"
  | "pageUrl"
  | "referrer"
  | "sessionId"
  | "tagUid"
>

/** Collect lightweight context for scan/found events (owner UI shows device only). */
export function collectBrowserEventContext(
  options: { publicId?: string; storage?: Storage } = {}
): BrowserEventContext {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {}
  }

  const storage =
    options.storage ??
    (typeof sessionStorage !== "undefined" ? sessionStorage : undefined)
  const ua = navigator.userAgent

  const ctx: BrowserEventContext = {
    userAgent: ua,
    device: parseDevice(ua),
    language: parseLanguageLabel(navigator.language || "en"),
    pageUrl: window.location.href,
    referrer: document.referrer || undefined,
  }

  if (storage) {
    ctx.sessionId = getOrCreateId(storage, SESSION_KEY, "sar")
  }
  if (options.publicId) {
    // Stand-in for NFC tag id until hardware tags exist.
    ctx.tagUid = `nfc:${options.publicId}`
  }

  return ctx
}
