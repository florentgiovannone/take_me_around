import { Link } from "react-router-dom"
import type { RodinArtwork } from "../../data/rodinArtworks"

type ArtworkCardProps = {
  artwork: RodinArtwork
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link to={`/artworks/${artwork.slug}`} className="arkin-artwork-card">
      <div className="arkin-artwork-thumb" aria-hidden />
      <div className="arkin-artwork-caption">
        <p className="arkin-artwork-artist">{artwork.artist}</p>
        <h3 className="arkin-artwork-title">{artwork.title}</h3>
      </div>
    </Link>
  )
}
