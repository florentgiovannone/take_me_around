export const COOKIE_NAME = "mac_admin_session"
export const COOKIE_MAX_AGE_SEC = 12 * 60 * 60

const SESSION_PAYLOAD = "mac-admin-session-v1"

export type AdminGateInput = {
  method: string
  pathname: string
  cookieHeader: string | null
  password: string
  submittedPassword: string | null
  secure: boolean
}

export type AdminGateResult =
  | { kind: "next" }
  | { kind: "unconfigured"; status: 503; body: string; contentType: string }
  | { kind: "html"; status: number; body: string; contentType: string }
  | { kind: "empty"; status: number }
  | { kind: "redirect"; status: 302; location: string; setCookie: string }

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1)
  return pathname
}

function bytesToHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let diff = 0
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return diff === 0
}

export async function sessionToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(SESSION_PAYLOAD))
  return bytesToHex(signature)
}

export function sessionCookie(token: string, secure: boolean): string {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${COOKIE_MAX_AGE_SEC}`,
  ]
  if (secure) parts.push("Secure")
  return parts.join("; ")
}

export function cookieValue(header: string | null, name: string): string | null {
  if (!header) return null
  for (const part of header.split(";")) {
    const [rawName, ...rest] = part.trim().split("=")
    if (rawName === name) return rest.join("=")
  }
  return null
}

export function loginPageHtml(error = ""): string {
  const errorMarkup = error ? `<p class="error">${error}</p>` : ""
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin dashboard | Museum Association Conference</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f4f0e8;
      color: #243044;
      font-family: "Outfit", "Avenir Next", sans-serif;
    }
    main {
      width: min(calc(100% - 2rem), 28rem);
      padding: 2rem 1.75rem;
      background: #fbf9f6;
      border: 1px solid #efe7da;
      border-radius: 1.25rem;
      box-shadow: 0 16px 40px rgba(14, 35, 71, 0.12);
    }
    p.eyebrow {
      margin: 0 0 0.5rem;
      color: #b08958;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0 0 1.25rem;
      color: #0e2347;
      font-size: 1.45rem;
      line-height: 1.25;
    }
    label {
      display: grid;
      gap: 0.45rem;
      font-size: 0.9rem;
      font-weight: 600;
    }
    input {
      border: 1px solid #d9d0c3;
      border-radius: 0.75rem;
      padding: 0.8rem 0.9rem;
      font: inherit;
      background: #fff;
    }
    button {
      margin-top: 1.1rem;
      width: 100%;
      border: 0;
      border-radius: 999px;
      padding: 0.85rem 1.25rem;
      background: #0e2347;
      color: #f4f0e8;
      font: inherit;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
    }
    .error { margin: 0 0 1rem; color: #9b2c2c; }
  </style>
</head>
<body>
  <main>
    <p class="eyebrow">Take Me Around · Analytics</p>
    <h1>Museum Association Conference · Admin</h1>
    ${errorMarkup}
    <form method="post" action="/admindashboard">
      <label>
        Password
        <input type="password" name="password" autocomplete="current-password" autofocus />
      </label>
      <button type="submit">Open dashboard</button>
    </form>
  </main>
</body>
</html>`
}

function unconfigured() {
  return {
    kind: "unconfigured" as const,
    status: 503 as const,
    body: "Admin dashboard is not configured.",
    contentType: "text/plain; charset=utf-8",
  }
}

function html(status: number, body: string) {
  return {
    kind: "html" as const,
    status,
    body,
    contentType: "text/html; charset=utf-8",
  }
}

async function hasValidSession(cookieHeader: string | null, password: string) {
  const token = cookieValue(cookieHeader, COOKIE_NAME)
  if (!token) return false
  return timingSafeEqual(token, await sessionToken(password))
}

export async function handleAdminGate(input: AdminGateInput): Promise<AdminGateResult> {
  const pathname = normalizePath(input.pathname)
  const isAdminPage = pathname === "/admindashboard"
  const isSession = pathname === "/api/admin-session"
  const isRegistrationsRead = pathname === "/api/admin/registrations"
  if (!isAdminPage && !isSession && !isRegistrationsRead) return { kind: "next" }

  const password = input.password.trim()
  if (!password) return unconfigured()

  const method = input.method.toUpperCase()
  const valid = await hasValidSession(input.cookieHeader, password)

  if (isSession) {
    if (method !== "GET") return { kind: "empty", status: 405 }
    return { kind: "empty", status: valid ? 204 : 401 }
  }

  if (isRegistrationsRead) {
    if (method !== "GET") return { kind: "empty", status: 405 }
    if (!valid) return { kind: "empty", status: 401 }
    return { kind: "next" }
  }

  if (method === "POST") {
    const submitted = input.submittedPassword ?? ""
    if (!timingSafeEqual(submitted, password)) {
      return html(401, loginPageHtml("That password is not correct."))
    }
    return {
      kind: "redirect",
      status: 302,
      location: "/admindashboard",
      setCookie: sessionCookie(await sessionToken(password), input.secure),
    }
  }

  if (method !== "GET") return { kind: "empty", status: 405 }
  if (valid) return { kind: "next" }
  return html(200, loginPageHtml())
}
