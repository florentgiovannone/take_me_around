export function scanSessionKey(publicId: string): string {
  return `tma-safe-pet-scan-session:${publicId}`
}

export function hasRecordedScanThisSession(
  storage: Storage,
  publicId: string
): boolean {
  return storage.getItem(scanSessionKey(publicId)) === "1"
}

export function markScanRecordedThisSession(
  storage: Storage,
  publicId: string
): void {
  storage.setItem(scanSessionKey(publicId), "1")
}
