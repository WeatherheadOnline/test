'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const loadStatus = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            setLoading(false)
            return
        }

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


      setLoading(false)
    }

    loadStatus()
  }, [])

  if (loading) return <p>Loading…</p>
  if (status === null) return <p>Not logged in</p>

const handleFlip = async () => {
  if (status === null || saving) return

  const nextStatus = !status
  const nextFlipCount = flipCount + 1

  // Optimistic UI update
  setStatus(nextStatus)
  setFlipCount(nextFlipCount)
  setSaving(true)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase
    .from('profiles')
    .update({
      status: nextStatus,
      flip_count: nextFlipCount,
    })
    .eq('id', user.id)

  if (error) {
    // rollback on failure
    setStatus(status)
    setFlipCount(flipCount)
    console.error(error)
  }

  setSaving(false)
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