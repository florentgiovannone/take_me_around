import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { ArtworkFrame, BrandHeader } from "./index"

describe("BrandHeader", () => {
  it("links the wordmark to the app home", () => {
    const html = renderToStaticMarkup(<BrandHeader />)
    expect(html).toContain('href="/"')
    expect(html).toContain("TAKE")
    expect(html).toContain("ME")
    expect(html).toContain("AROUND")
  })
})

describe("ArtworkFrame", () => {
  it("renders the hero, both banners, audio, image, and sections", () => {
    const html = renderToStaticMarkup(
      <ArtworkFrame
        title="Mona Lisa"
        subtitle="1503–1519 by Leonardo da Vinci"
        bannerTop="Read about the technology."
        bannerBottom="Read about the technology again."
        imageSrc="/mona.jpg"
        imageAlt="Mona Lisa by Leonardo da Vinci"
        audio={<p>Listen</p>}
        sections={[
          { heading: "About the painting.", paragraphs: ["A portrait on poplar."] },
          { heading: "About the artist.", paragraphs: ["Born near Vinci."] },
        ]}
      />
    )
    expect(html).toContain("Mona Lisa")
    expect(html).toContain("1503–1519 by Leonardo da Vinci")
    expect(html).toContain("Read about the technology.")
    expect(html).toContain("Read about the technology again.")
    expect(html).toContain('href="/underlying-technology"')
    expect(html).toContain("Listen")
    expect(html).toContain('src="/mona.jpg"')
    expect(html).toContain('alt="Mona Lisa by Leonardo da Vinci"')
    expect(html).toContain("About the painting.")
    expect(html).toContain("A portrait on poplar.")
    expect(html).toContain("About the artist.")
    expect(html).toContain("Born near Vinci.")
    expect(html).toContain("Text size")
    expect(html).toContain('aria-label="Medium text"')
    expect(html).toContain('aria-pressed="true"')
  })

  it("renders an optional line under the title", () => {
    const html = renderToStaticMarkup(
      <ArtworkFrame
        title="The Golden Boys"
        detail="Boulton, Watt and Murdoch"
        subtitle="1956 by William Bloye"
        imageSrc="/golden-boys.jpg"
        imageAlt="The Golden Boys"
        sections={[{ heading: "About the work", paragraphs: ["A gilded bronze group."] }]}
      />
    )
    expect(html).toContain("The Golden Boys")
    expect(html).toContain("Boulton, Watt and Murdoch")
    expect(html).toContain("1956 by William Bloye")
    expect(html.indexOf("The Golden Boys")).toBeLessThan(html.indexOf("Boulton, Watt and Murdoch"))
    expect(html.indexOf("Boulton, Watt and Murdoch")).toBeLessThan(html.indexOf("1956 by William Bloye"))
  })

  it("omits an empty audio slot and an empty banner", () => {
    const html = renderToStaticMarkup(
      <ArtworkFrame
        title="Mona Lisa"
        subtitle="Leonardo da Vinci"
        bannerTop=""
        imageSrc="/mona.jpg"
        imageAlt="Mona Lisa"
        sections={[{ heading: "About the painting.", paragraphs: ["A portrait."] }]}
      />
    )
    expect(html).not.toContain("tma-brand-banner")
    expect(html).not.toContain("Listen")
    expect(html).toContain("About the painting.")
  })
})
