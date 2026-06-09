type RodinSiteHeaderProps = {
  caption?: string
  title?: string
  artist?: string
}

export default function RodinSiteHeader({ caption, title, artist }: RodinSiteHeaderProps) {
  const isArtworkHeader = Boolean(title)

  return (
    <header className={isArtworkHeader ? "arkin-site-header arkin-site-header--artwork" : "arkin-site-header"}>
      <div className="arkin-site-header-inner">
        {isArtworkHeader ? (
          <>
            <h1 className="arkin-exhibition-title">{title}</h1>
            {caption ? <p className="arkin-exhibition-caption">{caption}</p> : null}
            {artist ? <p className="arkin-exhibition-artist">{artist}</p> : null}
          </>
        ) : (
          <p className="arkin-site-brand-title">Arkın Rodin Collection</p>
        )}
      </div>
    </header>
  )
}
