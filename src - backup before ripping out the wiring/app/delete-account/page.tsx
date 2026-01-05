"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/providers/UserProvider";
import "@/styles/globals.css";
import "./delete-account.css";
import RedirectToGate from "@/components/RedirectToGate";

export default function DeleteAccountPage() {
  const { user, userReady } = useUser();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

if (!userReady) {
  return null; // or a loading skeleton
}

if (!user) {
  return <RedirectToGate />;
}

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("DELETE SUBMIT FIRED");
    setError(null);
    setSubmitting(true);

    try {
      // 1 Re-authenticate
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password,
      });

      if (authError) {
        setError("Incorrect password");
        setSubmitting(false);
        return;
      }

      // 2️ Call secure API route
      const res = await fetch("/api/delete-account", {
        method: "POST",
        credentials: "include", //  REQUIRED
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      // 3️ Sign out + redirect
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main>
      <section className="page-section">
        <div className="section-wrapper">
          <h2>&#9888; Danger zone &#9888;</h2>

          <form onSubmit={handleDeleteAccount}>
            <div>
              <p>Are you sure you want to delete your account?</p>
              <p>This action cannot be undone.</p>
              <p>
                Your account and all associated data will be permanently
                deleted. You will be logged out immediately.
              </p>
            </div>

            <label className="sr-only" htmlFor="confirm-pw-to-delete-account">
              Confirm your password
            </label>
            <input
              id="confirm-pw-to-delete-account"
              type="password"
              placeholder="Confirm your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error">{error}</p>}

            <div className="button-row">
              <Link className="navlink" href="/settings">
                Cancel
              </Link>

              <button type="submit" className="danger" disabled={submitting}>
                ⚠ Delete my account
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}