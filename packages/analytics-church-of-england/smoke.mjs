import assert from "node:assert/strict"

import {
  SOUTHWELL_MINSTER_TAG_NAMES,
  canonicalSouthwellMinsterTagName,
  southwellMinsterDisplayTitle,
} from "@tma/config"
import {
  TRACKED_CHURCH_OF_ENGLAND_ARTWORKS,
  TRACKED_SOUTHWELL_MINSTER_ARTWORKS,
  buildAudienceAnalytics,
  buildChurchOfEnglandActivityEntries,
  buildSarTimelinePlot,
  getChurchOfEnglandLogs,
  listDistinctChurchOfEnglandSars,
  resolveTrackedArtwork,
} from "./src/index.ts"

const expectedCodes = ["SM001", "SM002", "SM003", "SM004", "SM005", "SM006", "SM007"]

assert.deepEqual([...SOUTHWELL_MINSTER_TAG_NAMES], expectedCodes, "Southwell tracks SM001–SM007")
assert.equal(TRACKED_SOUTHWELL_MINSTER_ARTWORKS.length, 7, "church lists 7 Southwell slates")
assert.equal(TRACKED_CHURCH_OF_ENGLAND_ARTWORKS.length, 8, "church lists Westminster plus 7 Southwell slates")

for (const code of expectedCodes) {
  assert.equal(canonicalSouthwellMinsterTagName(code), code, `recognises ${code}`)
}

assert.equal(canonicalSouthwellMinsterTagName("SM-001"), "SM001")
assert.equal(canonicalSouthwellMinsterTagName("SM 001"), "SM001")
assert.equal(canonicalSouthwellMinsterTagName("sm1"), "SM001")
assert.equal(canonicalSouthwellMinsterTagName("Southwell Minster - SM001"), "SM001")
assert.equal(canonicalSouthwellMinsterTagName("sm007"), "SM007")
assert.equal(canonicalSouthwellMinsterTagName("SM-7"), "SM007")

assert.equal(canonicalSouthwellMinsterTagName("SM008"), null)
assert.equal(canonicalSouthwellMinsterTagName("Southwell Minster 007"), "SM007")
assert.equal(canonicalSouthwellMinsterTagName("Southwell 007"), "SM007")
assert.equal(canonicalSouthwellMinsterTagName("Southwell Minster - 007"), "SM007")
assert.equal(canonicalSouthwellMinsterTagName("Southwell Minster"), null)
assert.equal(canonicalSouthwellMinsterTagName("Southwell"), null)

assert.equal(southwellMinsterDisplayTitle("SM001"), "Southwell Minster - SM001")
assert.equal(southwellMinsterDisplayTitle("SM007"), "Southwell Minster - SM007")

const baseLog = {
  int_id: 1,
  dtm_timestamp: null,
  txt_uid: null,
  text_name: "Westminster Abbey",
  txt_message_type: "SEEN",
}

const cases = [
  {
    name: "accepts the CoE URL and tracked path",
    message: "https://takemearound.church/westminster-abbey",
    expected: true,
  },
  {
    name: "accepts the legacy CoE host",
    message: "https://church.takemearound.gallery/westminster-abbey",
    expected: true,
  },
  {
    name: "rejects a museum URL despite the tracked title",
    message: "https://takemearound.museum/westminster-abbey",
    expected: false,
  },
  {
    name: "accepts an opaque SEEN user-agent payload via title",
    message: JSON.stringify({ HTTP_USER_AGENT: "Mozilla/5.0" }),
    expected: true,
  },
  {
    name: "accepts an opaque SEEN referer payload via title",
    message: JSON.stringify({ HTTP_REFERER: "https://google.com/search?q=abbey" }),
    expected: true,
  },
  {
    name: "accepts the tracked path",
    message: "/westminster-abbey",
    expected: true,
  },
]

for (const testCase of cases) {
  const artwork = resolveTrackedArtwork({ ...baseLog, txt_message: testCase.message })
  assert.equal(Boolean(artwork), testCase.expected, testCase.name)
}

assert.equal(
  resolveTrackedArtwork({
    ...baseLog,
    text_name: null,
    txt_message: "https://takemearound.church/minster_cathedral/Southwell/deans_welcome_message",
  }),
  null,
  "leaves a bare Southwell URL unmapped until an SM slate is present"
)

