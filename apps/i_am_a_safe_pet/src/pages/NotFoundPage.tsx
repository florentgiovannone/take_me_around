import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <main className="safe-pet-page">
      <h1>Page not found</h1>
      <p>
        <Link to="/">Back home</Link>
      </p>
    </main>
  )
}
