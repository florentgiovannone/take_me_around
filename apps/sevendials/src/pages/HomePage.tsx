import { Link } from "react-router-dom"
import SevenDialsRoundel from "../components/SevenDialsRoundel"
import { plaques } from "../plaques"

export default function HomePage() {
  return (
    <div className="sd-page">
      <nav className="sd-topbar" aria-label="Seven Dials navigation">
        <div className="sd-topbar-inner">
          <Link to="/" className="sd-brand-link">
            <span className="sd-brand-dot" aria-hidden="true" />
            <span>Seven Dials Trust · People&apos;s Plaques</span>
          </Link>
        </div>
      </nav>

      <header className="sd-hero sd-hero--home">
        <div className="sd-hero-inner">
          <div className="sd-hero-copy">
            <div className="sd-kicker">
              <span>Covent Garden · London · Est. 1690s</span>
            </div>
            <h1>Seven Dials Trust People&apos;s Plaques</h1>
            <p className="sd-standfirst">
              Seven Dials is a unique quarter of London whose seven-street star layout remains as
              constructed by Thomas Neale in the early 1690s. Tap or select a People&apos;s Plaque
              below to explore the in-situ history of the notable figures who lived and worked in
              these buildings.
            </p>
            <div className="sd-home-actions">
              <Link to="/charles-boon" className="sd-btn sd-btn--primary">
                Charles Boon (1877–1943)
              </Link>
              <Link to="/brian-epstein" className="sd-btn sd-btn--primary">
                Brian Epstein (1934–1967)
              </Link>
              <Link to="/dashboard" className="sd-btn sd-btn--outline-light">
                Open Live Dashboard
              </Link>
            </div>
          </div>

          <div className="sd-hero-badges">
            <SevenDialsRoundel size={210} />
          </div>
        </div>
      </header>

      <main className="sd-main">
        <section className="sd-directory-grid" aria-label="Featured Seven Dials Plaques">
          {plaques.map((person) => (
            <article key={person.slug} className="sd-directory-card">
              <div className="sd-directory-card-top">
                <span className="sd-tag-pill">{person.tagCode}</span>
                <span className="sd-directory-dates">In-situ {person.plaqueDates}</span>
              </div>
              <h2>
                <Link to={`/${person.slug}`}>
                  {person.name} ({person.lifeDates})
                </Link>
              </h2>
              <p className="sd-directory-location">{person.locationTitle}</p>
              <p className="sd-directory-address">{person.historicAddress}</p>
              <p className="sd-directory-summary">{person.standfirst}</p>
              <div className="sd-directory-footer">
                <Link to={`/${person.slug}`} className="sd-btn sd-btn--primary">
                  Read In-Situ Guide →
                </Link>
                <a
                  href={person.officialTrustUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sd-text-link"
                >
                  Seven Dials Trust Archive ↗
                </a>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="sd-footer">
        <div className="sd-footer-inner">
          <div>
            <strong>Seven Dials Trust · People&apos;s Plaques</strong>
            <p>Take Me Around · Heritage NFC Experience</p>
          </div>
          <div className="sd-footer-links">
            <Link to="/charles-boon">Charles Boon</Link>
            <Link to="/brian-epstein">Brian Epstein</Link>
            <Link to="/allpages">All Pages</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
