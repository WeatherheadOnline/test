"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "../LogoutButton/LogoutButton";
import "./header.css";
import { useUser } from "@/providers/UserProvider";
import Image from "next/image";

export default function Header() {
  const { user, loading } = useUser();

  if (loading) {
    return <header style={{ height: 64 }} />;
  }

  return (
    <header>
      <div id="logo">
        <Link className="navlink" id="homeLink" href="/">
          <Image src="/assets/01_logo.svg" alt="Logo" width={40} height={40} />
          {/* alternatively: */}
          {/* <img src="/assets/01_logo.svg" /> */}
        </Link>
      </div>

      <nav>
        {user && (
          <Link className="navlink" href="/dashboard">
            Dashboard
          </Link>
        )}
        {user && (
          <Link className="navlink" href="/settings">
            Settings
          </Link>
        )}
        <Link className="navlink" href="/">
          Home
        </Link>
        {user && <LogoutButton />}
        {!user && (
          <Link className="navlink" href="/signup">
            Sign up
          </Link>
        )}
        {/* Button should switch focus to the login form on the homepage. It should scroll and/or navigate to the top of the homepage if the user isn't already there. */}
        {!user && <button>Log in</button>}
      </nav>
    </header>
  );
}