import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import {
  BrandAudioPlayer,
  formatAudioTime,
  shouldShowFloatingAudioPill,
} from "./BrandAudioPlayer"

describe("formatAudioTime", () => {
  it("formats valid seconds as M:SS and invalid values as --:--", () => {
    expect(formatAudioTime(0)).toBe("0:00")
    expect(formatAudioTime(72.4)).toBe("1:12")
    expect(formatAudioTime(248)).toBe("4:08")
    expect(formatAudioTime(Number.NaN)).toBe("--:--")
    expect(formatAudioTime(Number.POSITIVE_INFINITY)).toBe("--:--")
    expect(formatAudioTime(-5)).toBe("--:--")
  })
})

describe("shouldShowFloatingAudioPill", () => {
  it("returns true only when playback has started and the in-page player is out of view", () => {
    expect(shouldShowFloatingAudioPill({ hasStarted: false, isInView: true })).toBe(false)
    expect(shouldShowFloatingAudioPill({ hasStarted: false, isInView: false })).toBe(false)
    expect(shouldShowFloatingAudioPill({ hasStarted: true, isInView: true })).toBe(false)
    expect(shouldShowFloatingAudioPill({ hasStarted: true, isInView: false })).toBe(true)
  })
})

describe("BrandAudioPlayer", () => {
  it("renders the navy pill with Listen kicker, time readout, seek bar, and hidden audio element", () => {
    const html = renderToStaticMarkup(
      createElement(BrandAudioPlayer, { src: "/audio/the-kiss.mp3" })
    )
    expect(html).toContain("tma-navy-pill")
    expect(html).toContain("Listen")
    expect(html).toContain("0:00 / --:--")
    expect(html).toContain('aria-label="Play audio"')
    expect(html).toContain('aria-label="Seek audio"')
    expect(html).toContain('class="tma-audio-player tma-section-audio"')
    expect(html).toContain('src="/audio/the-kiss.mp3"')
  })
})
