import {
  registrationReadHeaders,
  resolveRegistrationBase,
  stripWrappingQuotes,
} from "../../src/registrationsReadEnv.ts"

export default async (request: Request) => {
  const readKey = stripWrappingQuotes(Deno.env.get("REGISTRATIONS_READ_KEY") || "")
  const registrationBase = resolveRegistrationBase(Deno.env.get("VITE_BIRMINGHAM_REGISTRATION_URL"))
  const url = new URL(request.url)
  const packNumber = (url.searchParams.get("packNumber") || "").trim()
  if (request.method.toUpperCase() !== "GET") {
    return new Response(null, { status: 405 })
  }
  if (!/^\d{3}$/.test(packNumber)) {
    return new Response(JSON.stringify({ error: "missing_pack" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
    })
  }
  return fetch(`${registrationBase}/api/registrations?packNumber=${encodeURIComponent(packNumber)}`, {
    method: "GET",
    headers: registrationReadHeaders(readKey),
  })
}

export const config = { path: "/api/pack-registration" }
