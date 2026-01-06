"use client";

import { useEffect, useRef, useState } from "react";
import { useHeaderConfig } from "@/providers/HeaderConfigProvider";
import LoginForm from "@/components/LoginForm/LoginForm";
import { useUser } from "@/providers/UserProvider";
import "./landing.css";

export default function Landing() {
  const { user, profile, userReady } = useUser();
  const loginInputRef = useRef<HTMLInputElement>(null);
  const { setConfig, focusLoginOnMount, setFocusLoginOnMount } =
  useHeaderConfig();

useEffect(() => {
  setConfig({

onLoginClick: () => {
  window.scrollTo({ top: 0, behavior: "smooth" });

  const focusAfterScroll = () => {
    if (loginInputRef.current) {
      loginInputRef.current.focus();
    } else {
      requestAnimationFrame(focusAfterScroll);
    }
  };

  // Let the smooth scroll begin before focusing
  setTimeout(focusAfterScroll, 200);
},

    onHomeClick: () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  return () => setConfig({});
}, [setConfig, focusLoginOnMount, setFocusLoginOnMount]);

useEffect(() => {
  if (!focusLoginOnMount) return;

  const tryFocus = () => {
    if (loginInputRef.current) {
      loginInputRef.current.focus();
      setFocusLoginOnMount(false); // consume intent
    } else {
      requestAnimationFrame(tryFocus);
    }
  };

  tryFocus();
}, [focusLoginOnMount, setFocusLoginOnMount]);

  return (
    <section className="page-section landing-section">
      <div className="landing-left-side">
        <p aria-hidden="true">
          11100010101000100101110010111010100101111110001010100010010111001011101010010111111000101010001001011100101110101001011111100010101000100101110010111010100101111110001010100010010111001011101010010111
        </p>
        <div className="text-pattern-overlay"></div>
      </div>

      <div className="landing-right-side">
        <div className="text-align-center">
          <p className="landing-tagline">
            <span>Are you sick of</span>
            <span>social media?</span>
          </p>
          <h1>
            <span>Just</span>
            <span>A</span>
            <span>Bit</span>
          </h1>
          <p className="landing-tagline">
            <span>Post a zero or a one.</span>
            <span>Then you're done.</span>
          </p>
        </div>

        {userReady && user && (
          <h2>
            Welcome
            {profile?.display_name ? ` ${profile.display_name}` : ""}
          </h2>
        )}

        {userReady && !user && <LoginForm ref={loginInputRef} />}
      </div>
    </section>
  );
}
