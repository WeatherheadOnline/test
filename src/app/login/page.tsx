'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import LogoutButton from '@/components/LogoutButton/LogoutButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else alert('Check your email for confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else alert('Logged in successfully!')
    }

    setLoading(false)
  }

  return (
    <main style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => setIsSignUp(!isSignUp)} style={{ marginTop: '1rem' }}>
        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </button>
      <button
        onClick={async () => {
          await supabase.auth.signOut()
          alert("Logged out")
        }}
      >
        Log out

      </button>
    </main>
  )
}