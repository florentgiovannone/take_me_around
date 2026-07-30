import assert from "node:assert/strict"

import { resolveTrackedArtwork } from "./src/index.ts"

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
    name: "accepts Southwell introduction path",
    message: "https://takemearound.church/Southwell_Minster/introduction",
    expected: true,
  },
  {
    name: "accepts legacy Southwell path alias",
    message: "https://takemearound.church/southwell-minster",
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

console.log(`CoE analytics smoke passed (${cases.length} cases)`)
