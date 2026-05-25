function isDeployedSite(hostname: string): boolean {
  return (
    hostname === "arkin.takemearound.gallery" ||
    hostname === "takemearound.gallery" ||
    hostname === "www.takemearound.gallery" ||
    hostname.endsWith(".netlify.app")
  )
}

/** API origin for fetch(). Empty = same host (/api/...), proxied by Vite (dev) or Netlify (production). */
export function apiBaseUrl(): string {
  const proxyTarget = (import.meta.env.VITE_API_PROXY_TARGET ?? "").trim()
  const apiBase = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "")
  const hasProxyConfig = Boolean(proxyTarget || apiBase)

  if (typeof window !== "undefined") {
    const host = window.location.hostname
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "[::1]"
    if (isDeployedSite(host)) {
      return ""
    }
    if (isLocal && hasProxyConfig) {
      return ""
    }
  }

  return apiBase
}

export function apiNeedsNgrokHeader(): boolean {
  const base = apiBaseUrl()
  return base === "" || base.includes("ngrok")
}
