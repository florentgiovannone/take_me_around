export type AdminSessionState = "open" | "denied" | "unconfigured" | "error"

export async function readAdminSession(
  fetchImpl: typeof fetch = fetch
): Promise<AdminSessionState> {
  try {
    const response = await fetchImpl("/api/admin-session", { credentials: "same-origin" })
    if (response.status === 204) return "open"
    if (response.status === 503) return "unconfigured"
    return "denied"
  } catch {
    return "error"
  }
}
