"use client";

import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
import Link from "next/link";
import LogoutButton from "../LogoutButton/LogoutButton";
import "./header.css";
import { useUser } from '@/providers/UserProvider'

export default function Header() {
  const { user, loading } = useUser()

  if (loading) {
    return <header style={{ height: 64 }} />
  }

  return (
    <header>
      <div id="logo">
        <Link className="navlink" id="homeLink" href="/">
          <img src="../../assets/01_logo.svg" />
        </Link>
      </div>

      <nav>
        <Link className="navlink" href="/dashboard">
          Dashboard
        </Link>
        <Link className="navlink" href="/">
          Home
        </Link>
        {user && <LogoutButton />}
      </nav>
    </header>
  );
}