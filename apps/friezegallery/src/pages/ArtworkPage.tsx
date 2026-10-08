import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { logArtworkScan } from "../artworkScans"
import { artworkBySlug } from "../artworks"
import ArtworkFigure from "../components/ArtworkFigure"
import AudioPlayer from "../components/AudioPlayer"
import BidButton, { currencyForPrice } from "../components/BidButton"
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
            <ArtworkFigure src={artwork.imageSrc} alt={artwork.imageAlt} />
            {artwork.extraImages.length > 0 && (
              <div className="piece-extra">
                {artwork.extraImages.map((image) => (
                  <ArtworkFigure key={image.src} src={image.src} alt={image.alt} />
                ))}
              </div>
            )}
            <p className="caption">
              {artwork.artist}, {artwork.title}, {artwork.year}. Presented by {artwork.gallery}.
            </p>
            <dl className="details">
              <div>
                <dt>Year</dt>
                <dd>{artwork.year}</dd>
              </div>
              <div>
                <dt>Medium</dt>
                <dd>{artwork.medium}</dd>
              </div>
              <div>
                <dt>Dimensions</dt>
                <dd>{artwork.dimensions}</dd>
              </div>
              <div>
                <dt>Gallery</dt>
                <dd>
                  <a href={artwork.website}>{artwork.gallery}</a>
                </dd>
              </div>
              {artwork.inventory && (
                <div>
                  <dt>Inventory</dt>
                  <dd>{artwork.inventory}</dd>
                </div>
              )}
              <div>
                <dt>Section</dt>
                <dd>{artwork.section}</dd>
              </div>
              <div>
                <dt>Fair</dt>
                <dd>{artwork.fair}</dd>
              </div>
              {artwork.price && (
                <div>
                  <dt>{artwork.price.startsWith("Under") ? "Price range" : "Price"}</dt>
                  <dd>{artwork.price}</dd>
                </div>
              )}
              <div>
                <dt>Status</dt>
                <dd>{artwork.onView ? `${artwork.status} · On view` : artwork.status}</dd>
              </div>
              {artwork.document && (
                <div>
                  <dt>Document</dt>
                  <dd>
                    <a href={artwork.document.href}>{artwork.document.label}</a>
                  </dd>
                </div>
              )}
            </dl>
            <div className="bid">
              <BidButton key={artwork.slug} currency={currencyForPrice(artwork.price)} />
            </div>
            <div className="essay">
              <h2>About The Work</h2>
              {artwork.standfirst ? <p className="standfirst">{artwork.standfirst}</p> : null}
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
