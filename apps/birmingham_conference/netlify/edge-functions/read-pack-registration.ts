export default async (request: Request) => {
  const readKey = (Deno.env.get("REGISTRATIONS_READ_KEY") || "").trim()
  const registrationBase = (Deno.env.get("VITE_BIRMINGHAM_REGISTRATION_URL") || "")
    .trim()
    .replace(/\/$/, "")
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
  if (!readKey || !registrationBase) {
    return new Response(JSON.stringify({ error: "Registrations read is not configured." }), {
      status: 503,
      headers: { "content-type": "application/json; charset=utf-8" },
    })
  }
  return fetch(`${registrationBase}/api/registrations?packNumber=${encodeURIComponent(packNumber)}`, {
    method: "GET",
    headers: {
      "X-Registrations-Key": readKey,
      "ngrok-skip-browser-warning": "true",
    },
  })
}

export const config = { path: "/api/pack-registration" }
