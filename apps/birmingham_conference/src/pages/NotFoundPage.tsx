import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import "../styles/style.css"

export default function NotFoundPage() {
  return (
    <>
      <main className="tma-gallery-page">
        <header className="tma-header">
          <div className="tma-header-inner">
            <h1 className="tma-page-title">Page not found</h1>
          </div>
        </header>
        <div className="tma-content">
          <p>
            <Link to="/">Back to Museum Association Conference</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
