import { Link } from "react-router-dom"
import SevenDialsRoundel from "../components/SevenDialsRoundel"
import { plaques } from "../plaques"

export default function AllPagesPage() {
  return (
    <div className="sd-page">
      <header className="sd-hero">
        <div className="sd-hero-inner">
          <div className="sd-hero-copy">
            <div className="sd-kicker">
              <span>Take Me Around · Seven Dials Trust</span>
            </div>
            <h1>All Pages</h1>
            <p className="sd-standfirst">
              Open a Seven Dials Trust People&apos;s Plaque page or the live NFC dashboard from the
              links below.
            </p>
          </div>
          <div className="sd-hero-badges">
            <SevenDialsRoundel size={140} />
          </div>
        </div>
      </header>

      <main className="sd-main">
        <section className="sd-insitu-card">
          <h2>Seven Dials Project Links</h2>
          <ul className="sd-sources-list">
            <li>
              <Link to="/">Go to Seven Dials Home &amp; Directory (/)</Link>
            </li>
            {plaques.map((person) => (
              <li key={person.slug}>
                <Link to={`/${person.slug}`}>
                  Go to {person.name} ({person.lifeDates}) page (/{person.slug}) — {person.tagCode}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/dashboard">Go to Seven Dials Trust Dashboard (/dashboard)</Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
