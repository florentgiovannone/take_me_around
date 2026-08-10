import { describe, expect, it } from "vitest"
import {
  hasRecordedScanThisSession,
  markScanRecordedThisSession,
  scanSessionKey,
} from "./scanSession"

describe("scanSession", () => {
  it("builds a namespaced key", () => {
    expect(scanSessionKey("demo-mochi")).toBe("tma-safe-pet-scan-session:demo-mochi")
  })

  it("marks and detects a recorded scan in session storage", () => {
    const storage = new Map<string, string>()
    const shim: Storage = {
      get length() {
        return storage.size
      },
      clear() {
        storage.clear()
      },
      getItem(key) {
        return storage.has(key) ? storage.get(key)! : null
      },
      key() {
        return null
      },
      removeItem(key) {
        storage.delete(key)
      },
      setItem(key, value) {
        storage.set(key, value)
      },
    }

    expect(hasRecordedScanThisSession(shim, "demo-mochi")).toBe(false)
    markScanRecordedThisSession(shim, "demo-mochi")
    expect(hasRecordedScanThisSession(shim, "demo-mochi")).toBe(true)
  })
})
