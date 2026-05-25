import type { KeyboardEvent } from "react"
import ChartCountReadout from "./ChartCountReadout"
import { formatNumber } from "@tma/dashboard-scope"
export type AudienceBreakdownItem = {
  key: string
  label: string
  count: number
  percent: number
}

type ChartSelection = {
  key: string
  label: string
  count: number
  percent?: number
}

type AudienceBreakdownListProps = {
  items: AudienceBreakdownItem[]
  colorForKey: (key: string) => string
  selection: ChartSelection | null
  onSelectionChange: (selection: ChartSelection | null) => void
  tapToSelect: boolean
  readoutIdleTap: string
  readoutIdleHover: string
  onKeyDown: (event: KeyboardEvent, onActivate: () => void) => void
  className?: string
}

function formatVisitLabel(count: number, percent: number) {
  return `${formatNumber(count)} visit${count === 1 ? "" : "s"} · ${percent}%`
}

function toggleSelection(
  current: ChartSelection | null,
  next: ChartSelection,
  setter: (value: ChartSelection | null) => void
) {
  setter(current?.key === next.key ? null : next)
}

export default function AudienceBreakdownList({
  items,
  colorForKey,
  selection,
  onSelectionChange,
  tapToSelect,
  readoutIdleTap,
  readoutIdleHover,
  onKeyDown,
  className,
}: AudienceBreakdownListProps) {
  return (
    <div className={className}>
      <ChartCountReadout
        label={selection?.label ?? null}
        value={
          selection?.percent != null
            ? formatVisitLabel(selection.count, selection.percent)
            : null
        }
        tapToSelect={tapToSelect}
        idleMessage={tapToSelect ? readoutIdleTap : readoutIdleHover}
      />
      <ul className="tma-analytics-browser-list">
        {items.map((item) => {
          const isSelected = selection?.key === item.key
          const chartSelection: ChartSelection = {
            key: item.key,
            label: item.label,
            count: item.count,
            percent: item.percent,
          }

          return (
            <li key={item.key}>
              <div
                className={`tma-analytics-browser-entry${isSelected ? " tma-analytics-browser-entry--selected" : ""}${tapToSelect ? " tma-analytics-browser-entry--tappable" : ""}`}
                role={tapToSelect ? "button" : undefined}
                tabIndex={tapToSelect ? 0 : undefined}
                aria-pressed={tapToSelect ? isSelected : undefined}
                aria-label={
                  tapToSelect
                    ? `${item.label}, ${formatVisitLabel(item.count, item.percent)}`
                    : undefined
                }
                onClick={
                  tapToSelect
                    ? () => toggleSelection(selection, chartSelection, onSelectionChange)
                    : undefined
                }
                onMouseEnter={
                  tapToSelect ? undefined : () => onSelectionChange(chartSelection)
                }
                onMouseLeave={tapToSelect ? undefined : () => onSelectionChange(null)}
                onKeyDown={
                  tapToSelect
                    ? (event) =>
                        onKeyDown(event, () =>
                          toggleSelection(selection, chartSelection, onSelectionChange)
                        )
                    : undefined
                }
              >
                <div className="tma-analytics-browser-row">
                  <span>{item.label}</span>
                  <strong>{item.percent}%</strong>
                </div>
                <div className="tma-analytics-browser-track">
                  <div
                    className="tma-analytics-browser-fill"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: colorForKey(item.key),
                    }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
