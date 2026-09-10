import assert from "node:assert/strict"

import {
  LIVE_SLATE_ACTIVITY_START,
  filterLiveSlateItems,
  filterLiveSlateLogs,
  isLiveSlateDate,
} from "./src/todayFilter.ts"

const today = new Date("2026-09-10T15:00:00")
const tomorrow = new Date("2026-09-11T15:00:00")
const todayNoon = new Date("2026-09-10T12:00:00")
const justBeforeStart = new Date(2026, 8, 11, 0, 0, 59)
const atStart = new Date(2026, 8, 11, 0, 1, 0)
const tomorrowNoon = new Date("2026-09-11T12:00:00")
const saturdayNoon = new Date("2026-09-12T12:00:00")

assert.equal(LIVE_SLATE_ACTIVITY_START.getTime(), atStart.getTime(), "window opens tomorrow at 00:01")
assert.equal(isLiveSlateDate(todayNoon, today), false, "hides today's scans before the window opens")
assert.equal(isLiveSlateDate(justBeforeStart, tomorrow), false, "hides scans before 00:01")
assert.equal(isLiveSlateDate(atStart, tomorrow), true, "keeps scans from 00:01")
assert.equal(isLiveSlateDate(tomorrowNoon, tomorrow), true, "keeps the rest of tomorrow")
assert.equal(isLiveSlateDate(tomorrowNoon, today), false, "does not show tomorrow while it is still today")
assert.equal(isLiveSlateDate(saturdayNoon, tomorrow), false, "does not show days after the current day")

const items = [
  { id: "today", time: todayNoon },
  { id: "before-start", time: justBeforeStart },
  { id: "start", time: atStart },
  { id: "tomorrow", time: tomorrowNoon },
  { id: "missing", time: null },
]

assert.deepEqual(
  filterLiveSlateItems(items, (item) => item.time, today).map((item) => item.id),
  [],
  "church/demo stay empty until tomorrow 00:01"
)

assert.deepEqual(
  filterLiveSlateItems(items, (item) => item.time, tomorrow).map((item) => item.id),
  ["start", "tomorrow"],
  "from tomorrow 00:01, keeps that day's slates"
)

function parseNaiveGmt(value) {
  if (!value) return null
  const date = new Date(`${value}Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

const activityRows = [
  { artworkTitle: "SM001", timestamp: "2026-09-10T12:00:00" },
  { artworkTitle: "SM002", timestamp: "2026-09-11T12:00:00" },
  { artworkTitle: "SM003", timestamp: null },
]

assert.deepEqual(
  filterLiveSlateItems(activityRows, (row) => parseNaiveGmt(row.timestamp), tomorrow).map(
    (row) => row.artworkTitle
  ),
  ["SM002"],
  "keeps slates scanned from tomorrow 00:01"
)

const audienceAndSessionLogs = [
  { int_id: 1, dtm_timestamp: "2026-09-10T12:00:00" },
  { int_id: 2, dtm_timestamp: "2026-09-11T12:00:00" },
  { int_id: 3, dtm_timestamp: null },
]

assert.deepEqual(
  filterLiveSlateLogs(audienceAndSessionLogs, parseNaiveGmt, tomorrow).map((log) => log.int_id),
  [2],
  "audience and live sessions keep logs from tomorrow 00:01"
)

console.log("dashboard-scope live slate filter: ok")
