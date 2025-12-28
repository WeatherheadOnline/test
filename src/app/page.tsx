'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Landing from '@/components/Homepage/Landing/Landing'
import What from '@/components/Homepage/What/What'
import Feed from '@/components/Feed/Feed'

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('Supabase session:', data.session)
    })
  }, [])

  return (
    <main>
      <Landing />
      <What />
      <Feed />
    </main>
  )
}