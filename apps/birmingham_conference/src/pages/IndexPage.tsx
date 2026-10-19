import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import "../styles/style.css"

export default function IndexPage() {
  return (
    <>
      <main className="tma-gallery-page">
        <header className="tma-header">
          <div className="tma-header-inner">
            <h1 className="tma-page-title">Birmingham Conference</h1>
          </div>
        </header>
        <div className="tma-content">
          <p>
            <Link to="/the-star-of-bethlehem">The Star of Bethlehem</Link>
          </p>
          <p>
            <Link to="/the-golden-boys">The Golden Boys</Link>
          </p>
          <p>
            <Link to="/dashboard">Dashboard</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
