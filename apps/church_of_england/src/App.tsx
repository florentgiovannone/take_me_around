import { BrandHeader } from "@tma/brand"
import { useEffect } from "react"
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import ContactPage from "./pages/ContactPage"
import Dashboard from "./pages/Dashboard"
import NotFoundPage from "./pages/NotFoundPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import UnderlyingTechnologyPage from "./pages/UnderlyingTechnologyPage"
import SouthwellMinsterPage from "./pages/SouthwellMinsterPage"
import "./styles/style.css"
import "./styles/home.css"
import "./styles/southwell-minster.css"

export const SOUTHWELL_MINSTER_PATH = "/minster_cathedral/Southwell/deans_welcome_message"

const PAGE_TITLES: Record<string, string> = {
  "/": "Take Me Around",
  "/allpages": "All Pages",
  [SOUTHWELL_MINSTER_PATH]: "Southwell Minster",
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
    <div className="southwell-minster church-allpages">
      <main>
        <section>
          <h1>Take Me Around</h1>
          <p className="lede">Church of England demo pages.</p>
          <p>
            <Link to={SOUTHWELL_MINSTER_PATH}>Go to Southwell Minster page</Link>
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
          <p>
            <Link to="/dashboard">Go to Dashboard page</Link>
          </p>
        </section>
      </main>
      <footer>
        <div className="colophon">Take Me Around</div>
        <div>Church of England</div>
      </footer>
    </div>
  )
}

function HomePage() {
  return (
    <>
      <BrandHeader homeHref="https://takemearound.com/" />
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
    </>
  )
}

function App() {
  return (
    <>
      <PageTitleUpdater />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/allpages" element={<AllPage />} />
        <Route path={SOUTHWELL_MINSTER_PATH} element={<SouthwellMinsterPage />} />
        <Route path="/Southwell_Minster/introduction" element={<Navigate to={SOUTHWELL_MINSTER_PATH} replace />} />
        <Route path="/Southwell_Minster" element={<Navigate to={SOUTHWELL_MINSTER_PATH} replace />} />
        <Route path="/southwell-minster" element={<Navigate to={SOUTHWELL_MINSTER_PATH} replace />} />
        <Route path="/underlying-technology" element={<UnderlyingTechnologyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
