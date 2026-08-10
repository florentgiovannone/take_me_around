/** Lightweight UA parsers aligned with `@tma/analytics-*` ActivityVisitDetails. */

export type DeviceKind = "mobile" | "desktop" | "tablet"
export type BrowserKind = "Chrome" | "Safari" | "Firefox" | "Edge" | "Other"
export type OperatingSystemKind =
  | "iOS"
  | "Android"
  | "Windows"
  | "macOS"
  | "Chrome OS"
  | "Linux"
  | "Windows Phone"
  | "Other"

function isAndroidUserAgent(userAgent: string) {
  if (/android/i.test(userAgent)) return true
  if (/dalvik|;\s*wv\)/i.test(userAgent)) return true
  if (
    /linux/i.test(userAgent) &&
    /mobile/i.test(userAgent) &&
    !/windows|macintosh|mac os x|iphone|ipad|ipod|cros/i.test(userAgent)
  ) {
    return true
  }
  return false
}

export function parseDevice(userAgent: string): DeviceKind {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet"
  if (/mobile|iphone|ipod|android.*mobile|blackberry|windows phone/i.test(userAgent)) {
    return "mobile"
  }
  return "desktop"
}

export function parseBrowser(userAgent: string): BrowserKind {
  if (/edg\//i.test(userAgent)) return "Edge"
  if (/firefox/i.test(userAgent)) return "Firefox"
  if (/chrome|crios|chromium/i.test(userAgent) && !/edg\//i.test(userAgent)) return "Chrome"
  if (/safari/i.test(userAgent) && !/chrome|crios|chromium/i.test(userAgent)) return "Safari"
  return "Other"
}

export function parseOperatingSystem(userAgent: string): OperatingSystemKind {
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS"
  if (isAndroidUserAgent(userAgent)) return "Android"
  if (/windows phone/i.test(userAgent)) return "Windows Phone"
  if (/windows nt/i.test(userAgent)) return "Windows"
  if (/mac os x|macintosh/i.test(userAgent)) return "macOS"
  if (/cros/i.test(userAgent)) return "Chrome OS"
  if (/linux/i.test(userAgent)) return "Linux"
  return "Other"
}

export function isAndroidUserAgentFlag(userAgent: string): boolean {
  return isAndroidUserAgent(userAgent)
}

/** Primary language label from a BCP-47 tag / Accept-Language style value. */
export function parseLanguageLabel(languageTag: string): string {
  const tag = languageTag.trim()
  if (!tag) return "Unknown"
  const langCode = tag.split(",")[0]?.split("-")[0]?.toLowerCase() ?? ""
  const CANONICAL: Record<string, string> = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    tr: "Turkish",
  }
  if (CANONICAL[langCode]) return CANONICAL[langCode]
  try {
    const languages = new Intl.DisplayNames(["en"], { type: "language" })
    return languages.of(langCode) ?? tag
  } catch {
    return tag
  }
}