const southwellSeenPayload = JSON.stringify({
  REMOTE_ADDR: "1.2.3.4",
  HTTP_USER_AGENT: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15",
  HTTP_ACCEPT_LANGUAGE: "en-GB,en;q=0.9",
  HTTP_COOKIE: "sar=southwell-anonymous-sar",
})

const anonymousSouthwellPair = [
  {
    int_id: 6014,
    dtm_timestamp: "2026-09-08T09:29:27.031103",
    txt_uid: null,
    text_name: null,
    txt_message_type: "SEEN",
    txt_message: southwellSeenPayload,
  },
  {
    int_id: 6015,
    dtm_timestamp: "2026-09-08T09:29:27.033148",
    txt_uid: null,
    text_name: "SM001",
    txt_message_type: "REDIRECTED",
    txt_message: "https://takemearound.church/minster_cathedral/Southwell/deans_welcome_message",
  },
]

{
  const churchLogs = getChurchOfEnglandLogs(anonymousSouthwellPair)
  assert.equal(churchLogs.length, 2, "pairs unnamed adjacent SEEN with the SM001 redirect")
  assert.ok(
    churchLogs.some((log) => log.txt_message_type === "SEEN" && log.int_id === 6014),
    "includes the anonymous SEEN row"
  )
}

{
  const [entry] = buildChurchOfEnglandActivityEntries(anonymousSouthwellPair)
  assert.equal(entry?.redirect?.int_id, 6015, "activity keeps the SM001 redirect")
  assert.equal(entry?.seen.length, 1, "activity attaches the anonymous SEEN to the redirect")
  assert.equal(entry?.seen[0]?.int_id, 6014)
  assert.equal(entry?.artworkTitle, "Southwell Minster - SM001")
}

{
  const sars = listDistinctChurchOfEnglandSars(anonymousSouthwellPair)
  assert.deepEqual(sars, ["southwell-anonymous-sar"], "SAR from anonymous SEEN is kept")
  const plot = buildSarTimelinePlot(anonymousSouthwellPair)
  assert.ok(plot?.points.length, "live sessions include the anonymous Southwell tap")
  assert.ok(plot.points.some((point) => point.sar === "southwell-anonymous-sar"))
}

{
  const audience = buildAudienceAnalytics(anonymousSouthwellPair)
  assert.ok(audience.hasDeviceInfoData, "audience uses the paired anonymous SEEN")
}

{
  const namedGalleryNeighbor = [
    {
      int_id: 6000,
      dtm_timestamp: "2026-09-08T09:20:43.251675",
      txt_uid: null,
      text_name: "TSN005",
      txt_message_type: "SEEN",
      txt_message: southwellSeenPayload,
    },
    {
      int_id: 6001,
      dtm_timestamp: "2026-09-08T09:20:43.253323",
      txt_uid: null,
      text_name: "SM003",
      txt_message_type: "REDIRECTED",
      txt_message: "https://takemearound.church/Southwell_Minster/introduction",
    },
  ]
  const churchLogs = getChurchOfEnglandLogs(namedGalleryNeighbor)
  assert.equal(churchLogs.length, 1, "does not steal a named non-church SEEN next to a Southwell redirect")
  assert.equal(churchLogs[0]?.int_id, 6001)
  assert.equal(resolveTrackedArtwork(namedGalleryNeighbor[1])?.tagName, "SM003")
}

{
  const titleAlias = {
    ...baseLog,
    text_name: "Southwell Minster 007",
    txt_message: "https://takemearound.church/southwell-minster",
  }
  assert.equal(resolveTrackedArtwork(titleAlias)?.tagName, "SM007")
}

{
  const farApart = [
    {
      int_id: 1,
      dtm_timestamp: "2026-09-08T08:00:00.000000",
      txt_uid: null,
      text_name: null,
      txt_message_type: "SEEN",
      txt_message: southwellSeenPayload,
    },
    {
      int_id: 2,
      dtm_timestamp: "2026-09-08T09:29:27.033148",
      txt_uid: null,
      text_name: "SM001",
      txt_message_type: "REDIRECTED",
      txt_message: "https://takemearound.church/Southwell_Minster/introduction",
    },
  ]
  const churchLogs = getChurchOfEnglandLogs(farApart)
  assert.equal(churchLogs.length, 1, "does not pair an unnamed SEEN hours away from the redirect")
}

console.log(`CoE analytics smoke passed (${cases.length} cases + Southwell SM001–SM007 mapping)`)
