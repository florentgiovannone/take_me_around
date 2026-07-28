import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="tma-not-found-shell">
      <main className="tma-not-found-main">
        <p className="tma-not-found-eyebrow">Page not found</p>
        <h1 className="tma-not-found-code" aria-hidden="true">
          4<span className="tma-not-found-code-accent">0</span>4
        </h1>
        <p className="tma-not-found-message">
          This URL isn’t part of the collection. Head back to the entrance and start the tour again.
        </p>
        <Link to="/" className="tma-not-found-home-link">
          Take me home
        </Link>
      </main>

      <footer className="tma-home-footer">
        <div>© 2026 Take Me Around</div>
      </footer>
    </div>
  )
}
