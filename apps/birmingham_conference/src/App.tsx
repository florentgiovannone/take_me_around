import { useEffect } from "react"
import { Link, Route, Routes, useLocation } from "react-router-dom"
import { BrandHeader } from "@tma/brand"
import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"
import DashboardPage from "./pages/DashboardPage"
import IndexPage from "./pages/IndexPage"
import NotFoundPage from "./pages/NotFoundPage"
import RegisterInterestPage from "./pages/RegisterInterestPage"
import { REGISTRATION_PATH } from "./registrationFlow"
import "./styles/home.css"

function PageTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    const artwork = BIRMINGHAM_CONFERENCE_ARTWORKS.find((item) => item.path === pathname)
    const titles: Record<string, string> = {
      "/": "Take Me Around",
      "/allpages": "All Pages",
      "/dashboard": "Dashboard",
      [REGISTRATION_PATH]: "Register interest",
    }
    const page = artwork?.title ?? titles[pathname]
    document.title = page
      ? `${page} | Museum Association Conference`
      : "Page not found | Museum Association Conference"
  }, [pathname])
  return null
}

function ExternalRedirect({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href)
  }, [href])
  return null
}

function AllPages() {
  return (
    <div className="birmingham-allpages">
      <BrandHeader />
      <main>
        <h1>Take Me Around</h1>
        <p>Open a Museum Association Conference page from the links below.</p>
        {BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => (
          <p key={artwork.slug}>
            <a href={artwork.url}>Go to {artwork.title} page</a>
          </p>
        ))}
        <p>
          <Link to="/dashboard">Go to Dashboard page</Link>
        </p>
        <p>
          <Link to={REGISTRATION_PATH}>Go to Register interest page</Link>
        </p>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <PageTitle />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/allpages" element={<AllPages />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path={REGISTRATION_PATH} element={<RegisterInterestPage />} />
        {BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => (
          <Route
            key={artwork.path}
            path={artwork.path}
            element={<ExternalRedirect href={artwork.url} />}
          />
        ))}
        <Route
          path="/the-star-of-betlehem"
          element={<ExternalRedirect href="https://takemearound.gallery/the-star-of-bethlehem" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
