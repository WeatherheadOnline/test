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

        {/* <div id="menu-wrapper">
            <div id="hamburger">
                <img src="../../assets/hamburger.png" />
            </div>
            <div id="menu">
                <span id="closeMenu">&times;</span>
                <a href="#Home"><h4>Home</h4></a>
                <a href="#About"><h4>About</h4></a>
                <a href="#Effects"><h4>Special Effects</h4></a>
                <a href="#Portfolio"><h4>Portfolio</h4></a>
                <a href="#Contact"><h4>Contact</h4></a>
            </div>
        </div>
        <p></p> */}
    </header>
  )
}