'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import LogoutButton from '../LogoutButton/LogoutButton'
import './header.css'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <header>
      <div id="logo">
        <a className="navlink" id="homeLink" href="/">
          <img src="../../assets/01_logo.svg" />
        </a>
      </div>


<nav>
  <Link className="navlink" href="/dashboard">Dashboard</Link>
  <Link className="navlink" href="/">Home</Link>
        {/* Only this depends on auth */}
  {loggedIn && <LogoutButton />}
</nav>
    </header>
  )
}