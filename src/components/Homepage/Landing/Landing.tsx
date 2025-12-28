'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import LoginForm from '@/components/LoginComponent/LoginComponent'
import './landing.css'

export default function Landing() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    // React to login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <section className="page-section landing-section">
      <div className="landing-left-side">
        <p aria-hidden='true'>11100010101000100101110010111010100101111110001010100010010111001011101010010111111000101010001001011100101110101001011111100010101000100101110010111010100101111110001010100010010111001011101010010111</p>
        <div className="text-pattern-overlay"></div>
      </div>

      <div className="landing-right-side">
        <div className='text-align-center'>
          <p className="landing-tagline">
            <span>Are you sick of</span><span>social media?</span>
          </p>
          <h1><span>Just</span><span>A</span><span>Bit</span></h1>
          <p className="landing-tagline">
            <span>Post a zero or a one.</span><span>Then you're done.</span>
          </p>
        </div>

{user ? (
        <div>
          <p>You are logged in as <span>{user.email}</span></p>
        </div>
      ) : (
        <LoginForm />
      )}

        {/* {!loggedIn && <LoginForm />} */}
      </div>
    </section>
  )
}