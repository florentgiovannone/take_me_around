export type RodinArtworkMeta = {
  height?: string
  marksAndInscriptions?: string
  inventoryNumber?: string
  materials?: string
  location?: string
}

export type RodinArtworkSource = {
  label: string
  href: string
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
  /** Italic summary below the facts row on exhibition pages. */
  summary?: string
  /** Full “About” copy; when set, replaces generic placeholder text. */
  aboutParagraphs?: string[]
  /** Institutions and references cited on the page. */
  sources?: RodinArtworkSource[]
}

export const RODIN_ARTWORKS: RodinArtwork[] = [
  {
    slug: "the-secret",
    title: "The Secret",
    subtitle: "Le Secret",
    artist: "Auguste Rodin (French, 1840–1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Auguste Rodin, Study for The Secret, modeled c. 1910, bronze on marble base. Image courtesy of the National Gallery of Art, Washington.",
    meta: {
      height: "27.9 cm",
      marksAndInscriptions: "Signed A. Rodin. Inscribed with foundery mark Georges Rudier Fondeur Paris © by Musée Rodin 1960.",
      inventoryNumber: "RCG0071.2-25",
      materials: "Bronze with brown patination and green highlights.",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    summary: "Two right hands rise from a dark base, fingertips almost meeting around an unseen object. What the hands enclose is never shown — the secret lives in the space between them.",
    aboutParagraphs: [
      "Two right hands lift from a dark base and curve toward one another, fingertips almost — but never quite — touching. Between them, Rodin leaves a small, charged emptiness. Whatever the hands are guarding, we are not allowed to see it. That withholding is the whole point: the title tells us there is a secret, and the sculpture refuses to give it away.",
      "Rodin modeled Le Secret around 1910, in the last great chapter of his career, when he had become obsessed with hands as subjects in their own right. It belongs to the same family as The Cathedral (1908), in which two right hands form a vault of empty air, and shares Rodin's late conviction that a fragment — a torso, a pair of hands — could carry as much feeling as a complete figure. The piece was never carved as a single grand monument; instead it exists in plaster studies and in small bronzes cast under the Musée Rodin's authority by the Rudier foundries, which is why you meet it today in many museums at roughly hand-held scale.",
      "Walk slowly around it. From one angle the hands read as lovers leaning in; from another, as conspirators sharing a confidence; from a third, as a pair of worshippers cupping something precious. Rodin gives you only the form and lets the meaning shift with your footsteps. The bronze protects the secret. You are invited to wonder what it is.",
    ],
    sources: [
      { label: "Philadelphia Museum of Art", href: "https://www.philamuseum.org/objects/103428" },
      { label: "The Metropolitan Museum of Art", href: "https://www.metmuseum.org/art/collection/search/207489" },
      { label: "National Gallery of Art", href: "https://www.nga.gov/artworks/171813-study-secret" },
      { label: "Rodin's Hands (PMA)", href: "https://www.philamuseum.org/exhibitions/rodins-hands" },
    ],
  },
  {
    slug: "main-crispee-droite",
    title: "Large Clenched Right Hand",
    subtitle: "Main crispée droite, grand modèle",
    artist: "Auguste Rodin (French, 1840–1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Conceived before 1898 and cast between 1926 and 1965. This bronze edition cast in 1962.",
    meta: {
      height: "46.5 cm",
      marksAndInscriptions: "Signed A. Rodin. Inscribed Georges Rudier Fondeur Paris and © by Musée Rodin 1962. Stamped A. Rodin in the interior.",
      inventoryNumber: "RCG0062.2-23",
      materials: "Bronze",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    summary: "An isolated right hand enlarged to monumental scale — fingers twisted in a grip that reads as strain, defiance, or inner turmoil, drawn from the expressive vocabulary of The Gates of Hell.",
    aboutParagraphs: [
      "Rodin isolated and enlarged this right hand as an autonomous study, drawn from the expressive vocabulary he developed for The Gates of Hell. The fingers are not closed into a simple fist but held in a tense, twisted grip that suggests strain, defiance, or inner turmoil.",
      "The grand modèle stands at nearly half a metre in height, allowing the sculptor's modelling marks and the musculature of the wrist to read at monumental scale. The bronze retains a dark patina with green highlights in the recesses, characteristic of posthumous casts from the Musée Rodin editions.",
      "This example was cast at the Georges Rudier foundry in Paris in 1962 under licence from the Musée Rodin, with the artist's signature on the exterior and an interior stamp confirming the museum-sanctioned edition.",
    ],
    sources: [
      { label: "Musée Rodin", href: "https://www.musee-rodin.fr/en" },
      { label: "Arkın Rodin Collection", href: "https://www.thearkinrodincollection.com/" },
    ],
  },
  {
    slug: "age-of-bronze-small",
    title: "The Age of Bronze",
    subtitle: "L'Âge d'Airain, petit modèle, 2ème réduction",
    artist: "Auguste Rodin (French, 1840–1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Conceived between 1875 and 1877 and cast in November 1904, this version cast in October 1945.",
    meta: {
      height: "64.3 cm",
      marksAndInscriptions: "Signed A. Rodin. With the founder's mark Alexis Rudier / Fondeur Paris at the back on the right and with the interior stamp.",
      inventoryNumber: "RCG0063.2-23",
      materials: "Bronze",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    summary: "Rodin's first major success in reduction — the iconic pose of one hand on the head, the other lifted, preserved at a scale suited to intimate display.",
    aboutParagraphs: [
      "L'Âge d'Airain was Rodin's first major success: a life-size nude that stunned the Paris Salon of 1877 with its anatomical conviction. The model was Auguste Neyt, and the work's realism was so extraordinary that Rodin was briefly accused of casting from life.",
      "This petit modèle is the second reduction of the figure, preserving the iconic pose—one hand on the head, the other lifted before the chest, weight shifted onto one leg—at a scale suited to intimate display while retaining the tension of the original.",
      "The present bronze was cast in October 1945 at the Alexis Rudier foundry in Paris, with the founder's mark at the back and Rodin's signature on the base, consistent with the posthumous editions overseen by the Musée Rodin.",
    ],
    sources: [
      { label: "Musée Rodin — The Age of Bronze", href: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/age-bronze" },
      { label: "Cantor Foundation — Reductions and Enlargements", href: "https://cantorfoundation.org/resources/reductions-and-enlargements/" },
      { label: "Smarthistory / Khan Academy", href: "https://www.khanacademy.org/humanities/becoming-modern/avant-garde-france/avant-garde-sculpture/a/auguste-rodin-the-age-of-bronze" },
      { label: "Arkın Rodin Collection", href: "https://www.thearkinrodincollection.com/" },
    ],
  },
  {
    slug: "age-of-bronze",
    title: "L'Âge d'Airain",
    subtitle: "The Age of Bronze",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, first cast by Thiébaut Frères, 1880, commissioned by the French State. Image: Musée d'Orsay, Paris (LUX 86).",
    meta: {
      materials: "· Bronze",
      height: "· H. 180.5 cm — life-size",
      marksAndInscriptions: "· Thiébaut Frères, Paris (first cast)",
    },
    summary: "A life-size male nude, one hand on his head, the other raised — Rodin's first independent masterpiece, so disconcertingly real that the Paris Salon accused him of casting it directly from the body.",
    aboutParagraphs: [
      "Rodin began the figure in October 1875, in Brussels, where he had moved with Rose Beuret after the Franco-Prussian War. He had just come back from Italy — his first sight of Michelangelo — and he wanted to make something life-size, alone, on his own terms. His model was a young Belgian soldier named Auguste Neyt, found in a barracks near the studio. Neyt later remembered standing for three or four hours at a time, an hour at a stretch, while Rodin shifted the pose by inches to keep the muscles from going dead.",
      "Originally the figure held a long spear in his left hand, and Rodin titled him Le Vaincu — The Vanquished — in memory of the defeated French. Then he removed the spear. With the weapon gone, the gesture became unreadable: is the man waking up, dying, dreaming, lifting himself out of nothing? Rodin renamed him L'Âge d'Airain after Hesiod's Third Age of Man, and the ambiguity stuck. He stands halfway between sleep and consciousness, halfway between idealised classical nude and something startlingly modern.",
      "When the plaster reached the Salons of Brussels and Paris in 1877, critics accused Rodin of casting from life. A group of his peers — Falguière, Carrier-Belleuse, Dubois — finally signed a public defence. The State bought the plaster and commissioned this, the first bronze, from Thiébaut Frères in 1880. Rodin was awarded a third-class medal at the Salon. He never made a life-size figure again. He had already learned what he needed.",
    ],
    sources: [
      { label: "Musée d'Orsay — L'Âge d'Airain", href: "https://www.musee-orsay.fr/en/artworks/lage-dairain-15624" },
      { label: "Musée Rodin — The Age of Bronze", href: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/age-bronze" },
      { label: "Metropolitan Museum of Art — The Age of Bronze", href: "https://www.metmuseum.org/art/collection/search/189265" },
      { label: "Cleveland Museum of Art — The Age of Bronze", href: "https://www.clevelandart.org/art/1918.328" },
    ],
  },
  {
    slug: "danaide",
    title: "Danaïde",
    artist: "Auguste Rodin (French, 1840–1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Marble, carved by Jean Escoula c. 1889–1890 from Rodin's 1885 model. Image: Web Gallery of Art — Danaid (The Source).",
    meta: {
      height: "21 cm",
      marksAndInscriptions: "Signed A. Rodin with repeat raised interior signature. Inscribed © Alexis Rudier Fondeur Paris.",
      inventoryNumber: "RCG0013.2-13",
      materials: "Bronze with a rich dark and red/brown patination",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    summary: "One of the daughters of Danaos, condemned to fill a bottomless jar for eternity — Rodin gives up the jar, and shows her instead collapsed across the rock, her hair pouring into the stone like the water she cannot keep.",
    aboutParagraphs: [
      "In the Greek myth, the fifty daughters of King Danaos murder their husbands on their wedding night and are condemned in the underworld to draw water for ever in jars that cannot hold it. Rodin began modelling one of them in 1885 for The Gates of Hell, then lifted her out and let her stand alone, as he did with so many of his small damned figures. He kept the punishment but quietly removed its instrument. There is no jar in the marble. There is only the woman, her body given over to the rock.",
      "She lies face down, knees folded under her, one arm crushed beneath her chest. The back is luminous, polished to the limit marble will allow. The block beneath her remains rough, deliberately unfinished, so that you see the line where Escoula's chisel stopped — Rodin's praticien Jean Escoula carved this marble between 1889 and 1890 from Rodin's enlarged plaster. The unworked stone reads at once as the rock she has fallen onto and as the raw material she is sinking back into.",
      "The most extraordinary passage is the hair. It pours forward over her face, splays across the stone, and dissolves into the marble grain itself. You cannot tell where the strands end and the rock begins. Rodin called the piece The Source as well as Danaïde; the water she could not keep has become her own body. The State bought it at the Salon of 1890.",
    ],
    sources: [
      { label: "Musée d'Orsay — Danaïde", href: "https://www.musee-orsay.fr/en/artworks/danaide-7694" },
      { label: "Musée Rodin — Danaïd", href: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/danaid" },
      { label: "Rodin Museum, Philadelphia — Danaid (The Source)", href: "https://rodinmuseum.org/collection/object/96034" },
    ],
  },
  {
    slug: "je-suis-belle",
    title: "I Am Beautiful",
    subtitle: "Je suis belle",
    artist: "Auguste Rodin (French, 1840–1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Conceived between 1882 and 1885, cast in 1968.",
    meta: {
      height: "75 cm",
      marksAndInscriptions: "Signed A. Rodin. Inscribed © by Musée Rodin 1968 and Georges Rudier Fondeur Paris.",
      inventoryNumber: "RCG0064.2-18",
      materials: "Bronze with dark brown, black and green patina",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    summary: "A standing man lifts a woman curled into a compact ball above his head — physical strain and dance-like balance united under a title drawn from Baudelaire.",
    aboutParagraphs: [
      "Je suis belle unites two figures in a single, vertiginous lift: a standing man raises a woman curled into a compact ball above his head. The title quotes Charles Baudelaire's poem \"Her hair and her petticoat, entangled,\" linking the sculpture to the Symbolist literature Rodin admired.",
      "Rodin developed the group from elements first explored for The Gates of Hell, combining physical strain with an almost dance-like balance. The bronze patina shifts between dark brown and black with green highlights that settle in the recesses of the modeled surface.",
      "This cast was produced in 1968 at the Georges Rudier foundry in Paris under licence from the Musée Rodin, with the museum copyright and founder's inscription recorded on the base.",
    ],
    sources: [
      { label: "Musée Rodin", href: "https://www.musee-rodin.fr/en" },
      { label: "Arkın Rodin Collection", href: "https://www.thearkinrodincollection.com/" },
    ],
  },
  {
    slug: "bust-of-jean-daire",
    title: "Bust of Jean d'Aire",
    artist: "Auguste Rodin (French, 1840–1917)",
    featured: true,
    exhibitionStyle: true,
    caption: "Conceived in 1886, cast in December 1940.",
    meta: {
      height: "46.9 cm",
      marksAndInscriptions: "Signed and stamped with the foundry mark Alexis Rudier Fondeur Paris, with repeat interior raised A. Rodin signature.",
      inventoryNumber: "RCG0061.2-22",
      materials: "Bronze with brown and green patination",
      location: "The Arkın Clock Tower - Arkın Group Headquarters",
    },
    summary: "Jean d'Aire, one of the six burghers of Calais, isolated in bronze — resolute, worn features that refuse heroic idealisation.",
    aboutParagraphs: [
      "Jean d'Aire was one of the six burghers of Calais who, according to medieval chronicle, offered themselves as hostages to King Edward III of England to save their besieged city. Rodin portrayed each man with individual psychology rather than heroic idealisation.",
      "This bust isolates d'Aire's resolute, worn features—the furrowed brow, deep-set eyes, and set jaw—that also appear in the monumental group Les Bourgeois de Calais, commissioned in 1884 and unveiled in Calais in 1895.",
      "The bronze was cast in December 1940 at the Alexis Rudier foundry in Paris, with the founder's mark on the exterior and a raised interior signature confirming the edition's authenticity.",
    ],
    sources: [
      { label: "Musée Rodin — The Burghers of Calais", href: "https://www.musee-rodin.fr/en/collections/sculptures/bourgeois-de-calais-monument" },
      { label: "Arkın Rodin Collection", href: "https://www.thearkinrodincollection.com/" },
    ],
  },
  {
    slug: "seated-titan",
    title: "Seated Titan",
    subtitle: "from the Vase of the Titans",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Albert-Ernest Carrier-Belleuse, with Auguste Rodin, Vase of the Titans, c. 1876–78. Cleveland Museum of Art. Photograph via Cleveland Museum of Art.",
    meta: {
      materials: "· Glazed terracotta",
      marksAndInscriptions: "Modelled c. 1876–78 · · With Albert-Ernest Carrier-Belleuse · · Vase H. ≈ 72 cm",
    },
    summary: "One of four straining giants modelled by the young Rodin to bear the weight of a polychrome vase — a Michelangelesque exercise in disguise, made anonymously inside another sculptor's workshop.",
    aboutParagraphs: [
      "Stand close to the vase and the four giants seem to lean and strain under its weight. This is one of the four Seated Titans Rodin modelled around 1876, just home from his transformative trip to Italy where the unfinished Slaves of Michelangelo had stopped him cold. He brought that shock back to the Brussels studio of Albert-Ernest Carrier-Belleuse, his employer at the time, and poured it into a piece of grand decorative furniture: Carrier's polychrome Vase of the Titans. The vase is a vessel for the gods of the pre-Olympian age, condemned by Zeus to bear the weight of the heavens forever.",
      "Look at the figure on the left — the long ribbon of muscle from shoulder to thigh, the bowed head, the bare foot braced on the plinth. There is more anatomical conviction here than the vase strictly needs. You can already see the sculptor of The Thinker, working in disguise.",
      "Rodin received no public credit for years; Carrier-Belleuse signed the vase alone, and Rodin's hand was only formally acknowledged in 1957. Today complete glazed examples survive in Cleveland, Philadelphia, Detroit and at the Petit Palais in Paris. Walk slowly around it once. The Titans are caryatids, yes — but they are also a young Rodin announcing himself in the language of a master he had not yet been allowed to surpass.",
    ],
    sources: [
      { label: "Cleveland Museum of Art", href: "https://www.clevelandart.org/" },
      { label: "Philadelphia Museum of Art", href: "https://www.philamuseum.org/objects/346671" },
      { label: "Detroit Institute of Arts", href: "https://dia.org/collection/vase-titans-94258" },
      { label: "Museum of Fine Arts, Houston", href: "https://www.mfah.org/blogs/inside-mfah/spotlight-fusion-of-forms" },
    ],
  },
  {
    slug: "titan-iv",
    title: "Titan IV",
    subtitle: "from the Vase of the Titans",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Albert-Ernest Carrier-Belleuse, with Auguste Rodin, Vase of the Titans, side view (Titan IV at right), late 1870s. Cleveland Museum of Art. Photograph via Cleveland Museum of Art.",
    meta: {
      materials: "· Terracotta",
      marksAndInscriptions: "Modelled late 1870s · · With Albert-Ernest Carrier-Belleuse · · One of four figures",
    },
    summary: "The fourth of the Titans condemned to carry the vase — a quieter, inward-turning crouch in which the future maker of the Gates of Hell is already legible.",
    aboutParagraphs: [
      "Among the four straining giants who carry Carrier-Belleuse's Vase of the Titans, this one — catalogued by the Musée Rodin as Titan IV — has perhaps the most arresting back. Modelled by the young Auguste Rodin in the late 1870s, soon after his return from Italy, the figure crouches against the vase with one knee raised and the spine torqued in a long Michelangelesque curve. The Houston cast, in unglazed terracotta, lets you read the modeller's thumbprints in the clay.",
      "Rodin was working as a praticien in Albert-Ernest Carrier-Belleuse's Brussels and Paris studios, anonymous labour on his employer's grand decorative commissions. The Titans were pre-Olympian gods condemned by Zeus to support the heavens, and Carrier seized on the mythology to turn a luxury vase into a small drama of cosmic endurance. Rodin gave the figures their nerve.",
      "Stand to the side and you can see what makes this Titan different from his three brothers around the rim: a quieter, almost listening pose, head turned inward, the muscles braced rather than flexed. The bold, sculptural attack is unmistakably the future maker of The Gates of Hell. Carrier signed the vase alone in his lifetime; Rodin's authorship of the Titans was only formally recognised by scholars in 1957. The figure you are looking at is, in effect, a signature he was not yet allowed to write.",
    ],
    sources: [
      { label: "Museum of Fine Arts, Houston", href: "https://www.mfah.org/blogs/inside-mfah/spotlight-fusion-of-forms" },
      { label: "Cleveland Museum of Art", href: "https://www.clevelandart.org/" },
      { label: "Philadelphia Museum of Art", href: "https://www.philamuseum.org/objects/346671" },
      { label: "Detroit Institute of Arts", href: "https://dia.org/collection/vase-titans-94258" },
    ],
  },
  {
    slug: "abduction-of-hippodamia",
    title: "L'Enlèvement d'Hippodamie",
    subtitle: "The Abduction of Hippodamia",
    artist: "Albert-Ernest Carrier-Belleuse, with Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Albert-Ernest Carrier-Belleuse, with Auguste Rodin, L'Enlèvement d'Hippodamie, cast after 1877. Bronze. National Gallery of Art, Washington, 1977.58.1.",
    meta: {
      materials: "· Bronze",
      height: "· 64.8 × 55.6 × 29.2 cm",
      marksAndInscriptions: "Modelled c. 1871–79 · · Signed Carrier-Belleuse",
    },
    summary: "The centaur Eurytion seizes the Lapith bride at her wedding — a violent two-handed collaboration between an established master and the young Rodin, signed in his employer's name alone.",
    aboutParagraphs: [
      "A centaur has crashed the wedding. At the marriage feast of Pirithous, king of the Lapiths, the half-horse guests grew drunk on wine and seized the bride. The leader of the centaurs, Eurytion, lifts Hippodamia clear of the ground; her body twists away, her arm pinned against his shoulder, garlands of the wedding still scattered at his hooves. An overturned wine jar tells you everything you need to know about how the evening went.",
      "This bronze was modelled in Carrier-Belleuse's Brussels studio between 1871 and 1879. The young Auguste Rodin had followed his master into Belgian exile after the Commune, and worked there as a praticien — a hired pair of hands. The piece is signed by Carrier alone, but scholarship since June Hargrove's research has divided the authorship: the howling, violently muscled centaur is Rodin's; the idealised, almost neoclassical bride is Carrier's. You can see the join. The two halves of the group seem to belong to two different sculptors, two different decades.",
      "The subject — the Centauromachy, civilisation against brute appetite — was an old Greek favourite, pediment material for the Parthenon. Walk around this cast in Washington. The patina is a deep storm-green, the modelling restless. Rodin is two years away from The Age of Bronze, and already, in another man's signature, he is unmistakable.",
    ],
    sources: [
      { label: "National Gallery of Art, Washington", href: "https://www.nga.gov/artworks/56386-abduction-hippodamia-lenlevement-dhippodamie" },
      { label: "The Arkın Rodin Collection", href: "https://www.thearkinrodincollection.com/our-exhibitions/l%E2%80%99enl%C3%A8vement-d%E2%80%99hippodamie-%5Bthe-abduction-of-hippodamia%5D" },
    ],
  },
  {
    slug: "minotaur",
    title: "The Minotaur",
    subtitle: "Faun and Nymph",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Auguste Rodin, The Minotaur, c. 1886. Plaster. Maryhill Museum of Art, Goldendale, Washington. Image via Wikimedia Commons.",
    meta: {
      materials: "· Plaster (also cast in bronze)",
      height: "· 34.3 × 24.1 × 20.3 cm",
      marksAndInscriptions: "Modelled c. 1885 · · From The Gates of Hell",
    },
    summary: "A horned figure and a nymph in a posture that hovers, deliberately, between abduction and embrace — one of the small, troubling groups Rodin lifted out of the Gates of Hell and let stand alone.",
    aboutParagraphs: [
      "A horned, bearded creature sits on a rock and gathers a nymph into his lap. She leans across him, her right hand resting on her own thigh, her face wearing a frown that might be irritation as easily as fear. Rodin called the group simply The Minotaur, though he showed it under many titles in his lifetime — Faun and Nymph, Satyr and Woman, Jupiter Taurus.",
      "The piece was modelled around 1885, in the middle of Rodin's long, sprawling labour on The Gates of Hell. Like so many figures siphoned off from that monumental project — The Thinker, The Kiss, the Three Shades — the Minotaur began as a fragment of Dante's underworld and grew into a work in its own right. Its companion piece, Faun and Nymph, is so closely related that the two are sometimes treated as variations on a single composition.",
      "What Rodin does here, quietly, is refuse the usual story. The classical Minotaur is a monster; this one is awkward, almost shy, his open mouth caught between hunger and bewilderment as he stares at the nymph's hair. She, in turn, neither flees nor submits. Walk around the cast and the pairing keeps shifting between abduction and seduction, violence and tenderness. Rodin had begun to mistrust clear stories. The Minotaur is the result — an ambiguity in plaster, alive on all sides.",
    ],
    sources: [
      { label: "Philadelphia Museum of Art", href: "https://www.philamuseum.org/objects/103480" },
      { label: "Maryhill Museum of Art", href: "https://www.maryhillmuseum.org/inside/exhibitions/permanent-exhibitions/auguste-rodin" },
      { label: "Rodin-Web / Tancock & Elsen catalogues", href: "http://rodin-web.org/works/1886_minotaur.htm" },
      { label: "Musée Rodin, The Gates of Hell", href: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/gates-hell" },
    ],
  },
  {
    slug: "camille-claudel-bonnet",
    title: "Camille Claudel au bonnet",
    subtitle: "Camille Claudel with a Bonnet",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Auguste Rodin, Tête de Camille Claudel au bonnet (marble version), c. 1884. Photograph via Wikimedia Commons, after the Musée Rodin.",
    meta: {
      materials: "· Marble (also cast in bronze and terracotta)",
      marksAndInscriptions: "Modelled c. 1884 · · Musée Rodin, Paris · · H. ≈ 24–27 cm",
    },
    summary: "A young, brilliant, eyes-closed face under a softly modelled Phrygian cap — Rodin's most direct portrait of Camille Claudel, made in the first year of their decade together.",
    aboutParagraphs: [
      "The bonnet on top of the head looks almost casual — a soft Phrygian cap, modelled with an offhand looseness Rodin reserved for the people he loved. Underneath, the face is severe. The eyes are closed; the long, straight nose and the firm, narrow mouth give nothing away. This is Camille Claudel, around 1884, modelled by her lover and teacher at the very beginning of the most consuming relationship in either of their lives.",
      "Camille came to Rodin's studio in 1883 as a pupil, not yet twenty. He was forty-three, in his first full bloom of fame. Within a year she was his collaborator, his model, his muse and — soon — his mistress. He sculpted her many times over the decade that followed: as La Pensée, as the head of Aurora, as the goddess of dawn breaking through marble. This early head, known as Camille au bonnet, is the most direct of those portraits, the closest to private observation.",
      "Walk slowly around it. There is no performance here, no allegory. Rodin has caught the inwardness of a young, brilliant, formidably difficult woman thinking. The closed eyes and the contrast between rough cap and finely polished face are pure Rodin — a way of saying the work is unfinished because the sitter is unfinished, still becoming. Within ten years Camille would break with him. The bonnet remains.",
    ],
    sources: [
      { label: "Musée Rodin — Rodin and Camille Claudel", href: "https://www.musee-rodin.fr/en/resources/rodin-and-artists/camille-claudel" },
      { label: "Musée Camille Claudel, Nogent-sur-Seine", href: "https://www.museecamilleclaudel.fr/en/collections/camille-claudel-biography/1886-1893-rodin-and-camille-claudel-tumultuous-love-affair-and" },
      { label: "The Met — Rodin's Portraits of His Contemporaries", href: "https://www.metmuseum.org/perspectives/auguste-rodin-portraits" },
    ],
  },
  {
    slug: "mme-rodin",
    title: "Mme Rodin",
    subtitle: "Mask of Rose Beuret",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Auguste Rodin, Mask of Rose Beuret, conceived c. 1882. Plaster. The Metropolitan Museum of Art, New York. Image © The Met, Open Access.",
    meta: {
      materials: "· Plaster (cast in bronze by Alexis Rudier)",
      marksAndInscriptions: "Conceived c. 1882 · · Edition of 11 · · H. ≈ 26.9 cm",
    },
    summary: "The face of Rose Beuret — Rodin's companion for fifty-three years — modelled as a mask with closed eyes, softened deliberately to avoid the casting-from-life scandal that had haunted him since 1877.",
    aboutParagraphs: [
      "The eyes are closed and the face has been left to read like a mask, lifted from a body that is no longer there. This is the woman who shared Rodin's life for fifty-three years: Marie-Rose Beuret, a seamstress from the Lorraine countryside who met him in 1864 when she was twenty, bore his only son, kept his studio while he was unknown, and married him only weeks before they both died in 1917.",
      "Rodin first modelled her around 1880 as the fierce, helmeted Bellona. By the time of this portrait, conceived around 1882, the look is different — quieter, withdrawn, the features blurred deliberately to skirt the scandal that had nearly ended his career when critics accused him of casting The Age of Bronze directly from life. He kept her bust slightly smaller than life-size, the surfaces left soft, the hair barely indicated. Nothing here invites accusation. Everything here invites looking.",
      "Stand close. You can see the long history of the relationship in the modelling — the affection, the inattention, the late, slightly guilty tenderness of a man who took her devotion as a fact of his daily existence. Cast by Alexis Rudier in bronze, the head is also known as the Mask of Madame Rodin. It is Rose without performance, as the studio knew her: silent, lowered, indispensable.",
    ],
    sources: [
      { label: "The Metropolitan Museum of Art — Mask of Rose Beuret", href: "https://www.metmuseum.org/art/collection/search/207493" },
      { label: "Art at Arkın İskele — Mme Rodin", href: "https://www.artatarkiniskele.com/import-1/mme-rodin-%5Bbust-of-rose-beuret%5D" },
      { label: "Rose Beuret — biography", href: "https://en.wikipedia.org/wiki/Rose_Beuret" },
      { label: "The Met — Rodin's Portraits of His Contemporaries", href: "https://www.metmuseum.org/perspectives/auguste-rodin-portraits" },
    ],
  },
  {
    slug: "mask-of-hanako",
    title: "Masque d'Hanako",
    subtitle: "Étude Type E",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Auguste Rodin, Masque d'Hanako, modelled 1907. Bronze on stone base. National Museum of Western Art, Tokyo. Image © NMWA.",
    meta: {
      materials: "· Bronze (also pâte de verre by Jean Cros, 1912)",
      marksAndInscriptions: "Modelled 1907 · · Cast by Alexis Rudier · · One of fifty-eight Hanako heads",
    },
    summary: "The face of Ohta Hisa — the Japanese actress Hanako — held in the moment of her stage harakiri, eyes closed, lips set. Rodin modelled her more often than any other sitter.",
    aboutParagraphs: [
      "A small dark face, eyes closed, lips set, mounted on a block of veined stone. This is Hanako — born Ohta Hisa in 1868, the Japanese actress who became one of Rodin's most obsessively studied sitters during the last decade of his life. He made fifty-eight heads of her between 1907 and 1911, more than of any other model.",
      "Rodin first saw Hanako perform in Marseille in 1906, in a touring company managed by the American dancer Loïe Fuller. Her plays were Westernised pastiches of Japanese theatre, written for European audiences and culminating, almost always, in a bloody scene of ritual suicide. It was Hanako's face in that moment of extreme anguish — taut, drained, transcendent — that struck Rodin. He brought her to Meudon and asked her to hold her death-scene expressions while he modelled.",
      "This is Étude Type E, one of the variations Rodin made in 1907. The Victoria & Albert Museum holds a remarkable version cast in pâte de verre by Jean Cros in 1912 — Hanako in coloured glass, almost translucent at the temples. The mask shown here is the bronze. Stand close. Even at rest she seems to be listening for something just out of frame. Rodin would later say that her face contained all the expressive power of a Roman bust by Donatello. Hanako, he thought, was a sculpture before he touched her.",
    ],
    sources: [
      { label: "The Metropolitan Museum of Art — Mask of Hanako", href: "https://www.metmuseum.org/art/collection/search/207487" },
      { label: "Victoria & Albert Museum — Mask of Hanako, Type E", href: "https://collections.vam.ac.uk/item/O1758562/mask-of-hanako-type-e-mask-of-hanako-rodin-auguste/" },
      { label: "National Museum of Western Art, Tokyo", href: "https://collection.nmwa.go.jp/en/S.1959-0025.html" },
      { label: "Rodin-Web — Masks of Hanako", href: "http://www.rodin-web.org/works/1907_hanako.htm" },
    ],
  },
  {
    slug: "head-of-lust",
    title: "Tête de la Luxure",
    subtitle: "Head of Lust",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Auguste Rodin, Tête de la Luxure, conceived 1882; this cast 1917–18 by Alexis Rudier. Bronze with dark green, black and brown patination. The Arkın Rodin Collection, North Cyprus.",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived 1882; cast 1917–18 · · Cast by Alexis Rudier · · H. 37.3 cm",
    },
    summary: "A head torn from the Gates of Hell — mouth open, eyes half-shut, the figure of Lust herself, modelled by Rodin as desire caught mid-breath rather than as punishment.",
    aboutParagraphs: [
      "A head thrown back, eyes half closed, mouth open in something between a cry and a kiss. Rodin called her La Luxure — Lust — and gave her a small, fierce place on The Gates of Hell, the monumental bronze door he laboured at for thirty-seven years and never finished.",
      "The head was conceived in 1882, in the second year of work on the Gates. It belongs to a sin Rodin returned to constantly: the female figure of Lust in the group Avarice and Lust, where she lies, legs spread, beneath the falling man who grasps for his coins. Dante had placed the lustful in the second circle of Hell, blown forever on a black wind; Rodin extracted his Lust from that wind and modelled her face on its own. Detached, she becomes a portrait of pure desire — not punishment, not allegory, but the experience itself, caught mid-breath.",
      "Stand close to this bronze, cast by Alexis Rudier between 1917 and 1918, the year after Rodin's death. The patina is dark green and brown, almost black where the light pools in the open mouth. Few examples survive — perhaps fewer than ten, in collections from Arkın to private hands. Rodin had a habit of pulling his finest moments out of the Gates and exhibiting them alone. Tête de la Luxure is one of those liberated fragments: a small, dangerous head.",
    ],
    sources: [
      { label: "The Arkın Rodin Collection — Tête de la Luxure", href: "https://www.thearkinrodincollection.com/our-exhibitions/t%C3%AAte-de-la-luxure-%5Bhead-of-lust%5D" },
      { label: "Musée Rodin — Avarice et la Luxure", href: "https://enfer.musee-rodin.fr/fr/figure/avarice-et-la-luxure" },
      { label: "Musée Rodin — The Gates of Hell", href: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/gates-hell" },
    ],
  },
  {
    slug: "mask-broken-nose",
    title: "Masque de l'Homme au Nez Cassé",
    subtitle: "Mask of the Man with the Broken Nose",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Auguste Rodin, Mask of the Man with the Broken Nose (Masque de l'homme au nez cassé), modelled 1864. Bronze. National Gallery of Victoria, Melbourne.",
    meta: {
      materials: "· Bronze (also plaster, marble)",
      height: "· 31.8 × 18.4 × 15.6 cm",
      marksAndInscriptions: "Modelled 1863–64 · · Accepted at the Salon, 1875",
    },
    summary: "The bearded, battered face of a Paris handyman known only as Bibi — modelled by the 23-year-old Rodin in a freezing studio, refused twice by the Salon, and remembered by Rodin as his first real work.",
    aboutParagraphs: [
      "A bearded face, scarred, broken-nosed, neither young nor classically beautiful. Rodin would later call this his first real work — “the first piece of modelling I ever did.” He was twenty-three.",
      "The sitter was a local odd-job man known only as Bibi, who lived near Rodin's freezing Saint-Marcel studio in 1863. Rodin worked on the head for over a year. One winter night the studio's heating failed, the clay froze, and the back of the head simply broke off. He kept the fragment and called it a mask. He submitted it to the Salon des Beaux-Arts in 1864; it was refused. He submitted it again in 1865; refused again. The jurors thought it unfinished. They were not yet ready for a portrait of an ageing labourer with a broken nose, modelled as carefully as a Roman emperor.",
      "Stand close. The features are utterly naturalistic, but the hair is treated like the curls of a late Hellenistic bust, the blank eyes like classical sculpture. Rodin was already doing what he would do for the next fifty years — pulling the language of antiquity down into the bodies of ordinary, unflattering, particular people. The mask was finally accepted in 1875 and cast in bronze. Bibi, who never knew his sitter's name was about to become art history, had been Rodin's first true subject.",
    ],
    sources: [
      { label: "The Metropolitan Museum of Art — Mask of the Man with the Broken Nose", href: "https://www.metmuseum.org/art/collection/search/204767" },
      { label: "National Gallery of Victoria, Melbourne", href: "https://www.ngv.vic.gov.au/explore/collection/work/3579/" },
      { label: "Wikipedia — Man with the Broken Nose", href: "https://en.wikipedia.org/wiki/Man_with_the_Broken_Nose" },
      { label: "The Arkın Rodin Collection", href: "https://www.artatarkiniskele.com/import-1/masque-de-l%E2%80%99homme-au-nez-cass%C3%A9-%5Bmask-of-a-man-with-a-broken-nose%5D" },
    ],
  },
  {
    slug: "torso-great-shadow",
    title: "Torse de la Grande Ombre",
    subtitle: "Torso of the Great Shadow",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze cast, c. 2000, after the 1901 plaster enlargement. Image: Arkın Rodin Collection.",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived c. 1900; this cast 2000 · · E. Godard / Musée Rodin edition · · H. 100 cm",
    },
    summary: "An enlarged, headless and armless torso drawn out of The Gates of Hell, where it once stood as one of the Three Shades pointing down to Dante's inscription.",
    aboutParagraphs: [
      "Stand close and the eye starts upward, then catches: there is no head to meet. The body arches as if straining against a weight pressed down through invisible shoulders, the chest pulled open, the abdomen drawn tight. Without arms to balance it, the torso seems to answer only to gravity and to itself — a fragment turned, paradoxically, into a whole.",
      "Rodin first modelled the figure as one of the Three Shades crowning The Gates of Hell. Each of those mournful sentries leans inward, hand falling toward Dante's inscription — Lasciate ogni speranza, voi ch'entrate. Around 1900, working with his enlarger Henri Lebossé, Rodin had the headless, armless core of the Shade scaled up beyond life size. Lebossé, awed by what came out of the studio, called it perhaps the most important piece of sculpture of Rodin's career.",
      "The kinship with the antique Belvedere Torso — Michelangelo's lodestar — is deliberate. Rodin had long argued that a fragment could carry more truth than a finished figure, that incompleteness was a form of intensity. Walk around the bronze slowly: every angle gives you a different drama of muscle and shadow, but no resolution. That is the point. The Great Shadow keeps its head and its arms to itself.",
    ],
    sources: [
      { label: "Arkın Rodin Collection — Torse de la Grande Ombre", href: "https://www.thearkinrodincollection.com/our-exhibitions/torse-de-la-grande-ombre-%5Btorso-of-the-great-shadow%5D" },
      { label: "Christie's — Rodin, Torse de la Grande Ombre", href: "https://www.christies.com/en/lot/lot-5766532" },
      { label: "Musée Rodin, Paris", href: "https://www.musee-rodin.fr/" },
    ],
  },
  {
    slug: "head-jean-de-fiennes",
    title: "Tête de Jean de Fiennes",
    subtitle: "Head of Jean de Fiennes",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Plaster study, 1885–1886. Image: Maryhill Museum of Art, via Wikimedia Commons.",
    meta: {
      materials: "· Plaster (study)",
      marksAndInscriptions: "Modelled 1885–1886 · · Maryhill Museum of Art · · Detail of figure",
    },
    summary: "A study head for the youngest of the six Burghers of Calais — boyish, his lips parted, his face turned slightly upward in disbelief at the sentence laid on him and his companions.",
    aboutParagraphs: [
      "Among the six citizens who walked barefoot out of besieged Calais in 1347 to give their lives for the town, Jean de Fiennes was the youngest. Rodin gave him a face still soft with youth — full cheek, parted lips, eyes that do not yet quite believe what is happening. In this head, taken from a half-nude study with a shirt draped over the outstretched arms, the boy has only just stepped forward, palms turned upward in a gesture that is at once offering and question.",
      "Rodin received the Calais commission in 1884 and chose, against every monumental convention, to model each burgher as an individual under the weight of his own decision. He showed an early plaster of the group to the Calais Council in 1885; this Fiennes study belongs to that searching first stage, when he was still feeling for the temperature of each man's interior moment.",
      "Stand at the right height and you read the whole monument from this single head: not glory, not surrender, but the long second in which a young man learns the price of his own courage. The tattered drapery, the bare throat, the slight backward tilt — Rodin trusts these to do the work that no sword or laurel could.",
    ],
    sources: [
      { label: "Metropolitan Museum of Art — Jean de Fiennes, Vêtu", href: "https://www.metmuseum.org/art/collection/search/207553" },
      { label: "Wikipedia — Jean de Fiennes (Rodin)", href: "https://en.wikipedia.org/wiki/Jean_de_Fiennes" },
      { label: "Maryhill Museum of Art — Rodin Collection", href: "https://www.maryhillmuseum.org/" },
    ],
  },
  {
    slug: "head-pierre-de-wiessant",
    title: "Tête de Pierre de Wiessant",
    subtitle: "Head of Pierre de Wissant",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Heroic-scale plaster, 1886. Image: Cleveland Museum of Art (1917.722), gift of Loïe Fuller.",
    meta: {
      materials: "· Plaster, tinted",
      height: "· 85.1 × 61 × 50.8 cm",
      marksAndInscriptions: "Modelled 1886 · · Cleveland Museum of Art (gift of Loïe Fuller, 1917)",
    },
    summary: "An over-life-size head of one of the Burghers of Calais, frozen in the long instant of fear — eyes hollow, mouth half-open, surface still bearing Rodin's working marks.",
    aboutParagraphs: [
      "Pierre de Wissant was one of the six wealthy citizens of Calais who, in 1347, offered themselves to Edward III of England as hostages so the besieged town might be spared. Rodin, modelling his monument five centuries later, refused the patriotic cliché and instead pulled each man down into private terror. This is Pierre's face enlarged beyond life, as if the sculptor wanted you to read the smallest shift of mouth and eyelid as you would on a stage.",
      "Look at the surface. Rodin worked the plaster directly — graphite lines flicker through the temple, washes of tint sink into the hollows beneath the eyes, the skin still bears the press of his fingers. Nothing is smoothed or polished. The head is unfinished in the academic sense and finished in every other.",
      "He exhibited the life-size figure of Pierre alone, separately from the monument group, while still working on the ensemble — convinced that each burgher carried a complete drama. Stand in front of this head and you understand why. The mouth is just open; some word has been thought but not said. Walk slowly to the side and the whole face seems to sink another fraction. That fraction is the entire subject.",
    ],
    sources: [
      { label: "Cleveland Museum of Art — Head of Pierre de Wissant (1917.722)", href: "https://www.clevelandart.org/art/1917.722" },
      { label: "Cleveland Museum of Art — Head of Pierre de Wissant (bronze, 1920.120)", href: "https://www.clevelandart.org/art/1920.120" },
      { label: "Arkın Collection — Tête de Pierre de Wiessant, Type B", href: "https://www.thearkinrodincollection.com/our-exhibitions/t%C3%AAte-de-pierre-de-wiessant,-type-b-%5Bhead-of-pierre-de-wiessant,-type-b%5D" },
    ],
  },
  {
    slug: "head-eustache-de-saint-pierre",
    title: "Tête d'Eustache de Saint Pierre",
    subtitle: "Head of Eustache de Saint-Pierre",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, \"Final Head with Rope around the Neck\", cast II of IV by the Musée Rodin. Image: Wikimedia Commons.",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Modelled 1886 · · Musée Rodin, cast II of IV · · Final head with rope",
    },
    summary: "The bearded, hollow-eyed head of the eldest burgher — the man who, by all the chronicles, was first to volunteer his life for Calais.",
    aboutParagraphs: [
      "Eustache de Saint-Pierre was the eldest of the six citizens of Calais who, in 1347, walked out of the besieged city in shirts, with ropes about their necks, to surrender themselves to Edward III. The chronicles single him out as the first to step forward. Rodin gave him a face to match: the rope is already laid round his throat, the beard hides nothing of the gauntness beneath it, and the eyes have travelled somewhere past fear into resolve.",
      "Rodin modelled Eustache in 1886 from the painter Jean-Charles Cazin, a native of the Pas-de-Calais whose features he thought carried the right inheritance. He did not give the burgher heroic posture. The cheekbones sharpen against the temples; the mouth is set but tired; the brow leans slightly forward, as though the head has already begun the walk it cannot refuse.",
      "Stand to one side and the rope catches the light first — a thick, deliberate coil that Rodin refused to soften into ornament. It is the literal instrument of the death that may, in the next hour, be carried out. The patriotic monument the Calais council expected became, in Rodin's hands, an essay on what it costs a man to give himself away.",
    ],
    sources: [
      { label: "Musée Rodin — Monument to the Burghers of Calais", href: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/monument-burghers-calais" },
      { label: "Kreeger Museum — Eustache de Saint-Pierre from the Burghers of Calais", href: "https://www.kreegermuseum.org/about-us/collection/sculpture/Auguste-Rodin_Eustache-de-Saint-Pierre-from-The-Burghers-of-Calais-1884-95-reduction" },
      { label: "Wikimedia Commons — Final Head of Eustache de Saint-Pierre, Musée Rodin cast II of IV", href: "https://commons.wikimedia.org/wiki/File:Final_Head_of_Eustache_de_Saint_Pierre_by_Auguste_Rodin,_Mus%C3%A9e_Rodin_cast_II_of_IV.JPG" },
    ],
  },
  {
    slug: "eve-small-model",
    title: "Ève, petit modèle",
    subtitle: "Eve, small model",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, small model with square base and flat feet, cast 1883. Image: Musée Rodin, Paris.",
    meta: {
      materials: "· Bronze",
      inventoryNumber: "· Musée Rodin, Paris (S.957 / L.57)",
      marksAndInscriptions: "Conceived 1881; this cast 1883 · · H. ~71 cm",
    },
    summary: "A small-scale Eve who has folded herself into her own shame — arms wrapped across her face and body, head sunk into the shadow she has made of her arms.",
    aboutParagraphs: [
      "Rodin began Eve in 1881 as a pendant to Adam, both intended to flank the Gates of Hell. He worked from an Italian model, one of the Abruzzesi sisters, and noticed early on that her body was changing — without telling him, she was pregnant. The figure he ended up modelling carries that secret weight: a thickness through the abdomen, a thigh that no longer quite agrees with itself, a body just beginning to lean inward against what it cannot any longer hide.",
      "The small model — the petit modèle, with its square base and flat feet — was finished and shown by 1883. Around forty bronze casts were eventually pulled, by François Rudier, Griffoul & Lorge, Perzinka, Alexis Rudier and finally Georges Rudier as late as 1967. The first owners loved it because it brought the monumental Eve down into a domestic room without losing any of the moral force.",
      "Rilke described her best: \"Eve stands with head sunk deeply into the shadow of the arms.\" Approach her quietly. The arms close over the breasts and the face; the shoulders curve forward; the body has already begun its long walk out of paradise. You are looking at the moment just after the apple.",
    ],
    sources: [
      { label: "Musée Rodin — Eve", href: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/eve" },
      { label: "Arkın Collection — Ève, petit modèle (à la base carrée et aux pieds plats)", href: "https://www.thearkinrodincollection.com/our-exhibitions/eve,-petit-mod%C3%A8le-(mod%C3%A8le-%C3%A0-la-base-carr%C3%A9e-et-aux-pieds-plats)-%5Beve,-small-model-(model-with-a-square-base-and-flat-feet)%5D" },
      { label: "Wikipedia — Eve (Rodin)", href: "https://en.wikipedia.org/wiki/Eve_(Rodin)" },
    ],
  },
  {
    slug: "meditation",
    title: "La Méditation",
    subtitle: "Meditation, or The Inner Voice",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, enlarged 1896 from the 1885 figure on the Monument to Victor Hugo. Image: Wikipedia / Wikimedia Commons.",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived 1885; enlarged 1896 · · Alexis Rudier, edition of 13 (1921–1943) · · H. 147 cm",
    },
    summary: "A turning, twisting figure conceived for the abandoned Pantheon monument to Victor Hugo — afterwards drawn out as a work of its own, often shown without arms.",
    aboutParagraphs: [
      "La Méditation began as a Muse. In 1885 Rodin was commissioned to design a monument to Victor Hugo for the Panthéon, and on the rocks beside the seated poet he placed three voices: Tragic, Lyric, and the one he called the Inner Voice, leaning down to whisper to Hugo what he could not quite hear from the world.",
      "The Panthéon plan collapsed and Rodin, refusing to lose the figure, lifted her out of the group. In 1896 he had her enlarged to almost life size. She turns. The hip throws out, the chest rotates against the shoulders, the head sinks toward the further breast — a whole body listening inward. In many casts she has no arms; in some, no legs below the knee. Rodin was unrepentant. \"My statues without arms,\" he told Rilke, \"lack nothing essential to them.\"",
      "Alexis Rudier cast thirteen examples between 1921 and 1943; the master plaster remains at the Musée Rodin in Meudon, and other casts live in Stockholm, Tokyo, London. Stand still in front of her. The figure does not pose for you. She is mid-sentence inside her own head, and the bronze is the only thing thick enough to hold what she is hearing.",
    ],
    sources: [
      { label: "Musée Rodin — Meditation, or Inner Voice", href: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/meditation-or-inner-voice" },
      { label: "Rodin-Web — La Méditation (1885)", href: "http://rodin-web.org/works/1885_meditation.htm" },
      { label: "Victoria & Albert Museum — Inner Voice (The Muse)", href: "https://collections.vam.ac.uk/item/O135947/inner-voice-the-muse-figure-rodin-auguste/" },
      { label: "Wikipedia — Meditation (Rodin)", href: "https://en.wikipedia.org/wiki/Meditation_(Rodin)" },
    ],
  },
  {
    slug: "triumphant-youth",
    title: "La Jeunesse Triomphante",
    subtitle: "Triumphant Youth",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, conceived 1894, cast in Rodin's lifetime between 1906 and 1918. Image: MutualArt / Bonhams archive.",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived 1894; this cast 1906–1918 · · Cast in Rodin's lifetime · · H. 52.2 cm",
    },
    summary: "A young woman and an old woman locked in the same embrace, the meeting of two ages of the body — a sculpture Rodin titled, at different times, Eternal Youth, Fate, Old Age and Adolescence, and The Grandmother's Kiss.",
    aboutParagraphs: [
      "Few works of Rodin's have changed titles as often as this one. He showed it first as La Jeunesse Triomphante — Triumphant Youth — at the 1896 Paris Salon, in marble. A bronze version appeared in Berlin in 1903. Over the years it has also been called Eternal Youth, Fate, The Convalescent, The Grandmother's Kiss, Old Age and Adolescence, and Young Girl and Fate. Each title brings a different reading; the sculpture quietly tolerates them all.",
      "What you see is the body in two of its ages, brought into the same compass. The young woman lies back against the rock, one arm flung up beside her head, her body still entirely her own. The old woman bends over her, vertebrae showing through skin, the cheek pressed close to the girl's. The contact between them is neither sentimental nor cruel; Rodin makes them simply the same person, encountered twice.",
      "The piece was conceived in 1894 — the year Rodin's affair with Camille Claudel was finally ending, the year he turned fifty-four. Walk around it and the two figures keep changing roles: which of them is comforting whom, which is the one being taken away. Rodin trusts you, as ever, to feel that out without help.",
    ],
    sources: [
      { label: "Arkın Rodin Collection — La Jeunesse Triomphante", href: "https://www.thearkinrodincollection.com/our-exhibitions/la-jeunesse-triomphante-%5Btriumphant-youth%5D" },
      { label: "Wikipedia — Youth Triumphant", href: "https://en.wikipedia.org/wiki/Youth_Triumphant" },
      { label: "Philadelphia Museum of Art — Youth Triumphant", href: "https://press.philamuseum.org/asset/331894/image4-youthtriumphant-2" },
    ],
  },
  {
    slug: "iris-study-with-head",
    title: "Iris, Étude avec Tête",
    subtitle: "Iris, Study with Head",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, early maquette with head intact, cast 1970. Image: Arkın Rodin Collection.",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived 1890–1891; this cast 1970 · · Susse Foundry for Musée Rodin · · H. 53 cm",
    },
    summary: "An early maquette of Rodin's most provocative female figure — caught mid-leap, the right leg flung wide, the head still attached as it would not be in the better-known version.",
    aboutParagraphs: [
      "Iris was the rainbow-running messenger of the Olympian gods, the figure Homer sends down from the clouds whenever Zeus has business with mortals. Rodin took the name and made of it something stranger: a female nude balanced on one foot, the other leg swung clear of the body in a movement that is at once flight, dance and unembarrassed display. In this small early version, the head is still in place — a detail he would, characteristically, soon delete.",
      "He worked from a model who lay on her back. The composition was conceived between 1890 and 1891 and seems to have begun as a study for the second Monument to Victor Hugo, where Iris was to be supported by a cloud and hang upside-down above the poet's head, complete with a pair of wings. When the monument failed, Rodin kept the figure and progressively pared it down — removing the head, truncating the left arm at the shoulder, leaving the splayed, headless torso we now know as Iris, messagère des dieux.",
      "Walk around this version slowly. With the head still attached and the figure modelled at a chamber scale, you can see the choreography intact — neck angled, mouth slightly open, the body still belonging to a single person before Rodin began to argue, in bronze, that a body could speak without a face.",
    ],
    sources: [
      { label: "Arkın Rodin Collection — Iris, Étude avec Tête", href: "https://www.thearkinrodincollection.com/our-exhibitions/iris,-%C3%A9tude-avec-t%C3%A9te-%5Biris,-study-with-head%5D" },
      { label: "Musée Rodin — Iris, messenger of the gods", href: "https://www.musee-rodin.fr/en/musee/collections/oeuvres/iris-messenger-gods" },
      { label: "Metropolitan Museum of Art — Iris, Messenger of the Gods", href: "https://www.metmuseum.org/art/collection/search/207490" },
    ],
  },
  {
    slug: "falling-man",
    title: "L'Homme Qui Tombe",
    subtitle: "The Falling Man",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze cast by the Susse Foundry for the Musée Rodin, 1973. Image: Wikipedia / Wikimedia Commons.",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived c. 1882–1885; this cast 1973 · · Susse Foundry for Musée Rodin · · H. 58.5 cm",
    },
    summary: "A figure of the damned hurled backwards over the lintel of The Gates of Hell, twisting away from a force that cannot be resisted.",
    aboutParagraphs: [
      "Among the writhing crowd Rodin pinned to The Gates of Hell, the Falling Man holds a particular position: he is the figure who escapes nothing. Conceived in the early 1880s as Rodin laboured on the great portal, he was placed in the upper left of the doors, half straddling the lintel that separates the tympanum from the panels below. He has begun to topple backwards, and the bronze captures exactly the instant before the fall becomes irreversible.",
      "No casts of the figure were made during Rodin's lifetime. The Susse foundry pulled twelve bronzes for the Musée Rodin between 1972 and 1982, and this is one of them. As a free-standing piece, away from the Gate, the Falling Man reveals what is masked when he is welded into the swarm — the deep curve of his back, the great forward push of the chest, the head thrown over the right shoulder as though already glimpsing what is rushing up to meet him.",
      "Walk around him slowly. The composition has no rest point. Every line — arm, ribcage, thigh — leans against another. Rodin once said he wanted his figures to express, in the body, what the face could not. Here is the body in unanswered prayer.",
    ],
    sources: [
      { label: "Arkın Rodin Collection — L'Homme Qui Tombe", href: "https://www.thearkinrodincollection.com/our-exhibitions/l%E2%80%99homme-qui-tombe-%5Bthe-falling-man%5D" },
      { label: "Wikipedia — The Falling Man (Rodin)", href: "https://en.wikipedia.org/wiki/The_Falling_Man_(Rodin)" },
      { label: "Musée Rodin — La Porte de l'Enfer: Homme qui tombe", href: "https://enfer.musee-rodin.fr/fr/figure/homme-qui-tombe" },
    ],
  },
  {
    slug: "monumental-torso",
    title: "Grande Torse de l'Homme",
    subtitle: "Monumental Torso",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze cast by Georges Rudier, 1970, enlarged from the figure of L'Homme Qui Tombe. Image: Public Art Archive (Wichita, Kansas installation).",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived 1904; this cast 1970 · · Georges Rudier foundry, Paris · · H. 102 cm",
    },
    summary: "An enlarged, headless and armless torso drawn out of the Falling Man — a fragment scaled up until it stands alone, beyond rescue and beyond escape.",
    aboutParagraphs: [
      "By 1904, Rodin had spent twenty years pulling figures off and on the great relief of The Gates of Hell, working them up at new scales, refusing to let them stay anonymous in the swarm. The Monumental Torso is one of these salvages. It begins with the Falling Man — the writhing figure half-toppled over the upper left lintel of the Gate — and ends as a thing entirely its own: head gone, arms cut at the shoulder, legs ending mid-thigh.",
      "The figure was never cast in Rodin's lifetime. In 1970, the Georges Rudier foundry pulled this version on commission from the Musée Rodin, at just over a metre high. The torso retains every push of Rodin's thumb. Look at the way the chest opens to the sky, ribs arcing under the skin, the abdomen still tensed against a fall already begun. Without the limbs to give the action a direction, the body becomes a piece of pure pressure.",
      "Rodin had argued since his youth that a fragment, properly chosen, could carry more truth than a complete figure. Walk slowly around this one and the case makes itself. There is nowhere for the eye to settle: every angle gives a different drama of muscle and shadow, and none resolves.",
    ],
    sources: [
      { label: "Arkın Rodin Collection — Grande Torse de l'Homme", href: "https://www.thearkinrodincollection.com/our-exhibitions/grande-torse-de-l%E2%80%99homme-%5Bmonumental-torso%5D" },
      { label: "North Carolina Museum of Art — Monumental Torso of the Walking Man", href: "https://collection.ncartmuseum.org/objects/4746/monumental-torso-of-the-walking-man" },
      { label: "Public Art Archive — Grand Torse de L'homme qui Tombe", href: "https://publicartarchive.org/art/Grand-Torse-de-L-homme-qui-Tombe/382dc281" },
    ],
  },
  {
    slug: "eternal-spring-first-state",
    title: "L'Éternel Printemps, Premier État",
    subtitle: "Eternal Spring, First State",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, first state, cast by Georges Rudier for the Musée Rodin, 1969. Image: Basil &amp; Elise Goulandris Foundation.",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived 1884; this cast 1969 · · Georges Rudier foundry, Paris · · H. 51.4 cm",
    },
    summary: "Rodin's earliest conception of Eternal Spring — a young man bent backwards over a rock, drawing a girl across his lap into a kiss. For most connoisseurs, the finest of all the variants.",
    aboutParagraphs: [
      "L'Éternel Printemps was conceived in 1884, alongside The Kiss, and like The Kiss it was originally meant to flank The Gates of Hell as one of the doomed lovers of Dante's second circle. Rodin soon decided that the embrace was too radiant to belong among the damned. He pulled it out of the Gate and let it stand on its own as the most romantic of his independent compositions.",
      "What makes the Premier État rare and prized is its rawness. There are only five bronze casts of this earliest version: two pulled by Alexis Rudier between 1930 and 1952, and three more by Georges Rudier between 1966 and 1969. The Musée Rodin's contract list ends with the present example. In later states, Rodin and his collaborators softened the composition, but here the young man is still bent extravagantly backwards over the rock, and the girl is still flung across him — knees splayed, hair loose, the whole body offering itself.",
      "Stand close. The lovers' faces have not quite met. Eternal Spring went on to become one of Rodin's most commercially successful icons of romance, and yet this — the first state — still feels as if the couple had only met that morning.",
    ],
    sources: [
      { label: "Arkın Rodin Collection — L'Éternel Printemps, Premier État", href: "https://www.thearkinrodincollection.com/our-exhibitions/l%E2%80%99%C3%A9ternel-printemps,-premier-%C3%A9tat-%5Beternal-spring,-first-state%5D" },
      { label: "Wikipedia — Eternal Springtime", href: "https://en.wikipedia.org/wiki/Eternal_Springtime" },
      { label: "Basil &amp; Elise Goulandris Foundation — L'Éternel Printemps", href: "https://goulandris.gr/en/artwork/rodin-auguste-eternal-springtime" },
    ],
  },
  {
    slug: "the-kiss-3rd-reduction",
    title: "Le Baiser, 3ème Réduction",
    subtitle: "The Kiss, 3rd Reduction",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, third Barbedienne reduction, cast 1910–1918. Image: National Gallery of Art, Washington (1942.5.15).",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived 1886; reduced 1901; cast 1910–1918 · · Barbedienne foundry, Paris (unlimited edition) · · H. 39.5 cm",
    },
    summary: "A small-scale, chamber version of Rodin's most famous embrace — Paolo and Francesca caught in the kiss that, in Dante, will cost them eternity.",
    aboutParagraphs: [
      "The couple began on The Gates of Hell. Rodin was modelling Paolo Malatesta and his sister-in-law Francesca da Rimini at the moment, in Canto V of Dante's Inferno, when their first kiss is interrupted by Francesca's husband — and they are afterwards condemned to drift forever in the second circle, locked together in the wind. Almost immediately, the embrace looked wrong on the doors: too tender, too close to ordinary happiness. Rodin lifted them out and let them stand alone.",
      "Le Baiser as a free-standing work was exhibited in plaster in Brussels in 1887 and in bronze in Paris later the same year. In 1898 Rodin signed a ten-year contract with the Barbedienne foundry to cast an unlimited edition in four reduced scales — 72 cm, 60 cm, 40 cm and 25 cm. The 3ème Réduction at 39.5 cm corresponds to the third of those sizes and was cast in considerable numbers between 1910 and 1918.",
      "What survives the reduction is the quiet of the gesture. Francesca leans into Paolo; their lips meet; his book, which Dante mentions, lies forgotten on the rock at her hip. Approach close and you can read the pulse of the moment. They do not yet know it cannot last.",
    ],
    sources: [
      { label: "Arkın Rodin Collection — Le Baiser, 3ème Réduction", href: "https://www.thearkinrodincollection.com/our-exhibitions/le-baiser,-3%C3%A8me-r%C3%A9duction-%5Bthe-kiss,-2nd-reduction%5D" },
      { label: "National Gallery of Art — The Kiss (Le Baiser)", href: "https://www.nga.gov/artworks/1008-kiss-le-baiser" },
      { label: "Christie's — Le Baiser, 3ème réduction", href: "https://www.christies.com/en/lot/lot-5839227" },
    ],
  },
  {
    slug: "death-of-adonis",
    title: "Mort d'Adonis",
    subtitle: "Death of Adonis",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, edition cast 1956 by Georges Rudier for the Musée Rodin. Image: Arkın Rodin Collection (RCG0004).",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived 1885–1887; this cast 1956 · · Georges Rudier foundry, Paris · · H. 27 cm",
    },
    summary: "Adonis, the young god of beauty mortally wounded by a wild boar, lies across the body of Aphrodite — a compact, intensely felt elegy that began life as a marginal sketch beside one of Baudelaire's poems.",
    aboutParagraphs: [
      "The group is not large — barely the size of a forearm — but Rodin has charged it with the gravity of a tomb. Adonis is dead. He lies face down across the body of Aphrodite, who half kneels, half collapses beneath him, holding what is left of him as if she could still warm him back. The two bodies are wrapped so tightly into one mass that, walking around the bronze, you sometimes lose track of where one figure ends and the other begins.",
      "Rodin first sketched the composition in 1887 in the margin of Baudelaire's poem Le Poison, inside a copy of Les Fleurs du Mal that the publisher Paul Gallimard had asked him to illustrate. He exhibited the sculpture under three different titles in three different cities — Venus and Adonis in Brussels, Hero and Leander in London, and finally Mort d'Adonis — the same group of mourning lovers re-named each time after another mythical death.",
      "The figure of Adonis is in fact recycled from The Gates of Hell, where she appears, female, on the upper lintel as part of Man and his Thought. Rodin liked to swap his figures' sexes and stories freely; what matters is the posture. Lean close: the curve of the back, the slack hand, the way Aphrodite presses her cheek into his shoulder. You are watching the precise moment when desire becomes grief.",
    ],
    sources: [
      { label: "Arkın Rodin Collection — Mort d'Adonis", href: "https://www.artatarkiniskele.com/import-1/mort-d'adonis-%5Bdeath-of-adonis%5D" },
      { label: "Walters Art Museum — The Death of Adonis", href: "https://art.thewalters.org/object/27.491/" },
      { label: "Christie's — Le réveil d'Adonis (companion)", href: "https://www.christies.com/en/lot/lot-3905784" },
    ],
  },
  {
    slug: "jardiniere-of-the-titans",
    title: "Jardinière aux Titans",
    subtitle: "The Titans' Jardinière",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Glazed polychromed earthenware. Image: Petit Palais, Paris (ODUT1914).",
    meta: {
      marksAndInscriptions: "Modelled c. 1877; this piece fired late 19th century · · Glazed polychromed earthenware · · Choisy-le-Roi factory (Hippolyte Boulanger) · · H. ~71 cm total",
    },
    summary: "An ornamental garden vase with four straining nude Titans at its base — the closest collaboration between Rodin and his teacher Albert Carrier-Belleuse, and Rodin's first serious answer to Michelangelo.",
    aboutParagraphs: [
      "It is, formally, a planter — a piece of decorative furniture commissioned from the Choisy-le-Roi ceramics factory of Hippolyte Boulanger. But look at the figures squeezed under the bowl. Four nude giants, locked in spiralling crouches, shoulder a weight far larger than themselves. Their muscles read like a translation of Michelangelo's ignudi from the Sistine Chapel ceiling — except the original ignudi sit serene, while Rodin's Titans buckle.",
      "Rodin made them around 1877, when he was still a young assistant in Albert Carrier-Belleuse's workshop in Brussels. Carrier-Belleuse designed the upper vessel — the rounded urn with its tumbling oak leaves, acorns, and bright blue skinks — but the four Titans on the base are unmistakably Rodin's, modelled on his return from his transformative pilgrimage to Italy where he had finally stood in front of Michelangelo's sculpture and ceiling. The jardinière is the first work in which Rodin's Michelangelo lives openly: tense, twisted, full of held-in force.",
      "Only three complete jardinières — bowl and base together — survive in public collections, here at the Petit Palais, at the Detroit Institute of Arts, and at the Museo Lázaro Galdiano in Madrid. Walk around it. The Titans are not decorative. They are wrestling Olympus, and losing.",
    ],
    sources: [
      { label: "Petit Palais — The Titans Jardinière", href: "https://www.petitpalais.paris.fr/en/oeuvre/titans-jardiniere" },
      { label: "Detroit Institute of Arts — Vase of the Titans", href: "https://dia.org/collection/vase-titans-94258" },
      { label: "Philadelphia Museum of Art — The Vase of the Titans", href: "https://www.philamuseum.org/objects/346671" },
    ],
  },
  {
    slug: "eternal-idol-small-model",
    title: "Éternelle Idole, Petit Modèle",
    subtitle: "Eternal Idol, Small Model",
    artist: "Auguste Rodin (French, 1840–1917)",
    exhibitionStyle: true,
    caption: "Bronze, this cast 1927 by Alexis Rudier — the earliest of thirteen casts. Image: Arkın Rodin Collection (RCG0003.20-05).",
    meta: {
      materials: "· Bronze",
      marksAndInscriptions: "Conceived 1889; this cast 1927 · · Alexis Rudier foundry, Paris · · H. 17.14 cm",
    },
    summary: "A man kneels with his hands locked behind his back and presses his lips to a standing woman's breast — Rodin's most intense small group of adoration, mistrust, and worship, modelled while The Gates of Hell were still in his studio.",
    aboutParagraphs: [
      "Rodin made the group in 1889 while still wrestling with The Gates of Hell. Both figures began separately on the right-hand door before he pulled them out and pressed them together. The man kneels, his hands fastened behind his back as though tied. The woman stands above him, one leg drawn up, looking down with a face that is almost without expression. He buries his mouth in her breast in what could be a prayer, an act of surrender, or a confession he cannot say aloud.",
      "Rodin gave it three different titles during his lifetime. He called it L'Hostie — the Host — invoking the wafer at communion. He called it Le Sacrifice. He finally settled on L'Éternelle Idole. The titles agree on one thing: the woman is divine, and the man, however abject, is also somehow free to worship.",
      "The first cast of this 17-centimetre version, in 1891, went to the collector Antoni Roux. Roux pushed Rodin to enlarge it, and a marble was carved by Jean Escoula in 1893. But the small bronze keeps something the larger versions soften. The composition is closed and concentrated, the size of a held thing. The novelist Rainer Maria Rilke, who briefly served as Rodin's secretary, said of it: 'Heaven is near, but has not yet been reached; Hell is near, but has not yet been forgotten.' Look at the man's hands. They are not quite bound, and not quite free.",
    ],
    sources: [
      { label: "Arkın Rodin Collection — Éternelle Idole, Petit Modèle", href: "https://www.thearkinrodincollection.com/our-exhibitions/%C3%A9ternelle-idole,-petit-modele-%5Beternal-idol,-small-model%5D-" },
      { label: "Montreal Museum of Fine Arts — The Eternal Idol", href: "https://www.mbam.qc.ca/en/works/71552/" },
      { label: "Christie's — Éternelle idole, grand modèle", href: "https://www.christies.com/en/lot/lot-6414756" },
    ],
  },]

export function getRodinArtwork(slug: string): RodinArtwork | undefined {
  return RODIN_ARTWORKS.find((artwork) => artwork.slug === slug)
}

export function getFeaturedRodinArtworks(): RodinArtwork[] {
  return RODIN_ARTWORKS.filter((artwork) => artwork.featured)
}
