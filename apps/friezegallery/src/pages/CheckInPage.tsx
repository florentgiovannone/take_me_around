import { FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { isCheckedIn, markCheckedIn, validateCheckIn, type CheckInErrors } from "../checkIn"
import FriezeLogo from "../components/FriezeLogo"

export default function CheckInPage() {
  const [email, setEmail] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [errors, setErrors] = useState<CheckInErrors>({})
  const [submitted, setSubmitted] = useState(isCheckedIn)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateCheckIn({ email, acceptedTerms, acceptedPrivacy })
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    markCheckedIn()
    setSubmitted(true)
  }

  return (
    <div className="check-in">
      <header className="site-header">
        <p className="wordmark">
          <FriezeLogo />
        </p>
      </header>
      <main className="check-in-main">
        {submitted ? (
          <>
            <p className="kicker">Visitor check-in</p>
            <h1>Thank you.</h1>
            <p className="deck">Your email address has been received.</p>
          </>
        ) : (
          <>
            <p className="kicker">Visitor check-in</p>
            <h1>Welcome to the gallery.</h1>
            <p className="deck">
              Leave an email address and accept the terms and the privacy notice.
            </p>
            <form className="check-in-form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {errors.email && (
                  <p id="email-error" className="field-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="checks">
                <div className="check">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    aria-invalid={errors.terms ? true : undefined}
                    aria-describedby={errors.terms ? "terms-error" : undefined}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                  />
                  <label htmlFor="terms">
                    I agree to the <Link to="/terms">terms and conditions</Link>.
                  </label>
                </div>
                {errors.terms && (
                  <p id="terms-error" className="field-error" role="alert">
                    {errors.terms}
                  </p>
                )}
                <div className="check">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    checked={acceptedPrivacy}
                    aria-invalid={errors.privacy ? true : undefined}
                    aria-describedby={errors.privacy ? "privacy-error" : undefined}
                    onChange={(event) => setAcceptedPrivacy(event.target.checked)}
                  />
                  <label htmlFor="privacy">
                    I agree to the <Link to="/privacy">privacy notice</Link>.
                  </label>
                </div>
                {errors.privacy && (
                  <p id="privacy-error" className="field-error" role="alert">
                    {errors.privacy}
                  </p>
                )}
              </div>
              <button type="submit">Check in</button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
