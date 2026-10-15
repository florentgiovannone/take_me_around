import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"
import { LocaleLink, useUiCopy } from "../i18n/locale"

export default function NotFoundPage() {
  const copy = useUiCopy()

  return (
    <div className="shell">
      <SiteHeader />
      <main className="legal">
        <h1>{copy.pageNotInGallery}</h1>
        <p>
          <LocaleLink to="/check-in">{copy.returnToCheckIn}</LocaleLink>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
