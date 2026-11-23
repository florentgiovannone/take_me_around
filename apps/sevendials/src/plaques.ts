export type PlaqueTimelineItem = {
  year: string
  heading: string
  detail: string
}

export type PlaqueSection = {
  id: string
  eyebrow: string
  heading: string
  lede: string
  paragraphs: string[]
  callout?: {
    label: string
    body: string
  }
}

export type PlaqueSource = {
  label: string
  citation: string
  href?: string
}

export type PlaquePerson = {
  slug: "charles-boon" | "brian-epstein"
  tagCode: "SD001" | "SD002"
  name: string
  lifeDates: string
  role: string
  plaqueDates: string
  locationTitle: string
  historicAddress: string
  modernAddress: string
  coordinates: string
  sponsor: string
  unveiled: string
  plaqueInscription: string[]
  standfirst: string
  inSituSummary: {
    heading: string
    streetThenAndNow: string
    buildingContext: string
    whyHere: string
    nearbyLandmarks: string[]
  }
  sections: PlaqueSection[]
  timeline: PlaqueTimelineItem[]
  sources: PlaqueSource[]
  officialTrustUrl: string
}

export const plaques: PlaquePerson[] = [
  {
    slug: "charles-boon",
    tagCode: "SD001",
    name: "Charles Boon",
    lifeDates: "1877–1943",
    role: "Co-founder of Mills & Boon and pioneer of popular romantic literature",
    plaqueDates: "1877–1901",
    locationTitle: "Corner of Shelton Street & Mercer Street",
    historicAddress: "Born at 47 Castle Street (above Combe's Brewery); family home at 12 Little White Lion Street",
    modernAddress: "6 Mercer Street (corner of Shelton Street & Mercer Street), Seven Dials, London WC2H 9FD",
    coordinates: "51° 30.803′ N, 0° 7.581′ W",
    sponsor: "Sponsored by Mills & Boon (HarperCollins UK)",
    unveiled: "12 February 2026 (Valentine's Week)",
    plaqueInscription: [
      "CHARLES BOON",
      "(1877–1943)",
      "Co-Founder of publisher",
      "Mills & Boon, and pioneer",
      "of romantic literature",
      "lived here 1877–1901",
    ],
    standfirst:
      "Born above the steam and beer vats of Combe's Woodyard Brewery on Castle Street and raised around the corner on Little White Lion Street, Charles Boon rose from a Seven Dials brewery labourer's household to build one of the most recognisable publishing imprints in the English-speaking world.",
    inSituSummary: {
      heading: "Where You Are Standing: Castle Street, Little White Lion Street & Combe's Brewery",
      streetThenAndNow:
        "Today's intersection of Shelton Street and Mercer Street was, in the 1870s, the corner of Castle Street (renamed Shelton Street in 1877) and Little White Lion Street (later absorbed into Mercer Street). In Victorian Seven Dials, this block stood at the industrial heart of the parish of St Giles-in-the-Fields.",
      buildingContext:
        "Charles Thomas Boon was born on 9 May 1877 at No. 47 Castle Street, in tenement rooms directly above Combe & Co.'s sprawling Woodyard Brewery. The brewery's mash tuns, copper vats, dray-horse stables, and warehouse yards dominated the triangle between Castle Street, Neal Street, and Long Acre. The Boon family subsequently lived at 12 Little White Lion Street—the exact corner marked by this plaque today—where Charles remained until at least 1901.",
      whyHere:
        "The contrast between the gritty working-class tenements above Combe's Brewery and the glamorous escapism of the Mills & Boon books Charles later championed is central to his story. Growing up in cramped Seven Dials quarters where every penny counted gave Boon a lifelong respect for ordinary working readers—especially women seeking affordable, uplifting fiction from neighbourhood tuppenny libraries.",
      nearbyLandmarks: [
        "Site of Combe & Co.'s Woodyard Brewery (spanning Shelton Street, Neal Street, and Mercer Street)",
        "12 Little White Lion Street (now 6 Mercer Street — Boon family home in the 1891 & 1901 censuses)",
        "Seven Dials Sundial Pillar (one block north-west at the junction of the seven streets)",
      ],
    },
    sections: [
      {
        id: "in-situ-brewery",
        eyebrow: "01 · In-Situ in Victorian Seven Dials (1877–1901)",
        heading: "A Rose Between the Beer Vats of Castle Street",
        lede:
          "Life in the Boon household at 47 Castle Street and 12 Little White Lion Street was shaped by the sights, sounds, and rhythms of Combe's Woodyard Brewery.",
        paragraphs: [
          "Charles Boon's father—also named Charles Boon—worked as an unskilled general labourer in the Woodyard Brewery below their Castle Street rooms. With six children to feed, both parents worked relentlessly, and as a young boy Charles helped his mother at home assembling matchboxes by the gross to add a few vital pennies to the household budget.",
          "For decades, the Oxford Dictionary of National Biography repeated a family story that Charles's father died when the boy was twelve, forcing him to leave school as the sole breadwinner. However, census research highlighted by the Seven Dials Trust reveals that his father was still alive in 1901, when the 23-year-old Charles was still living at the family home at 12 Little White Lion Street (now Mercer Street).",
          "Even so, Charles left formal schooling early. After taking initial odd jobs around the brewery, he found work in a London bookshop and a circulating library—an apprenticeship on the shop floor that taught him exactly how readers browsed, borrowed, and talked about popular books.",
        ],
        callout: {
          label: "Archival Discovery in the 1901 Census",
          body: "While earlier biographical dictionaries stated that Charles Boon's brewery-worker father died around 1889, the 1901 Census for 12 Little White Lion Street, Seven Dials records both father and son living together in the family home—just as Charles was rising through the ranks at Methuen & Co. nearby on Essex Street, Strand.",
        },
      },
      {
        id: "methuen-to-mills-and-boon",
        eyebrow: "02 · From Office Boy to Publisher (1893–1928)",
        heading: "Joining Methuen & Founding Mills & Boon",
        lede:
          "In 1893, while still living in Seven Dials, the sixteen-year-old Boon joined the publishing house Methuen & Co. as an office boy and warehouse clerk.",
        paragraphs: [
          "At Methuen, Boon's instinct for sales and his tireless rapport with booksellers propelled him from the warehouse floor to travelling representative, sales manager, and finally general manager. It was at Methuen that he met Gerald Rusgrove Mills (1877–1928), an Oxford graduate whose literary editorial background complemented Boon's commercial genius.",
          "In 1908, backed by an initial capital of £1,000, the two partners founded Mills & Boon Ltd at 49 Whitcomb Street (and later 49 Rupert Street, Soho). Initially a general publisher of fiction, travel, and health books, the firm published early works by P. G. Wodehouse and Hugh Walpole, and in 1911 Boon personally signed Jack London—then at the zenith of his international fame—to their list.",
          "Throughout the 1910s and 1920s, Boon oversaw fiction and marketing, demonstrating an uncanny gift for spotting emerging female novelists including Denise Robins, Elizabeth Carfrae, and Georgette Heyer.",
        ],
      },
      {
        id: "romance-revolution",
        eyebrow: "03 · The Tuppenny Library & Brand Revolution (1928–1943)",
        heading: "'Another Mills & Boon, Please'",
        lede:
          "Following Gerald Mills's sudden death in 1928 and the onset of the Great Depression, Charles Boon made the bold decision to concentrate exclusively on romantic fiction written by and for women.",
        paragraphs: [
          "In the early 1930s, high-street 'tuppenny libraries' (commercial lending libraries where readers borrowed books for two pence a week without a subscription) boomed across Britain. Boon realised that female readers constituted a vast, underserved audience—and that libraries needed a reliable, instantly recognisable product.",
          "Boon gave every Mills & Boon novel a distinctive brown-jacketed library binding, encouraged his all-female roster of authors to write prolifically with a warm 'personal touch', and promoted titles directly through circulating libraries and Women's Institutes.",
          "The result was a triumph of publishing branding: for the first time in British book history, readers walked into libraries asking not for a specific author or title, but simply for 'Another Mills & Boon, please.' When Charles Boon died on 2 December 1943, the imprint founded by a Seven Dials brewery worker's son had defined an enduring global genre.",
        ],
      },
    ],
    timeline: [
      {
        year: "9 May 1877",
        heading: "Born at 47 Castle Street, Seven Dials",
        detail:
          "Born above Combe & Co.'s Woodyard Brewery on Castle Street (renamed Shelton Street the same year) to brewery labourer Charles Boon and his wife.",
      },
      {
        year: "1880s",
        heading: "Childhood on Little White Lion Street",
        detail:
          "Grows up at 12 Little White Lion Street (now Mercer Street), helping assemble matchboxes at home before working in a bookshop and circulating library.",
      },
      {
        year: "1893",
        heading: "Joins Methuen & Co.",
        detail:
          "Starts as a 16-year-old office boy and warehouse clerk at Methuen, rising to sales manager and general manager while still living in Seven Dials.",
      },
      {
        year: "1901",
        heading: "Recorded at 12 Little White Lion Street",
        detail:
          "The 1901 Census records Charles Boon still residing in the family home on Little White Lion Street at the corner of Shelton Street.",
      },
      {
        year: "1908",
        heading: "Co-founds Mills & Boon",
        detail:
          "Partners with Gerald Rusgrove Mills with £1,000 capital to launch Mills & Boon; signs Jack London in 1911.",
      },
      {
        year: "1928–1930s",
        heading: "Shapes the Modern Romance Imprint",
        detail:
          "After Gerald Mills's death in 1928, Boon focuses the house on women's romantic fiction, pioneering the brown-jacketed tuppenny library phenomenon.",
      },
      {
        year: "2 Dec 1943",
        heading: "Death of Charles Boon",
        detail:
          "Dies aged 66, leaving his three sons to carry forward the independent family firm before its later partnership with Harlequin.",
      },
      {
        year: "12 Feb 2026",
        heading: "Seven Dials Trust People's Plaque Unveiled",
        detail:
          "Unveiled at the corner of Shelton Street and Mercer Street (6 Mercer Street), sponsored by Mills & Boon.",
      },
    ],
    sources: [
      {
        label: "Seven Dials Trust — Charles Boon People's Plaque",
        citation: "The Seven Dials Trust official plaque biography and Shelton/Mercer Street location notes.",
        href: "https://sevendials.com/peoples-plaques/charles-boon",
      },
      {
        label: "Passion's Fortune: The Story of Mills & Boon",
        citation: "Joseph McAleer (Oxford University Press, 1999) & Harlequin–Mills & Boon Ltd Archives.",
      },
      {
        label: "Historical Marker Database — Charles Boon Marker",
        citation: "Inscription, coordinates (51° 30.803′ N, 0° 7.581′ W), and 6 Mercer Street site record.",
        href: "https://www.hmdb.org/m.asp?m=297506",
      },
      {
        label: "A London Miscellany — 'A Rose Between the Beer Vats'",
        citation: "Steve Matthews (2023), social history of 47 Castle Street and Combe's Woodyard Brewery in Seven Dials.",
        href: "https://www.alondonmiscellany.com/post/a-rose-between-the-beer-vats",
      },
      {
        label: "Oxford Dictionary of National Biography & 1891/1901 UK Census",
        citation: "Parish of St Giles-in-the-Fields census returns for 47 Castle Street and 12 Little White Lion Street.",
      },
    ],
    officialTrustUrl: "https://sevendials.com/peoples-plaques/charles-boon",
  },
  {
    slug: "brian-epstein",
    tagCode: "SD002",
    name: "Brian Epstein",
    lifeDates: "1934–1967",
    role: "Music impresario, founder of NEMS Enterprises, and manager of The Beatles ('The Fifth Beatle')",
    plaqueDates: "1963–1964",
    locationTitle: "13 Monmouth Street, Seven Dials",
    historicAddress: "Second Floor Offices, NEMS Enterprises Ltd, 13 Monmouth Street",
    modernAddress: "13 Monmouth Street, Seven Dials, Covent Garden, London WC2H 9DA",
    coordinates: "51° 30.818′ N, 0° 7.625′ W",
    sponsor: "Sponsored by Shaftesbury PLC; unveiled by the late Cilla Black",
    unveiled: "28 September 2010",
    plaqueInscription: [
      "BRIAN EPSTEIN",
      "(1934–1967)",
      "The Beatles Manager",
      "and impresario",
      "worked here",
      "1963–1964",
    ],
    standfirst:
      "Dubbed the 'fifth Beatle' by John Lennon, Brian Epstein brought NEMS Enterprises south from Liverpool to the second floor of 13 Monmouth Street in early 1963—the first London nerve centre from which he orchestrated Beatlemania, the Mersey Sound, and The Beatles' conquest of America.",
    inSituSummary: {
      heading: "Where You Are Standing: Inside 13 Monmouth Street (1963–1964)",
      streetThenAndNow:
        "Standing outside 13 Monmouth Street, you are looking up at the narrow brick building just south of the Seven Dials pillar that served as Brian Epstein's first dedicated London headquarters during the pivotal twelve months when The Beatles transformed from a Liverpool club act into a global phenomenon.",
      buildingContext:
        "In early 1963, after briefly borrowing desk space from music publisher Dick James at James House (71–75 New Oxford Street), Epstein rented the second floor of 13 Monmouth Street for NEMS Enterprises. In true early-Sixties Covent Garden fashion, the ground floor below Epstein's wood-panelled office was occupied by a Soho-style adult bookshop—a contrast that amused visiting journalists and musicians alike.",
      whyHere:
        "Within months of moving in, Beatlemania overwhelmed the building. Postmen carried hundreds of mailbags up the narrow Monmouth Street staircase as the Official Beatles Fan Club (run by Bettina Rose and Freda Kelly's London counterparts) devoured nearly the entire second floor. By March 1964—just after The Beatles' historic debut on The Ed Sullivan Show—Epstein had to lease the fifth floor of Sutherland House (5–6 Argyll Street) to house 25 staff, though NEMS kept 13 Monmouth Street until finally vacating it on 4 November 1966.",
      nearbyLandmarks: [
        "13 Monmouth Street (Second Floor: NEMS Enterprises & Official Beatles Fan Club, 1963–1966)",
        "Seven Dials Pillar (just yards north at the seven-street junction)",
        "Covent Garden Hotel, 10 Monmouth Street (directly opposite, where the 2010 plaque reception was hosted)",
        "71–75 New Oxford Street (Dick James Music, where Lennon & McCartney recorded early demos nearby)",
      ],
    },
    sections: [
      {
        id: "monmouth-street-hq",
        eyebrow: "01 · In-Situ at 13 Monmouth Street (1963–1964)",
        heading: "The Narrow Staircase Where Beatlemania Hit London",
        lede:
          "When NEMS Enterprises (named after the Epstein family's Liverpool business, North End Music Stores) moved south from Whitechapel, Liverpool to 13 Monmouth Street in 1963, Seven Dials was still a rough-edged quarter of fruit warehouses, theatrical costumiers, and tiny offices.",
        paragraphs: [
          "From his second-floor office at No. 13, the immaculately tailored Epstein worked eighteen-hour days alongside his personal assistant Wendy Hanson and publicist Tony Barrow. Here he signed contracts, fielded frantic calls from concert promoters, and planned the strategy that propelled The Beatles from 'Please Please Me' (February 1963) to the Royal Variety Performance (November 1963).",
          "It was also from 13 Monmouth Street in late 1963 that Epstein finalised the transatlantic deal with Ed Sullivan and Capitol Records that brought The Beatles to New York in February 1964—watched by 73 million American viewers.",
          "By spring 1964, the sheer volume of fan club mail and press traffic crowding the Monmouth Street doorway above the ground-floor shop prompted Epstein to lease grander headquarters at Sutherland House on Argyll Street next to the London Palladium, while retaining 13 Monmouth Street as an overflow and fan-club office until 4 November 1966.",
        ],
        callout: {
          label: "First Seven Dials Trust Heritage Plaque (28 September 2010)",
          body: "Unveiled by Sixties pop icon and Epstein protégée Cilla Black alongside Seven Dials Trust chair David Bieda and Camden Mayor Cllr Jonathan Simpson, this marker at 13 Monmouth Street was the inaugural plaque in the Seven Dials Trust People's Plaques programme.",
        },
      },
      {
        id: "mersey-sound",
        eyebrow: "02 · Architect of the Mersey Sound",
        heading: "From Liverpool Record Shop to Global Pop Impresario",
        lede:
          "Born in Rodney Street, Liverpool on 19 September 1934, Brian Samuel Epstein transformed his family's North End Music Stores (NEMS) into one of the most influential music retailers in the north of England before ever managing a band.",
        paragraphs: [
          "On 9 November 1961, intrigued by customer enquiries for the German import single 'My Bonnie', Epstein walked down the steps of the Cavern Club on Mathew Street to hear The Beatles perform live for the first time. Convinced of their charisma before they even had a UK record contract, he became their manager in January 1962 and famously smartened their leather-jacketed stage presentation into bespoke Mohair suits and synchronised bows.",
          "After securing The Beatles' Parlophone recording contract with producer George Martin at EMI, Epstein assembled a powerhouse roster of Merseybeat artists under the NEMS banner: Cilla Black (whom he discovered working as a cloakroom attendant at the Cavern), Gerry and the Pacemakers, Billy J. Kramer & the Dakotas, The Fourmost, Tommy Quickly, and Sounds Incorporated.",
          "In 1963 alone, artists managed by Epstein from 13 Monmouth Street held the UK Singles Chart No. 1 spot for 32 out of 52 weeks.",
        ],
      },
      {
        id: "legacy-fifth-beatle",
        eyebrow: "03 · Cultural Legacy (1964–1967)",
        heading: "'If Anyone Was the Fifth Beatle, It Was Brian'",
        lede:
          "Epstein's vision extended beyond pop singles into West End theatre, concert promotion at the Saville Theatre on nearby Shaftesbury Avenue, and establishing rock music as a respected global art form.",
        paragraphs: [
          "In 1965, Epstein leased the Saville Theatre at 135 Shaftesbury Avenue—just a two-minute walk from 13 Monmouth Street—staging both dramatic plays and landmark Sunday-night rock concerts featuring Jimi Hendrix, The Who, Cream, and Pink Floyd.",
          "Following The Beatles' retirement from live touring in August 1966 and the release of 'Sgt. Pepper's Lonely Hearts Club Band' in June 1967, Epstein died at his Belgravia home in Chapel Street on 27 August 1967, aged just 32.",
          "Remembering the man who steered them from the Cavern Club through the doors of 13 Monmouth Street to the summit of popular culture, John Lennon remarked simply: 'If anyone was the fifth Beatle, it was Brian.'",
        ],
      },
    ],
    timeline: [
      {
        year: "19 Sept 1934",
        heading: "Born in Liverpool",
        detail:
          "Born at 4 Rodney Street, Liverpool; joins the family furniture and music business, North End Music Stores (NEMS).",
      },
      {
        year: "9 Nov 1961",
        heading: "First Sees The Beatles at the Cavern Club",
        detail:
          "Attends a lunchtime session at the Cavern Club in Liverpool and signs The Beatles to a management contract in January 1962.",
      },
      {
        year: "Early 1963",
        heading: "Moves NEMS to 13 Monmouth Street, Seven Dials",
        detail:
          "Establishes NEMS Enterprises' first dedicated London offices on the second floor of 13 Monmouth Street as Beatlemania sweeps Britain.",
      },
      {
        year: "1963–Feb 1964",
        heading: "Mersey Sound Dominance & US Breakthrough",
        detail:
          "Manages The Beatles, Cilla Black, Gerry and the Pacemakers, and Billy J. Kramer from Monmouth Street; negotiates The Beatles' February 1964 Ed Sullivan Show debut.",
      },
      {
        year: "March 1964",
        heading: "Expands to Sutherland House, Argyll Street",
        detail:
          "With the Beatles Fan Club filling the second floor of 13 Monmouth Street, Epstein leases 5–6 Argyll Street for NEMS headquarters while keeping Monmouth Street active.",
      },
      {
        year: "4 Nov 1966",
        heading: "NEMS Vacates 13 Monmouth Street",
        detail:
          "NEMS finally closes its remaining operations at 13 Monmouth Street after three and a half historic years in Seven Dials.",
      },
      {
        year: "27 Aug 1967",
        heading: "Death of Brian Epstein",
        detail:
          "Dies in London aged 32; posthumously inducted into the Rock and Roll Hall of Fame in 2014.",
      },
      {
        year: "28 Sept 2010",
        heading: "Seven Dials Trust Plaque Unveiled by Cilla Black",
        detail:
          "Cilla Black unveils the Seven Dials Trust People's Plaque at 13 Monmouth Street, sponsored by Shaftesbury PLC.",
      },
    ],
    sources: [
      {
        label: "Seven Dials Trust — Brian Epstein People's Plaque",
        citation: "Official Seven Dials Trust page for 13 Monmouth Street and the 28 September 2010 unveiling by Cilla Black.",
        href: "https://sevendials.com/peoples-plaques/brian-epstein",
      },
      {
        label: "BBC London — Special Plaque for the 'Fifth Beatle' Brian Epstein in Seven Dials",
        citation: "BBC News archive report from the unveiling at 13 Monmouth Street (28 September 2010).",
        href: "http://news.bbc.co.uk/local/london/hi/people_and_places/history/newsid_9040000/9040878.stm",
      },
      {
        label: "The Beatles Bible — NEMS Leaves 13 Monmouth Street, London",
        citation: "Chronicle of NEMS Enterprises' 1963–1966 tenure at 13 Monmouth Street.",
        href: "https://www.beatlesbible.com/1966/11/04/nems-leaves-13-monmouth-street-london/",
      },
      {
        label: "London Blue Plaques — Brian Epstein at 13 Monmouth Street",
        citation: "Plaque inscription and in-situ architectural notes for 13 Monmouth Street.",
        href: "https://londonblueplaques.com/plaque/3802",
      },
      {
        label: "A Cellarful of Noise",
        citation: "Brian Epstein (Souvenir Press, 1964) — Epstein's contemporary autobiography written during the NEMS years.",
      },
    ],
    officialTrustUrl: "https://sevendials.com/peoples-plaques/brian-epstein",
  },
]

export function plaqueBySlug(slug: string | undefined): PlaquePerson | undefined {
  if (!slug) return undefined
  const normalized = slug.trim().toLowerCase()
  return plaques.find((item) => item.slug === normalized)
}
