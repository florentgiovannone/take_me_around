import { Link } from "react-router-dom"
import SevenDialsRoundel from "../components/SevenDialsRoundel"

export default function NotFoundPage() {
  return (
    <div className="sd-page">
      <header className="sd-hero">
        <div className="sd-hero-inner">
          <div className="sd-hero-copy">
            <div className="sd-kicker">
              <span>404 · Page Not Found</span>
            </div>
            <h1>Plaque Not Found</h1>
            <p className="sd-standfirst">
              We couldn&apos;t find a Seven Dials Trust page at this address. Choose one of the
              People&apos;s Plaques or open the live dashboard below.
            </p>
            <div className="sd-home-actions">
              <Link to="/charles-boon" className="sd-btn sd-btn--primary">
                Charles Boon (1877–1943)
              </Link>
              <Link to="/brian-epstein" className="sd-btn sd-btn--primary">
                Brian Epstein (1934–1967)
              </Link>
              <Link to="/dashboard" className="sd-btn sd-btn--outline-light">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="sd-hero-badges">
            <SevenDialsRoundel size={150} />
          </div>
        </div>
      </header>
    </div>
  )
}
