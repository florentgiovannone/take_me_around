import assert from "node:assert/strict"

import { buildMuseumActivityEntries, getMuseumLogs } from "./src/index.ts"

const seenPayload = JSON.stringify({
  REMOTE_ADDR: "86.171.205.55",
  HTTP_USER_AGENT: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15",
  HTTP_ACCEPT_LANGUAGE: "en-GB,en;q=0.9",
  HTTP_COOKIE: "sar=temple-serial-sar",
})

const namedSerialPair = [
  {
    int_id: 5992,
    dtm_timestamp: "2026-09-08T09:14:59.319303",
    txt_uid: null,
    text_name: "TTTOD001",
    txt_message_type: "SEEN",
    txt_message: seenPayload,
  },
  {
    int_id: 5993,
    dtm_timestamp: "2026-09-08T09:14:59.320956",
    txt_uid: null,
    text_name: "TTTOD001",
    txt_message_type: "REDIRECTED",
    txt_message: "https://takemearound.museum/the-temple-of-dendur",
  },
]

{
  const museumLogs = getMuseumLogs(namedSerialPair)
  assert.equal(museumLogs.length, 2, "pairs named serial SEEN with the museum redirect")
  assert.ok(
    museumLogs.some((log) => log.txt_message_type === "SEEN" && log.int_id === 5992),
    "includes the TTTOD001 SEEN row"
  )
}

{
  const [entry] = buildMuseumActivityEntries(namedSerialPair)
  assert.equal(entry?.redirect?.int_id, 5993, "activity keeps the museum redirect")
  assert.equal(entry?.seen.length, 1, "activity attaches the named serial SEEN to the redirect")
  assert.equal(entry?.seen[0]?.int_id, 5992)
  assert.equal(entry?.artworkTitle, "The Temple of Dendur")
}

console.log("analytics-museum smoke: ok")
