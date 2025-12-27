import { UnlockId } from './unlocks'

export function hasUnlock(
  unlocks: string[],
  unlock: UnlockId
): boolean {
  return unlocks.includes(unlock)
}