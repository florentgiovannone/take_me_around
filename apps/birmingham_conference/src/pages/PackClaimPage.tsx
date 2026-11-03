import { useEffect, useState, type FormEvent } from "react"
import { useParams } from "react-router-dom"
import { CONSENT_LABEL, privacyAccessHint } from "../interestForm"
import {
  PACK_CLAIM_INTRO,
  PACK_CLAIM_SUBMIT,
  packClaimPayload,
  submitPackClaim,
  type PackClaimForm,
} from "../packClaim"
import { outcomeFromResponse, registrationBaseUrl } from "../registrationFlow"
import {
  PACK_REGISTRATION_PATH,
  packClaimFromTag,
  parseConfirmedRegistrations,
  registrationForPack,
} from "../scanRegistrations"
import NotFoundPage from "./NotFoundPage"
import "../styles/home.css"

const EMPTY: PackClaimForm = {
  name: "",
  surname: "",
  email: "",
  company: "",
  consent: false,
}

export default function PackClaimPage() {
  const { code = "" } = useParams()
  const target = packClaimFromTag(code)
  const [claimed, setClaimed] = useState<boolean | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [privacyContact, setPrivacyContact] = useState("")
  const [notice, setNotice] = useState("")
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [frameFailed, setFrameFailed] = useState(false)

  useEffect(() => {
    if (!target) return
    let cancelled = false
    void (async () => {
      try {
        const response = await fetch(
          `${PACK_REGISTRATION_PATH}?packNumber=${encodeURIComponent(target.packNumber)}`,
          { headers: { "ngrok-skip-browser-warning": "true" } }
        )
        if (!response.ok || cancelled) return
        const rows = parseConfirmedRegistrations(await response.json())
        if (cancelled) return
        setClaimed(Boolean(registrationForPack(rows, target.packNumber)))
      } catch {
        if (!cancelled) setClaimed(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [target])

  useEffect(() => {
    const baseUrl = registrationBaseUrl()
    if (!baseUrl) return
    void (async () => {
      try {
        const response = await fetch(`${baseUrl}/api/artworks`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        })
        if (!response.ok) return
        const body = (await response.json()) as { privacyContact?: string }
        if (typeof body.privacyContact === "string") setPrivacyContact(body.privacyContact)
      } catch {
        /* the hint is optional */
      }
    })()
  }, [])

  if (!target) return <NotFoundPage />
  if (claimed === true) {
    window.location.replace(target.destinationUrl)
    return null
  }
  if (claimed === null) return null

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!target || submitting) return
    const result = submitPackClaim(form)
    if (!result.ok) {
      setFieldErrors(result.errors)
      setNotice("")
      setSent(false)
      return
    }
    const baseUrl = registrationBaseUrl()
    if (!baseUrl) {
      setNotice("Registration is unavailable.")
      return
    }
    setFieldErrors({})
    setSubmitting(true)
    try {
      const response = await fetch(`${baseUrl}/api/pack-claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(packClaimPayload(form, target.tagCode)),
      })
      const body = (await response.json()) as {
        ok: boolean
        error?: string
        message?: string
        errors?: Record<string, string>
      }
      if (response.status === 409 && body.error === "pack_taken") {
        const lookup = await fetch(
          `${PACK_REGISTRATION_PATH}?packNumber=${encodeURIComponent(target.packNumber)}`,
          { headers: { "ngrok-skip-browser-warning": "true" } }
        )
        if (lookup.ok) {
          const rows = parseConfirmedRegistrations(await lookup.json())
          if (registrationForPack(rows, target.packNumber)) {
            window.location.replace(target.destinationUrl)
            return
          }
        }
      }
      const outcome = outcomeFromResponse(response.status, body)
      if (outcome.type === "sent") {
        setSent(true)
        setNotice(outcome.message)
        return
      }
      if (outcome.type === "fields") {
        setFieldErrors(outcome.errors)
        return
      }
      setNotice(outcome.message)
    } catch {
      setNotice("Registration is unavailable.")
    } finally {
      setSubmitting(false)
    }
  }

  const frameSrc = target.kind === "dashboard" ? "/dashboard" : target.destinationUrl

  return (
    <div className="birmingham-pack">
      <div className="birmingham-pack-stage" aria-hidden="true">
        {frameFailed ? (
          <div className="birmingham-pack-fallback" />
        ) : (
          <iframe
            className="birmingham-pack-frame"
            title={target.tagCode}
            src={frameSrc}
            onError={() => setFrameFailed(true)}
          />
        )}
      </div>
      <div className="birmingham-pack-scrim">
        <section className="birmingham-pack-modal" role="dialog" aria-modal="true">
          <p className="birmingham-interest-eyebrow">Museum Association Conference</p>
          <h1>Unlock the full experience</h1>
          <p>{PACK_CLAIM_INTRO}</p>
          {sent ? (
            <p className="birmingham-interest-thanks">{notice}</p>
          ) : (
            <form className="birmingham-interest-form" onSubmit={onSubmit} noValidate>
              <label>
                <span className="req">Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
                {fieldErrors.name ? (
                  <span className="birmingham-interest-error">{fieldErrors.name}</span>
                ) : null}
              </label>
              <label>
                <span className="req">Surname</span>
                <input
                  type="text"
                  value={form.surname}
                  onChange={(event) => setForm({ ...form, surname: event.target.value })}
                />
                {fieldErrors.surname ? (
                  <span className="birmingham-interest-error">{fieldErrors.surname}</span>
                ) : null}
              </label>
              <label>
                <span className="req">Email address</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
                {fieldErrors.email ? (
                  <span className="birmingham-interest-error">{fieldErrors.email}</span>
                ) : null}
              </label>
              <label>
                <span className="req">Company</span>
                <input
                  type="text"
                  value={form.company}
                  onChange={(event) => setForm({ ...form, company: event.target.value })}
                />
                {fieldErrors.company ? (
                  <span className="birmingham-interest-error">{fieldErrors.company}</span>
                ) : null}
              </label>
              <label className="birmingham-interest-consent">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => setForm({ ...form, consent: event.target.checked })}
                />
                <span className="req">{CONSENT_LABEL}</span>
              </label>
              {fieldErrors.consent ? (
                <span className="birmingham-interest-error">{fieldErrors.consent}</span>
              ) : null}
              {privacyContact ? (
                <p className="birmingham-interest-privacy">{privacyAccessHint(privacyContact)}</p>
              ) : null}
              {notice ? <p className="birmingham-interest-error">{notice}</p> : null}
              <button type="submit" disabled={submitting}>
                {PACK_CLAIM_SUBMIT}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
