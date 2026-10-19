import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"
import ArtworkPage from "./pages/ArtworkPage"
import DashboardPage from "./pages/DashboardPage"
import IndexPage from "./pages/IndexPage"
import NotFoundPage from "./pages/NotFoundPage"

function PageTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    const artwork = BIRMINGHAM_CONFERENCE_ARTWORKS.find((item) => item.path === pathname)
    const titles: Record<string, string> = {
      "/": "Birmingham Conference",
      "/dashboard": "Dashboard",
    }
    const page = artwork?.title ?? titles[pathname]
    document.title = page ? `${page} | Birmingham Conference` : "Page not found | Birmingham Conference"
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <PageTitle />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/:slug" element={<ArtworkPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
