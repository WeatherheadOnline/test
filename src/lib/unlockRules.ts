import { UNLOCKS, UnlockId } from './unlocks'

type UnlockRule = {
  flipsRequired: number
  unlocks: UnlockId[]
}

export const UNLOCK_RULES: UnlockRule[] = [
  {
    flipsRequired: 4,
    unlocks: [UNLOCKS.FILL_GRADIENT],
  },
  {
    flipsRequired: 8,
    unlocks: [UNLOCKS.FILL_STRIPES],
  },
  {
    flipsRequired: 16,
    unlocks: [UNLOCKS.FILL_COLOURS_PACK_1],
  },
  {
    flipsRequired: 32,
    unlocks: [UNLOCKS.FILL_PATTERNS_PACK_1],
  },
]