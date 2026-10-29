import { useEffect, useRef, useState, type FormEvent } from "react"
import {
  DashboardAboutLinks,
  DashboardActivityPanel,
  DashboardAudiencePanel,
  DashboardCountsPanel,
  DashboardOverviewPanel,
  DashboardSarTimelinePanel,
  DashboardTabsNav,
  SiteScopeProvider,
  type DashboardTabId,
} from "@tma/dashboard-ui"
import type { PoiseLog } from "@tma/dashboard-scope"
import { readAdminSession } from "../adminSession"
import { mergeArtworkScans, readArtworkScans } from "../artworkScans"
import {
  CONTACT_UNAVAILABLE,
  contactOutcomeFromResponse,
  contactPayload,
  validateContactForm,
  type ContactFormErrors,
} from "../contactForm"
import { registrationBaseUrl } from "../registrationFlow"
import {
  ADMIN_REGISTRATIONS_PATH,
  PACK_REGISTRATION_PATH,
  adminScanLabel,
  latestConfirmedMacdRegistration,
  macdPackNumbersNewestFirst,
  nextContactPrefillState,
  packNumberFromMacdTag,
  parseConfirmedRegistrations,
  registrationDetailFields,
  registrationForPack,
  type ConfirmedRegistration,
} from "../scanRegistrations"
import "../../../dashboard/src/styles/style.css"
import "@tma/brand/dashboard.css"
import "../styles/dashboard.css"

const POLL_INTERVAL_MS = 5000

type FetchLogsResult =
  | { ok: true; data: PoiseLog[] }
  | { ok: false; code: "denied" | "unconfigured" | "unexpected" | "status" | "network"; status?: number }

