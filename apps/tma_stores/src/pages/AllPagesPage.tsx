import { useEffect } from "react"
import { Link } from "react-router-dom"
import { BrandHeader } from "@tma/brand"
import "../styles/allpages.css"

const PAGES = [
  { to: "/charlespeters", label: "Charles Peters" },
  { to: "/charlespeters/dashboard", label: "Charles Peters dashboard" },
  { to: "/waitburys", label: "Waitburys" },
  { to: "/waitburys/dashboard", label: "Waitburys dashboard" },
]

export default function AllPagesPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = "All Pages | Take Me Around"
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="tma-stores-allpages">
      <BrandHeader />
      <main>
        <h1>All pages</h1>
        <p>Open a TMA Stores page from the links below.</p>
        {PAGES.map((page) => (
          <p key={page.to}>
            <Link to={page.to}>Go to {page.label} page</Link>
          </p>
        ))}
      </main>
    </div>
  )
}
