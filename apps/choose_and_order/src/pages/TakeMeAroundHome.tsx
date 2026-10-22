import { useEffect } from "react"
import { BrandHeader } from "@tma/brand"
import "../styles/home.css"

export default function TakeMeAroundHome() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = "Take Me Around | Take Me Around"
    return () => {
      document.title = previousTitle
    }
  }, [])

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
