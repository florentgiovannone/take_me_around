import { Link, useNavigate } from "react-router-dom"
import { clearCheckIn, isCheckedIn } from "../checkIn"
import FriezeLogo from "./FriezeLogo"

export default function SiteHeader() {
  const navigate = useNavigate()
  const checkedIn = isCheckedIn()

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Frieze">
        <FriezeLogo />
      </Link>
      {checkedIn && (
        <nav className="site-nav" aria-label="Gallery">
          <button
            type="button"
            className="text-button"
            onClick={() => {
              clearCheckIn()
              navigate("/")
            }}
          >
            End visit
          </button>
        </nav>
      )}
    </header>
  )
}
