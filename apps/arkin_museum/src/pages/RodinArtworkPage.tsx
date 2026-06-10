import { Fragment, useEffect } from "react"
import { useParams } from "react-router-dom"
import { RODIN_IMAGE_GALLERIES, RODIN_IMAGES } from "../assets/rodin"
import ArtworkImageGallery from "../components/ArtworkImageGallery"
import AudioPlayer from "../components/AudioPlayer"
import Footer from "../components/Footer"
import {
  getRodinArtwork,
  type RodinArtwork,
  type RodinArtworkMeta,
  type RodinArtworkSource,
} from "../data/rodinArtworks"
import NotFoundPage from "./NotFoundPage"
import "../styles/style.css"
import "../styles/rodin-exhibition.css"

function ExhibitionFacts({ items }: { items: string[] }) {
  if (items.length === 0) return null

  return (
    <div className="arkin-exhibition-facts">
      {items.map((item, index) => (
        <Fragment key={item}>
          {index > 0 ? <span className="arkin-exhibition-facts-sep" aria-hidden="true">·</span> : null}
          <span>{item}</span>
        </Fragment>
      ))}
    </div>
  )
}

function buildExhibitionFacts(artwork: RodinArtwork): string[] {
  const facts: string[] = []
  if (artwork.caption) facts.push(artwork.caption)
  if (artwork.meta?.height) facts.push(artwork.meta.height)
  if (artwork.meta?.materials) facts.push(artwork.meta.materials)
  if (artwork.meta?.location) facts.push(artwork.meta.location)
  return facts
}

function ExhibitionPlateCaption({ artwork }: { artwork: RodinArtwork }) {
  const meta = artwork.meta
  if (!meta?.marksAndInscriptions && !meta?.inventoryNumber) return null

  const parts = [
    meta.marksAndInscriptions,
    meta.inventoryNumber ? `Inventory ${meta.inventoryNumber}` : null,
  ].filter(Boolean)

  return (
    <figcaption className="arkin-exhibition-plate-caption">
      {artwork.artist}, <em>{artwork.title}</em>. {parts.join(" ")}
    </figcaption>
  )
}

function ExhibitionSources({ sources }: { sources: RodinArtworkSource[] }) {
  if (sources.length === 0) return null

  return (
    <footer className="arkin-exhibition-sources" aria-label="Sources">
      <span className="arkin-exhibition-sources-label">Sources:</span>{" "}
      {sources.map((source, index) => (
        <Fragment key={source.href}>
          {index > 0 ? <span className="arkin-exhibition-sources-sep" aria-hidden="true"> · </span> : null}
          <a href={source.href} target="_blank" rel="noopener noreferrer">
            {source.label}
          </a>
        </Fragment>
      ))}
    </footer>
  )
}

function ExhibitionEssay({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null

  return (
    <section className="arkin-exhibition-essay" aria-labelledby="arkin-exhibition-essay-heading">
      <h2 id="arkin-exhibition-essay-heading">About the work</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
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
  const aboutParagraphs = artwork.aboutParagraphs ?? []
  const hasCustomAbout = aboutParagraphs.length > 0
  const summary =
    artwork.summary ?? (aboutParagraphs.length > 1 ? aboutParagraphs[0] : null)
  const essayParagraphs = hasCustomAbout
    ? artwork.summary
      ? aboutParagraphs
      : aboutParagraphs.length > 1
        ? aboutParagraphs.slice(1)
        : aboutParagraphs
    : artwork.description
      ? [artwork.description]
      : [
          "This bronze is part of the Arkın Rodin Collection. Listen to the audio guide above to discover more about this piece.",
        ]

  if (exhibition) {
    return (
      <main className="arkin-exhibition-page arkin-exhibition-page--artwork">
        <div className="arkin-exhibition-page-inner">
          <header className="arkin-exhibition-label">
            <div className="arkin-exhibition-eyebrow">Arkın Rodin Collection — Sculpture</div>
            <h1 className="arkin-exhibition-title">
              <span className="arkin-exhibition-title-main">{artwork.title}</span>
              {artwork.subtitle ? (
                <span className="arkin-exhibition-title-alt">({artwork.subtitle})</span>
              ) : null}
            </h1>
            <p className="arkin-exhibition-byline">{artwork.artist}</p>
            <ExhibitionFacts items={buildExhibitionFacts(artwork)} />
            {summary ? <p className="arkin-exhibition-summary">{summary}</p> : null}
          </header>

          <AudioPlayer />

          <figure className="arkin-exhibition-plate">
            <div className="arkin-exhibition-frame">
              {gallery && gallery.length > 0 ? (
                <ArtworkImageGallery images={gallery} title={artwork.title} />
              ) : imageSrc ? (
                <img src={imageSrc} alt={artwork.title} className="arkin-exhibition-plate-image" />
              ) : (
                <div
                  className="arkin-exhibition-plate-image arkin-exhibition-plate-placeholder"
                  role="img"
                  aria-label={artwork.title}
                />
              )}
            </div>
            <ExhibitionPlateCaption artwork={artwork} />
          </figure>

          <ExhibitionEssay paragraphs={essayParagraphs} />

          {artwork.sources?.length ? <ExhibitionSources sources={artwork.sources} /> : null}
        </div>

        <Footer />
      </main>
    )
  }

  return (
    <>
      <main className="tma-gallery-page">
        <header className="tma-header">
          <div className="tma-header-inner">
            <h1 className="tma-page-title">{artwork.title}</h1>
            <p className="tma-page-subtitle">{pageSubtitle}</p>
          </div>
        </header>

        <div className="tma-content">
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

          {artwork.meta ? <LegacyMeta meta={artwork.meta} /> : null}

          <h2>About {artwork.title}.</h2>
          {hasCustomAbout ? (
            aboutParagraphs.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)
          ) : (
            <>
              {artwork.description ? <p>{artwork.description}</p> : null}
              <p>
                This bronze is part of the Arkın Rodin Collection, featuring works by Auguste Rodin
                (1840–1917) and related sculptors.
              </p>
            </>
          )}
        </div>

        <a href="/underlying-technology" className="tma-banner-link">
          <p className="tma-banner-text">
            <strong>Click this banner to discover more about technology used to create this page.</strong>
          </p>
        </a>
      </main>
      <Footer />
    </>
  )
}

function LegacyMeta({ meta }: { meta: RodinArtworkMeta }) {
  return (
    <dl className="tma-artwork-meta">
      {meta.height ? (
        <>
          <dt>Height</dt>
          <dd>{meta.height}</dd>
        </>
      ) : null}
      {meta.marksAndInscriptions ? (
        <>
          <dt>Marks &amp; Inscriptions</dt>
          <dd>{meta.marksAndInscriptions}</dd>
        </>
      ) : null}
      {meta.inventoryNumber ? (
        <>
          <dt>Inventory Number</dt>
          <dd>{meta.inventoryNumber}</dd>
        </>
      ) : null}
      {meta.materials ? (
        <>
          <dt>Materials</dt>
          <dd>{meta.materials}</dd>
        </>
      ) : null}
      {meta.location ? (
        <>
          <dt>Location</dt>
          <dd>{meta.location}</dd>
        </>
      ) : null}
    </dl>
  )
}
