import { useEffect } from "react"
import { Link, Route, Routes, useLocation } from "react-router-dom"
import ExternalDashboardRedirect from "./components/ExternalDashboardRedirect"
import ContactPage from "./pages/ContactPage"
import NotFoundPage from "./pages/NotFoundPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import UnderlyingTechnologyPage from "./pages/UnderlyingTechnologyPage"
import WestminsterAbbeyPage from "./pages/WestminsterAbbeyPage"
import "./styles/style.css"

const PAGE_TITLES: Record<string, string> = {
  "/": "Take Me Around",
  "/allpages": "All Pages",
  "/westminster-abbey": "Westminster Abbey",
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
      <p>Church of England demo pages.</p>
      <p>
        <Link to="/westminster-abbey">Go to Westminster Abbey page</Link>
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
        <Route path="/westminster-abbey" element={<WestminsterAbbeyPage />} />
        <Route path="/underlying-technology" element={<UnderlyingTechnologyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/dashboard"
          element={
            <ExternalDashboardRedirect path="/dashboard/church-of-england" />
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
