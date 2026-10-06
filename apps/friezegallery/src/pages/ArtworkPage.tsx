import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { logArtworkScan } from "../artworkScans"
import { artworkBySlug } from "../artworks"
import ArtworkFigure from "../components/ArtworkFigure"
import AudioPlayer from "../components/AudioPlayer"
import SiteFooter from "../components/SiteFooter"
import SiteHeader from "../components/SiteHeader"

export default function ArtworkPage() {
  const { slug } = useParams()
  const artwork = artworkBySlug(slug)

  useEffect(() => {
    if (!artwork) return
    logArtworkScan(artwork.textName, `/works/${artwork.slug}`)
  }, [artwork])

  return (
    <div className="shell">
      <SiteHeader />
      <main className="article">
        {artwork ? (
          <>
            <p className="kicker">{artwork.kicker}</p>
            <h1>{artwork.title}</h1>
            <p className="byline">By {artwork.artist}</p>
            <AudioPlayer src={artwork.audioSrc} />
            <ArtworkFigure slug={artwork.slug} />
            <p className="caption">Illustrated for this visit.</p>
            <p className="meta">
              {artwork.year} · {artwork.medium}
            </p>
            <div className="essay">
              <p className="standfirst">{artwork.standfirst}</p>
              {artwork.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1>This work is not on view.</h1>
            <p>
              <Link to="/allpages">See all pages</Link>
            </p>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
