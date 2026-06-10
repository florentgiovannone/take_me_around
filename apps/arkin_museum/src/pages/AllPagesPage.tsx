import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import { RODIN_ARTWORKS } from "../data/rodinArtworks"
import "../styles/style.css"

export default function AllPagesPage() {
  const exhibitionArtworks = RODIN_ARTWORKS.filter((artwork) => artwork.exhibitionStyle)
  const otherArtworks = RODIN_ARTWORKS.filter((artwork) => !artwork.exhibitionStyle)

  return (
    <>
      <main style={{ margin: "0 auto", maxWidth: 900, padding: "2rem 1rem" }}>
        <h1>Arkın Rodin Collection</h1>
        <p>All pages in this site.</p>

        <h2>Artworks</h2>
        {exhibitionArtworks.map((artwork) => (
          <p key={artwork.slug}>
            <Link to={`/${artwork.slug}`}>
              {artwork.title}
              {artwork.subtitle ? ` (${artwork.subtitle})` : ""}
            </Link>
          </p>
        ))}

        {otherArtworks.length > 0 ? (
          <>
            <h2>Catalogue (in progress)</h2>
            {otherArtworks.map((artwork) => (
              <p key={artwork.slug}>
                <Link to={`/${artwork.slug}`}>
                  {artwork.title}
                  {artwork.subtitle ? ` (${artwork.subtitle})` : ""}
                </Link>
              </p>
            ))}
          </>
        ) : null}

        <h2>Other</h2>
        <p>
          <Link to="/underlying-technology">Underlying Technology</Link>
        </p>
        <p>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </p>
        <p>
          <Link to="/dashboard">Dashboard</Link>
        </p>
      </main>
      <Footer />
    </>
  )
}