async function fetchConfirmedRegistrations(): Promise<ConfirmedRegistration[] | null> {
  try {
    const response = await fetch(ADMIN_REGISTRATIONS_PATH, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
    if (!response.ok) return null
    return parseConfirmedRegistrations(await response.json())
  } catch {
    return null
  }
}

async function fetchPackRegistration(packNumber: string): Promise<ConfirmedRegistration[] | null> {
  try {
    const response = await fetch(
      `${PACK_REGISTRATION_PATH}?packNumber=${encodeURIComponent(packNumber)}`,
      { headers: { "ngrok-skip-browser-warning": "true" } }
    )
    if (!response.ok) return null
    return parseConfirmedRegistrations(await response.json())
  } catch {
    return null
  }
}

async function fetchRegistrationsForLogs(logs: PoiseLog[]): Promise<ConfirmedRegistration[] | null> {
  const packs = macdPackNumbersNewestFirst(logs)
  if (packs.length === 0) return []
  const results = await Promise.all(packs.map((pack) => fetchPackRegistration(pack)))
  if (results.every((rows) => rows === null)) return null
  const rows: ConfirmedRegistration[] = []
  const seen = new Set<string>()
  for (const part of results) {
    if (!part) continue
    for (const row of part) {
      if (seen.has(row.packNumber)) continue
      seen.add(row.packNumber)
      rows.push(row)
    }
  }
  return rows
}

async function fetchDashboardLogs(): Promise<FetchLogsResult> {
  try {
    const response = await fetch("/api/secure/items")
    if (response.status === 401) return { ok: false, code: "denied" }
    if (response.status === 503) return { ok: false, code: "unconfigured" }
    if (!response.ok) return { ok: false, code: "status", status: response.status }
    const data = (await response.json()) as PoiseLog[]
    if (!Array.isArray(data)) return { ok: false, code: "unexpected" }
    return { ok: true, data }
  } catch {
    return { ok: false, code: "network" }
  }
}

function errorMessage(result: Extract<FetchLogsResult, { ok: false }>): string {
  if (result.code === "denied") return "Dashboard access was denied."
  if (result.code === "unconfigured") return "Dashboard API is not configured."
  if (result.code === "unexpected") return "Dashboard returned an unexpected response."
  if (result.code === "status") return `Dashboard request failed (${result.status}).`
  return "Dashboard request failed."
}

const EMPTY_FORM = { name: "", email: "", organisation: "", message: "" }

type ConferenceDashboardScope = "birmingham_conference" | "birmingham_conference_admin"

type DashboardPageProps = {
  scope?: ConferenceDashboardScope
}

export default function DashboardPage({
  scope = "birmingham_conference",
}: DashboardPageProps) {
  const showContact = scope === "birmingham_conference"
  const isAdmin = scope === "birmingham_conference_admin"
  const title =
    scope === "birmingham_conference_admin"
      ? "Museum Association Conference · Admin"
      : "Museum Association Conference"
  const subtitle =
    scope === "birmingham_conference_admin"
      ? "Live Museum Association Conference tag activity"
      : "Live Museum Association Conference activity"
  const [logs, setLogs] = useState<PoiseLog[]>(() => readArtworkScans())
  const [registrations, setRegistrations] = useState<ConfirmedRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTabId>("activity")
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({})
  const [notice, setNotice] = useState("")
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const contactRef = useRef<HTMLElement>(null)
  const contactPrefillAppliedRef = useRef(false)

  const loadLogs = async (showLoading: boolean) => {
    if (showLoading) setLoading(true)
    const result = await fetchDashboardLogs()
    const nextLogs = result.ok
      ? mergeArtworkScans(result.data)
      : mergeArtworkScans(showLoading ? [] : logs)
    setLogs(nextLogs)
    setReady(true)
    if (!result.ok) {
      if (showLoading) setError(errorMessage(result))
    } else {
      setError(null)
    }
    if (showLoading) setLoading(false)
    const confirmed = isAdmin
      ? (await fetchConfirmedRegistrations()) ?? (await fetchRegistrationsForLogs(nextLogs))
      : await fetchRegistrationsForLogs(nextLogs)
    if (confirmed !== null) {
      setRegistrations(confirmed)
    }
  }

  useEffect(() => {
    if (!isAdmin) return
    void (async () => {
      const session = await readAdminSession()
      if (session !== "open") window.location.replace("/admindashboard")
    })()
  }, [isAdmin])

  useEffect(() => {
    void loadLogs(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const interval = setInterval(() => {
      void loadLogs(false)
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [ready])

  useEffect(() => {
    if (!contactOpen) return
    contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [contactOpen])

  useEffect(() => {
    if (!contactOpen) {
      contactPrefillAppliedRef.current = false
      return
    }
    if (!showContact) return
    const match = latestConfirmedMacdRegistration(logs, registrations)
    setForm((current) => {
      const result = nextContactPrefillState({
        contactOpen,
        alreadyApplied: contactPrefillAppliedRef.current,
        form: current,
        match,
      })
      contactPrefillAppliedRef.current = result.applied
      return result.form
    })
  }, [showContact, contactOpen, logs, registrations])

  function closeContact() {
    setContactOpen(false)
    setSent(false)
    setNotice("")
    setFieldErrors({})
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    const result = validateContactForm(form)
    if (!result.ok) {
      setNotice("")
      setFieldErrors(result.errors)
      setSent(false)
      return
    }
    const baseUrl = registrationBaseUrl()
    if (!baseUrl) {
      setNotice(CONTACT_UNAVAILABLE)
      return
    }
    setFieldErrors({})
    setSubmitting(true)
    setNotice("")
    try {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(contactPayload(form)),
      })
      const body = (await response.json()) as {
        ok: boolean
        error?: string
        message?: string
        errors?: ContactFormErrors
      }
      const outcome = contactOutcomeFromResponse(response.status, body)
      if (outcome.type === "sent") {
        setForm(EMPTY_FORM)
        contactPrefillAppliedRef.current = true
        setSent(true)
        setNotice(outcome.message)
        return
      }
      if (outcome.type === "fields") {
        setNotice("")
        setFieldErrors(outcome.errors)
        return
      }
      setNotice(outcome.message)
    } catch {
      setSent(false)
      setNotice(CONTACT_UNAVAILABLE)
    } finally {
      setSubmitting(false)
    }
  }

  function registrationForTitle(title: string): ConfirmedRegistration | undefined {
    const pack = packNumberFromMacdTag(title)
    return pack ? registrationForPack(registrations, pack) : undefined
  }

  return (
    <div
      className={`tma-dashboard tma-main-dashboard tma-brand${showContact && contactOpen ? " birmingham-contact-is-open" : ""}`}
    >
      <DashboardAboutLinks />
      <header className="tma-header tma-main-dashboard-header">
        <div className="tma-header-inner tma-main-dashboard-header-inner">
          <h5 className="tma-main-dashboard-eyebrow">Take Me Around · Analytics</h5>
          <h1 className="tma-page-title tma-main-dashboard-title">{title}</h1>
          <p className="tma-page-subtitle tma-main-dashboard-subtitle">{subtitle}</p>
        </div>
        {isAdmin ? (
          <form className="birmingham-admin-logout" method="post" action="/admindashboard">
            <input type="hidden" name="logout" value="1" />
            <button type="submit">Logout</button>
          </form>
        ) : null}
      </header>
      <div className="tma-content">
        <DashboardTabsNav activeTab={activeTab} onChange={setActiveTab} />
        {loading && (
          <div className="tma-analytics-card tma-dashboard-status-card">
            <p>Loading activity</p>
          </div>
        )}
        {error && <p className="tma-dashboard-error">{error}</p>}
        <SiteScopeProvider
          scope={scope}
          scanTitle={
            isAdmin ? (title) => adminScanLabel(title, registrationForTitle(title)) : undefined
          }
          scanRegistrationFields={
            isAdmin
              ? (title) => {
                  const row = registrationForTitle(title)
                  return row ? registrationDetailFields(row) : null
                }
              : undefined
          }
        >
          {!loading && activeTab === "activity" && <DashboardActivityPanel logs={logs} />}
          {!loading && activeTab === "counts" && <DashboardCountsPanel logs={logs} />}
          {!loading && activeTab === "overview" && <DashboardOverviewPanel logs={logs} />}
          {!loading && activeTab === "audience" && <DashboardAudiencePanel logs={logs} />}
          {!loading && activeTab === "sar" && <DashboardSarTimelinePanel logs={logs} />}
        </SiteScopeProvider>
        {showContact && contactOpen && (
          <section className="tma-analytics-card birmingham-contact" ref={contactRef}>
            <div className="birmingham-contact-heading">
              <h2>Talk to Take Me Around</h2>
              <button
                type="button"
                className="birmingham-contact-close"
                disabled={submitting}
                onClick={closeContact}
              >
                Close
              </button>
            </div>
            <p>Tell us about your venue.</p>
            {sent ? (
              <p className="birmingham-contact-thanks">{notice}</p>
            ) : (
              <form className="birmingham-contact-form" onSubmit={onSubmit} noValidate>
                <label>
                  Name
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                  {fieldErrors.name && <span className="birmingham-contact-error">{fieldErrors.name}</span>}
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                  {fieldErrors.email && (
                    <span className="birmingham-contact-error">{fieldErrors.email}</span>
                  )}
                </label>
                <label>
                  Organisation
                  <input
                    value={form.organisation}
                    onChange={(event) => setForm({ ...form, organisation: event.target.value })}
                  />
                  {fieldErrors.organisation && (
                    <span className="birmingham-contact-error">{fieldErrors.organisation}</span>
                  )}
                </label>
                <label>
                  Message
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                  />
                  {fieldErrors.message && (
                    <span className="birmingham-contact-error">{fieldErrors.message}</span>
                  )}
                </label>
                {notice && <p className="birmingham-contact-error">{notice}</p>}
                <button type="submit" disabled={submitting}>
                  Send message
                </button>
              </form>
            )}
          </section>
        )}
      </div>
      {showContact && !contactOpen && (
        <button type="button" className="birmingham-contact-open" onClick={() => setContactOpen(true)}>
          Talk to us
        </button>
      )}
    </div>
  )
}
