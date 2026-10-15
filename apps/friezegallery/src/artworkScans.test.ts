import { afterEach, describe, expect, it } from "vitest"
import { logArtworkScan, readArtworkScans } from "./artworkScans"

const store = new Map<string, string>()

afterEach(() => {
  store.clear()
})

Object.assign(globalThis, {
  localStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
  },
})

describe("artwork scans", () => {
  it("logs a scan with a Frieze text name", () => {
    logArtworkScan("FO001", "/works/overcast")
    const [scan] = readArtworkScans()
    expect(scan.text_name).toBe("FO001")
    expect(scan.txt_message).toBe("/works/overcast")
    expect(scan.txt_message_type).toBe("REDIRECTED")
  })
})
