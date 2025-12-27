'use client'

import { useEffect, useState, useRef } from 'react'
import BitDisplay from '@/components/BitDisplay'
import Section from '@/components/Section'
import { Appearance } from '@/types/appearance'
import { defaultAppearance } from '@/lib/defaultAppearance'
import CustomiseMenu from '@/components/CustomiseMenu'
import { loadProfile, saveProfile } from '@/lib/localProfile'

export default function DashboardPage() {
const [status, setStatus] = useState<boolean>(false)
const [flipCount, setFlipCount] = useState<number>(0)
const [appearance, setAppearance] = useState<Appearance>(defaultAppearance)

const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [flipPending, setFlipPending] = useState(false)

    const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const appearanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)


    
    const reloadProfile = () => {
  const profile = loadProfile()

  setStatus(profile.status)
  setFlipCount(profile.flipCount)
  setAppearance(profile.appearance)
}



const saveAppearanceDebounced = (nextAppearance: Appearance) => {
  if (appearanceTimeoutRef.current) {
    clearTimeout(appearanceTimeoutRef.current)
  }

  appearanceTimeoutRef.current = setTimeout(() => {
    const profile = loadProfile()

    saveProfile({
      ...profile,
      appearance: nextAppearance,
    })
  }, 400)
}

useEffect(() => {
  reloadProfile()
  setLoading(false)
}, [])


  if (loading) return <p>Loading…</p>
  if (status === null) return <p>Not logged in</p>




// Keep saving (for error handling / rollback)
// Stop using saving to disable the button
// Clear flipPending when the debounce fires, not when the RPC finishes
const handleFlip = () => {
  if (flipPending) return

  setFlipPending(true)

  // optimistic UI
  setStatus(prev => !prev)
  setFlipCount(prev => prev + 1)

  if (flipTimeoutRef.current) {
    clearTimeout(flipTimeoutRef.current)
  }

  flipTimeoutRef.current = setTimeout(() => {
    setFlipPending(false)
    setSaving(true)

    const profile = loadProfile()

    const nextFlipCount = profile.flipCount + 1

    const nextProfile = {
      ...profile,
      status: !profile.status,
      flipCount: nextFlipCount,
      appearance: profile.appearance,
    }

    saveProfile(nextProfile)

    // reconcile UI with persisted state
    setStatus(nextProfile.status)
    setFlipCount(nextProfile.flipCount)

    setSaving(false)
  }, 250)
}


const handleAppearanceChange = (next: Appearance) => {
  setAppearance(next)                 // optimistic
  saveAppearanceDebounced(next)       // persistent
}


//   The return statement

return (
  <main>
    <Section minHeight="100vh">
    <BitDisplay
    value={status ? '1' : '0'}
    appearance={appearance}
    />
    <button
      onClick={handleFlip}
      disabled={flipPending}
      aria-pressed={status}
      style={{
        padding: '1rem 2rem',
        fontSize: '1.25rem',
        marginTop: '2rem',
        opacity: flipPending ? 0.5 : 1,
      }}
    >
        Flip bit
    </button>

    <p className="flip-count-card" aria-live="polite" style={{ padding: '0.5rem', backgroundColor: '#E8E8E8', outline: `1px solid #555555`, position: 'absolute', left: '0', top: '5rem' }}>
        Flipped <strong>{flipCount}</strong> times
    </p>

    <CustomiseMenu
      appearance={appearance}
      onChange={handleAppearanceChange}
    />

    <p aria-live="polite" style={{ marginTop: '1rem' }}>
        Flipped <strong>{flipCount}</strong> times
    </p>
    </Section>
  </main>
)
}