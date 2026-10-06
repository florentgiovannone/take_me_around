import { Link } from "react-router-dom"
import { artworks } from "../artworks"
import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"

const pages = [
  { to: "/", label: "Check-in" },
  ...artworks.map((artwork) => ({
    to: `/works/${artwork.slug}`,
    label: artwork.title,
  })),
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/allpages", label: "All pages" },
]

export default function AllPagesPage() {
  return (
    <div className="shell">
      <SiteHeader />
      <main className="legal">
        <p className="kicker">Index</p>
        <h1>All pages</h1>
        <ul className="page-index">
          {pages.map((page) => (
            <li key={page.to}>
              <Link to={page.to}>{page.label}</Link>
              <span>{page.to}</span>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
