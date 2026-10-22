import { useState } from "react"

export const ARTWORK_TEXT_SCALES = [
  { id: "small", label: "Smaller text", scale: 1 },
  { id: "medium", label: "Medium text", scale: 1.5 },
  { id: "large", label: "Larger text", scale: 2 },
] as const

const STORAGE_KEY = "tma-artwork-text-size"

function readArtworkTextScale() {
  if (typeof window === "undefined") return 1.5
  const saved = window.localStorage.getItem(STORAGE_KEY)
  const match = ARTWORK_TEXT_SCALES.find((option) => String(option.scale) === saved)
  return match ? match.scale : 1.5
}

export function useArtworkTextScale() {
  const [scale, setScale] = useState(readArtworkTextScale)

  function choose(next: number) {
    setScale(next)
    window.localStorage.setItem(STORAGE_KEY, String(next))
  }

  return { scale, choose }
}

export function ArtworkTextSize({
  scale,
  onChange,
}: {
  scale: number
  onChange: (scale: number) => void
}) {
  return (
    <div className="tma-text-size" role="group" aria-label="Text size">
      <span className="tma-text-size-label">Text size</span>
      {ARTWORK_TEXT_SCALES.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`tma-text-size-option tma-text-size-option-${option.id}`}
          aria-pressed={scale === option.scale}
          aria-label={option.label}
          onClick={() => onChange(option.scale)}
        >
          A
        </button>
      ))}
    </div>
  )
}
