type ArtworkFigureProps = {
  src: string
  alt: string
}

export default function ArtworkFigure({ src, alt }: ArtworkFigureProps) {
  return (
    <figure className="piece">
      <img src={src} alt={alt} />
    </figure>
  )
}
