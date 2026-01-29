"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import "@/styles/globals.css";
import "./settings.css";
import RedirectToGate from "@/components/RedirectToGate";

export default function Settings() {
  const { user, profile, userReady } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!userReady) {
    return null; // or a loading skeleton if you want
  }

  if (!user) {
    return <RedirectToGate />;
  }

  const handleNewEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!newEmail) {
        setError("Please enter a new email address");
        return;
      }

      await reauthenticate();

      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      setSuccess(
        "Email update requested. Check your new email to confirm the change.",
      );
      setNewEmail("");
      setCurrentPassword("");
    } catch (err: any) {
      setError(err.message ?? "Failed to update email");
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match");
        return;
      }

      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      await reauthenticate();

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccess("Password updated successfully");
      setNewPassword("");
      setConfirmNewPassword("");
      setCurrentPassword("");
    } catch (err: any) {
      setError(err.message ?? "Failed to update password");
    }
  };

  const reauthenticate = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (error) {
      throw new Error("Incorrect password");
    }
  };

  return (
    <main>
      <section className="page-section">
        <div className="section-wrapper">
          <h2>Settings page</h2>
          {profile?.display_name ? (
            <>
              <p>for {profile.display_name}</p>
            </>
          ) : (
            ""
          )}

          <form>
            <fieldset>
              <h2 className="settings-h">Current Password</h2>
              <label htmlFor="current-password-input">
                To update your password or email address, enter your current password.
              </label>
              <input
                id="current-password-input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </fieldset>

            <fieldset>
              <h2 className="settings-h">Update Email</h2>

              <label>
                New email
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </label>

              <button
                type="button"
                onClick={handleNewEmail}
                disabled={currentPassword.length === 0}
              >
                Update email
              </button>
            </fieldset>

            <fieldset>
              <h2 className="settings-h">Password</h2>

              <label>
                New password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </label>

              <label>
                Re-enter new password
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </label>

              <button
                type="button"
                onClick={handleNewPassword}
                disabled={currentPassword.length === 0}
              >
                Update password
              </button>
            </fieldset>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <Link className="navlink faux-button" href="/dashboard">
              ← Back to bitsness
            </Link>

            <fieldset>
              <h2 className="settings-h">⚠ Danger zone ⚠</h2>

              <Link
                className="navlink danger faux-button"
                href="/delete-account"
              >
                Delete my account
              </Link>
            </fieldset>
          </form>
        </div>
      </section>
      <div className="modal"></div>
    </main>
  );
}
