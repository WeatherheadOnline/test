'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()

    // ✅ redirect to homepage
    router.push('/')
  }

  return (
    <button onClick={handleLogout}>
      Log out
    </button>
  )
}