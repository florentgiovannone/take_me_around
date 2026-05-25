export const ZERO_BAR_HEIGHT = "8px"
/** Minimum height for any day with taps — must stay above ZERO_BAR_HEIGHT. */
export const SINGLE_BAR_MIN_HEIGHT = "18px"
export const SINGLE_BAR_HEIGHT_PERCENT = 18

export function getBarHeight(count: number, maxCount: number) {
  if (count === 0) {
    return { height: ZERO_BAR_HEIGHT, isZero: true }
  }

  if (maxCount <= 1) {
    return { height: SINGLE_BAR_MIN_HEIGHT, isZero: false }
  }

  const scaled =
    SINGLE_BAR_HEIGHT_PERCENT +
    ((count - 1) / (maxCount - 1)) * (100 - SINGLE_BAR_HEIGHT_PERCENT)

  return { height: `max(${SINGLE_BAR_MIN_HEIGHT}, ${scaled}%)`, isZero: false }
}
