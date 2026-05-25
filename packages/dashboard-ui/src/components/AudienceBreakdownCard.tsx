import type { KeyboardEvent } from "react"
import AudienceBreakdownList, { type AudienceBreakdownItem } from "./AudienceBreakdownList"

export type { AudienceBreakdownItem }

type ChartSelection = {
  key: string
  label: string
  count: number
  percent?: number
}

type AudienceBreakdownCardProps = {
  title: string
  items: AudienceBreakdownItem[]
  hasData: boolean
  emptyMessage: string
  colorForKey: (key: string) => string
  selection: ChartSelection | null
  onSelectionChange: (selection: ChartSelection | null) => void
  tapToSelect: boolean
  readoutIdleTap: string
  readoutIdleHover: string
  onKeyDown: (event: KeyboardEvent, onActivate: () => void) => void
  className?: string
  listClassName?: string
}

export default function AudienceBreakdownCard({
  title,
  items,
  hasData,
  emptyMessage,
  colorForKey,
  selection,
  onSelectionChange,
  tapToSelect,
  readoutIdleTap,
  readoutIdleHover,
  onKeyDown,
  className,
  listClassName,
}: AudienceBreakdownCardProps) {
  return (
    <section className={["tma-analytics-card", className].filter(Boolean).join(" ")}>
      <h2>{title}</h2>
      {hasData ? (
        <AudienceBreakdownList
          items={items}
          colorForKey={colorForKey}
          selection={selection}
          onSelectionChange={onSelectionChange}
          tapToSelect={tapToSelect}
          readoutIdleTap={readoutIdleTap}
          readoutIdleHover={readoutIdleHover}
          onKeyDown={onKeyDown}
          className={listClassName}
        />
      ) : (
        <p className="tma-analytics-empty">{emptyMessage}</p>
      )}
    </section>
  )
}
