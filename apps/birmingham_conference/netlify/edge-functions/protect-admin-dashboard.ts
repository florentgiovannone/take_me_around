import { handleAdminGate } from "../../src/adminGate.ts"

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const password = (Deno.env.get("ADMIN_DASHBOARD_PASSWORD") || "").trim()
  const url = new URL(request.url)
  let submittedPassword: string | null = null
  let submittedLogout = false
  if (request.method === "POST") {
    try {
      const form = await request.formData()
      submittedPassword = String(form.get("password") ?? "")
      submittedLogout = String(form.get("logout") ?? "") === "1"
    } catch {
      submittedPassword = ""
    }
  }
  const result = await handleAdminGate({
    method: request.method,
    pathname: url.pathname,
    cookieHeader: request.headers.get("cookie"),
    password,
    submittedPassword,
    submittedLogout,
    secure: url.protocol === "https:",
  })
  if (result.kind === "next") return context.next()
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

export const config = { path: ["/admindashboard", "/api/admin-session"] }