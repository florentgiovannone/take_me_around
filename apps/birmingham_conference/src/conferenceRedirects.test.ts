import { describe, expect, it } from "vitest"
import { conferenceRedirects } from "./conferenceRedirects"

describe("conferenceRedirects", () => {
  it("puts the registration admin on the HTTPS frontend origin", () => {
    expect(
      conferenceRedirects({
        proxyBase: "https://api.example",
        registrationBase: "http://backend.example:5051",
      })
    ).toEqual([
      "/api/*  https://api.example/api/:splat  200",
      "/registration-api/*  http://backend.example:5051/:splat  200",
      "/confirm  http://backend.example:5051/confirm  200",
      "/admin/*  http://backend.example:5051/admin/:splat  200",
      "/admin  http://backend.example:5051/admin  200",
      "/static/*  http://backend.example:5051/static/:splat  200",
      "/*    /index.html   200",
    ])
  })

  it("still falls through to the app when no backends are configured", () => {
    expect(conferenceRedirects({ proxyBase: "", registrationBase: "" })).toEqual([
      "/*    /index.html   200",
    ])
  })
})
