export type Artwork = {
  slug: string
  textName: string
  title: string
  artist: string
  year: string
  medium: string
  dimensions: string
  gallery: string
  section: string
  fair: string
  price: string | null
  inventory: string | null
  website: string
  document: { href: string; label: string } | null
  extraImages: { src: string; alt: string }[]
  onView: boolean
  status: string
  kicker: string
  imageSrc: string
  imageAlt: string
  standfirst: string
  paragraphs: string[]
  audioSrc: string
}

export const artworks: Artwork[] = [
  {
    slug: "overcast",
    textName: "FG001",
    title: "Overcast",
    artist: "Paul Robas",
    year: "2026",
    medium: "Acrylic, oil, ink and encaustic on linen",
    dimensions: "30 × 40 × 3 cm",
    gallery: "Alice Amati, London",
    section: "Artist-to-Artist",
    fair: "Frieze London",
    price: "Under $10,000",
    inventory: "PR075",
    website: "https://www.aliceamati.com",
    document: {
      href: "https://assets-frieze-fvr.artnav.co/f6a184a1-cb45-4165-9ba9-36af47587918___%20Paul%20Robas%20-%20Bio.pdf",
      label: "Artist biography",
    },
    extraImages: [
      {
        src: "https://assets-frieze-fvr.artnav.co/003337c6-6faf-4262-9170-d53e742964a2___Paul%20Robas%2C%20%E2%80%98Overcast%E2%80%99%2C%202026%2C%20Acrylic%2C%20oil%2C%20ink%20and%20encaustic%20on%20linen%2C%2030%20x%2040%20cm.jpg",
        alt: "Paul Robas, Overcast, 2026, installation view",
      },
    ],
    onView: true,
    status: "Available",
    kicker: "Painting",
    imageSrc:
      "https://assets-frieze-fvr.artnav.co/f0fbc63e-2585-4eb2-b8a5-18e3ebb36ea1___Alice%20Amati%20-%20Paul%20Robas_009-desktop.jpg",
    imageAlt: "Paul Robas, Overcast, 2026",
    audioSrc: "/audio/overcast.mp3",
    standfirst:
      "Robas makes Overcast from photographs in his own archive, edited and collaged until a face no longer holds still.",
    paragraphs: [
      "The pictures pass through a camera, digital work, and then projection or transfer onto linen. What arrives on the canvas is blurred, doubled, layered, or partly hidden.",
      "He uses encaustic, pigment laid over wax, a method he first met in the Fayum mummy portraits of the Roman period. The wax leaves a pale, fading surface, which is the quality he wants from the image.",
      "The anonymous face is less a fixed likeness than a place where memory and an interior life come through. Presented by Alice Amati in Artist-to-Artist at Frieze London. Inventory PR075.",
    ],
  },
  {
    slug: "study-for-toali",
    textName: "FG002",
    title: "Study for Toali",
    artist: "Jorge González Santos",
    year: "2021",
    medium: "Lampblack drawing on fabric",
    dimensions: "7\" x 9\" (17.78 cm x 22.86 cm)",
    gallery: "Embajada, San Juan",
    section: "Artist-to-Artist",
    fair: "Frieze London",
    price: "£ 8,000",
    inventory: null,
    website: "https://embajadada.com/",
    document: null,
    extraImages: [
      {
        src: "https://assets-frieze-fvr.artnav.co/56100d7a-4408-4f8c-b58d-1b0ee96285ad___Embajada_JorgeGonzalez_003a.jpg",
        alt: "Jorge González Santos, Study for Toali, detail",
      },
      {
        src: "https://assets-frieze-fvr.artnav.co/2772b240-8bf8-4e1e-b594-6e8b51b2b9ee___Embajada_JorgeGonzalez_003b.jpg",
        alt: "Jorge González Santos, Study for Toali, alternate view",
      },
    ],
    onView: false,
    status: "Available",
    kicker: "Drawing",
    imageSrc:
      "https://assets-frieze-fvr.artnav.co/9e0f86e8-8e7c-42d0-a176-db8d6e86dd1c___JorgeGonzalez_Toali_Embajada-desktop.jpg",
    imageAlt: "Jorge González Santos, Study for Toali, 2021",
    audioSrc: "/audio/study-for-toali.mp3",
    standfirst: "",
    paragraphs: [
      "González Santos’s lampblack drawings are from an ongoing series entitled Toali, named after the 3-pointed Taíno carved stones. These indigenous objects were used to acknowledge ancestral spirits and act as offerings for crop cultivation. González’s depictions of these carved stones among other Taíno symbols and designs are made using lampblack, a black pigment made from soot, harvested by the artist from an oil lamp in his studio. The pigment recalls photographic documentation made by archaeological investigations of the Caribbean in the early 20th century.",
    ],
  },
  {
    slug: "stars-wrapped-in-flesh",
    textName: "FG003",
    title: "Stars wrapped in flesh",
    artist: "Karim Boumjimar",
    year: "2025",
    medium: "Watercolour and ink on mulberry paper",
    dimensions: "66 × 98 cm",
    gallery: "TINA, London",
    section: "The Code Universe",
    fair: "Frieze London",
    price: "€6,000",
    inventory: "BOUM-240019",
    website: "https://tinaofficial.co.uk/",
    document: {
      href: "https://assets-frieze-fvr.artnav.co/3942d89a-3364-4d7e-8f29-17d3bd70f203___Karim_Boumjimar_CV%20.pdf",
      label: "Artist CV",
    },
    extraImages: [],
    onView: false,
    status: "Available",
    kicker: "Works on paper",
    imageSrc:
      "https://assets-frieze-fvr.artnav.co/82f55740-6de5-44ca-8bf8-61f48e7e08a0___BOUM-240019-desktop.jpg",
    imageAlt: "Karim Boumjimar, Stars wrapped in flesh, 2025",
    audioSrc: "/audio/stars-wrapped-in-flesh.mp3",
    standfirst:
      "Boumjimar’s Frieze London presentation treats the body as a code shaped by desire, myth, media, and the marks a society leaves on it.",
    paragraphs: [
      "Ceramics sit with a mural painted on the booth walls. In that setting, vessels such as Deep Leopard, 2025, read as records of a body and a society changing. Stars wrapped in flesh is watercolour and ink on mulberry paper, inventory BOUM-240019.",
      "The figures are hybrid: lovers, sirens, devils, and animal-human beings drawn from queer kinship, mythology, and devotional images. Distinctions between masculine and feminine, human and beast, sacred and grotesque come apart.",
      "Underwater settings carry the same idea of fluidity into identity. The work has a political edge: it marks both the defiance of communities and the pressure those communities still meet.",
      "Recent solo exhibitions include Bodies under Construction, Møstings, Frederiksberg (2026); Rites of Affection, Lahti Museum of Visual Arts Malva (2026); Pandemonium Paradiso, O-Overgaden, Copenhagen (2025); Drawings from the Hotel, Poriginal Galleria, Pori Art Museum (2025); and Alien Water, Art Hub Copenhagen (2021). Group exhibitions include Beauty Is the Best Defense, Jessica Silverman, San Francisco (2026); Stockholm Cosmologies, Liljevalchs, Stockholm (2025); Kultuur, TINA, London (2025); Queer Ecologies, Centro de Arte la Panera, Lleida (2023); and Psychopathia Sexualis, O-Overgaden, Copenhagen (2021).",
      "Presented by TINA in The Code Universe at Frieze London.",
    ],
  },
]

export function artworkBySlug(slug: string | undefined): Artwork | undefined {
  return artworks.find((artwork) => artwork.slug === slug)
}
