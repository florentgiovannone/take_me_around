import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { artworkBySlug } from "./artworks"
import AllPagesPage from "./pages/AllPagesPage"
import ArtworkPage from "./pages/ArtworkPage"
import CheckInPage from "./pages/CheckInPage"
import DashboardPage from "./pages/DashboardPage"
import NotFoundPage from "./pages/NotFoundPage"
import PrivacyPage from "./pages/PrivacyPage"
import TermsPage from "./pages/TermsPage"

function PageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const slug = pathname.startsWith("/works/") ? pathname.slice("/works/".length) : undefined
    const artwork = artworkBySlug(slug)
    const titles: Record<string, string> = {
      "/check-in": "Check in",
      "/terms": "Terms",
      "/privacy": "Privacy",
      "/dashboard": "Dashboard",
      "/allpages": "All pages",
    }
    const page = artwork?.title ?? titles[pathname] ?? "Page not found"
    document.title = `${page} | Frieze Gallery`
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <PageTitle />
      <Routes>
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/allpages" element={<AllPagesPage />} />
        <Route path="/works/:slug" element={<ArtworkPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
