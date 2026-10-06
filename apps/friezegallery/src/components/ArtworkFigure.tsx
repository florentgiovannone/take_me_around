const LETTER_HOURS = ["06:12", "07:40", "09:05", "11:18", "13:02", "15:44", "18:21", "21:07"]

type ArtworkFigureProps = {
  slug: string
  compact?: boolean
}

export default function ArtworkFigure({ slug, compact = false }: ArtworkFigureProps) {
  const className = `piece piece--${slug}${compact ? " piece--compact" : ""}`

  if (slug === "the-listening-room") {
    return (
      <div className={className} aria-hidden="true">
        {[18, 32, 46, 60, 76].map((size) => (
          <span
            key={size}
            className="piece-ring"
            style={{ width: `${size}%`, height: `${size}%` }}
          />
        ))}
      </div>
    )
  }

  if (slug === "salt-latitude") {
    return (
      <div className={className} aria-hidden="true">
        <span className="piece-band piece-band--sky" />
        <span className="piece-band piece-band--foam" />
        <span className="piece-band piece-band--water" />
        <span className="piece-band piece-band--slab" />
        <span className="piece-tide" />
      </div>
    )
  }

  return (
    <div className={className} aria-hidden="true">
      {LETTER_HOURS.map((hour) => (
        <span key={hour} className="piece-slip">
          <em>{hour}</em>
        </span>
      ))}
    </div>
  )
}
