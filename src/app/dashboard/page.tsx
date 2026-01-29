"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import "@/styles/globals.css";
import "./dashboard.css";
import { useUser } from "@/providers/UserProvider";
import { supabase } from "@/lib/supabase";
import Feed from "@/components/Feed/Feed";
import ShareModal from "@/components/ShareModal/ShareModal";
import BitExperience from "@/components/BitExperience/BitExperience";
import { useRouter } from "next/navigation";
import RedirectToGate from "@/components/RedirectToGate";

function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export default function DashboardPage() {
  const {
    user,
    profile,
    authLoading,
    userReady,
    profileLoading,
    refreshProfile,
    updateProfileOptimistic,
    updateFlipOptimistic,
  } = useUser();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [flipPending, setFlipPending] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flipButtonRef = useRef<HTMLButtonElement | null>(null);

  const status = profile?.status ?? false;
  const flipCount = profile?.flip_count ?? 0;
  const [localStatus, setLocalStatus] = useState(status);
  const [localFlipCount, setLocalFlipCount] = useState(flipCount);

  useEffect(() => {
    setLocalStatus(status);
    setLocalFlipCount(flipCount);
  }, [status, flipCount]);

  const saveFlip = useMemo(
    () =>
      debounce(async (newStatus: boolean, newFlipCount: number) => {
        if (!user) return;

        try {
          const { error } = await supabase.rpc("record_flip", {
            p_user_id: user.id,
          });
          if (error) throw error;

          await supabase
            .from("profiles")
            .update({ status: newStatus, flip_count: newFlipCount })
            .eq("id", user.id);
        } catch (err) {
          console.error("Failed to save flip:", err);
        }
      }, 300),
    [user],
  );

  const handleFlip = () => {
    if (!user) return;

    const newStatus = !localStatus;
    const newFlipCount = localFlipCount + 1;

    // Update local state for immediate UI feedback
    setLocalStatus(newStatus);
    setLocalFlipCount(newFlipCount);

    // Update global profile optimistically
    updateFlipOptimistic(newStatus, newFlipCount);

    // Persist to backend
    saveFlip(newStatus, newFlipCount);
  };

  if (!userReady) {
    return null; // or a loading shell
  }

  if (!user) {
    return <RedirectToGate />;
  }

  //   The return statement

  return (
    <main>
      <section className="page-section">
        <div className="dashboard-container section-wrapper">
          <BitExperience
            mode="authenticated"
            value={localStatus ? "1" : "0"}
            flipCount={localFlipCount}
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
      <Feed />
    </main>
  );
}
