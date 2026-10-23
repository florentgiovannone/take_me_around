import { useState, type FormEvent } from "react"
import { BrandHeader } from "@tma/brand"
import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"
import {
  submitInterestRegistration,
  type InterestFormErrors,
  type InterestRegistration,
} from "../interestForm"

const EMPTY_FORM: InterestRegistration = {
  name: "",
  surname: "",
  email: "",
  position: "",
  company: "",
  town: "",
  country: "",
  artworkSlug: "",
}

export default function RegisterInterestPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<InterestFormErrors>({})
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = submitInterestRegistration(form)
    if (!result.ok) {
      setFieldErrors(result.errors)
      setSent(false)
      return
    }
    setFieldErrors({})
    setSent(true)
  }

  return (
    <div className="birmingham-interest">
      <BrandHeader homeHref="https://takemearound.com/" />
      <main>
        <h1>Register interest</h1>
        {sent ? (
          <p className="birmingham-interest-thanks">Thank you. Your interest is registered.</p>
        ) : (
          <form className="birmingham-interest-form" onSubmit={onSubmit} noValidate>
            <label>
              Name
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              {fieldErrors.name && <span className="birmingham-interest-error">{fieldErrors.name}</span>}
            </label>
            <label>
              Surname
              <input
                type="text"
                value={form.surname}
                onChange={(event) => setForm({ ...form, surname: event.target.value })}
              />
              {fieldErrors.surname && (
                <span className="birmingham-interest-error">{fieldErrors.surname}</span>
              )}
            </label>
            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
              {fieldErrors.email && (
                <span className="birmingham-interest-error">{fieldErrors.email}</span>
              )}
            </label>
            <label>
              Position
              <input
                type="text"
                value={form.position}
                onChange={(event) => setForm({ ...form, position: event.target.value })}
              />
              {fieldErrors.position && (
                <span className="birmingham-interest-error">{fieldErrors.position}</span>
              )}
            </label>
            <label>
              Company
              <input
                type="text"
                value={form.company}
                onChange={(event) => setForm({ ...form, company: event.target.value })}
              />
              {fieldErrors.company && (
                <span className="birmingham-interest-error">{fieldErrors.company}</span>
              )}
            </label>
            <label>
              Town of company
              <input
                type="text"
                value={form.town}
                onChange={(event) => setForm({ ...form, town: event.target.value })}
              />
              {fieldErrors.town && <span className="birmingham-interest-error">{fieldErrors.town}</span>}
            </label>
            <label>
              Country
              <input
                type="text"
                value={form.country}
                onChange={(event) => setForm({ ...form, country: event.target.value })}
              />
              {fieldErrors.country && (
                <span className="birmingham-interest-error">{fieldErrors.country}</span>
              )}
            </label>
            <fieldset>
              <legend>Artwork desired</legend>
              <div className="birmingham-interest-options">
                {BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => (
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
            <button type="submit">Register interest</button>
          </form>
        )}
      </main>
    </div>
  )
}
