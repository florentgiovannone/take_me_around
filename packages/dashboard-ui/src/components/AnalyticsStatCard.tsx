import type { ReactNode } from "react"

export function StatIcon({ children }: { children: ReactNode }) {
  return <span className="tma-analytics-stat-icon">{children}</span>
}

type AnalyticsStatCardProps = {
  label: string
  value: ReactNode
  meta: ReactNode
  icon?: ReactNode
  valueClassName?: string
  metaClassName?: string
}

export default function AnalyticsStatCard({
  label,
  value,
  meta,
  icon,
  valueClassName,
  metaClassName,
}: AnalyticsStatCardProps) {
  return (
    <article className="tma-analytics-stat-card">
      {icon ? <StatIcon>{icon}</StatIcon> : null}
      <p className="tma-analytics-stat-label">{label}</p>
      <p className={`tma-analytics-stat-value${valueClassName ? ` ${valueClassName}` : ""}`}>{value}</p>
      <p className={`tma-analytics-stat-meta${metaClassName ? ` ${metaClassName}` : ""}`}>{meta}</p>
    </article>
  )
}
