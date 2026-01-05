import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json()

    if (!identifier || !password) {
      return NextResponse.json(
        { ok: false, error: 'Missing credentials' },
        { status: 400 }
      )
    }

    const rawIdentifier = identifier.trim()

    let email: string

    // 🔐 Admin client (lookup only)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (isEmail(rawIdentifier)) {
      // Email login
      email = rawIdentifier
    } else {
      // Username login (canonicalized)
      const canonicalUsername = rawIdentifier.toLowerCase()

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('username', canonicalUsername)
        .single()

      if (error || !profile) {
        return NextResponse.json(
          { ok: false, error: 'Invalid username or password' },
          { status: 401 }
        )
      }

      const { data: userData, error: userError } =
        await supabaseAdmin.auth.admin.getUserById(profile.id)

      if (userError || !userData.user?.email) {
        return NextResponse.json(
          { ok: false, error: 'Invalid username or password' },
          { status: 401 }
        )
      }

      email = userData.user.email
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // 🎉 Session cookies are now set
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('LOGIN ERROR:', err)
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 }
    )
  }
}