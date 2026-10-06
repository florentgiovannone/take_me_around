import { Link } from "react-router-dom"

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        <Link to="/terms">Terms</Link>
        <span aria-hidden="true"> · </span>
        <Link to="/privacy">Privacy</Link>
      </p>
      <p>Frieze Gallery is a demonstration site, independent of Frieze.</p>
    </footer>
  )
}
