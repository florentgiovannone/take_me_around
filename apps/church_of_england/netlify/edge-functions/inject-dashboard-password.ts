/**
 * Church /dashboard is public. Attach the API password on the server so the
 * browser never sends or stores it.
 */
export default async (request: Request) => {
  const password = (
    Deno.env.get("DASHBOARD_PASSWORD") ||
    Deno.env.get("VITE_DASHBOARD_PASSWORD") ||
    ""
  ).trim()
  const api = (
    Deno.env.get("VITE_API_PROXY_TARGET") ||
    Deno.env.get("VITE_API_BASE_URL") ||
    ""
  )
    .trim()
    .replace(/\/$/, "")

  if (!api || !password) {
    return new Response(JSON.stringify({ error: "Dashboard is not configured." }), {
      status: 503,
      headers: { "content-type": "application/json; charset=utf-8" },
    })
  }

  const incoming = new URL(request.url)
  const headers = new Headers(request.headers)
  headers.set("X-Dashboard-Password", password)
  headers.set("ngrok-skip-browser-warning", "true")
  headers.delete("host")

  return fetch(`${api}${incoming.pathname}${incoming.search}`, {
    method: request.method,
    headers,
  })
}

export const config = { path: "/api/secure/*" }
