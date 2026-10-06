import { useEffect, useRef } from "react"

type AudioPlayerProps = {
  src: string
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement>(null)

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
    <audio ref={ref} className="tma-audio-player tma-section-audio" controls src={src}>
      Your browser does not support the audio element.
    </audio>
  )
}
