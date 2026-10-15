import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"
import { useUiCopy } from "../i18n/locale"

export default function PrivacyPage() {
  const copy = useUiCopy()

  return (
    <div className="shell">
      <SiteHeader />
      <main className="legal">
        <p className="kicker">{copy.privacyKicker}</p>
        <h1>{copy.privacyTitle}</h1>
        {copy.privacyBody.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </main>
      <SiteFooter />
    </div>
  )
}
