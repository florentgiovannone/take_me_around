import { Route, Routes, useLocation } from "react-router-dom"
import AllPagesPage from "./pages/AllPagesPage"
import Dashboard from "./pages/Dashboard"
import NotFoundPage from "./pages/NotFoundPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import RodinArtworkPage from "./pages/RodinArtworkPage"
import UnderlyingTechnologyPage from "./pages/UnderlyingTechnologyPage"
import { getRodinArtwork } from "./data/rodinArtworks"
import { getArtworkPageTitle } from "./utils/artworkTitles"
import "./styles/style.css"
import { useEffect } from "react"

const STATIC_TITLES: Record<string, string> = {
  "/allpages": "All Pages",
  "/underlying-technology": "Underlying Technology",
  "/privacy-policy": "Privacy Policy",
  "/dashboard": "Dashboard",
}

function PageTitleUpdater() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      document.title = "Dashboard | Take Me Around"
      return
    }

    const staticTitle = STATIC_TITLES[location.pathname]
    if (staticTitle) {
      document.title = `${staticTitle} | Take Me Around`
      return
    }
    const slug = location.pathname.replace(/^\//, "")
    const artwork = slug ? getRodinArtwork(slug) : undefined
    if (artwork) {
      document.title = `${getArtworkPageTitle(artwork)} | Take Me Around`
      return
    }
    document.title = "Page not found | Take Me Around"
  }, [location.pathname])

  return null
}

function App() {
  return (
    <>
      <PageTitleUpdater />
      <Routes>
        <Route path="/allpages" element={<AllPagesPage />} />
        <Route path="/underlying-technology" element={<UnderlyingTechnologyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:slug" element={<RodinArtworkPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
