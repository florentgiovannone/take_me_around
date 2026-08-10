import { SAFE_PET_HOST } from "./eventContext"
import type { PetEvent, PetProfile } from "./types"

export const DEMO_OWNER_ACCOUNT_ID = "demo-owner"
export const DEMO_PET_PUBLIC_ID = "demo-mochi"
export const DEMO_PET_ID = "pet-mochi"
export const DEMO_SEED_SCAN_ID = "seed-scan-mochi-1"

export const DEMO_PETS: PetProfile[] = [
  {
    id: DEMO_PET_ID,
    publicId: DEMO_PET_PUBLIC_ID,
    name: "Mochi",
    species: "dog",
    breed: "Scottish Terrier",
    ownerName: "Alex Rivera",
    contactNumber: "+44 7700 900123",
    personality:
      "Wary of strangers and men in particular. Startled by fluorescent clothing. Do not leave alone with young children. Approach slowly, speak softly, and let Mochi come to you.",
    allergies: "Chicken; avoid treats containing poultry.",
    vetContact: "Greenfield Vets\n+44 1234 567890\n14 High Street",
    photoUrl: "/images/scottie.png", // locked: Scottie brand art for demo pet Mochi
    ownerAccountId: DEMO_OWNER_ACCOUNT_ID,
  },
]

/** One seeded scan so the owner dashboard is not empty on first load. */
export const DEMO_SEED_SCAN: PetEvent = {
  id: DEMO_SEED_SCAN_ID,
  petId: DEMO_PET_ID,
  publicId: DEMO_PET_PUBLIC_ID,
  type: "scan",
  createdAt: "2026-08-07T14:32:18.000Z",
  source: "page_view",
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  device: "mobile",
  language: "English",
  pageUrl: `https://${SAFE_PET_HOST}/pet/${DEMO_PET_PUBLIC_ID}`,
  referrer: "https://takemearound.com/",
  sessionId: "sar-demo-a1b2c3d4",
  tagUid: "04:A1:B2:C3:D4:E5:F6",
  ipAddress: "82.132.214.55",
}
