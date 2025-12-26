'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('Supabase session:', data.session)
    })
  }, [])

  return (
    <main>
      <h1>onebit</h1>
      <p>Check the console</p>
    </main>
  )
}