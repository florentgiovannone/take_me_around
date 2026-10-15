import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"
import { useUiCopy } from "../i18n/locale"

export default function TermsPage() {
  const copy = useUiCopy()

  return (
    <div className="shell">
      <SiteHeader />
      <main className="legal">
        <p className="kicker">{copy.termsKicker}</p>
        <h1>{copy.termsTitle}</h1>
        {copy.termsBody.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </main>
      <SiteFooter />
    </div>
  )
}
