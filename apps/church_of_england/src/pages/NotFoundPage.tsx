import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="southwell-minster church-allpages">
      <main>
        <section>
          <h1>404</h1>
          <p className="lede">
            This URL isn’t part of the collection. Head back to the entrance and start the tour again.
          </p>
          <p>
            <Link to="/" className="donate-button">
              Take me home
            </Link>
          </p>
        </section>
      </main>
      <footer>
        <div className="colophon">Take Me Around</div>
        <div>Church of England</div>
      </footer>
    </div>
  )
}
