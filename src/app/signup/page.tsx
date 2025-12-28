"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./signup.css";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }


//  Preserve user-preferred username case
    const rawUsername = username.trim()
    const normalizedUsername = rawUsername.toLowerCase()
    const displayName = rawUsername

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      const message = authError?.message?.toLowerCase() ?? "";

      if (message.includes("already")) {
        setError("That email is already registered");
      } else {
        setError(authError?.message ?? "Signup failed");
      }

      setLoading(false);
      return;
    }

    // 2. Create profile row
    // const { error: profileError } = await supabase
    //   .from("profiles")
    //   .update({
    //     id: authData.user.id,
    //     username: normalizedUsername,
    //     status: true,
    //     flip_count: 0,
    //     appearance: {},
    //     unlocks: [],
    //     accessories: {},
    //   })
    //   .eq("id", authData.user.id);

    const { error: profileError } = await supabase
  .from("profiles")
  .upsert(
    {
      id: authData.user.id,
      username: normalizedUsername,   // canonical (lowercase)
      display_name: displayName,      // 👈 STORE PREFERRED CASE
      status: true,
      flip_count: 0,
      appearance: {},
      unlocks: [],
      accessories: {},
    },
    { onConflict: "id" }
  );

    if (profileError) {
      // 🔴 UNIQUE violation (username taken)
      if (profileError.code === "23505") {
        setError("That username is taken");
      } else {
        setError("Failed to create profile");
      }

      // Clean up auth session
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    setLoading(false);
    // ✅ success — auth + profile created
    router.push("/dashboard");
    //   Later, change push('/dashboard') to this:
    // if (!authData.session) {
    //   router.push('/check-your-email')
    //   return
    // }
  };

  return (
    <main>
      <section className="page-section">
        <div className="section-wrapper">
          <h1>Sign up</h1>
          <form onSubmit={handleSignup}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Username
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            {error && <p className="error">{error}</p>}
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">Submit</button>
            <button onClick={() => (window.location.href = "../")}>
              Cancel
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
