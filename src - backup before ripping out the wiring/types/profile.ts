import { Appearance } from './appearance'
import { UnlockId } from '@/lib/unlocks'

export type LocalProfile = {
  status: boolean
  flipCount: number
  appearance: Appearance
  unlocks: UnlockId[]
}