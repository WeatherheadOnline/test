"use client";

import { useEffect, useState, useRef } from "react";
import BitDisplay from "@/components/BitDisplay/BitDisplay";
import Section from "@/components/Section";
import { Appearance } from "@/types/appearance";
import { defaultAppearance } from "@/lib/defaultAppearance";
import CustomiseMenu from "@/components/CustomiseMenu/CustomiseMenu";
import { loadProfile, saveProfile } from "@/lib/localProfile";
import { getUnlocksForFlipCount } from "@/lib/unlocks";
import UnlockToast from "@/components/UnlockToast";
import FlipToast from "@/components/FlipToast";
import "@/styles/globals.css";
import "./dashboard.css";

export default function DashboardPage() {
  // useState

  const [status, setStatus] = useState<boolean>(false);
  const [flipCount, setFlipCount] = useState<number>(0);
  const [appearance, setAppearance] = useState<Appearance>(defaultAppearance);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flipPending, setFlipPending] = useState(false);
  const [unlocks, setUnlocks] = useState<string[]>([]);
  const [unlockToasts, setUnlockToasts] = useState<string[]>([]);
  const [flipToastKey, setFlipToastKey] = useState<number | null>(null);

  // useRef

  const appearanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flipButtonRef = useRef<HTMLButtonElement | null>(null);

  const reloadProfile = () => {
    const profile = loadProfile();

    setStatus(profile.status);
    setFlipCount(profile.flipCount);
    setAppearance(profile.appearance);
    setUnlocks(profile.unlocks);
  };

  const profile = loadProfile();

  const saveAppearanceDebounced = (nextAppearance: Appearance) => {
    if (appearanceTimeoutRef.current) {
      clearTimeout(appearanceTimeoutRef.current);
    }

    appearanceTimeoutRef.current = setTimeout(() => {
      const profile = loadProfile();

      saveProfile({
        ...profile,
        appearance: nextAppearance,
      });
    }, 400);
  };

  useEffect(() => {
    reloadProfile();
    setLoading(false);
  }, []);

  useEffect(() => {
    const profile = loadProfile();

    if (
      appearance.fill.style === "gradient" &&
      !profile.unlocks.includes("fill:gradient")
    ) {
      setAppearance({
        ...appearance,
        fill: { ...appearance.fill, style: "solid" },
      });
    }
  }, []);

  useEffect(() => {
    if (flipToastKey === null) return;

    const t = setTimeout(() => {
      setFlipToastKey(null);
    }, 1500); // 500ms visible + 1000ms fade

    return () => clearTimeout(t);
  }, [flipToastKey]);

  if (loading) return <p>Loading…</p>;
  if (status === null) return <p>Not logged in</p>;

  const unlockIdToLabel = (id: string): string | null => {
    if (id.startsWith("fill:")) return "Fill";
    if (id.startsWith("border:")) return "Border";
    if (id.startsWith("shadow:")) return "Shadow";
    return null;
  };

  const handleFlip = () => {
    if (flipPending) return;

    // force-remount flip toast
    setFlipToastKey(Date.now());

    setFlipPending(true);

    // optimistic UI
    setStatus((prev) => !prev);
    setFlipCount((prev) => prev + 1);

    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
    }

    flipTimeoutRef.current = setTimeout(() => {
      setFlipPending(false);
      setSaving(true);

      const profile = loadProfile();

      const nextFlipCount = profile.flipCount + 1;

      const nextUnlocks = getUnlocksForFlipCount(
        nextFlipCount,
        profile.unlocks
      );

      const newlyUnlocked = nextUnlocks.filter(
        (id) => !profile.unlocks.includes(id)
      );

      if (newlyUnlocked.length > 0) {
        const labels = newlyUnlocked
          .map(unlockIdToLabel)
          .filter(Boolean) as string[];

        if (labels.length > 0) {
          setUnlockToasts((prev) => [...prev, ...labels]);

          setTimeout(() => {
            setUnlockToasts((prev) =>
              prev.filter((label) => !labels.includes(label))
            );
          }, 2000);
        }
      }

      const nextProfile = {
        ...profile,
        status: !profile.status,
        flipCount: nextFlipCount,
        appearance: profile.appearance,
        unlocks: nextUnlocks,
      };

      saveProfile(nextProfile);

      // reconcile UI with persisted state
      setStatus(nextProfile.status);
      setFlipCount(nextProfile.flipCount);
      setUnlocks(nextProfile.unlocks);

      setSaving(false);
    }, 250);
  };

  const handleAppearanceChange = (next: Appearance) => {
    setAppearance(next); // optimistic
    saveAppearanceDebounced(next); // persistent
  };

  //   The return statement

  return (
    <main>
      <section className='page-section'>

        {/* These things are outside the section-wrapper that constrains content width */}

        {/* Unlock toasts */}
        <div
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          {unlockToasts.map((label, i) => (
            <UnlockToast key={`${label}-${i}`} label={label} />
          ))}
        </div>

        {/* Flip toast */}
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          {flipToastKey !== null && <FlipToast key={flipToastKey} />}
        </div>

        {/* Flip count card */}

        <div className="flip-count-card" aria-live="polite">
          <p>
            <span>You have </span>
            <span>flipped:</span>
          </p>
          <p className="bit-count-binary">{flipCount.toString(2)}</p>
          <p className="bit-count-base10">({flipCount})</p>
          <p>bits</p>
        </div>


        {/* Here starts the section wrapper */}

        <div className="dashboard-container section-wrapper">

          <div className="bit-flip-wrapper">
            <BitDisplay value={status ? "1" : "0"} appearance={appearance} />
            {/* Flip switch: */}
            <button
              ref={flipButtonRef}
              type="button"
              role="switch"
              aria-checked={status}
              onClick={handleFlip}
              disabled={flipPending}
              style={{
                marginTop: "2rem",
                width: "96px",
                height: "44px",
                position: "relative", // ⬅️ required
                zIndex: 20, // ⬅️ higher than giant bit
                padding: 0,
                border: "none",
                background: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: flipPending ? "not-allowed" : "pointer",
                opacity: flipPending ? 0.5 : 1,
              }}
            >
              {/* Track */}
              <span
                aria-hidden="true"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "999px",
                  backgroundColor: "#bdbdbd",
                  border: "2px solid #888888",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {/* Labels */}
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 14px",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "#000",
                    zIndex: 2, // ABOVE knob
                    pointerEvents: "none",
                  }}
                >
                  <span>0</span>
                  <span>1</span>
                </span>

                {/* Knob */}
                <span
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    outline: "3px solid #555",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    transform: status ? "translateX(52px)" : "translateX(0)",
                    transition: "transform 200ms ease",
                    zIndex: 1, // BELOW labels
                    pointerEvents: "none",
                  }}
                />
              </span>
            </button>
          </div>

          <CustomiseMenu
            appearance={appearance}
            unlocks={unlocks}
            onChange={handleAppearanceChange}
            ignoreRef={flipButtonRef}
          />
        </div>
      </section>
    </main>
  );
}
