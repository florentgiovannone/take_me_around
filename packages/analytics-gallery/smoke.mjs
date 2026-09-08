import assert from "node:assert/strict"

import { buildGalleryActivityEntries, getGalleryLogs } from "./src/index.ts"

const seenPayload = JSON.stringify({
  REMOTE_ADDR: "86.171.205.55",
  HTTP_USER_AGENT: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15",
  HTTP_ACCEPT_LANGUAGE: "en-GB,en;q=0.9",
  HTTP_COOKIE: "sar=starry-night-007-sar",
})

const namedSerialPair = [
  {
    int_id: 5994,
    dtm_timestamp: "2026-09-08T09:18:43.361019",
    txt_uid: null,
    text_name: "Starry Night 007",
    txt_message_type: "SEEN",
    txt_message: seenPayload,
  },
  {
    int_id: 5995,
    dtm_timestamp: "2026-09-08T09:18:43.362750",
    txt_uid: null,
    text_name: "Starry Night 007",
    txt_message_type: "REDIRECTED",
    txt_message: "https://takemearound.gallery/the-starry-night",
  },
]

{
  const galleryLogs = getGalleryLogs(namedSerialPair)
  assert.equal(galleryLogs.length, 2, "pairs named serial SEEN with the gallery redirect")
  assert.ok(
    galleryLogs.some((log) => log.txt_message_type === "SEEN" && log.int_id === 5994),
    "includes the Starry Night 007 SEEN row"
  )
}

{
  const [entry] = buildGalleryActivityEntries(namedSerialPair)
  assert.equal(entry?.redirect?.int_id, 5995, "activity keeps the gallery redirect")
  assert.equal(entry?.seen.length, 1, "activity attaches the named serial SEEN to the redirect")
  assert.equal(entry?.seen[0]?.int_id, 5994)
  assert.equal(entry?.artworkTitle, "The Starry Night")
}

{
  const demoNeighbor = [
    ...namedSerialPair,
    {
      int_id: 5996,
      dtm_timestamp: "2026-09-08T09:19:00.476703",
      txt_uid: null,
      text_name: "TK007",
      txt_message_type: "SEEN",
      txt_message: seenPayload,
    },
  ]
  const [entry] = buildGalleryActivityEntries(demoNeighbor)
  assert.equal(entry?.seen.length, 1, "does not attach a TMA Demo SEEN to the gallery redirect")
  assert.equal(entry?.seen[0]?.int_id, 5994)
}

console.log("analytics-gallery smoke: ok")
