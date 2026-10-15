import { describe, expect, it } from "vitest"
import { artworkAudioSrc, buildArtworkAudioScript } from "./audioScript"
import { artworks } from "./artworks"

const ORDER = ["by ", "Year. ", "Medium. ", "Gallery. ", "Price. ", "About the work."]

describe("artwork audio script", () => {
  it("speaks every work in the same order", () => {
    for (const artwork of artworks) {
      const script = buildArtworkAudioScript(artwork)
      const positions = ORDER.map((marker) => script.indexOf(marker))
      expect(positions.every((position) => position >= 0)).toBe(true)
      expect(positions).toEqual([...positions].sort((a, b) => a - b))
      expect(script.startsWith(`${artwork.title} by ${artwork.artist}.`)).toBe(true)

      const facts = script.split("About the work.")[0]
      expect(facts).not.toMatch(/Inventory|Available|Artist-to-Artist|Frieze London|centimetre|cm\b/i)
    }
  })

  it("keeps the catalogue facts ahead of the essay", () => {
    const overcast = artworks.find((artwork) => artwork.slug === "overcast")
    expect(overcast).toBeDefined()
    expect(buildArtworkAudioScript(overcast!)).toBe(
      [
        "Overcast by Paul Robas.",
        '<break time="0.8s" />\nYear. 2026.',
        '<break time="0.8s" />\nMedium. Acrylic, oil, ink and encaustic on linen.',
        '<break time="0.8s" />\nGallery. Alice Amati, London.',
        '<break time="0.8s" />\nPrice. Under $10,000.',
        [
          '<break time="1.2s" />',
          "About the work.",
          "",
          "Robas makes Overcast from photographs in his own archive, edited and collaged until a face no longer holds still.",
          "",
          "The pictures pass through a camera, digital work, and then projection or transfer onto linen. What arrives on the canvas is blurred, doubled, layered, or partly hidden.",
          "",
          "He uses encaustic, pigment laid over wax, a method he first met in the Fayum mummy portraits of the Roman period. The wax leaves a pale, fading surface, which is the quality he wants from the image.",
          "",
          "The anonymous face is less a fixed likeness than a place where memory and an interior life come through. Presented by Alice Amati in Artist-to-Artist at Frieze London. Inventory PR075.",
        ].join("\n"),
      ].join("\n\n"),
    )
  })

  it("puts gallery before price, including Study for Toali", () => {
    const toali = artworks.find((artwork) => artwork.slug === "study-for-toali")
    expect(toali).toBeDefined()
    const script = buildArtworkAudioScript(toali!)
    expect(script.indexOf("Gallery. Embajada, San Juan.")).toBeLessThan(script.indexOf("Price. £8,000."))
    expect(script.indexOf("Price. £8,000.")).toBeLessThan(script.indexOf("About the work."))
    expect(script.startsWith("Study for Toali by Jorge González Santos.")).toBe(true)
  })

  it("speaks a translated script in the same order", () => {
    const overcast = artworks.find((artwork) => artwork.slug === "overcast")
    expect(overcast).toBeDefined()
    const script = buildArtworkAudioScript(overcast!, "fr")
    const markers = ["par ", "Année. ", "Technique. ", "Galerie. ", "Prix. ", "À propos de l’œuvre."]
    const positions = markers.map((marker) => script.indexOf(marker))
    expect(positions.every((position) => position >= 0)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
    expect(script).toContain("Moins de $10,000.")
    expect(script).toContain("Acrylique, huile, encre et encaustique sur lin.")
    expect(script).not.toContain("About the work.")
    expect(artworkAudioSrc("/audio/overcast.mp3", "fr")).toBe("/audio/fr/overcast.mp3")
    expect(artworkAudioSrc("/audio/overcast.mp3")).toBe("/audio/overcast.mp3")
  })
})
