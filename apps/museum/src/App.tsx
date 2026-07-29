import { Link, Route, Routes, useLocation } from "react-router-dom"
import CyrusCylinderPage from "./pages/CyrusCylinderPage"
import SuttonHooHelmetPage from "./pages/SuttonHooHelmetPage"
import HoaHakananaiPage from "./pages/HoaHakananaiPage"
import LewisChessmenPage from "./pages/LewisChessmenPage"
import RoyalGameOfUrPage from "./pages/RoyalGameOfUrPage"
import RosettaStonePage from "./pages/RosettaStonePage"
import TempleOfDendurPage from "./pages/TempleOfDendurPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import UnderlyingTechnologyPage from "./pages/UnderlyingTechnologyPage"
import ContactPage from "./pages/ContactPage"
import ExternalDashboardRedirect from "./components/ExternalDashboardRedirect"
import NotFoundPage from "./pages/NotFoundPage"
import "./styles/style.css"
import { useEffect } from "react"

const PAGE_TITLES: Record<string, string> = {
  "/": "Take Me Around",
  "/allpages": "All Pages",
  "/hoa-hakananai-a": "Hoa Hakananaiʻa",
  "/the-cyrus-cylinder": "The Cyrus Cylinder",
  "/the-lewis-chessmen": "The Lewis Chessmen",
  "/the-rosetta-stone": "The Rosetta Stone",
  "/the-royal-game-of-ur": "The Royal Game of Ur",
  "/the-sutton-hoo-helmet": "The Sutton Hoo helmet",
  "/the-temple-of-dendur": "The Temple of Dendur",
  "/underlying-technology": "Underlying Technology",
  "/contact": "Contact",
  "/privacy-policy": "Privacy Policy",
  "/dashboard": "Dashboard",
}

function PageTitleUpdater() {
  const location = useLocation()

  useEffect(() => {
    const pageTitle = PAGE_TITLES[location.pathname]
    document.title = pageTitle
      ? `${pageTitle} | Take Me Around`
      : `Page not found | Take Me Around`
  }, [location.pathname])

  return null
}

function AllPage() {
  return (
    <main style={{ margin: "0 auto", maxWidth: 900, padding: "2rem 1rem" }}>
      <h1>Take Me Around</h1>
      <p>Open the gallery page from the link below.</p>
      <p>
        <Link to="/the-cyrus-cylinder">Go to The Cyrus Cylinder page</Link>
      </p>
      <p>
        <Link to="/the-sutton-hoo-helmet">Go to The Sutton Hoo helmet page</Link>
      </p>
      <p>
        <Link to="/hoa-hakananai-a">Go to Hoa Hakananaiʻa page</Link>
      </p>
      <p>
        <Link to="/the-lewis-chessmen">Go to The Lewis Chessmen page</Link>
      </p>
      <p>
        <Link to="/the-royal-game-of-ur">Go to The Royal Game of Ur page</Link>
      </p>
      <p>
        <Link to="/the-rosetta-stone">Go to The Rosetta Stone page</Link>
      </p>
      <p>
        <Link to="/the-temple-of-dendur">Go to The Temple of Dendur page</Link>
      </p>
      <p>
        <Link to="/privacy-policy">Go to Privacy Policy page</Link>
      </p>
      <p>
        <Link to="/underlying-technology">Go to Underlying Technology page</Link>
      </p>
      <p>
        <Link to="/contact">Go to Contact page</Link>
      </p>
    </main>
  )
}

function HomePage() {
  return (
    <div className="tma-home-shell">
      <main className="tma-home-main">
        <div className="tma-home-intro">The Home Of</div>
        <h1 className="tma-home-title">Take Me Around</h1>
        <div className="tma-home-divider" />
      </main>

      <footer className="tma-home-footer">
        <div>© 2026 Take Me Around</div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <>
      <PageTitleUpdater />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/allpages" element={<AllPage />} />
        <Route path="/hoa-hakananai-a" element={<HoaHakananaiPage />} />
        <Route path="/the-cyrus-cylinder" element={<CyrusCylinderPage />} />
        <Route path="/the-lewis-chessmen" element={<LewisChessmenPage />} />
        <Route path="/the-rosetta-stone" element={<RosettaStonePage />} />
        <Route path="/the-royal-game-of-ur" element={<RoyalGameOfUrPage />} />
        <Route path="/the-sutton-hoo-helmet" element={<SuttonHooHelmetPage />} />
        <Route path="/the-temple-of-dendur" element={<TempleOfDendurPage />} />
        <Route path="/underlying-technology" element={<UnderlyingTechnologyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/dashboard"
          element={<ExternalDashboardRedirect path="/dashboard/museum" />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
