"use client";

import Link from "next/link";
import "@/styles/globals.css";
import "./delete-account.css";

export default function Settings() {
  const handleDeleteAccount = (e) => {
    e.preventDefault();
  };
  const handleCancel = (e) => {
    e.preventDefault();
  };

  return (
    <main>
      <section className="page-section">
        <div className="section-wrapper">
          <h2>&#9888; Danger zone &#9888;</h2>

          <form>
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
            ></input>

            <button onClick={handleCancel}>
              <Link className="navlink" href="/settings">
                Cancel
              </Link>
            </button>

            <button onClick={handleDeleteAccount}>
              <Link className="navlink" href="/">
                &#9888; Delete my account
              </Link>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
