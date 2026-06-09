import RodinSiteHeader from "../components/rodin/RodinSiteHeader"
import Footer from "../components/Footer"
import "../styles/style.css"
import "../styles/rodin-exhibition.css"

export default function NotFoundPage() {
  return (
    <div className="tma-not-found-shell arkin-exhibition-page">
      <RodinSiteHeader />
      <main className="tma-not-found-main">
        <p className="tma-not-found-eyebrow">Page not found</p>
        <h1 className="tma-not-found-code" aria-hidden="true">
          4<span className="tma-not-found-code-accent">0</span>4
        </h1>
        <p className="tma-not-found-message">
          This URL isn&apos;t part of the collection. Use the link you received for a specific artwork.
        </p>
      </main>
      <Footer />
    </div>
  )
}
