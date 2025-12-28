'use client'

import React from 'react'
import { supabase } from '@/lib/supabase'

export default function LogoutButton() {
    const logoutFunction = () => {
        async () => {
            await supabase.auth.signOut()
            window.location.href = '/'
        }
    }
  return (
    <button onClick={logoutFunction}>
        Log out
    </button>
    )
}