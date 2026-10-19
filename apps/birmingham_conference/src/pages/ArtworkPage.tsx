import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"
import Footer from "../components/Footer"
import { ARTWORK_COPY } from "../artworkCopy"
import { logArtworkScan } from "../artworkScans"
import NotFoundPage from "./NotFoundPage"
import "../styles/style.css"

export default function ArtworkPage() {
  const { slug } = useParams()
  const artwork = BIRMINGHAM_CONFERENCE_ARTWORKS.find((item) => item.slug === slug)
  const copy = artwork ? ARTWORK_COPY[artwork.slug] : undefined

  useEffect(() => {
    if (!artwork) return
    logArtworkScan(artwork.slug)
  }, [artwork])

  if (!artwork || !copy) return <NotFoundPage />

  return (
    <>
      <main className="tma-gallery-page">
        <header className="tma-header">
          <div className="tma-header-inner">
            <h1 className="tma-page-title">{artwork.title}</h1>
            <p className="tma-page-subtitle">{copy.artist}</p>
          </div>
        </header>
        <div className="tma-content">
          <img src={copy.imageSrc} alt={copy.imageAlt} className="tma-painting-image" />
          <h2>About the work</h2>
          <p>{copy.aboutWork}</p>
          <h2>About the artist</h2>
          <p>{copy.aboutArtist}</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
