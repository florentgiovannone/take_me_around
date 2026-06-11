import theSecret1 from "./the-secret-1.jpg"
import mainCrispeeDroite1 from "./main-crispee-droite-1.jpg"
import ageOfBronzeSmall1 from "./age-of-bronze-small-1.jpg"
import ageOfBronze1 from "./age-of-bronze-1.jpg"
import danaide1 from "./danaide-1.jpg"
import jeSuisBelle1 from "./je-suis-belle-1.jpg"
import bustOfJeanDaire1 from "./bust-of-jean-daire-1.jpg"
import seatedTitan1 from "./seated-titan-1.jpg"
import titanIv1 from "./titan-iv-1.jpg"
import abductionOfHippodamia1 from "./abduction-of-hippodamia-1.jpg"
import minotaur1 from "./minotaur-1.jpg"
import camilleClaudelBonnet1 from "./camille-claudel-bonnet-1.jpg"
import mmeRodin1 from "./mme-rodin-1.jpg"
import maskOfHanako1 from "./mask-of-hanako-1.jpg"
import headOfLust1 from "./head-of-lust-1.jpg"
import maskBrokenNose1 from "./mask-broken-nose-1.jpg"
import torsoGreatShadow1 from "./torso-great-shadow-1.jpg"
import headJeanDeFiennes1 from "./head-jean-de-fiennes-1.jpg"
import headPierreDeWiessant1 from "./head-pierre-de-wiessant-1.jpg"
import headEustacheDeSaintPierre1 from "./head-eustache-de-saint-pierre-1.jpg"
import eveSmallModel1 from "./eve-small-model-1.jpg"
import meditation1 from "./meditation-1.jpg"
import triumphantYouth1 from "./triumphant-youth-1.jpg"
import irisStudyWithHead1 from "./iris-study-with-head-1.jpg"
import fallingMan1 from "./falling-man-1.jpg"
import monumentalTorso1 from "./monumental-torso-1.jpg"
import eternalSpringFirstState1 from "./eternal-spring-first-state-1.jpg"
import theKiss3rdReduction1 from "./the-kiss-3rd-reduction-1.jpg"
import deathOfAdonis1 from "./death-of-adonis-1.jpg"
import jardiniereOfTheTitans1 from "./jardiniere-of-the-titans-1.jpg"
import eternalIdolSmallModel1 from "./eternal-idol-small-model-1.jpg"

/** Artwork slug → single hero image. */
export const RODIN_IMAGES: Partial<Record<string, string>> = {}

/** Artwork slug → gallery row (shown side by side). */
export const RODIN_IMAGE_GALLERIES: Partial<Record<string, string[]>> = {
  "the-secret": [theSecret1],
  "main-crispee-droite": [mainCrispeeDroite1],
  "age-of-bronze-small": [ageOfBronzeSmall1],
  "age-of-bronze": [ageOfBronze1],
  danaide: [danaide1],
  "je-suis-belle": [jeSuisBelle1],
  "bust-of-jean-daire": [bustOfJeanDaire1],
  "seated-titan": [seatedTitan1],
  "titan-iv": [titanIv1],
  "abduction-of-hippodamia": [abductionOfHippodamia1],
  minotaur: [minotaur1],
  "camille-claudel-bonnet": [camilleClaudelBonnet1],
  "mme-rodin": [mmeRodin1],
  "mask-of-hanako": [maskOfHanako1],
  "head-of-lust": [headOfLust1],
  "mask-broken-nose": [maskBrokenNose1],
  "torso-great-shadow": [torsoGreatShadow1],
  "head-jean-de-fiennes": [headJeanDeFiennes1],
  "head-pierre-de-wiessant": [headPierreDeWiessant1],
  "head-eustache-de-saint-pierre": [headEustacheDeSaintPierre1],
  "eve-small-model": [eveSmallModel1],
  meditation: [meditation1],
  "triumphant-youth": [triumphantYouth1],
  "iris-study-with-head": [irisStudyWithHead1],
  "falling-man": [fallingMan1],
  "monumental-torso": [monumentalTorso1],
  "eternal-spring-first-state": [eternalSpringFirstState1],
  "the-kiss-3rd-reduction": [theKiss3rdReduction1],
  "death-of-adonis": [deathOfAdonis1],
  "jardiniere-of-the-titans": [jardiniereOfTheTitans1],
  "eternal-idol-small-model": [eternalIdolSmallModel1],
}
