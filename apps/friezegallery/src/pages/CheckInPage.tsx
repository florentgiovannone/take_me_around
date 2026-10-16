import { FormEvent, useState } from "react"
import { isCheckedIn, markCheckedIn } from "../checkIn"
import FriezeLogo from "../components/FriezeLogo"
import { useUiCopy } from "../i18n/locale"

export default function CheckInPage() {
  const copy = useUiCopy()
  const [submitted, setSubmitted] = useState(isCheckedIn)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
          </>
        ) : (
          <>
            <p className="kicker">{copy.visitorCheckIn}</p>
            <h1>{copy.welcome}</h1>
            <p className="deck">{copy.checkInDeck}</p>
            <form className="check-in-form" onSubmit={onSubmit}>
              <button type="submit">{copy.checkInButton}</button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
