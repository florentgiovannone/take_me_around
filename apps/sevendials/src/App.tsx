import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import AllPagesPage from "./pages/AllPagesPage"
import DashboardPage from "./pages/DashboardPage"
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"
import PlaquePage from "./pages/PlaquePage"
import { plaqueBySlug } from "./plaques"

const charlesBoon = plaqueBySlug("charles-boon")!
const brianEpstein = plaqueBySlug("brian-epstein")!

function PageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const normalized = pathname.replace(/^\/peoples-plaques\//, "/")
    if (normalized === "/charles-boon") {
      document.title = "Charles Boon (1877–1943) | Seven Dials Trust"
      return
    }
    if (normalized === "/brian-epstein") {
      document.title = "Brian Epstein (1934–1967) | Seven Dials Trust"
      return
    }
    const titles: Record<string, string> = {
      "/": "People's Plaques | Seven Dials Trust",
      "/allpages": "All Pages | Seven Dials Trust",
      "/dashboard": "Dashboard | Seven Dials Trust",
    }
    document.title = titles[pathname] ?? "Page Not Found | Seven Dials Trust"
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <PageTitle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/allpages" element={<AllPagesPage />} />
        <Route path="/charles-boon" element={<PlaquePage person={charlesBoon} />} />
        <Route path="/peoples-plaques/charles-boon" element={<PlaquePage person={charlesBoon} />} />
        <Route path="/brian-epstein" element={<PlaquePage person={brianEpstein} />} />
        <Route path="/peoples-plaques/brian-epstein" element={<PlaquePage person={brianEpstein} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
