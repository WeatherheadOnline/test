"use client";

import { useEffect, useState } from "react";
import LoginForm from "@/components/LoginForm/LoginForm";
import { useUser } from "@/providers/UserProvider";
import "./landing.css";

export default function Landing() {
  const { user, profile, loading } = useUser();

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

        {!loading && user && (
          <h2>
  Welcome
  {profile?.display_name ? ` ${profile.display_name}` : ""}
</h2>
        )}

        {!loading && !user && <LoginForm />}
      </div>
    </section>
  );
}
