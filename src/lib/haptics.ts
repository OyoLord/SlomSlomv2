export function vibrate(pattern: number | number[]) {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      // @ts-ignore
      navigator.vibrate(pattern)
    }
  } catch (e) {
    // silent fallback
  }
}
