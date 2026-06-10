import { useCallback, useRef, useState } from "react"

type ArtworkImageGalleryProps = {
  images: string[]
  title: string
}

export default function ArtworkImageGallery({ images, title }: ArtworkImageGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const hasMultiple = images.length > 1

  const updateActiveFromScroll = useCallback(() => {
    const track = trackRef.current
    if (!track || track.clientWidth <= 0) return
    const index = Math.round(track.scrollLeft / track.clientWidth)
    setActiveIndex(Math.min(Math.max(index, 0), images.length - 1))
  }, [images.length])

  const goToSlide = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.min(Math.max(index, 0), images.length - 1)
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" })
    setActiveIndex(clamped)
  }

  return (
    <div className="tma-artwork-gallery-wrap">
      <div className="tma-artwork-gallery-carousel">
        {hasMultiple ? (
          <button
            type="button"
            className="tma-artwork-gallery-nav tma-artwork-gallery-nav--prev"
            aria-label="Previous image"
            disabled={activeIndex === 0}
            onClick={() => goToSlide(activeIndex - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}

        <div
          ref={trackRef}
          className="tma-artwork-gallery"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${title} photographs`}
          onScroll={updateActiveFromScroll}
        >
          {images.map((src, index) => (
            <figure key={src} className="tma-artwork-gallery-slide">
              <img
                src={src}
                alt={`${title} — view ${index + 1} of ${images.length}`}
                className="tma-artwork-gallery-image"
                draggable={false}
              />
            </figure>
          ))}
        </div>

        {hasMultiple ? (
          <button
            type="button"
            className="tma-artwork-gallery-nav tma-artwork-gallery-nav--next"
            aria-label="Next image"
            disabled={activeIndex === images.length - 1}
            onClick={() => goToSlide(activeIndex + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {hasMultiple ? (
        <>
          <p className="tma-artwork-gallery-hint" aria-hidden="true">
            Swipe or use arrows to see more views
          </p>
          <div className="tma-artwork-gallery-dots" role="tablist" aria-label="Image views">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`View ${index + 1}`}
                className={
                  index === activeIndex ? "tma-artwork-gallery-dot is-active" : "tma-artwork-gallery-dot"
                }
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
