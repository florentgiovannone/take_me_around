import { Link } from "react-router-dom"
import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"

export default function NotFoundPage() {
  return (
    <div className="shell">
      <SiteHeader />
      <main className="legal">
        <h1>This page is not in the gallery.</h1>
        <p>
          <Link to="/">Return to check-in</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
