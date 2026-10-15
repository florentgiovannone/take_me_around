import { FormEvent, useState } from "react"
import { isCheckedIn, markCheckedIn, validateCheckIn, type CheckInErrors } from "../checkIn"
import FriezeLogo from "../components/FriezeLogo"
import { LocaleLink, useUiCopy } from "../i18n/locale"
import type { UiCopy } from "../i18n/uiCopy"

function errorText(errors: CheckInErrors, field: keyof CheckInErrors, copy: UiCopy): string | undefined {
  const code = errors[field]
  if (!code) return undefined
  if (field === "email") return code === "invalid" ? copy.emailInvalid : copy.emailRequired
  if (field === "terms") return copy.termsRequired
  return copy.privacyRequired
}

export default function CheckInPage() {
  const copy = useUiCopy()
  const [email, setEmail] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [errors, setErrors] = useState<CheckInErrors>({})
  const [submitted, setSubmitted] = useState(isCheckedIn)
  const emailError = errorText(errors, "email", copy)
  const termsError = errorText(errors, "terms", copy)
  const privacyError = errorText(errors, "privacy", copy)

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
            <p className="kicker">{copy.visitorCheckIn}</p>
            <h1>{copy.thankYou}</h1>
            <p className="deck">{copy.emailReceived}</p>
          </>
        ) : (
          <>
            <p className="kicker">{copy.visitorCheckIn}</p>
            <h1>{copy.welcome}</h1>
            <p className="deck">{copy.checkInDeck}</p>
            <form className="check-in-form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">{copy.emailAddress}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? "email-error" : undefined}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {emailError && (
                  <p id="email-error" className="field-error" role="alert">
                    {emailError}
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
                    aria-invalid={termsError ? true : undefined}
                    aria-describedby={termsError ? "terms-error" : undefined}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                  />
                  <label htmlFor="terms">
                    {copy.agreeTermsLead}<LocaleLink to="/terms">{copy.agreeTermsLink}</LocaleLink>{copy.agreeTermsTail}
                  </label>
                </div>
                {termsError && (
                  <p id="terms-error" className="field-error" role="alert">
                    {termsError}
                  </p>
                )}
                <div className="check">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    checked={acceptedPrivacy}
                    aria-invalid={privacyError ? true : undefined}
                    aria-describedby={privacyError ? "privacy-error" : undefined}
                    onChange={(event) => setAcceptedPrivacy(event.target.checked)}
                  />
                  <label htmlFor="privacy">
                    {copy.agreePrivacyLead}<LocaleLink to="/privacy">{copy.agreePrivacyLink}</LocaleLink>{copy.agreePrivacyTail}
                  </label>
                </div>
                {privacyError && (
                  <p id="privacy-error" className="field-error" role="alert">
                    {privacyError}
                  </p>
                )}
              </div>
              <button type="submit">{copy.checkInButton}</button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
