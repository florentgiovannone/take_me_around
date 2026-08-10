import { Link } from "react-router-dom"
import HomeBrandScene from "../components/HomeBrandScene"

export default function HomePage() {
  return (
    <main className="safe-pet-home">
      <h1 className="safe-pet-display safe-pet-home-title">
        I&rsquo;m a safe pet
      </h1>
      <HomeBrandScene />
      <p className="safe-pet-home-promise">
        When someone finds your pet, they get the safety notes and contact
        details they need — and you can see that the tag was scanned.
      </p>
      <div className="safe-pet-home-ctas">
        <Link className="safe-pet-btn safe-pet-btn-primary" to="/pet/demo-mochi">
          View demo pet
        </Link>
        <Link className="safe-pet-btn safe-pet-btn-secondary" to="/owner">
          Owner dashboard
        </Link>
      </div>
      <p className="safe-pet-footer-links">
        <Link to="/privacy-policy">Privacy policy</Link>
      </p>
    </main>
  )
}
