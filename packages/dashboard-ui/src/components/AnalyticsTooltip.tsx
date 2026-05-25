import { useEffect, useRef, useState, type ReactNode } from "react"
import { useTapChartInteraction } from "../hooks/useTapChartInteraction"

type AnalyticsTooltipProps = {
  label: string
  value: string
  children: ReactNode
}

export default function AnalyticsTooltip({ label, value, children }: AnalyticsTooltipProps) {
  const tapToSelect = useTapChartInteraction()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tapToSelect || !open) return

    const close = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const timeoutId = window.setTimeout(() => {
      document.addEventListener("click", close)
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
      document.removeEventListener("click", close)
    }
  }, [tapToSelect, open])

  const handleClick = () => {
    if (!tapToSelect) return
    setOpen((current) => !current)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  return (
    <div
      ref={wrapRef}
      className={`tma-analytics-tooltip-wrap${open ? " is-open" : ""}`}
      onMouseLeave={handleMouseLeave}
      onClick={tapToSelect ? handleClick : undefined}
      onKeyDown={
        tapToSelect
          ? (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              handleClick()
            }
          }
          : undefined
      }
      role={tapToSelect ? "button" : undefined}
      tabIndex={tapToSelect ? 0 : undefined}
      aria-expanded={tapToSelect ? open : undefined}
      aria-label={tapToSelect ? `${label}, ${value}` : undefined}
    >
      {children}
      <div className="tma-analytics-tooltip" role="tooltip">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  )
}
