import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"

export default function PrivacyPage() {
  return (
    <div className="shell">
      <SiteHeader />
      <main className="legal">
        <p className="kicker">Privacy</p>
        <h1>Privacy notice</h1>
        <p>
          The email address is checked in this browser so the visit can open. It is not sent to a
          server and it is not saved after you end the visit or close the tab.
        </p>
        <p>
          The public dashboard shows gallery tag activity. It does not list check-in email
          addresses.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
