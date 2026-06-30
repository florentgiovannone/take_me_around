import { Link, Route, Routes, useLocation } from "react-router-dom"
import EdmondDeBelamyPage from "./pages/EdmondDeBelamyPage"
import GalleryNouvionPage from "./pages/GalleryNouvionPage"
import MonaLisaPage from "./pages/MonaLisaPage"
import QingmingFestivalPage from "./pages/QingmingFestivalPage"
import StarryNightPage from "./pages/StarryNightPage"
import TwoFridasPage from "./pages/TwoFridasPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import UnderlyingTechnologyPage from "./pages/UnderlyingTechnologyPage"
import ContactPage from "./pages/ContactPage"
import ExternalDashboardRedirect from "./components/ExternalDashboardRedirect"
import NotFoundPage from "./pages/NotFoundPage"

import "./styles/style.css"
import { useEffect } from "react"

const PAGE_TITLES: Record<string, string> = {
  "/": "Take Me Around",
  "/portrait-of-edmond-de-belamy": "Portrait of Edmond de Belamy",
  "/gallery-nouvion-4738593893849": "The Fallen Madonna with the Big Boobies",
  "/mona-lisa": "Mona Lisa",
  "/along-the-river-during-qingming-festival-by-zhang-zeduan-attributed-12th-century":
    "Along the River During Qingming Festival",
  "/the-starry-night": "The Starry Night",
  "/the-two-fridas": "The Two Fridas",
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
      : "Page not found | Take Me Around"
  }, [location.pathname])

  return null
}

function AllPage() {
  return (
    <main style={{ margin: "0 auto", maxWidth: 900, padding: "2rem 1rem" }}>
      <h1>Take Me Around</h1>
      <p>Open the gallery page from the link below.</p>
      <p>
        <Link to="/portrait-of-edmond-de-belamy">Go to Portrait of Edmond de Belamy page</Link>
      </p>
      <p>
        <Link to="/gallery-nouvion-4738593893849">Go to Nouvion gallery page</Link>
      </p>
      <p>
        <Link to="/mona-lisa">Go to Mona Lisa page</Link>
      </p>
      <p>
        <Link to="/along-the-river-during-qingming-festival-by-zhang-zeduan-attributed-12th-century">
          Go to Qingming Festival page
        </Link>
      </p>
      <p>
        <Link to="/the-starry-night">Go to The Starry Night page</Link>
      </p>
      <p>
        <Link to="/the-two-fridas">Go to The Two Fridas page</Link>
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
        <Route path="/portrait-of-edmond-de-belamy" element={<EdmondDeBelamyPage />} />
        <Route path="/mona-lisa" element={<MonaLisaPage />} />
        <Route path="/gallery-nouvion-4738593893849" element={<GalleryNouvionPage />} />
        <Route
          path="/along-the-river-during-qingming-festival-by-zhang-zeduan-attributed-12th-century"
          element={<QingmingFestivalPage />}
        />
        <Route path="/the-starry-night" element={<StarryNightPage />} />
        <Route path="/the-two-fridas" element={<TwoFridasPage />} />
        <Route path="/underlying-technology" element={<UnderlyingTechnologyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/dashboard"
          element={<ExternalDashboardRedirect path="/dashboard" />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
