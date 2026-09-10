import assert from "node:assert/strict"

import {
  TMA_DEMO_TAG_NAMES,
  canonicalTmaDemoTagName,
  isReservedSiteTagName,
  tmaDemoDisplayTitle,
} from "@tma/config"
import {
  TRACKED_TMA_DEMO_ARTWORKS,
  getTmaDemoLogs,
  resolveTrackedArtwork,
} from "./src/index.ts"

const expectedCodes = [
  "TTOD001",
  "TTOD002",
  "TTOD003",
  "TTOD004",
  "TTOD005",
  "TTOD006",
  "TTOD007",
  "TK001",
  "TK002",
  "TK003",
  "TK004",
  "TK005",
  "TK006",
  "TK007",
  "TSN001",
  "TSN002",
  "TSN003",
  "TSN004",
  "TSN005",
  "TSN006",
  "TSN007",
]

assert.deepEqual([...TMA_DEMO_TAG_NAMES], expectedCodes, "demo tracks only TTOD, TK, and TSN 001–007")
assert.equal(TRACKED_TMA_DEMO_ARTWORKS.length, 21, "demo lists 21 tracked slates")

for (const code of expectedCodes) {
  assert.equal(canonicalTmaDemoTagName(code), code, `recognises ${code}`)
}

assert.equal(canonicalTmaDemoTagName("TTTOD001"), "TTOD001")
assert.equal(canonicalTmaDemoTagName("TTOD-001"), "TTOD001")
assert.equal(canonicalTmaDemoTagName("TTOD 001"), "TTOD001")
assert.equal(canonicalTmaDemoTagName("ttod1"), "TTOD001")
assert.equal(canonicalTmaDemoTagName("The Temple of Dendur - TTOD001"), "TTOD001")
assert.equal(canonicalTmaDemoTagName("tk007"), "TK007")
assert.equal(canonicalTmaDemoTagName("TSN-7"), "TSN007")

assert.equal(canonicalTmaDemoTagName("TS001"), null)
assert.equal(canonicalTmaDemoTagName("Starry Night 007"), "TSN007")
assert.equal(canonicalTmaDemoTagName("The Starry Night 007"), "TSN007")
assert.equal(canonicalTmaDemoTagName("The Starry Night - 007"), "TSN007")
assert.equal(isReservedSiteTagName("Starry Night 007"), false)
assert.equal(isReservedSiteTagName("The Starry Night 007"), false)
assert.equal(isReservedSiteTagName("TSN007"), true)
assert.equal(canonicalTmaDemoTagName("The Starry Night"), null)
assert.equal(canonicalTmaDemoTagName("The Temple of Dendur"), null)
assert.equal(canonicalTmaDemoTagName("TK008"), null)
assert.equal(canonicalTmaDemoTagName("The Kiss"), null)

assert.equal(tmaDemoDisplayTitle("TTOD001"), "The Temple of Dendur - TTOD001")
assert.equal(tmaDemoDisplayTitle("TK001"), "The Kiss - TK001")
assert.equal(tmaDemoDisplayTitle("TSN001"), "The Starry Night - TSN001")

const seenPayload = JSON.stringify({
  REMOTE_ADDR: "86.171.205.55",
  HTTP_USER_AGENT: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15",
  HTTP_ACCEPT_LANGUAGE: "en-GB,en;q=0.9",
  HTTP_COOKIE: "sar=ttod001-sar",
})

const logs = [
  {
    int_id: 1,
    dtm_timestamp: "2026-09-08T09:14:59.319303",
    txt_uid: null,
    text_name: "TTTOD001",
    txt_message_type: "SEEN",
    txt_message: seenPayload,
  },
  {
    int_id: 2,
    dtm_timestamp: "2026-09-08T09:14:59.320956",
    txt_uid: null,
    text_name: "TTTOD001",
    txt_message_type: "REDIRECTED",
    txt_message: "https://takemearound.museum/the-temple-of-dendur",
  },
  {
    int_id: 3,
    dtm_timestamp: "2026-09-08T09:15:01.000000",
    txt_uid: null,
    text_name: "TS001",
    txt_message_type: "REDIRECTED",
    txt_message: "https://example.test/ts001",
  },
  {
    int_id: 4,
    dtm_timestamp: "2026-09-08T09:15:02.000000",
    txt_uid: null,
    text_name: "Starry Night 007",
    txt_message_type: "REDIRECTED",
    txt_message: "https://takemearound.gallery/the-starry-night",
  },
]

const demoLogs = getTmaDemoLogs(logs)
assert.equal(demoLogs.length, 3, "keeps the TTOD001 alias pair and Starry Night 007")
assert.equal(resolveTrackedArtwork(logs[0])?.tagName, "TTOD001")
assert.equal(resolveTrackedArtwork(logs[2]), null)
assert.equal(resolveTrackedArtwork(logs[3])?.tagName, "TSN007")

console.log("analytics-tma-demo smoke: ok")
