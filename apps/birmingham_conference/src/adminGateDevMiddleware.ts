import type { IncomingMessage, ServerResponse } from "node:http"
import { Buffer } from "node:buffer"
import { handleAdminGate } from "./adminGate"

function isGatedPath(pathname: string) {
  const normalized = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
  return normalized === "/admindashboard" || normalized === "/api/admin-session"
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

export function createAdminGateMiddleware(password: string) {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = new URL(req.url || "/", "http://127.0.0.1")
    if (!isGatedPath(url.pathname)) {
      next()
      return
    }
    let submittedPassword: string | null = null
    if ((req.method || "GET").toUpperCase() === "POST") {
      const body = await readRequestBody(req)
      submittedPassword = new URLSearchParams(body).get("password")
    }
    const result = await handleAdminGate({
      method: req.method || "GET",
      pathname: url.pathname,
      cookieHeader: typeof req.headers.cookie === "string" ? req.headers.cookie : null,
      password,
      submittedPassword,
      secure: String(req.headers["x-forwarded-proto"] || "").split(",")[0]?.trim() === "https",
    })
    if (result.kind === "next") {
      next()
      return
    }
    if (result.kind === "redirect") {
      res.statusCode = 302
      res.setHeader("Location", result.location)
      res.setHeader("Set-Cookie", result.setCookie)
      res.end()
      return
    }
    if (result.kind === "empty") {
      res.statusCode = result.status
      res.end()
      return
    }
    res.statusCode = result.status
    res.setHeader("Content-Type", result.contentType)
    res.end(result.body)
  }
}