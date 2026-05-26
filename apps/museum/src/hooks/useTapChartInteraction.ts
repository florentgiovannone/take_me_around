import { useEffect, useState } from "react"

const TAP_CHART_MEDIA = "(max-width: 1024px), (hover: none), (pointer: coarse)"

export function useTapChartInteraction() {
  const [tapMode, setTapMode] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(TAP_CHART_MEDIA).matches
  })

  useEffect(() => {
    const media = window.matchMedia(TAP_CHART_MEDIA)
    const onChange = () => setTapMode(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return tapMode
}
