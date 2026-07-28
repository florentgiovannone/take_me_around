type AudioPlayerProps = {
  src: string
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <audio className="tma-audio-player" controls src={src}>
      Your browser does not support the audio element.
    </audio>
  )
}
