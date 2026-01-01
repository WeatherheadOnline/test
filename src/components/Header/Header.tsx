"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "../LogoutButton/LogoutButton";
import "./header.css";
import { useUser } from "@/providers/UserProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHeaderConfig } from "@/providers/HeaderConfigProvider";

export default function Header() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { config, setFocusLoginOnMount } = useHeaderConfig();
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
        <button
          className="navlink"
          onClick={() => {
            if (config.onHomeClick) {
              config.onHomeClick();
            } else {
              router.push("/");
            }
          }}
        >
          Home
        </button>

        {user && <LogoutButton />}

        {!user && (
          <button
            onClick={() => {
              if (config.onLoginClick) {
                // Already on homepage → scroll + focus immediately
                config.onLoginClick();
              } else {
                // Not on homepage → set intent, then navigate
                setFocusLoginOnMount(true);
                router.push("/");
              }
            }}
          >
            Log in
          </button>
        )}

        {!user && (
          <Link className="navlink" href="/signup">
            Sign up
          </Link>
        )}
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
      </nav>
    </header>
  );
}
