"use client";

import { useEffect, useState, useRef } from "react";
import { Appearance } from "@/types/appearance";
import { defaultAppearance } from "@/lib/defaultAppearance";
import { getUnlocksForFlipCount } from "@/lib/unlocks";
import UnlockToast from "@/components/UnlockToast";
import FlipToast from "@/components/FlipToast";
import "@/styles/globals.css";
import "./dashboard.css";
import { useUser } from "@/providers/UserProvider";
import { supabase } from "@/lib/supabase";
import Feed from "@/components/Feed/Feed";
import ShareModal from '@/components/ShareModal/ShareModal'
import BitExperience from "@/components/BitExperience/BitExperience";

export default function DashboardPage() {
  const { user, profile, loading } = useUser();

  // useState

  // const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flipPending, setFlipPending] = useState(false);
  const [unlockToasts, setUnlockToasts] = useState<string[]>([]);
  const [flipToastKey, setFlipToastKey] = useState<number | null>(null);

  const [status, setStatus] = useState<boolean>(false);
  const [flipCount, setFlipCount] = useState<number>(0);
  const [appearance, setAppearance] = useState<Appearance>(defaultAppearance);
  const [unlocks, setUnlocks] = useState<string[]>([]);
  const [shareOpen, setShareOpen] = useState(false);

  // useRef

  const appearanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flipButtonRef = useRef<HTMLButtonElement | null>(null);


  useEffect(() => {
  if (!appearance.fill) return;

  if (
    appearance.fill.style === "gradient" &&
    !unlocks.includes("fill:gradient")
  ) {
    setAppearance((prev) => ({
      ...prev,
      fill: {
        ...prev.fill,
        style: "solid",
      },
    }));
  }
}, [appearance.fill.style, unlocks]);

  const saveAppearanceDebounced = (nextAppearance: Appearance) => {
    if (!user) return;

    if (appearanceTimeoutRef.current) {
      clearTimeout(appearanceTimeoutRef.current);
    }

    appearanceTimeoutRef.current = setTimeout(async () => {
      await supabase
        .from("profiles")
        .update({ appearance: nextAppearance })
        .eq("id", user.id);
    }, 400);
  };


useEffect(() => {
  if (!profile) return;

  setStatus(profile.status ?? false);
  setFlipCount(profile.flip_count ?? 0);

  setAppearance({
    ...defaultAppearance,
    ...(profile.appearance ?? {}),
    fill: {
      ...defaultAppearance.fill,
      ...(profile.appearance?.fill ?? {}),
    },
    border: {
      ...defaultAppearance.border,
      ...(profile.appearance?.border ?? {}),
    },
    shadow: {
      ...defaultAppearance.shadow,
      ...(profile.appearance?.shadow ?? {}),
    },
  });

  setUnlocks(profile.unlocks ?? []);
}, [profile]);


  useEffect(() => {
    if (flipToastKey === null) return;

    const t = setTimeout(() => {
      setFlipToastKey(null);
    }, 1500); // 500ms visible + 1000ms fade

    return () => clearTimeout(t);
  }, [flipToastKey]);

  if (loading) return <p>Loading…</p>;
  if (!user || !profile) return <p>Not logged in</p>;

  const unlockIdToLabel = (id: string): string | null => {
    if (id.startsWith("fill:")) return "Fill";
    if (id.startsWith("border:")) return "Border";
    if (id.startsWith("shadow:")) return "Shadow";
    return null;
  };

const handleFlip = () => {
  if (flipPending || !user) return;

  // force-remount flip toast
  setFlipToastKey(Date.now());

  setFlipPending(true);

  // snapshot current state (prevents stale closure bugs)
  const prevStatus = status;
  const prevFlipCount = flipCount;
  const prevUnlocks = unlocks;

  // optimistic UI
  const optimisticStatus = !prevStatus;
  const optimisticFlipCount = prevFlipCount + 1;
  const optimisticUnlocks = getUnlocksForFlipCount(
    optimisticFlipCount,
    prevUnlocks
  );

  setStatus(optimisticStatus);
  setFlipCount(optimisticFlipCount);
  setUnlocks(optimisticUnlocks);

  // newly unlocked → toasts
  const newlyUnlocked = optimisticUnlocks.filter(
    (id) => !prevUnlocks.includes(id)
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

  (async () => {
    setSaving(true);

    try {
      // 🔒 atomic backend update
      const { error } = await supabase.rpc("record_flip", {
        p_user_id: user.id,
      });

      if (error) throw error;

      // status + unlocks are UI-only concerns;
      // flip_count + last_flip_at are now authoritative in DB
      await supabase
        .from("profiles")
        .update({
          status: optimisticStatus,
          unlocks: optimisticUnlocks,
        })
        .eq("id", user.id);
    } catch (err) {
      console.error("Failed to save flip:", err);

      // rollback UI
      setStatus(prevStatus);
      setFlipCount(prevFlipCount);
      setUnlocks(prevUnlocks);
    } finally {
      setSaving(false);
      setFlipPending(false);
    }
  })();
};




  const handleAppearanceChange = (next: Appearance) => {
    setAppearance(next); // optimistic
    saveAppearanceDebounced(next); // persistent
  };


  //   The return statement

  return (
    <main>
      <section className="page-section">
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


        <div className="dashboard-container section-wrapper">
<BitExperience
  mode="authenticated"
  value={status ? "1" : "0"}
  flipCount={flipCount}
  appearance={appearance}
  unlocks={unlocks}
  onFlip={handleFlip}
  onAppearanceChange={handleAppearanceChange}
  showShare
  onShare={() => setShareOpen(true)}
  flipPending={flipPending}
/>

{shareOpen && (
  <ShareModal
    onClose={() => setShareOpen(false)}
    homepageUrl={window.location.origin}
  />
)}
        </div>
      </section>
      {/* <Feed /> */}
    </main>
  );
}
