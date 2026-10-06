import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"

export default function TermsPage() {
  return (
    <div className="shell">
      <SiteHeader />
      <main className="legal">
        <p className="kicker">Terms</p>
        <h1>Terms and conditions</h1>
        <p>
          Frieze Gallery is a demonstration. Checking in lets you open the three works in this
          browser for the rest of the visit.
        </p>
        <p>
          The texts and pictures on this site were written for the demonstration. They are not
          reviews, listings, or artworks published by Frieze.
        </p>
        <p>End the visit from the header when you want the check-in gate to close again.</p>
      </main>
      <SiteFooter />
    </div>
  )
}
