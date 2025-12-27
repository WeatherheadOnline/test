import { LocalProfile } from '@/types/profile'
import { defaultAppearance } from '@/lib/defaultAppearance'

const STORAGE_KEY = 'justabit-profile'

export const loadProfile = (): LocalProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        status: false,
        flipCount: 0,
        appearance: defaultAppearance,
        unlocks: [],
      }
    }
    return JSON.parse(raw)
  } catch {
    return {
      status: false,
      flipCount: 0,
      appearance: defaultAppearance,
      unlocks: [],
    }
  }
}

export const saveProfile = (profile: LocalProfile) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}