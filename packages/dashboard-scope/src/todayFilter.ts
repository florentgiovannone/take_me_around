export function startOfLocalDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/** Church and demo live slate activity starts tomorrow at 00:01 (11 Sep 2026, local). */
export const LIVE_SLATE_ACTIVITY_START = (() => {
  const start = new Date(2026, 8, 11)
  start.setHours(0, 1, 0, 0)
  return start
})()

export function isLiveSlateDate(date: Date, now = new Date()) {
  const end = startOfLocalDay(now)
  end.setDate(end.getDate() + 1)
  return date >= LIVE_SLATE_ACTIVITY_START && date < end
}

export function filterLiveSlateItems<T>(
  items: T[],
  getDate: (item: T) => Date | null | undefined,
  now = new Date()
) {
  return items.filter((item) => {
    const date = getDate(item)
    return Boolean(date && isLiveSlateDate(date, now))
  })
}

export function filterLiveSlateLogs<T extends { dtm_timestamp?: string | null }>(
  logs: T[],
  parseTimestamp: (value: string | null | undefined) => Date | null,
  now = new Date()
) {
  return filterLiveSlateItems(logs, (log) => parseTimestamp(log.dtm_timestamp), now)
}
