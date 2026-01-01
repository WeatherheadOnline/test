"use client";

import { useEffect, useState, useRef } from "react";
import { Appearance } from "@/types/appearance";
import { defaultAppearance } from "@/lib/defaultAppearance";
import { getUnlocksForFlipCount } from "@/lib/unlocks";
import "@/styles/globals.css";
import "./dashboard.css";
import { useUser } from "@/providers/UserProvider";
import { supabase } from "@/lib/supabase";
import Feed from "@/components/Feed/Feed";
import ShareModal from "@/components/ShareModal/ShareModal";
import BitExperience from "@/components/BitExperience/BitExperience";
import type { UnlockId } from "@/lib/unlocks";
import { UNLOCK_DEFINITIONS } from "@/lib/unlocks";
import { useRouter } from "next/navigation";

const VALID_UNLOCK_IDS = new Set<UnlockId>(
  UNLOCK_DEFINITIONS.flatMap((rule) => rule.ids)
);

export default function DashboardPage() {
  const { user, profile, authLoading, userReady, profileLoading } = useUser();
  const router = useRouter();

  // useState

  const [saving, setSaving] = useState(false);
  const [flipPending, setFlipPending] = useState(false);
  const [status, setStatus] = useState<boolean>(false);
  const [flipCount, setFlipCount] = useState<number>(0);
  const [appearance, setAppearance] = useState<Appearance>(defaultAppearance);
  const [unlocks, setUnlocks] = useState<UnlockId[]>([]);
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

    setUnlocks((profile.unlocks ?? []) as UnlockId[]);

    // Safer option, if I can't guaruntee the DB only ever sends valid unlock IDs
    // const safeUnlocks: UnlockId[] = (profile.unlocks ?? []).filter(
    //   (id): id is UnlockId => VALID_UNLOCK_IDS.has(id as UnlockId)
    // );
  }, [profile]);

useEffect(() => {
  if (!userReady) return;

  const isLoggingOut = sessionStorage.getItem("isLoggingOut");

  if (!user && !isLoggingOut) {
    router.replace("/gate?reason=auth");
  }
}, [user, userReady, router]);

if (authLoading) return null;

  const handleFlip = () => {
    if (flipPending || !user) return;

    setFlipPending(true);
    // hard limit on how long the switch is disabled
if (flipTimeoutRef.current) {
  clearTimeout(flipTimeoutRef.current);
}

flipTimeoutRef.current = setTimeout(() => {
  setFlipPending(false);
}, 200);

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
      <Feed />
    </main>
  );
}
