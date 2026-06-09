export type RodinArtworkMeta = {
  height?: string
  marksAndInscriptions?: string
  inventoryNumber?: string
  materials?: string
  location?: string
}

export type RodinArtwork = {
  slug: string
  title: string
  subtitle?: string
  artist: string
  featured?: boolean
  description?: string
  /** Line above title, e.g. “Conceived in 1885, cast circa 1925.” */
  caption?: string
  /** Use Arkın Rodin Collection exhibition page styling. */
  exhibitionStyle?: boolean
  meta?: RodinArtworkMeta
  /** Full “About” copy; when set, replaces generic placeholder text. */
  aboutParagraphs?: string[]
}

export const RODIN_ARTWORKS: RodinArtwork[] = [
  {
    slug: "the-secret",
    title: "The Secret",
    artist: "Auguste Rodin (1840-1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Conceived circa 1894 and cast in 1960.",
    meta: {
      height: "27.9 cm",
      marksAndInscriptions:
        "Signed A. Rodin. Inscribed with foundery mark Georges Rudier Fondeur Paris © by Musée Rodin 1960.",
      inventoryNumber: "RCG0071.2-25",
      materials: "Bronze with brown patination and green highlights.",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    aboutParagraphs: [
      "The Secret depicts two figures leaning together in a private, intimate exchange. Rodin modelled the composition around 1894, exploring closeness and withheld speech through the intertwined bodies rather than explicit narrative detail.",
      "The bronze surface carries warm brown patination with green highlights that deepen in the recesses, emphasising the sculptor’s characteristic interplay of smooth flesh and rougher, rock-like support.",
      "This cast was produced by the Georges Rudier foundry in Paris under licence from the Musée Rodin in 1960, following the museum’s posthumous editions that made Rodin’s work accessible to collectors and institutions worldwide.",
    ],
  },
  {
    slug: "main-crispee-droite",
    title: "Main Crispee Droite, grand modele",
    subtitle: "Right Clenched Hand, large model",
    artist: "Auguste Rodin (1840-1917)",
    featured: true,
    exhibitionStyle: true,
    caption:
      "Conceived before 1898 and cast between 1926 and 1965. This bronze edition cast in 1962.",
    meta: {
      height: "46.5 cm",
      marksAndInscriptions:
        "Signed A. Rodin. Inscribed Georges Rudier Fondeur Paris and © by Musée Rodin 1962. Stamped A. Rodin in the interior.",
      inventoryNumber: "RCG0062.2-23",
      materials: "Bronze",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    aboutParagraphs: [
      "Rodin isolated and enlarged this right hand as an autonomous study, drawn from the expressive vocabulary he developed for The Gates of Hell. The fingers are not closed into a simple fist but held in a tense, twisted grip that suggests strain, defiance, or inner turmoil.",
      "The grand modèle stands at nearly half a metre in height, allowing the sculptor’s modelling marks and the musculature of the wrist to read at monumental scale. The bronze retains a dark patina with green highlights in the recesses, characteristic of posthumous casts from the Musée Rodin editions.",
      "This example was cast at the Georges Rudier foundry in Paris in 1962 under licence from the Musée Rodin, with the artist’s signature on the exterior and an interior stamp confirming the museum-sanctioned edition.",
    ],
  },
  {
    slug: "age-of-bronze-small",
    title: "L'Âge d'Airain, petit modèle, 2ème reduction",
    subtitle: "Age of bronze, small model, 2nd reduction",
    artist: "Auguste Rodin (1840-1917)",
    featured: true,
    exhibitionStyle: true,
    caption:
      "Conceived between 1875 and 1877 and cast in November 1904, this version cast in October 1945.",
    meta: {
      height: "64.3 cm",
      marksAndInscriptions:
        "Signed A. Rodin. With the founder's mark Alexis Rudier / Fondeur Paris at the back on the right and with the interior stamp.",
      inventoryNumber: "RCG0063.2-23",
      materials: "Bronze",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    aboutParagraphs: [
      "L'Âge d'Airain was Rodin's first major success: a life-size nude that stunned the Paris Salon of 1877 with its anatomical conviction. The model was Auguste Neyt, and the work's realism was so extraordinary that Rodin was briefly accused of casting from life.",
      "This petit modèle is the second reduction of the figure, preserving the iconic pose—one hand on the head, the other lifted before the chest, weight shifted onto one leg—at a scale suited to intimate display while retaining the tension of the original.",
      "The present bronze was cast in October 1945 at the Alexis Rudier foundry in Paris, with the founder's mark at the back and Rodin's signature on the base, consistent with the posthumous editions overseen by the Musée Rodin.",
    ],
  },
  {
    slug: "danaide",
    title: "Danaïde",
    subtitle: "Danaide",
    artist: "Auguste Rodin (1840-1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Conceived in 1885, cast circa 1925.",
    meta: {
      height: "21 cm",
      marksAndInscriptions:
        "Signed A. Rodin with repeat raised interior signature. Inscribed © Alexis Rudier Fondeur Paris.",
      inventoryNumber: "RCG0013.2-13",
      materials: "Bronze with a rich dark and red/brown patination",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    aboutParagraphs: [
      "Danaide was originally conceived to be part of Rodin’s great project The Gates of Hell, inspired by Dante Alighieri’s 14th-century poem.",
      "The subject of this sculpture is taken from a Greek myth. King Danaos had fifty daughters but no sons, his brother Aegyptos had fifty sons; in hopes of creating a stronger unified kingdom it was agreed that the daughters and sons from each should marry. Danaos, eager to win control over his brother instructed his daughters to kill their husbands on their wedding night. All except one performed the dreadful murder. As a punishment, the Danaides were damned to forever fill a broken water jar with water. Rodin depicts one of the young women crouched on the ground in despair, as the water spills from the jar.",
      "Although unproven, the thesis by Rodin scholar Monique Laurent suggests that Camille Claudel was Rodin’s model for these sculptures. Merging fact and fiction, Bruno Nuytten’s movie Camille Claudel with Isabelle Adjani as Rodin’s counterpart shows an exhausted Camille kneeling on the floor leaning over against a piece of furniture.",
      "Danaide was for the first time exhibited as an autonomous work in the Gallery Georges Petit in 1889 and submitted to the Salon of 1890. A marble version of the work was purchased for the Musée du Luxembourg and is now exhibited in the Musée Rodin. It was carved by Rodin’s assistant Jean Escoula.",
    ],
  },
  {
    slug: "je-suis-belle",
    title: "Je suis belle",
    subtitle: "I am Beautiful",
    artist: "Auguste Rodin (1840-1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Conceived between 1882 and 1885, cast in 1968.",
    meta: {
      height: "75 cm",
      marksAndInscriptions:
        "Signed A. Rodin. Inscribed © by Musée Rodin 1968 and Georges Rudier Fondeur Paris.",
      inventoryNumber: "RCG0064.2-18",
      materials: "Bronze with dark brown, black and green patina",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    aboutParagraphs: [
      "Je suis belle unites two figures in a single, vertiginous lift: a standing man raises a woman curled into a compact ball above his head. The title quotes Charles Baudelaire’s poem “Her hair and her petticoat, entangled,” linking the sculpture to the Symbolist literature Rodin admired.",
      "Rodin developed the group from elements first explored for The Gates of Hell, combining physical strain with an almost dance-like balance. The bronze patina shifts between dark brown and black with green highlights that settle in the recesses of the modeled surface.",
      "This cast was produced in 1968 at the Georges Rudier foundry in Paris under licence from the Musée Rodin, with the museum copyright and founder’s inscription recorded on the base.",
    ],
  },
  {
    slug: "bust-of-jean-daire",
    title: "Bust of Jean d'Aire",
    artist: "Auguste Rodin (1840-1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Conceived in 1886, cast in December 1940.",
    meta: {
      height: "46.9 cm",
      marksAndInscriptions:
        "Signed and stamped with the foundry mark Alexis Rudier Fondeur Paris, with repeat interior raised A. Rodin signature.",
      inventoryNumber: "RCG0061.2-22",
      materials: "Bronze with brown and green patination",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    aboutParagraphs: [
      "Jean d'Aire was one of the six burghers of Calais who, according to medieval chronicle, offered themselves as hostages to King Edward III of England to save their besieged city. Rodin portrayed each man with individual psychology rather than heroic idealisation.",
      "This bust isolates d'Aire's resolute, worn features—the furrowed brow, deep-set eyes, and set jaw—that also appear in the monumental group Les Bourgeois de Calais, commissioned in 1884 and unveiled in Calais in 1895.",
      "The bronze was cast in December 1940 at the Alexis Rudier foundry in Paris, with the founder's mark on the exterior and a raised interior signature confirming the edition's authenticity.",
    ],
  },
  {
    slug: "seated-titan",
    title: "Seated Titan",
    artist: "Auguste Rodin, (after)",
  },
  {
    slug: "titan-iv",
    title: "Titan IV",
    artist: "Auguste Rodin, (after)",
  },
  {
    slug: "abduction-of-hippodamia",
    title: "L'Enlèvement d'Hippodamie",
    subtitle: "The Abduction of Hippodamia",
    artist: "Carrier-Belleuse (1824-1887), Auguste Rodin (1840-1917)",
  },
  {
    slug: "minotaur",
    title: "Minotaur",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "camille-claudel-bonnet",
    title: "Camille Claudel au bonnet",
    subtitle: "Bust of Camille Claudel Wearing a Bonnet",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "mme-rodin",
    title: "Mme Rodin",
    subtitle: "Bust of Rose Beuret",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "mask-of-hanako",
    title: "Masque d'Hanako, Étude Type E",
    subtitle: "Mask of Hanako, Study Type E",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "head-of-lust",
    title: "Tête de la Luxure",
    subtitle: "Head of Lust",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "mask-broken-nose",
    title: "Masque de l'Homme au Nez Cassé",
    subtitle: "Mask of A Man With A Broken Nose",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "torso-great-shadow",
    title: "Torse de la Grande Ombre",
    subtitle: "Torso of the Great Shadow",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "head-jean-de-fiennes",
    title: "Tête de Jean de Fiennes",
    subtitle: "Head of Jean de Fiennes",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "head-pierre-de-wiessant",
    title: "Tête de Pierre de Wiessant, Étude Type B",
    subtitle: "Head of Pierre de Wiessant, Study Type B",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "head-eustache-de-saint-pierre",
    title: "Tête d'Eustache de Saint Pierre, Étude Type A, Grand Modèle",
    subtitle: "Head of d'Eustache de Saint Pierre, Study Type A, Large Model",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "eve-small-model",
    title: "Eve, Petit Modèle (à la Base Carrée et aux Pieds Plats)",
    subtitle: "Eve, Small Model (with a Square Base and Flat Feet)",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "meditation",
    title: "La Méditation",
    subtitle: "Meditation",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "iris-study-with-head",
    title: "Iris, Étude avec Tête",
    subtitle: "Iris, Study with Head",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "falling-man",
    title: "L'Homme Qui Tombe",
    subtitle: "The Falling Man",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "monumental-torso",
    title: "Grande Torse de l'Homme",
    subtitle: "Monumental Torso",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "the-kiss-3rd-reduction",
    title: "Le Baiser, 3ème Réduction",
    subtitle: "The Kiss, 2nd Reduction",
    artist: "Auguste Rodin (1840-1917)",
  },
  {
    slug: "eternal-spring-first-state",
    title: "L'Éternel Printemps, Premier État",
    subtitle: "Eternal Spring, First State",
    artist: "Auguste Rodin (1840-1917)",
  },
]

export function getRodinArtwork(slug: string): RodinArtwork | undefined {
  return RODIN_ARTWORKS.find((artwork) => artwork.slug === slug)
}

export function getFeaturedRodinArtworks(): RodinArtwork[] {
  return RODIN_ARTWORKS.filter((artwork) => artwork.featured)
}
