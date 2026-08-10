import { describe, expect, it } from "vitest"
import {
  parseBrowser,
  parseDevice,
  parseLanguageLabel,
  parseOperatingSystem,
} from "./deviceHints"

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"

describe("deviceHints", () => {
  it("parses iPhone Safari like analytics packages", () => {
    expect(parseDevice(IPHONE_SAFARI)).toBe("mobile")
    expect(parseBrowser(IPHONE_SAFARI)).toBe("Safari")
    expect(parseOperatingSystem(IPHONE_SAFARI)).toBe("iOS")
  })

  it("labels primary languages", () => {
    expect(parseLanguageLabel("en-GB")).toBe("English")
    expect(parseLanguageLabel("fr-FR")).toBe("French")
  })
})
