"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import LogoutButton from "../LogoutButton/LogoutButton";
import "./header.css";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
const [ready, setReady] = useState(false)

//   useEffect(() => {
//     // Initial session check
//     supabase.auth.getUser().then(({ data }) => {
//       setLoggedIn(!!data.session);
//     });

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setLoggedIn(!!session);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

useEffect(() => {
  let mounted = true

  const init = async () => {
    // 1️⃣ Wait for Supabase to rehydrate session
    const { data } = await supabase.auth.getUser()

    if (!mounted) return

    setLoggedIn(!!data.user)
    setReady(true)
  }

  init()

  // 2️⃣ Listen for future auth changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setLoggedIn(!!session?.user)
  })

  return () => {
    mounted = false
    subscription.unsubscribe()
  }
}, [])

  useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setLoggedIn(!!data.user)
    setReady(true)
  })
}, [])

// if (!ready) return null
if (!ready) {
  return <header style={{ height: 64 }} />
}

  return (
    <header>
      <div id="logo">
        <a className="navlink" id="homeLink" href="/">
          <img src="../../assets/01_logo.svg" />
        </a>
      </div>

      <nav>
        <Link className="navlink" href="/dashboard">
          Dashboard
        </Link>
        <Link className="navlink" href="/">
          Home
        </Link>
        {/* Only this depends on auth */}
        {loggedIn && <LogoutButton />}
      </nav>
    </header>
  );
}