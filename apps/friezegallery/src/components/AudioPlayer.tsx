import { useEffect, useRef, useState } from "react"

type AudioPlayerProps = {
  src: string
  fallbackSrc?: string
  unsupported: string
}

export default function AudioPlayer({ src, fallbackSrc, unsupported }: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement>(null)
  const [activeSrc, setActiveSrc] = useState(src)

  useEffect(() => {
    setActiveSrc(src)
  }, [src])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onPlay = () => {
      document.querySelectorAll("audio.tma-audio-player").forEach((node) => {
        if (!(node instanceof HTMLAudioElement)) return
        if (node !== el && !node.paused) node.pause()
      })
    }

    el.addEventListener("play", onPlay)
    return () => el.removeEventListener("play", onPlay)
  }, [])

  return (
    <audio
      ref={ref}
      className="tma-audio-player tma-section-audio"
      controls
      src={activeSrc}
      onError={() => {
        if (fallbackSrc && activeSrc !== fallbackSrc) setActiveSrc(fallbackSrc)
      }}
    >
      {unsupported}
    </audio>
  )
}
