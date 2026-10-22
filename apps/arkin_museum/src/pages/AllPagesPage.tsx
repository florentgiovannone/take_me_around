import { Link } from "react-router-dom"
import RodinSiteHeader from "../components/rodin/RodinSiteHeader"
import Footer from "../components/Footer"
import { RODIN_ARTWORKS, type RodinArtwork } from "../data/rodinArtworks"
import { getArtworkDisplayTitle } from "../utils/artworkTitles"
import "../styles/style.css"
import "../styles/rodin-exhibition.css"

function ArtworkIndex({ artworks }: { artworks: readonly RodinArtwork[] }) {
  return (
    <ul className="arkin-index-list">
      {artworks.map((artwork) => {
        const { french, english } = getArtworkDisplayTitle(artwork)
        return (
          <li key={artwork.slug}>
            <Link to={`/${artwork.slug}`}>
              <span className="arkin-index-french">{french}</span>
              {english ? <span className="arkin-index-english">{english}</span> : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default function AllPagesPage() {
  const exhibitionArtworks = RODIN_ARTWORKS.filter((artwork) => artwork.exhibitionStyle)
  const otherArtworks = RODIN_ARTWORKS.filter((artwork) => !artwork.exhibitionStyle)

  return (
    <div className="arkin-exhibition-page arkin-index">
      <RodinSiteHeader />
      <main className="arkin-index-main">
        <p className="arkin-exhibition-eyebrow">Index</p>
        <h1 className="arkin-index-title">All pages</h1>
        <p className="arkin-index-lede">Every work and page in this collection.</p>

        <section className="arkin-index-section">
          <h2>Artworks</h2>
          <ArtworkIndex artworks={exhibitionArtworks} />
        </section>

        {otherArtworks.length > 0 ? (
          <section className="arkin-index-section">
            <h2>Catalogue (in progress)</h2>
            <ArtworkIndex artworks={otherArtworks} />
          </section>
        ) : null}

        <section className="arkin-index-section">
          <h2>Other</h2>
          <ul className="arkin-index-list">
            <li>
              <Link to="/underlying-technology">
                <span className="arkin-index-french">Underlying Technology</span>
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy">
                <span className="arkin-index-french">Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard">
                <span className="arkin-index-french">Dashboard</span>
              </Link>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  )
}
