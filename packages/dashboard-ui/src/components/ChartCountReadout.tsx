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
  const message =
    label && value
      ? `${label} · ${value}`
      : idleMessage ??
      (tapToSelect ? "Tap to see tap counts" : "Hover to see tap counts")

  return (
    <p className="tma-analytics-chart-hover-readout" aria-live="polite">
      {message}
    </p>
  )
}
