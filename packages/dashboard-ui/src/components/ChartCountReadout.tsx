import { useDashboardCopy } from "../hooks/useSiteAnalyticsScope"

type ChartCountReadoutProps = {
  label: string | null
  value: string | null
  tapToSelect: boolean
  idleMessage?: string
}

export default function ChartCountReadout({
  label,
  value,
  tapToSelect,
  idleMessage,
}: ChartCountReadoutProps) {
  const copy = useDashboardCopy()
  const message =
    label && value
      ? `${label} · ${value}`
      : idleMessage ??
      (tapToSelect ? copy.tapToSee : copy.hoverToSee)

  return (
    <p className="tma-analytics-chart-hover-readout" aria-live="polite">
      {message}
    </p>
  )
}
