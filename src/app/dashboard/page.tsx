'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import BitDisplay from '@/components/BitDisplay'
import Section from '@/components/Section'
import { Appearance } from '@/types/appearance'
import { defaultAppearance } from '@/lib/defaultAppearance'
import CustomiseMenu from '@/components/CustomiseMenu'

export default function DashboardPage() {
    const [status, setStatus] = useState<boolean | null>(null)
    const [flipCount, setFlipCount] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [appearance, setAppearance] = useState<Appearance>(defaultAppearance)

    const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const reloadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('status, flip_count, appearance')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        setStatus(data.status)
        setFlipCount(data.flip_count)
        setAppearance({
          ...defaultAppearance,
          ...data.appearance,
        })
      }
    }


  useEffect(() => {
    reloadProfile().finally(() => setLoading(false))
  }, [])


  if (loading) return <p>Loading…</p>
  if (status === null) return <p>Not logged in</p>



  const handleFlip = () => {
  if (status === null || saving) return

  // optimistic UI update
  setStatus(prev => !prev)
  setFlipCount(prev => prev + 1)

  // debounce backend write
  if (flipTimeoutRef.current) {
    clearTimeout(flipTimeoutRef.current)
  }

  flipTimeoutRef.current = setTimeout(async () => {
    setSaving(true)

    const { data, error } = await supabase.rpc('flip_bit')

    if (error || !data || data.length === 0) {
      console.error(error)
      await reloadProfile() // rollback
    } else {
      // reconcile with authoritative values
      setStatus(data[0].status)
      setFlipCount(data[0].flip_count)
    }

    setSaving(false)
  }, 400)
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
        disabled={saving}
        aria-pressed={status}
        style={{
        padding: '1rem 2rem',
        fontSize: '1.25rem',
        marginTop: '2rem',
        }}
    >
        Flip bit
    </button>
    
    <CustomiseMenu
      appearance={appearance}
      onChange={setAppearance}
    />

    <p aria-live="polite" style={{ marginTop: '1rem' }}>
        Flipped <strong>{flipCount}</strong> times
    </p>
    </Section>
  </main>
)
}