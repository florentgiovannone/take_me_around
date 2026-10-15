import { Link, useNavigate } from "react-router-dom"
import { clearCheckIn, isCheckedIn } from "../checkIn"
import { useLocalizedPath, useUiCopy } from "../i18n/locale"
import FriezeLogo from "./FriezeLogo"

export default function SiteHeader() {
  const copy = useUiCopy()
  const path = useLocalizedPath()
  const navigate = useNavigate()
  const checkedIn = isCheckedIn()

  return (
    <header className="site-header">
      <Link className="wordmark" to={path("/check-in")} aria-label="Frieze">
        <FriezeLogo />
      </Link>
      {checkedIn && (
        <nav className="site-nav" aria-label="Gallery">
          <button
            type="button"
            className="text-button"
            onClick={() => {
              clearCheckIn()
              navigate(path("/check-in"))
            }}
          >
            {copy.endVisit}
          </button>
        </nav>
      )}
    </header>
  )
}
