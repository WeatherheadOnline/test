'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import './loginForm.css'

export default function LoginForm() {
  const router = useRouter()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: identifier.trim(),
        password,
      }),
    })

    const result = await res.json()

    if (!res.ok || !result.ok) {
      setError(result.error ?? 'Login failed')
      setLoading(false)
      return
    }

    // ✅ Login successful
    router.push('/dashboard')
  } catch (err) {
    console.log(err)
    setError('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="login-form-wrapper">
      <h2>Log in</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
      <input
        type="text"
        placeholder="Username or email"
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
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
          Log in
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

    </div>
  )
}