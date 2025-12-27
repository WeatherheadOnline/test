import { Appearance } from './appearance'

export type LocalProfile = {
  status: boolean
  flipCount: number
  appearance: Appearance
  unlocks: string[]
}