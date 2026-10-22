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
import { mergeArtworkScans, readArtworkScans } from "../artworkScans"
import { validateContactForm, type ContactFormErrors } from "../contactForm"
import "../../../dashboard/src/styles/style.css"
import "@tma/brand/dashboard.css"
import "../styles/dashboard.css"

const POLL_INTERVAL_MS = 5000

type FetchLogsResult =
  | { ok: true; data: PoiseLog[] }
  | { ok: false; code: "denied" | "unconfigured" | "unexpected" | "status" | "network"; status?: number }

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

export default function DashboardPage() {
  const [logs, setLogs] = useState<PoiseLog[]>(() => readArtworkScans())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTabId>("activity")
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({})
  const [sent, setSent] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const contactRef = useRef<HTMLElement>(null)

  const loadLogs = async (showLoading: boolean) => {
    if (showLoading) setLoading(true)
    const result = await fetchDashboardLogs()
    if (!result.ok) {
      setLogs((current) => mergeArtworkScans(showLoading ? [] : current))
      setReady(true)
      if (showLoading) setError(errorMessage(result))
      if (showLoading) setLoading(false)
      return
    }
    setLogs(mergeArtworkScans(result.data))
    setReady(true)
    setError(null)
    if (showLoading) setLoading(false)
  }

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

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateContactForm(form)
    if (!result.ok) {
      setFieldErrors(result.errors)
      setSent(false)
      return
    }
    setFieldErrors({})
    setSent(true)
  }

  return (
    <div
      className={`tma-dashboard tma-main-dashboard tma-brand${contactOpen ? " birmingham-contact-is-open" : ""}`}
    >
      <DashboardAboutLinks />
      <header className="tma-header tma-main-dashboard-header">
        <div className="tma-header-inner tma-main-dashboard-header-inner">
          <h5 className="tma-main-dashboard-eyebrow">Take Me Around · Analytics</h5>
          <h1 className="tma-page-title tma-main-dashboard-title">Birmingham Conference</h1>
          <p className="tma-page-subtitle tma-main-dashboard-subtitle">
            Live Birmingham Conference activity
          </p>
        </div>
      </header>
      <div className="tma-content">
        <DashboardTabsNav activeTab={activeTab} onChange={setActiveTab} />
        {loading && (
          <div className="tma-analytics-card tma-dashboard-status-card">
            <p>Loading activity</p>
          </div>
        )}
        {error && <p className="tma-dashboard-error">{error}</p>}
        <SiteScopeProvider scope="birmingham_conference">
          {!loading && activeTab === "activity" && <DashboardActivityPanel logs={logs} />}
          {!loading && activeTab === "counts" && <DashboardCountsPanel logs={logs} />}
          {!loading && activeTab === "overview" && <DashboardOverviewPanel logs={logs} />}
          {!loading && activeTab === "audience" && <DashboardAudiencePanel logs={logs} />}
          {!loading && activeTab === "sar" && <DashboardSarTimelinePanel logs={logs} />}
        </SiteScopeProvider>
        {contactOpen && (
          <section className="tma-analytics-card birmingham-contact" ref={contactRef}>
            <div className="birmingham-contact-heading">
              <h2>Talk to Take Me Around</h2>
              <button
                type="button"
                className="birmingham-contact-close"
                onClick={() => setContactOpen(false)}
              >
                Close
              </button>
            </div>
            <p>Tell us about your venue.</p>
            {sent ? (
              <p className="birmingham-contact-thanks">
                Thank you. This page confirms your message only. It is not sent or saved.
              </p>
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
                <button type="submit">Send message</button>
              </form>
            )}
          </section>
        )}
      </div>
      {!contactOpen && (
        <button type="button" className="birmingham-contact-open" onClick={() => setContactOpen(true)}>
          Talk to us
        </button>
      )}
    </div>
  )
}
