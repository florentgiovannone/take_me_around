import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { RODIN_IMAGE_GALLERIES, RODIN_IMAGES } from "../assets/rodin"
import RodinSiteHeader from "../components/rodin/RodinSiteHeader"
import ArtworkImageGallery from "../components/ArtworkImageGallery"
import AudioPlayer from "../components/AudioPlayer"
import Footer from "../components/Footer"
import { getRodinArtwork, type RodinArtworkMeta } from "../data/rodinArtworks"
import NotFoundPage from "./NotFoundPage"
import "../styles/style.css"
import "../styles/rodin-exhibition.css"

function ExhibitionMetaBlock({
  label,
  value,
  long,
}: {
  label: string
  value: string
  long?: boolean
}) {
  return (
    <div className="arkin-exhibition-meta-block">
      <h2 className="arkin-exhibition-meta-label">{label}</h2>
      <p
        className={
          long ? "arkin-exhibition-meta-value arkin-exhibition-meta-value--long" : "arkin-exhibition-meta-value"
        }
      >
        {value}
      </p>
    </div>
  )
}

function ExhibitionMeta({ meta }: { meta: RodinArtworkMeta }) {
  const blocks: { label: string; value: string; long?: boolean }[] = []
  if (meta.height) blocks.push({ label: "Height", value: meta.height })
  if (meta.marksAndInscriptions) {
    blocks.push({ label: "Marks & Inscriptions", value: meta.marksAndInscriptions, long: true })
  }
  if (meta.inventoryNumber) blocks.push({ label: "Inventory Number", value: meta.inventoryNumber })
  if (meta.materials) blocks.push({ label: "Materials", value: meta.materials, long: true })
  if (meta.location) blocks.push({ label: "Location", value: meta.location, long: true })

  return (
    <section className="arkin-exhibition-meta" aria-label="Artwork details">
      {blocks.map((block) => (
        <ExhibitionMetaBlock key={block.label} {...block} />
      ))}
    </section>
  )
}

export default function RodinArtworkPage() {
  const { slug } = useParams<{ slug: string }>()
  const artwork = slug ? getRodinArtwork(slug) : undefined

  useEffect(() => {
    if (artwork) {
      document.title = `${artwork.title} | Take Me Around`
    }
  }, [artwork])

  if (!artwork) {
    return <NotFoundPage />
  }

  const exhibition = artwork.exhibitionStyle
  const pageSubtitle = `${artwork.subtitle ? `${artwork.subtitle} · ` : ""}${artwork.artist}`
  const gallery = slug ? RODIN_IMAGE_GALLERIES[slug] : undefined
  const imageSrc = slug ? RODIN_IMAGES[slug] : undefined
  const hasCustomAbout = Boolean(artwork.aboutParagraphs?.length)
  const displayTitle =
    exhibition && artwork.subtitle ? `${artwork.title} [${artwork.subtitle}]` : artwork.title

  return (
    <>
      {exhibition ? (
        <RodinSiteHeader
          caption={artwork.caption}
          title={displayTitle}
          artist={artwork.artist}
        />
      ) : null}
      <main
        className={
          exhibition
            ? "tma-gallery-page arkin-exhibition-page arkin-exhibition-page--artwork"
            : "tma-gallery-page"
        }
      >
        {!exhibition ? (
          <header className="tma-header">
            <div className="tma-header-inner">
              <h1 className="tma-page-title">{artwork.title}</h1>
              <p className="tma-page-subtitle">{pageSubtitle}</p>
            </div>
          </header>
        ) : null}

        <div className={exhibition ? "tma-content arkin-exhibition-content" : "tma-content"}>
          <AudioPlayer />
          {gallery && gallery.length > 0 ? (
            <ArtworkImageGallery images={gallery} title={artwork.title} />
          ) : imageSrc ? (
            <img src={imageSrc} alt={artwork.title} className="tma-painting-image" />
          ) : (
            <div
              className="tma-painting-image tma-sculpture-placeholder"
              role="img"
              aria-label={artwork.title}
            />
          )}

          {exhibition && artwork.meta ? <ExhibitionMeta meta={artwork.meta} /> : null}

          {!exhibition && artwork.meta ? (
            <dl className="tma-artwork-meta">
              {artwork.meta.height ? (
                <>
                  <dt>Height</dt>
                  <dd>{artwork.meta.height}</dd>
                </>
              ) : null}
              {artwork.meta.marksAndInscriptions ? (
                <>
                  <dt>Marks &amp; Inscriptions</dt>
                  <dd>{artwork.meta.marksAndInscriptions}</dd>
                </>
              ) : null}
              {artwork.meta.inventoryNumber ? (
                <>
                  <dt>Inventory Number</dt>
                  <dd>{artwork.meta.inventoryNumber}</dd>
                </>
              ) : null}
              {artwork.meta.materials ? (
                <>
                  <dt>Materials</dt>
                  <dd>{artwork.meta.materials}</dd>
                </>
              ) : null}
              {artwork.meta.location ? (
                <>
                  <dt>Location</dt>
                  <dd>{artwork.meta.location}</dd>
                </>
              ) : null}
            </dl>
          ) : null}

          {exhibition ? (
            <div className="arkin-exhibition-prose">
              {hasCustomAbout ? (
                artwork.aboutParagraphs!.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))
              ) : (
                <>
                  {artwork.description ? <p>{artwork.description}</p> : null}
                  <p>
                    This bronze is part of the Arkın Rodin Collection. Listen to the audio guide above to
                    discover more about this piece.
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <h2>About {artwork.title}.</h2>
              {hasCustomAbout ? (
                artwork.aboutParagraphs!.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))
              ) : (
                <>
                  {artwork.description ? <p>{artwork.description}</p> : null}
                  <p>
                    This bronze is part of the Arkın Rodin Collection, featuring works by Auguste Rodin
                    (1840–1917) and related sculptors.
                  </p>
                </>
              )}
              {!hasCustomAbout ? (
                <>
                  <h2>About Auguste Rodin</h2>
                  <p>
                    Auguste Rodin is widely regarded as the father of modern sculpture.
                  </p>
                </>
              ) : null}
            </>
          )}
        </div>

        {!exhibition ? (
          <a href="/underlying-technology" className="tma-banner-link">
            <p className="tma-banner-text">
              <strong>Click this banner to discover more about technology used to create this page.</strong>
            </p>
          </a>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
