import { BrandAudioPlayer } from "@tma/brand"

type AudioPlayerProps = {
  src: string
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return <BrandAudioPlayer src={src} />
}
