import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent } from "react"

export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--"
  const totalSeconds = Math.floor(seconds)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

export function shouldShowFloatingAudioPill({
  hasStarted,
  isInView,
}: {
  hasStarted: boolean
  isInView: boolean
}): boolean {
  return hasStarted && !isInView
}

export function pauseOtherAudioPlayers(
  activeEl: unknown,
  nodes: Iterable<{ paused?: boolean; pause?: () => void }>
): void {
  for (const node of nodes) {
    if (node !== activeEl && node && !node.paused && typeof node.pause === "function") {
      node.pause()
    }
  }
}

type PillControlsProps = {
  label: string
  isPlaying: boolean
  currentTime: number
  duration: number
  onTogglePlay: () => void
  onSeek: (event: ChangeEvent<HTMLInputElement>) => void
  floating?: boolean
}

function PillControls({
  label,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  floating = false,
}: PillControlsProps) {
  const progressPercent =
    Number.isFinite(duration) && duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0

  const timeText = `${formatAudioTime(currentTime)} / ${
    Number.isFinite(duration) && duration > 0 ? formatAudioTime(duration) : "--:--"
  }`

  return (
    <div
      className={
        floating
          ? "tma-navy-pill tma-navy-pill--floating"
          : "tma-navy-pill"
      }
      role={floating ? "region" : undefined}
      aria-label={floating ? "Floating audio player" : undefined}
    >
      <button
        type="button"
        className="tma-navy-pill-btn"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? (
          <span className="tma-navy-pill-pause" aria-hidden="true" />
        ) : (
          <span className="tma-navy-pill-play" aria-hidden="true" />
        )}
      </button>
      <div className="tma-navy-pill-mid">
        <div className="tma-navy-pill-top">
          <span className="tma-navy-pill-kicker">{label}</span>
          <span className="tma-navy-pill-time">{timeText}</span>
        </div>
        <div
          className="tma-navy-pill-track"
          style={{ "--tma-pill-progress": `${progressPercent}%` } as CSSProperties}
        >
          <span className="tma-navy-pill-fill" aria-hidden="true" />
          <input
            type="range"
            className="tma-navy-pill-range"
            aria-label="Seek audio"
            min={0}
            max={Number.isFinite(duration) && duration > 0 ? duration : 0}
            step={1}
            aria-valuetext={timeText}
            value={Number.isFinite(currentTime) ? currentTime : 0}
            disabled={!Number.isFinite(duration) || duration <= 0}
            onChange={onSeek}
          />
        </div>
      </div>
    </div>
  )
}

export function BrandAudioPlayer({
  src,
  label = "Listen",
}: {
  src: string
  label?: string
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(Number.NaN)
  const [isInView, setIsInView] = useState(true)

  useEffect(() => {
    setIsPlaying(false)
    setHasStarted(false)
    setCurrentTime(0)
    setDuration(Number.NaN)
  }, [src])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const onPlay = () => {
      setIsPlaying(true)
      setHasStarted(true)
      pauseOtherAudioPlayers(
        el,
        document.querySelectorAll("audio.tma-audio-player") as Iterable<{
          paused?: boolean
          pause?: () => void
        }>
      )
    }

    const onPause = () => {
      setIsPlaying(false)
    }

    const onEnded = () => {
      setIsPlaying(false)
      setHasStarted(false)
      setCurrentTime(0)
    }

    const onTimeUpdate = () => {
      setCurrentTime(el.currentTime || 0)
    }

    const onLoadedMetadata = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration)
      }
    }

    const onOtherPlay = (event: Event) => {
      const target = event.target
      if (
        target instanceof HTMLAudioElement &&
        target !== el &&
        target.classList.contains("tma-audio-player")
      ) {
        setHasStarted(false)
        setIsPlaying(false)
      }
    }

    if (Number.isFinite(el.duration) && el.duration > 0) {
      setDuration(el.duration)
    }

    el.addEventListener("play", onPlay)
    el.addEventListener("pause", onPause)
    el.addEventListener("ended", onEnded)
    el.addEventListener("timeupdate", onTimeUpdate)
    el.addEventListener("loadedmetadata", onLoadedMetadata)
    el.addEventListener("durationchange", onLoadedMetadata)
    document.addEventListener("play", onOtherPlay, true)

    return () => {
      el.removeEventListener("play", onPlay)
      el.removeEventListener("pause", onPause)
      el.removeEventListener("ended", onEnded)
      el.removeEventListener("timeupdate", onTimeUpdate)
      el.removeEventListener("loadedmetadata", onLoadedMetadata)
      el.removeEventListener("durationchange", onLoadedMetadata)
      document.removeEventListener("play", onOtherPlay, true)
    }
  }, [src])

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) setIsInView(entry.isIntersecting)
        },
        { threshold: 0 }
      )
      observer.observe(anchor)
      return () => observer.disconnect()
    }

    const updateOnScroll = () => {
      const rect = anchor.getBoundingClientRect()
      setIsInView(rect.bottom > 0 && rect.top < window.innerHeight)
    }
    window.addEventListener("scroll", updateOnScroll, { passive: true })
    updateOnScroll()
    return () => window.removeEventListener("scroll", updateOnScroll)
  }, [])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      void el.play().catch(() => {})
    } else {
      el.pause()
    }
  }

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current
    const nextTime = Number(event.target.value)
    if (!el || !Number.isFinite(nextTime)) return
    el.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const showFloating = shouldShowFloatingAudioPill({ hasStarted, isInView })

  return (
    <div ref={anchorRef} className="tma-audio-pill-anchor tma-section-audio">
      <audio
        ref={audioRef}
        className="tma-audio-player tma-section-audio"
        preload="metadata"
        src={src}
      >
        Your browser does not support the audio element.
      </audio>
      <PillControls
        label={label}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
      />
      {showFloating ? (
        <PillControls
          label={label}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          floating
        />
      ) : null}
    </div>
  )
}
