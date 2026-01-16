"use client";

import { useEffect, useState, useRef } from "react";
import "@/styles/globals.css";
import "./dashboard.css";
import { useUser } from "@/providers/UserProvider";
import { supabase } from "@/lib/supabase";
import Feed from "@/components/Feed/Feed";
import ShareModal from "@/components/ShareModal/ShareModal";
import BitExperience from "@/components/BitExperience/BitExperience";
import { useRouter } from "next/navigation";
import RedirectToGate from "@/components/RedirectToGate";

export default function DashboardPage() {
  const { user, profile, authLoading, userReady, profileLoading } = useUser();
  const router = useRouter();

  // useState

  const [saving, setSaving] = useState(false);
  const [flipPending, setFlipPending] = useState(false);
  const [status, setStatus] = useState<boolean>(false);
  const [flipCount, setFlipCount] = useState<number>(0);
  const [shareOpen, setShareOpen] = useState(false);

  // useRef

  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flipButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!profile) return;

    setStatus(profile.status ?? false);
    setFlipCount(profile.flip_count ?? 0);
  }, [profile]);

  if (!userReady) {
    return null; // or a loading shell
  }

  if (!user) {
    return <RedirectToGate />;
  }

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

    // optimistic UI
    const optimisticStatus = !prevStatus;
    const optimisticFlipCount = prevFlipCount + 1;
    setStatus(optimisticStatus);
    setFlipCount(optimisticFlipCount);

    (async () => {
      setSaving(true);

      try {
        // 🔒 atomic backend update
        const { error } = await supabase.rpc("record_flip", {
          p_user_id: user.id,
        });

        if (error) throw error;

        // flip_count + last_flip_at are now authoritative in DB
        await supabase
          .from("profiles")
          .update({
            status: optimisticStatus,
          })
          .eq("id", user.id);
      } catch (err) {
        console.error("Failed to save flip:", err);

        // rollback UI
        setStatus(prevStatus);
        setFlipCount(prevFlipCount);
      } finally {
        setSaving(false);
      }
    })();
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
            onFlip={handleFlip}
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
