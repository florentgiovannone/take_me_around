import assert from "node:assert/strict"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { test } from "node:test"
import { createServer } from "vite"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const SM003_SEEN = {
  int_id: 6222,
  dtm_timestamp: "2026-09-10T13:15:54.963829",
  txt_uid: null,
  text_name: "SM003",
  txt_message_type: "SEEN",
  txt_message:
    '{"REMOTE_ADDR":"86.171.205.55","HTTP_USER_AGENT":"Mozilla/5.0","HTTP_ACCEPT_LANGUAGE":"en-GB,en;q=0.9","HTTP_COOKIE":"sar=fb2f47e982d87992f9f2459fb123a5e39e5403a80ca6cd4d44d98fd68c58ca5f"}',
}

const SM003_REDIRECT = {
  int_id: 6223,
  dtm_timestamp: "2026-09-10T13:15:54.966741",
  txt_uid: null,
  text_name: "SM003",
  txt_message_type: "REDIRECTED",
  txt_message: "https://takemearound.church/Southwell_Minster/introduction",
}

test("church live-session visit collapses REDIRECTED+SEEN to a circle", async () => {
  const root = path.join(repoRoot, "apps/dashboard")
  const server = await createServer({
    root,
    configFile: path.join(root, "vite.config.ts"),
    server: { middlewareMode: true },
    appType: "custom",
  })
  try {
    const scope = await server.ssrLoadModule("../../packages/dashboard-scope/src/index.ts")
    const plot = scope.buildSarTimelinePlot([SM003_SEEN, SM003_REDIRECT], "church_of_england")
    assert.ok(plot, "plot exists")
    const latest = [...plot.points].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )[0]
    assert.equal(plot.points.length, 1)
    assert.equal(latest.isRedirect, false)
    assert.equal(latest.messageType.toUpperCase(), "SEEN")
  } finally {
    await server.close()
  }
})
