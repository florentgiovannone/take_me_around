import { useEffect } from "react"
import { Link } from "react-router-dom"
import SectionAudio from "../components/SectionAudio"
import SevenDialsRoundel from "../components/SevenDialsRoundel"
import { logPlaqueScan } from "../plaqueScans"
import { plaques, type PlaquePerson } from "../plaques"

export default function PlaquePage({ person }: { person: PlaquePerson }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    logPlaqueScan(person.tagCode, `/${person.slug}`)
  }, [person.slug, person.tagCode])

  const otherPlaque = plaques.find((item) => item.slug !== person.slug)

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

      <header className="sd-hero">
        <div className="sd-hero-inner">
          <div className="sd-hero-copy">
            <div className="sd-kicker">
              <span className="sd-tag-pill">{person.tagCode}</span>
              <span>Seven Dials Covent Garden · People&apos;s Plaque</span>
            </div>
            <h1>
              {person.name} <span className="sd-life-dates">({person.lifeDates})</span>
            </h1>
            <p className="sd-role">{person.role}</p>
            <p className="sd-standfirst">{person.standfirst}</p>

            <dl className="sd-meta-grid">
              <div>
                <dt>Plaque Location</dt>
                <dd>{person.locationTitle}</dd>
              </div>
              <div>
                <dt>Dates In-Situ</dt>
                <dd>{person.plaqueDates}</dd>
              </div>
              <div>
                <dt>Unveiled</dt>
                <dd>{person.unveiled}</dd>
              </div>
              <div>
                <dt>Sponsor</dt>
                <dd>{person.sponsor}</dd>
              </div>
            </dl>
          </div>

          <div className="sd-hero-badges">
            <div className="sd-plaque-disc" aria-label="Heritage plaque inscription">
              <div className="sd-plaque-disc-inner">
                {person.plaqueInscription.map((line, index) => (
                  <span
                    key={line}
                    className={
                      index === 0
                        ? "sd-plaque-line sd-plaque-line--name"
                        : index === 1
                          ? "sd-plaque-line sd-plaque-line--dates"
                          : "sd-plaque-line"
                    }
                  >
                    {line}
                  </span>
                ))}
                <span className="sd-plaque-line sd-plaque-line--footer">
                  SEVEN DIALS TRUST
                </span>
              </div>
            </div>
            <div className="sd-roundel-caption">
              <SevenDialsRoundel size={140} />
            </div>
          </div>
        </div>
      </header>

      <main className="sd-main">
        <section id="in-situ" className="sd-insitu-card" aria-labelledby="in-situ-heading">
          <div className="sd-insitu-header">
            <span className="sd-insitu-badge">In-Situ Street Guide</span>
            <SectionAudio workSlug={person.slug} sectionId="in-situ" />
            <h2 id="in-situ-heading">{person.inSituSummary.heading}</h2>
          </div>

          <div className="sd-insitu-addresses">
            <div>
              <span className="sd-insitu-label">Historic Address ({person.plaqueDates})</span>
              <strong>{person.historicAddress}</strong>
            </div>
            <div>
              <span className="sd-insitu-label">Modern Street Address</span>
              <strong>{person.modernAddress}</strong>
            </div>
            <div>
              <span className="sd-insitu-label">Coordinates</span>
              <strong>{person.coordinates}</strong>
            </div>
          </div>

          <div className="sd-insitu-columns">
            <div className="sd-insitu-col">
              <h3>The Street Then &amp; Now</h3>
              <p>{person.inSituSummary.streetThenAndNow}</p>
            </div>
            <div className="sd-insitu-col">
              <h3>Inside the Building</h3>
              <p>{person.inSituSummary.buildingContext}</p>
            </div>
            <div className="sd-insitu-col">
              <h3>Why This Spot Matters</h3>
              <p>{person.inSituSummary.whyHere}</p>
            </div>
          </div>

          <div className="sd-landmarks">
            <h3>Surrounding Seven Dials Context</h3>
            <ul>
              {person.inSituSummary.nearbyLandmarks.map((landmark) => (
                <li key={landmark}>{landmark}</li>
              ))}
            </ul>
          </div>
        </section>

        <nav className="sd-section-toc" aria-label="Article sections">
          <span>On this page:</span>
          {person.sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.heading}
            </a>
          ))}
          <a href="#timeline">Chronology</a>
          <a href="#sources">Sources &amp; Archives</a>
        </nav>

        {person.sections.map((section) => (
          <section key={section.id} id={section.id} className="sd-story-section">
            <div className="sd-section-head">
              <SectionAudio workSlug={person.slug} sectionId={section.id} />
              <div className="sd-section-eyebrow">{section.eyebrow}</div>
              <h2>{section.heading}</h2>
            </div>
            <p className="sd-section-lede">{section.lede}</p>
            <div className="sd-section-body">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
            {section.callout && (
              <aside className="sd-callout">
                <div className="sd-callout-label">{section.callout.label}</div>
                <p>{section.callout.body}</p>
              </aside>
            )}
          </section>
        ))}

        <section id="timeline" className="sd-timeline-section">
          <div className="sd-section-head">
            <SectionAudio workSlug={person.slug} sectionId="timeline" />
            <div className="sd-section-eyebrow">Chronology</div>
            <h2>Life &amp; Seven Dials Timeline</h2>
          </div>
          <dl className="sd-timeline">
            {person.timeline.map((item) => (
              <div key={item.year} className="sd-timeline-row">
                <dt>{item.year}</dt>
                <dd>
                  <strong>{item.heading}</strong>
                  <p>{item.detail}</p>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="sources" className="sd-sources-section">
          <div className="sd-section-eyebrow">Archival &amp; Historical References</div>
          <h2>Primary Sources &amp; Further Reading</h2>
          <ul className="sd-sources-list">
            {person.sources.map((source) => (
              <li key={source.label}>
                <div className="sd-source-title">
                  {source.href ? (
                    <a href={source.href} target="_blank" rel="noopener noreferrer">
                      {source.label} ↗
                    </a>
                  ) : (
                    <strong>{source.label}</strong>
                  )}
                </div>
                <p>{source.citation}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="sd-cross-nav" aria-label="Explore more Seven Dials plaques">
          {otherPlaque && (
            <div className="sd-cross-card">
              <span className="sd-section-eyebrow">Next Seven Dials People&apos;s Plaque</span>
              <h3>
                {otherPlaque.name} ({otherPlaque.lifeDates})
              </h3>
              <p>
                <strong>{otherPlaque.locationTitle}</strong> ({otherPlaque.plaqueDates}) —{" "}
                {otherPlaque.role}
              </p>
              <Link to={`/${otherPlaque.slug}`} className="sd-btn sd-btn--primary">
                Explore {otherPlaque.name} Plaque →
              </Link>
            </div>
          )}
          <div className="sd-cross-card sd-cross-card--alt">
            <span className="sd-section-eyebrow">Live NFC Telemetry</span>
            <h3>Seven Dials Trust Dashboard</h3>
            <p>
              View real-time NFC roundel scans, visitor activity, and plaque tap counts across Seven
              Dials.
            </p>
            <Link to="/dashboard" className="sd-btn sd-btn--secondary">
              Open Live Dashboard →
            </Link>
          </div>
        </section>
      </main>

      <footer className="sd-footer">
        <div className="sd-footer-inner">
          <div>
            <strong>Seven Dials Trust · People&apos;s Plaques</strong>
            <p>
              Seven Dials, Covent Garden — London&apos;s 1690s star-shaped seven-street quarter.
            </p>
          </div>
          <div className="sd-footer-links">
            <a href={person.officialTrustUrl} target="_blank" rel="noopener noreferrer">
              Official Seven Dials Trust Page ↗
            </a>
            <Link to="/allpages">All Pages</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
