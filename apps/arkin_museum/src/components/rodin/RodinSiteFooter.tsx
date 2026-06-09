import { Link } from "react-router-dom"

export default function RodinSiteFooter() {
  return (
    <footer className="arkin-footer">
      <div className="arkin-footer-inner">
        <div>
          <h4>Contact</h4>
          <p>
            <a href="mailto:rodin@arkingroup.com">rodin@arkingroup.com</a>
          </p>
          <p>
            <a href="tel:+903926501111">+90 392 650 1111</a>
          </p>
          <p>P.O. Box 309 Girne - Kıbrıs, 99300</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul className="arkin-footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/collection">Collection</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
        <p className="arkin-footer-copy">
          © {new Date().getFullYear()} Arkın Rodin Collection Gallery — Take Me Around experience
        </p>
      </div>
    </footer>
  )
}
