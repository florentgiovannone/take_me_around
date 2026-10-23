import { useEffect, useState, type FormEvent } from "react"
import { BrandHeader } from "@tma/brand"
import {
  submitInterestRegistration,
  type InterestFormErrors,
  type InterestRegistration,
} from "../interestForm"
import {
  REGISTRATION_UNAVAILABLE,
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
  country: "",
  artworkSlug: "",
  consent: false,
}

const CONSENT_LABEL =
  "I agree that Take Me Around will hold these details for up to 5 minutes to email me a confirmation link, and will keep them after I confirm so they can register my interest in this artwork and contact me about it."

export default function RegisterInterestPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<InterestFormErrors>({})
  const [artworks, setArtworks] = useState<StockedArtwork[]>([])
  const [privacyContact, setPrivacyContact] = useState("")
  const [loadFailed, setLoadFailed] = useState(false)
  const [notice, setNotice] = useState("")
  const [sent, setSent] = useState(false)

  async function loadArtworks(): Promise<void> {
    try {
      const response = await fetch(`${registrationBaseUrl()}/api/artworks`)
      if (!response.ok) throw new Error("artwork list failed")
      const body = (await response.json()) as {
        artworks: StockedArtwork[]
        privacyContact: string
      }
      setArtworks(body.artworks)
      setPrivacyContact(body.privacyContact)
      setLoadFailed(false)
    } catch {
      setLoadFailed(true)
    }
  }

  useEffect(() => {
    void loadArtworks()
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = submitInterestRegistration(form)
    if (!result.ok) {
      setFieldErrors(result.errors)
      setSent(false)
      return
    }
    const response = await fetch(`${registrationBaseUrl()}/api/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
      setFieldErrors(outcome.errors)
      return
    }
    if (outcome.type === "reload") await loadArtworks()
    setNotice(outcome.message)
  }

  const visible = artworksToShow(artworks)

  return (
    <div className="birmingham-interest">
      <BrandHeader homeHref="https://takemearound.com/" />
      <main>
        <h1>Register interest</h1>
        {sent ? (
          <p className="birmingham-interest-thanks">{notice}</p>
        ) : loadFailed ? (
          <p className="birmingham-interest-thanks">{REGISTRATION_UNAVAILABLE}</p>
        ) : (
          <form className="birmingham-interest-form" onSubmit={onSubmit} noValidate>
            <label>
              Name
              <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              {fieldErrors.name && <span className="birmingham-interest-error">{fieldErrors.name}</span>}
            </label>
            <label>
              Surname
              <input type="text" value={form.surname} onChange={(event) => setForm({ ...form, surname: event.target.value })} />
              {fieldErrors.surname && <span className="birmingham-interest-error">{fieldErrors.surname}</span>}
            </label>
            <label>
              Email address
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              {fieldErrors.email && <span className="birmingham-interest-error">{fieldErrors.email}</span>}
            </label>
            <label>
              Company
              <input type="text" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
              {fieldErrors.company && <span className="birmingham-interest-error">{fieldErrors.company}</span>}
            </label>
            <label>
              Position
              <input type="text" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} />
              {fieldErrors.position && <span className="birmingham-interest-error">{fieldErrors.position}</span>}
            </label>
            <label>
              Town
              <input type="text" value={form.town} onChange={(event) => setForm({ ...form, town: event.target.value })} />
              {fieldErrors.town && <span className="birmingham-interest-error">{fieldErrors.town}</span>}
            </label>
            <label>
              Country
              <input type="text" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} />
              {fieldErrors.country && <span className="birmingham-interest-error">{fieldErrors.country}</span>}
            </label>
            <fieldset>
              <legend>Artwork desired</legend>
              <div className="birmingham-interest-options">
                {visible.map((artwork) => (
                  <label key={artwork.slug}>
                    <input
                      type="radio"
                      name="artworkSlug"
                      value={artwork.slug}
                      checked={form.artworkSlug === artwork.slug}
                      onChange={() => setForm({ ...form, artworkSlug: artwork.slug })}
                    />
                    {artwork.title}
                  </label>
                ))}
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
              {CONSENT_LABEL}
            </label>
            {fieldErrors.consent && <span className="birmingham-interest-error">{fieldErrors.consent}</span>}
            {privacyContact && <p>To access or delete your details, email {privacyContact}.</p>}
            {notice && <p className="birmingham-interest-error">{notice}</p>}
            <button type="submit">Register interest</button>
          </form>
        )}
      </main>
    </div>
  )
}
