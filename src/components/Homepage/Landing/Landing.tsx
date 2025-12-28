"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import LoginForm from "@/components/LoginForm/LoginForm";
import "./landing.css";

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        setLoggedIn(false);
        setUsername(null);
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (!mounted) return;

      if (!error && data) {
        setUsername(data.username);
      }

      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

        {!loading && loggedIn && username && <h2>Welcome {username}</h2>}
        {loggedIn && !username && <h2>Welcome</h2>}
        {!loggedIn && <LoginForm />}
      </div>
    </section>
  );
}
