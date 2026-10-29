import { handleAdminGate } from "../../src/adminGate.ts"

export default async (request: Request) => {
  const password = (Deno.env.get("ADMIN_DASHBOARD_PASSWORD") || "").trim()
  const readKey = (Deno.env.get("REGISTRATIONS_READ_KEY") || "").trim()
  const registrationBase = (Deno.env.get("VITE_BIRMINGHAM_REGISTRATION_URL") || "")
    .trim()
    .replace(/\/$/, "")
  const url = new URL(request.url)
  const result = await handleAdminGate({
    method: request.method,
    pathname: url.pathname,
    cookieHeader: request.headers.get("cookie"),
    password,
    submittedPassword: null,
    secure: url.protocol === "https:",
  })
  if (result.kind === "next") {
    if (!readKey || !registrationBase) {
      return new Response(JSON.stringify({ error: "Registrations read is not configured." }), {
        status: 503,
        headers: { "content-type": "application/json; charset=utf-8" },
      })
    }
    return fetch(`${registrationBase}/api/registrations${url.search}`, {
      method: "GET",
      headers: {
        "X-Registrations-Key": readKey,
        "ngrok-skip-browser-warning": "true",
      },
    })
  }
  if (result.kind === "empty") return new Response(null, { status: result.status })
  if (result.kind === "redirect") {
    return new Response(null, {
      status: 302,
      headers: {
        Location: result.location,
        "Set-Cookie": result.setCookie,
      },
    })
  }
  return new Response(result.body, {
    status: result.status,
    headers: { "content-type": result.contentType },
  })
}

export const config = { path: "/api/admin/registrations" }
