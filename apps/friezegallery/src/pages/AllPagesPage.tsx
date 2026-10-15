import { artworks } from "../artworks"
import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"
import { LocaleLink, useUiCopy } from "../i18n/locale"

export default function AllPagesPage() {
  const copy = useUiCopy()
  const pages = [
    { to: "/check-in", label: copy.checkInNav },
    ...artworks.map((artwork) => ({
      to: `/works/${artwork.slug}`,
      label: artwork.title,
    })),
    { to: "/terms", label: copy.terms },
    { to: "/privacy", label: copy.privacy },
    { to: "/dashboard", label: copy.dashboard },
    { to: "/allpages", label: copy.allPages },
  ]

  return (
    <div className="shell">
      <SiteHeader />
      <main className="legal">
        <p className="kicker">{copy.indexKicker}</p>
        <h1>{copy.allPages}</h1>
        <ul className="page-index">
          {pages.map((page) => (
            <li key={page.to}>
              <LocaleLink to={page.to}>{page.label}</LocaleLink>
              <span>{page.to}</span>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
