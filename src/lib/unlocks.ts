export type UnlockRule = {
  at: number
  key: string
}

export const UNLOCK_RULES: UnlockRule[] = [
  { at: 4, key: 'fill.gradient' },
  { at: 8, key: 'fill.stripes' },
  { at: 16, key: 'fill.colours.pack1' },
  { at: 32, key: 'fill.patterns.pack1' },
]

export function computeUnlocks(
  flipCount: number,
  existing: string[] = []
): string[] {
  const next = new Set(existing)

  for (const rule of UNLOCK_RULES) {
    if (flipCount >= rule.at) {
      next.add(rule.key)
    }
  }

  if (flipCount >= 32) {
    const cycles = Math.floor((flipCount - 32) / 32)
    if (cycles >= 0) {
      next.add('cycles.' + cycles)
    }
  }

  return Array.from(next)
}