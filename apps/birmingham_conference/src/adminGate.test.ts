import { describe, expect, it } from "vitest"
import {
  COOKIE_NAME,
  handleAdminGate,
  loginPageHtml,
  sessionCookie,
  sessionToken,
} from "./adminGate"

const password = "correct-horse-battery-staple"

describe("sessionToken", () => {
  it("accepts a token created with the same password and rejects another password", async () => {
    const token = await sessionToken(password)
    expect(await handleAdminGate({
      method: "GET",
      pathname: "/api/admin-session",
      cookieHeader: `${COOKIE_NAME}=${token}`,
      password,
      submittedPassword: null,
      secure: false,
    })).toEqual({ kind: "empty", status: 204 })
    expect(await handleAdminGate({
      method: "GET",
      pathname: "/api/admin-session",
      cookieHeader: `${COOKIE_NAME}=${token}`,
      password: "other-password",
      submittedPassword: null,
      secure: false,
    })).toEqual({ kind: "empty", status: 401 })
  })
})

describe("handleAdminGate", () => {
  it("leaves unrelated paths alone", async () => {
    expect(
      await handleAdminGate({
        method: "GET",
        pathname: "/dashboard",
        cookieHeader: null,
        password,
        submittedPassword: null,
        secure: false,
      })
    ).toEqual({ kind: "next" })
  })

  it("returns 503 when the admin password is not configured", async () => {
    const result = await handleAdminGate({
      method: "GET",
      pathname: "/admindashboard",
      cookieHeader: null,
      password: "",
      submittedPassword: null,
      secure: false,
    })
    expect(result).toMatchObject({
      kind: "unconfigured",
      status: 503,
    })
    if (result.kind === "unconfigured") {
      expect(result.body).toContain("Admin dashboard is not configured.")
    }
  })

  it("shows the login page without a cookie", async () => {
    const result = await handleAdminGate({
      method: "GET",
      pathname: "/admindashboard/",
      cookieHeader: null,
      password,
      submittedPassword: null,
      secure: false,
    })
    expect(result.kind).toBe("html")
    if (result.kind === "html") {
      expect(result.status).toBe(200)
      expect(result.body).toContain('type="password"')
      expect(result.body).toContain("Museum Association Conference")
      expect(result.body).not.toContain("That password is not correct.")
    }
  })

  it("rejects the wrong password", async () => {
    const result = await handleAdminGate({
      method: "POST",
      pathname: "/admindashboard",
      cookieHeader: null,
      password,
      submittedPassword: "nope",
      secure: false,
    })
    expect(result.kind).toBe("html")
    if (result.kind === "html") {
      expect(result.status).toBe(401)
      expect(result.body).toContain("That password is not correct.")
    }
  })

  it("sets a session cookie and redirects after the correct password", async () => {
    const result = await handleAdminGate({
      method: "POST",
      pathname: "/admindashboard",
      cookieHeader: null,
      password,
      submittedPassword: password,
      secure: true,
    })
    const token = await sessionToken(password)
    expect(result).toEqual({
      kind: "redirect",
      status: 302,
      location: "/admindashboard",
      setCookie: sessionCookie(token, true),
    })
  })

  it("lets a valid cookie through to the admin dashboard", async () => {
    const token = await sessionToken(password)
    expect(
      await handleAdminGate({
        method: "GET",
        pathname: "/admindashboard",
        cookieHeader: `${COOKIE_NAME}=${token}`,
        password,
        submittedPassword: null,
        secure: false,
      })
    ).toEqual({ kind: "next" })
  })

  it("lets a valid cookie through to the registrations list and rejects the rest", async () => {
    const token = await sessionToken(password)
    expect(
      await handleAdminGate({
        method: "GET",
        pathname: "/api/admin/registrations",
        cookieHeader: `${COOKIE_NAME}=${token}`,
        password,
        submittedPassword: null,
        secure: false,
      })
    ).toEqual({ kind: "next" })
    expect(
      await handleAdminGate({
        method: "GET",
        pathname: "/api/admin/registrations",
        cookieHeader: null,
        password,
        submittedPassword: null,
        secure: false,
      })
    ).toEqual({ kind: "empty", status: 401 })
    expect(
      await handleAdminGate({
        method: "POST",
        pathname: "/api/admin/registrations",
        cookieHeader: `${COOKIE_NAME}=${token}`,
        password,
        submittedPassword: null,
        secure: false,
      })
    ).toEqual({ kind: "empty", status: 405 })
  })

  it("returns 401 for /api/admin-session without a valid cookie", async () => {
    expect(
      await handleAdminGate({
        method: "GET",
        pathname: "/api/admin-session",
        cookieHeader: null,
        password,
        submittedPassword: null,
        secure: false,
      })
    ).toEqual({ kind: "empty", status: 401 })
  })
})

describe("loginPageHtml", () => {
  it("includes a password field and optional error", () => {
    expect(loginPageHtml()).toContain('name="password"')
    expect(loginPageHtml("That password is not correct.")).toContain(
      "That password is not correct."
    )
  })
})
