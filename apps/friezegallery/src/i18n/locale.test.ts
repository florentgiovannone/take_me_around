import { afterEach, describe, expect, it } from "vitest"
import { artworks } from "../artworks"
import { localizeArtwork } from "./artworkCopy"
import { fill, uiCopy } from "./uiCopy"
import { ARTWORK_PAGE_LOCALES, detectArtworkPageLocale } from "../utils/artworkPageLocale"

const originalNavigator = globalThis.navigator

afterEach(() => {
  Object.defineProperty(globalThis, "navigator", {
    value: originalNavigator,
    configurable: true,
  })
})

function navigatorFor(languages: string[]) {
  Object.defineProperty(globalThis, "navigator", {
    value: { languages, language: languages[0] },
    configurable: true,
  })
}

describe("detectArtworkPageLocale", () => {
  it("reads the same language aliases as the other apps", () => {
    const search = (lang: string) => ({ get: (key: string) => (key === "lang" ? lang : null) })
    expect(detectArtworkPageLocale(search("fr"))).toBe("fr")
    expect(detectArtworkPageLocale(search("japanese"))).toBe("ja")
    expect(detectArtworkPageLocale(search("zh"))).toBe("zh")
    expect(detectArtworkPageLocale(search("pt"))).toBe("pt")
  })

  it("follows the browser language, then English", () => {
    navigatorFor(["pt-BR", "en"])
    expect(detectArtworkPageLocale({ get: () => null })).toBe("pt")

    navigatorFor(["nl-NL"])
    expect(detectArtworkPageLocale({ get: () => null })).toBe("en")
  })
})

describe("frieze copy", () => {
  it("has interface copy and artwork text for every locale", () => {
    for (const locale of ARTWORK_PAGE_LOCALES) {
      const copy = uiCopy(locale)
      expect(copy.welcome.length).toBeGreaterThan(0)
      expect(copy.termsBody).toHaveLength(3)
      expect(fill(copy.byline, { artist: "Ada" })).toContain("Ada")

      for (const artwork of artworks) {
        const localized = localizeArtwork(artwork, locale)
        expect(localized.paragraphs).toHaveLength(artwork.paragraphs.length)
        expect(localized.extraImages).toHaveLength(artwork.extraImages.length)
        expect(localized.kicker.length).toBeGreaterThan(0)
        if (locale !== "en") {
          expect(localized.paragraphs[0]).not.toBe(artwork.paragraphs[0])
        }
      }
    }
  })
})
