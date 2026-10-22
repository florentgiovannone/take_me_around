import { useEffect } from "react"
import { Link } from "react-router-dom"
import { BrandHeader } from "@tma/brand"
import "../styles/home.css"

const PAGES = [
  { to: "/buddysdeli", label: "Buddy's Deli" },
  { to: "/buddysdeli/order-now", label: "Buddy's Deli order" },
  { to: "/mme-betty", label: "Bistro Mme Betty" },
  { to: "/mme-betty/order-now", label: "Bistro Mme Betty order" },
  { to: "/dashboard", label: "Dashboard" },
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
    <div className="choose-order-allpages">
      <BrandHeader />
      <main>
        <h1>Take Me Around</h1>
        <p>Open a Choose and Order page from the links below.</p>
        {PAGES.map((page) => (
          <p key={page.to}>
            <Link to={page.to}>Go to {page.label} page</Link>
          </p>
        ))}
      </main>
    </div>
  )
}
