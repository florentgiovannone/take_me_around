import { BrandHeader } from "@tma/brand"
import "../styles/style.css"
import "../styles/home.css"

export default function IndexPage() {
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
