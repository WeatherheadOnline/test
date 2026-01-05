/**
 * Each entry represents:
 * - when it unlocks (flipsRequired)
 * - what it unlocks (ids)
 */
export const UNLOCK_DEFINITIONS = [
 {
    flipsRequired: 4,
    ids: ['fill:gradient', 'fill:stripes'],
  },
  {
    flipsRequired: 8,
    ids: ["shadow:colors:pack1"],
  },
  {
    flipsRequired: 16,
    ids: ['shadow:hard', 'shadow:grounded'],
  },
  {
    flipsRequired: 32,
    ids: ['fill:patterns:pack1', 'border:thin', 'border:medium', 'border:thick'],
  },
] as const

/**
 * Union of all possible unlock IDs
 */
export type UnlockId =
  (typeof UNLOCK_DEFINITIONS)[number]['ids'][number]

/**
 * Returns all unlocks earned at a given flip count
 */
export const getUnlocksForFlipCount = (
  flipCount: number,
  existing: UnlockId[] = []
): UnlockId[] => {
  const unlocked = new Set<UnlockId>(existing)

  for (const rule of UNLOCK_DEFINITIONS) {
    if (flipCount >= rule.flipsRequired) {
      rule.ids.forEach(id => unlocked.add(id))
    }
  }

  return Array.from(unlocked)
}