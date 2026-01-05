"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./signup.css";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/providers/UserProvider";
import SignupForm from "@/components/SignupForm/SignupForm";
import RedirectToGate from "@/components/RedirectToGate";

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const { user, authLoading } = useUser();

if (authLoading) {
  return (
    <main role="main">
      <p>Loading…</p>
    </main>
  );
}

  if (user) {
    return <RedirectToGate />;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    //  Preserve user-preferred username case
    const rawUsername = username.trim();
    const normalizedUsername = rawUsername.toLowerCase();
    const displayName = rawUsername;

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

      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: authData.user.id,
        username: normalizedUsername, // canonical (lowercase)
        display_name: displayName, // STORE PREFERRED CASE
      },
      { onConflict: "id" }
    );

    if (profileError) {
      // UNIQUE violation (username taken)
      if (profileError.code === "23505") {
        setError("That username is taken");
      } else {
        setError("Failed to create profile");
      }

      // Clean up auth session
      await supabase.auth.signOut();
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    // success — auth + profile created
    router.push("/dashboard");
    //   Later, change push('/dashboard') to this:
    // if (!authData.session) {
    //   router.push('/check-your-email')
    //   return
    // }
  };

  return (
    <main>
      <SignupForm
        email={email}
        username={username}
        password={password}
        confirmPassword={confirmPassword}
        error={error}
        isLoading={isLoading}
        onEmailChange={setEmail}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handleSignup}
        onCancel={() => router.push("/")}
      />
    </main>
  );
}