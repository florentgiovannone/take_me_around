export type Artwork = {
  slug: string
  textName: string
  title: string
  artist: string
  year: string
  medium: string
  kicker: string
  standfirst: string
  paragraphs: string[]
  audioSrc: string
}

export const artworks: Artwork[] = [
  {
    slug: "the-listening-room",
    textName: "FG001",
    title: "The Listening Room",
    artist: "Mara Ellison",
    year: "2024",
    medium: "Brass, silk thread, and spoken sound",
    kicker: "Installation",
    audioSrc: "/audio/the-listening-room.mp3",
    standfirst:
      "Thirty-six brass bowls hang in a circle. Speak, and the note walks the room until the plaster takes it.",
    paragraphs: [
      "Ellison tuned each bowl a fraction apart from its neighbour and hung them at mouth height on silk thread. The room is otherwise empty. A visitor’s voice strikes the nearest metal, and the reply moves clockwise, thinning as it goes.",
      "The work asks for a small courtesy. People lower their voices when they realise the room is answering. What begins as a demonstration becomes a conversation held at the volume of a gallery, which is to say almost privately.",
      "Nothing is kept. The piece exists only while someone is willing to speak into it, and it ends when they step back onto the carpet and the last bowl goes still.",
    ],
  },
  {
    slug: "salt-latitude",
    textName: "FG002",
    title: "Salt Latitude",
    artist: "Jonah Adeyemi",
    year: "2023",
    medium: "Cast concrete, sea salt, and steel",
    kicker: "Sculpture",
    audioSrc: "/audio/salt-latitude.mp3",
    standfirst:
      "A low slab carries one tide line inland. The salt Adeyemi left in the mix keeps blooming a pale crust across the concrete.",
    paragraphs: [
      "Adeyemi cast the slab on a beach and scored it with the average high-water mark of that morning. Steel pins hold the form a few centimetres off the floor, so the line reads as a horizon rather than a join in the ground.",
      "The salt was not sealed. Over weeks it rises to the surface and dusts the grey with white, heavier below the scored line than above it. The sculpture keeps a weather the room does not have.",
      "Seen from the side, the slab is almost nothing: a thickness, a shadow, a rule. From above it is a map of a place the visitor is not standing in.",
    ],
  },
  {
    slug: "index-of-unsent-letters",
    textName: "FG003",
    title: "Index of Unsent Letters",
    artist: "Hanae Sato",
    year: "2025",
    medium: "Ink, folded paper, and oak",
    kicker: "Paper",
    audioSrc: "/audio/index-of-unsent-letters.mp3",
    standfirst:
      "Two hundred and fourteen letters, written and never posted, filed by the hour they were folded. The envelopes stay closed.",
    paragraphs: [
      "Sato collected letters from people who had decided not to send them, then built an oak index of twenty-four drawers, one for each hour. A letter folded at dawn sits with the other dawn letters. The hour is the only fact on the label.",
      "The pages are not transcribed and the envelopes are not opened in the gallery. What the visitor can read is the grid of times, the weight of a drawer, and the slight difference between an hour that is full and an hour that is almost empty.",
      "The work treats privacy as a material. The letters remain correspondence, even though they never travelled, and the index is the part Sato is willing to show.",
    ],
  },
]

export function artworkBySlug(slug: string | undefined): Artwork | undefined {
  return artworks.find((artwork) => artwork.slug === slug)
}
