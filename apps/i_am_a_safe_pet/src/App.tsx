import { useEffect } from "react"
import { Link, Route, Routes, useLocation } from "react-router-dom"
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"
import OwnerDashboardPage from "./pages/OwnerDashboardPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import PublicPetPage from "./pages/PublicPetPage"

const PRODUCT = "I Am A Safe Pet"

const PAGE_TITLES: Record<string, string> = {
  "/": PRODUCT,
  "/allpages": "All Pages",
  "/owner": "Owner dashboard",
  "/privacy-policy": "Privacy Policy",
}

function pageTitleForPath(pathname: string): string {
  if (pathname.startsWith("/pet/")) {
    return `Pet | ${PRODUCT}`
  }
  const exact = PAGE_TITLES[pathname]
  if (exact) return `${exact} | ${PRODUCT}`
  return `Page not found | ${PRODUCT}`
}

function PageTitleUpdater() {
  const location = useLocation()

  useEffect(() => {
    document.title = pageTitleForPath(location.pathname)
  }, [location.pathname])

  return null
}

function AllPages() {
  return (
    <main className="safe-pet-page">
      <h1 className="safe-pet-display">All pages</h1>
      <ul className="safe-pet-allpages">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/pet/demo-mochi">Demo pet (Mochi)</Link>
        </li>
        <li>
          <Link to="/pet/unknown">Unknown pet (not found)</Link>
        </li>
        <li>
          <Link to="/owner">Owner dashboard</Link>
        </li>
        <li>
          <Link to="/privacy-policy">Privacy policy</Link>
        </li>
      </ul>
    </main>
  )
}

export default function App() {
  return (
    <>
      <PageTitleUpdater />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pet/:publicId" element={<PublicPetPage />} />
        <Route path="/owner" element={<OwnerDashboardPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/allpages" element={<AllPages />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
