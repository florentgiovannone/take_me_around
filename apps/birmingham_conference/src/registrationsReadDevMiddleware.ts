import type { IncomingMessage, ServerResponse } from "node:http"
import { handleAdminGate } from "./adminGate"
import { registrationReadHeaders } from "./registrationsReadEnv"

function applyGateResult(
  result: Awaited<ReturnType<typeof handleAdminGate>>,
  res: ServerResponse
) {
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
  if (result.kind === "unconfigured" || result.kind === "html") {
    res.statusCode = result.status
    res.setHeader("Content-Type", result.contentType)
    res.end(result.body)
  }
}

export function createRegistrationsReadMiddleware(options: {
  adminPassword: string
  registrationBase: string
  readKey: string
}) {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = new URL(req.url || "/", "http://127.0.0.1")
    const pathname = url.pathname.length > 1 && url.pathname.endsWith("/")
      ? url.pathname.slice(0, -1)
      : url.pathname
    if (pathname !== "/api/admin/registrations" && pathname !== "/api/pack-registration") {
      next()
      return
    }
    const packNumber = (url.searchParams.get("packNumber") || "").trim()
    if (pathname === "/api/pack-registration") {
      if (!/^\d{3}$/.test(packNumber)) {
        res.statusCode = 400
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        res.end(JSON.stringify({ error: "missing_pack" }))
        return
      }
    } else {
      const result = await handleAdminGate({
        method: req.method || "GET",
        pathname,
        cookieHeader: typeof req.headers.cookie === "string" ? req.headers.cookie : null,
        password: options.adminPassword,
        submittedPassword: null,
        secure: String(req.headers["x-forwarded-proto"] || "").split(",")[0]?.trim() === "https",
      })
      if (result.kind !== "next") {
        applyGateResult(result, res)
        return
      }
    }
    if (!options.registrationBase) {
      res.statusCode = 503
      res.setHeader("Content-Type", "application/json; charset=utf-8")
      res.end(JSON.stringify({ error: "Registrations read is not configured." }))
      return
    }
    const query = pathname === "/api/pack-registration" ? `?packNumber=${encodeURIComponent(packNumber)}` : url.search
    try {
      const upstream = await fetch(`${options.registrationBase}/api/registrations${query}`, {
        headers: registrationReadHeaders(options.readKey),
      })
      const body = Buffer.from(await upstream.arrayBuffer())
      res.statusCode = upstream.status
      upstream.headers.forEach((value, key) => {
        if (key === "transfer-encoding" || key === "content-encoding") return
        res.setHeader(key, value)
      })
      res.end(body)
    } catch {
      res.statusCode = 502
      res.setHeader("Content-Type", "application/json; charset=utf-8")
      res.end(JSON.stringify({ error: "Registrations could not be loaded." }))
    }
  }
}
