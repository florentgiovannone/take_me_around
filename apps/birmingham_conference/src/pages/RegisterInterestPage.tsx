import { useEffect, useState, type FormEvent } from "react"
import { BrandHeader } from "@tma/brand"
import {
  registrationPayload,
  submitInterestRegistration,
  type InterestFormErrors,
  type InterestRegistration,
} from "../interestForm"
import { COUNTRIES, flagEmoji } from "../countries"
import {
  NO_ARTWORKS_AVAILABLE,
  REGISTRATION_UNAVAILABLE,
  artworkMediumLabel,
  artworkSlugAfterReload,
  artworksToShow,
  outcomeFromResponse,
  registrationBaseUrl,
  type StockedArtwork,
} from "../registrationFlow"

const EMPTY_FORM: InterestRegistration = {
  name: "",
  surname: "",
  email: "",
  company: "",
  position: "",
  town: "",
  country: "United Kingdom",
  phoneCountry: "GB",
  phoneNumber: "",
  artworkSlug: "",
  consent: false,
}

const CONSENT_LABEL =
  "I agree that Take Me Around will hold these details for up to 5 minutes to email me a confirmation link, and will keep them after I confirm so they can register my interest in this artwork and contact me about it."

export default function RegisterInterestPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<InterestFormErrors>({})
  const [artworks, setArtworks] = useState<StockedArtwork[]>([])
  const [loadFailed, setLoadFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [notice, setNotice] = useState("")
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function loadArtworks(): Promise<StockedArtwork[] | null> {
    const baseUrl = registrationBaseUrl()
    if (!baseUrl) {
      setLoadFailed(true)
      setLoaded(true)
      return null
    }
    try {
      const response = await fetch(`${baseUrl}/api/artworks`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      })
      if (!response.ok) throw new Error("artwork list failed")
      const body = (await response.json()) as {
        artworks: StockedArtwork[]
      }
      setArtworks(body.artworks)
      setLoadFailed(false)
      return body.artworks
    } catch {
      setLoadFailed(true)
      return null
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => {
    void loadArtworks()
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    const result = submitInterestRegistration(form)
    if (!result.ok) {
      setNotice("")
      setFieldErrors(result.errors)
      setSent(false)
      return
    }
    const baseUrl = registrationBaseUrl()
    if (!baseUrl) {
      setNotice(REGISTRATION_UNAVAILABLE)
      return
    }
    setFieldErrors({})
    setSubmitting(true)
    setNotice("")
    try {
      const response = await fetch(`${baseUrl}/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(registrationPayload(form)),
      })
      const body = (await response.json()) as {
        ok: boolean
        error?: string
        message?: string
        errors?: Record<string, string>
      }
      const outcome = outcomeFromResponse(response.status, body)
      if (outcome.type === "sent") {
        setSent(true)
        setNotice(outcome.message)
        return
      }
      if (outcome.type === "fields") {
        setNotice("")
        setFieldErrors(outcome.errors)
        return
      }
      if (outcome.type === "reload") {
        const reloaded = await loadArtworks()
        if (reloaded) {
          setForm((current) => ({
            ...current,
            artworkSlug: artworkSlugAfterReload(current.artworkSlug, reloaded),
          }))
        }
      }
      setNotice(outcome.message)
    } catch {
      setSent(false)
      setNotice(REGISTRATION_UNAVAILABLE)
    } finally {
      setSubmitting(false)
    }
  }

  const visible = artworksToShow(artworks)

  return (
    <div className="birmingham-interest">
      <BrandHeader homeHref="https://takemearound.com/" />
      <main>
        {sent ? (
          <div className="birmingham-interest-thanks-card">
            <p className="birmingham-interest-eyebrow">Museum Association Conference</p>
            <h1 className="birmingham-interest-thanks-title">
              Thank you for registering your interest
            </h1>
            <p className="birmingham-interest-thanks">{notice}</p>
          </div>
        ) : (
          <>
            <h1>Register interest</h1>
            {loadFailed ? (
              <p className="birmingham-interest-thanks">{REGISTRATION_UNAVAILABLE}</p>
            ) : loaded && visible.length === 0 ? (
              <p className="birmingham-interest-thanks">{NO_ARTWORKS_AVAILABLE}</p>
            ) : loaded ? (
              <form className="birmingham-interest-form" onSubmit={onSubmit} noValidate>
                <label>
                  <span className="req">Name</span>
                  <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                  {fieldErrors.name && <span className="birmingham-interest-error">{fieldErrors.name}</span>}
                </label>
                <label>
                  <span className="req">Surname</span>
                  <input type="text" value={form.surname} onChange={(event) => setForm({ ...form, surname: event.target.value })} />
                  {fieldErrors.surname && <span className="birmingham-interest-error">{fieldErrors.surname}</span>}
                </label>
                <label>
                  <span className="req">Email address</span>
                  <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                  {fieldErrors.email && <span className="birmingham-interest-error">{fieldErrors.email}</span>}
                </label>
                <label>
                  <span className="req">Company</span>
                  <input type="text" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
                  {fieldErrors.company && <span className="birmingham-interest-error">{fieldErrors.company}</span>}
                </label>
                <label>
                  <span className="req">Role within the company</span>
                  <input type="text" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} />
                  {fieldErrors.position && <span className="birmingham-interest-error">{fieldErrors.position}</span>}
                </label>
                <label>
                  <span className="req">Town</span>
                  <input type="text" value={form.town} onChange={(event) => setForm({ ...form, town: event.target.value })} />
                  {fieldErrors.town && <span className="birmingham-interest-error">{fieldErrors.town}</span>}
                </label>
                <label>
                  <span className="req">Country</span>
                  <select value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })}>
                    <option value="">Choose a country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.name}>
                        {flagEmoji(country.code)} {country.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.country && <span className="birmingham-interest-error">{fieldErrors.country}</span>}
                </label>
                <fieldset className="birmingham-interest-phone">
                  <legend>Phone number (optional)</legend>
                  <label>
                    Country code
                    <select
                      value={form.phoneCountry}
                      onChange={(event) => setForm({ ...form, phoneCountry: event.target.value })}
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {flagEmoji(country.code)} {country.dial}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.phoneCountry && <span className="birmingham-interest-error">{fieldErrors.phoneCountry}</span>}
                  </label>
                  <label>
                    Number
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={form.phoneNumber}
                      onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
                    />
                    {fieldErrors.phoneNumber && <span className="birmingham-interest-error">{fieldErrors.phoneNumber}</span>}
                  </label>
                </fieldset>
                <fieldset>
                  <legend className="req">Artwork desired</legend>
                  <div className="birmingham-interest-options">
                    {visible.map((artwork) => {
                      const medium = artworkMediumLabel(artwork.slug)
                      const selected = form.artworkSlug === artwork.slug
                      return (
                        <label
                          key={artwork.slug}
                          className={`birmingham-interest-option-card${selected ? " is-selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="artworkSlug"
                            value={artwork.slug}
                            checked={selected}
                            onChange={() => setForm({ ...form, artworkSlug: artwork.slug })}
                          />
                          <span className="birmingham-interest-option-title">{artwork.title}</span>
                          {medium && (
                            <span className="birmingham-interest-option-medium">{medium}</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                  {fieldErrors.artworkSlug && (
                    <span className="birmingham-interest-error">{fieldErrors.artworkSlug}</span>
                  )}
                </fieldset>
                <label className="birmingham-interest-consent">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) => setForm({ ...form, consent: event.target.checked })}
                  />
                  <span className="req">{CONSENT_LABEL}</span>
                </label>
                {fieldErrors.consent && <span className="birmingham-interest-error">{fieldErrors.consent}</span>}
                {notice && <p className="birmingham-interest-error">{notice}</p>}
                <button type="submit" disabled={submitting}>
                  Register interest
                </button>
              </form>
            ) : null}
          </>
        )}
      </main>
    </div>
  )
}
