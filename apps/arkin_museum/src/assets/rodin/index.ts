import danaide1 from "./danaide-1.png"
import danaide2 from "./danaide-2.png"
import danaide3 from "./danaide-3.png"
import theSecret1 from "./the-secret-1.png"
import theSecret2 from "./the-secret-2.png"
import mainCrispeeDroite1 from "./main-crispee-droite-1.png"
import mainCrispeeDroite2 from "./main-crispee-droite-2.png"
import mainCrispeeDroite3 from "./main-crispee-droite-3.png"
import ageOfBronzeSmall1 from "./age-of-bronze-small-1.png"
import ageOfBronzeSmall2 from "./age-of-bronze-small-2.png"
import ageOfBronzeSmall3 from "./age-of-bronze-small-3.png"
import jeSuisBelle1 from "./je-suis-belle-1.png"
import jeSuisBelle2 from "./je-suis-belle-2.png"
import jeSuisBelle3 from "./je-suis-belle-3.png"
import bustOfJeanDaire1 from "./bust-of-jean-daire-1.png"
import bustOfJeanDaire2 from "./bust-of-jean-daire-2.png"
import bustOfJeanDaire3 from "./bust-of-jean-daire-3.png"

/** Artwork slug → single hero image. */
export const RODIN_IMAGES: Partial<Record<string, string>> = {}

/** Artwork slug → gallery row (shown side by side). */
export const RODIN_IMAGE_GALLERIES: Partial<Record<string, string[]>> = {
  danaide: [danaide1, danaide2, danaide3],
  "the-secret": [theSecret1, theSecret2],
  "main-crispee-droite": [mainCrispeeDroite1, mainCrispeeDroite2, mainCrispeeDroite3],
  "age-of-bronze-small": [ageOfBronzeSmall1, ageOfBronzeSmall2, ageOfBronzeSmall3],
  "je-suis-belle": [jeSuisBelle1, jeSuisBelle2, jeSuisBelle3],
  "bust-of-jean-daire": [bustOfJeanDaire1, bustOfJeanDaire2, bustOfJeanDaire3],
}
