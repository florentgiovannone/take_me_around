import { registrationAdminHomeTarget } from "../../src/registrationAdminProxy.ts"

export default async (request: Request) => {
  const registrationBase = (Deno.env.get("VITE_BIRMINGHAM_REGISTRATION_URL") || "")
    .trim()
    .replace(/\/$/, "")
  if (!registrationBase) {
    return new Response("Registration admin is not configured.", { status: 503 })
  }
  const url = new URL(request.url)
  const headers = new Headers()
  const cookie = request.headers.get("cookie")
  const accept = request.headers.get("accept")
  if (cookie) headers.set("cookie", cookie)
  if (accept) headers.set("accept", accept)
  headers.set("ngrok-skip-browser-warning", "true")
  return fetch(registrationAdminHomeTarget(registrationBase, url.search), {
    method: request.method,
    headers,
    redirect: "manual",
  })
}

export const config = { path: ["/admin", "/admin/"] }
