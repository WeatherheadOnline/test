"use client";

import Link from "next/link";
import "./settings.css";

export default function Settings() {
  const handleNewEmail = (e) => {
    e.preventDefault();
    alert("Button clicked: new email");
  };
  const handleNewPassword = (e) => {
    e.preventDefault();
    alert("Button clicked: new password");
  };

  return (
    <main>
      <section className="page-section">
        <div className="section-wrapper">
          <h2>Settings page</h2>

          <form>
            <fieldset>
              <h2 className="settings-h">Account</h2>
              <label>
                Confirm password:
                <input type="password"></input>
              </label>
              <label>
                New email:
                <input type="email"></input>
              </label>
              <button onClick={handleNewEmail}>Update email</button>
            </fieldset>

            <fieldset>
              <h2 className="settings-h">Security</h2>
              <label>
                Current password:
                <input type="password"></input>
              </label>
              <label>
                New password:
                <input type="password"></input>
              </label>
              <label>
                Re-enter new password:
                <input type="password"></input>
              </label>
              <button onClick={handleNewPassword}>Update password</button>
            </fieldset>

            <button>
              <Link className="navlink" href="/dashboard">
                Back to bitsness
              </Link>
            </button>

            <fieldset>
              <h2 className="settings-h">&#9888; Danger zone &#9888;</h2>

              <button>
                <Link className="navlink" href="/delete-account">
                  &#9888; Delete my account &#9888;
                </Link>
              </button>
            </fieldset>
          </form>
        </div>
      </section>
      <div className="modal"></div>
    </main>
  );
}
