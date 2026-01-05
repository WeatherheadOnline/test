'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LOGGING_OUT_KEY } from "@/lib/authFlags";

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    sessionStorage.setItem(LOGGING_OUT_KEY, "true");
    router.replace("/");
    await supabase.auth.signOut();
  };

  return (
    <button onClick={handleLogout}>
      Log out
    </button>
  )
}