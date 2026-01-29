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

  // useState

  const [saving, setSaving] = useState(false);
  const [flipPending, setFlipPending] = useState(false);
  // const [status, setStatus] = useState<boolean>(false); // Get rid of this: status has moved from local state to backend
  // const [flipCount, setFlipCount] = useState<number>(0); // Get rid of this: flip count has moved from local state to backend
  const [shareOpen, setShareOpen] = useState(false);

  // useRef

  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flipButtonRef = useRef<HTMLButtonElement | null>(null);

  // useEffect(() => {
  //   if (!profile) return;

  //   setStatus(profile.status ?? false);
  //   setFlipCount(profile.flip_count ?? 0);
  // }, [profile]);
  const status = profile?.status ?? false;
  const flipCount = profile?.flip_count ?? 0;
  const [localStatus, setLocalStatus] = useState(status);
  const [localFlipCount, setLocalFlipCount] = useState(flipCount);

  useEffect(() => {
    setLocalStatus(status);
    setLocalFlipCount(flipCount);
  }, [status, flipCount]);

  //   const handleFlip = () => {
  //     if (flipPending || !user) return;

  //     setFlipPending(true);
  //     // hard limit on how long the switch is disabled
  //     if (flipTimeoutRef.current) {
  //       clearTimeout(flipTimeoutRef.current);
  //     }

  //     flipTimeoutRef.current = setTimeout(() => {
  //       setFlipPending(false);
  //     }, 200);

  //     // snapshot current state (prevents stale closure bugs)
  //     const prevStatus = status;
  //     const prevFlipCount = flipCount;

  // ///////////////////////////////////////////

  // // Change so as to not use state

  //     // optimistic UI
  //     const optimisticStatus = !prevStatus;
  //     const optimisticFlipCount = prevFlipCount + 1;
  //     setStatus(optimisticStatus);
  //     setFlipCount(optimisticFlipCount);

  // ////////////////////////////////////////////

  //     (async () => {
  //       setSaving(true);

  //       try {
  //         // 🔒 atomic backend update
  //         const { error } = await supabase.rpc("record_flip", {
  //           p_user_id: user.id,
  //         });

  //         if (error) throw error;

  //         // flip_count + last_flip_at are now authoritative in DB
  //         await supabase
  //           .from("profiles")
  //           .update({
  //             status: optimisticStatus,
  //           })
  //           .eq("id", user.id);
  //       } catch (err) {
  //         console.error("Failed to save flip:", err);

  //         // rollback UI
  //         setStatus(prevStatus);
  //         setFlipCount(prevFlipCount);
  //       } finally {
  //         setSaving(false);
  //       }
  //     })();
  //   };

  // const handleFlip = async () => {
  //   if (flipPending || !user) return;

  //   setFlipPending(true);

  //   try {
  //     const { error } = await supabase.rpc("record_flip", {
  //       p_user_id: user.id,
  //     });

  //     if (error) throw error;

  //     await supabase
  //       .from("profiles")
  //       .update({ status: !status })
  //       .eq("id", user.id);

  //     await refreshProfile(); // 🔑 THIS IS THE KEY
  //   } catch (err) {
  //     console.error("Failed to save flip:", err);
  //   } finally {
  //     setFlipPending(false);
  //   }
  // };

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

  // const handleFlip = () => {
  //   if (!user) return;

  //   const newStatus = !localStatus;
  //   const newFlipCount = localFlipCount + 1;
  //   console.log("newStatus", newStatus, "& newFlipCount", newFlipCount);

  //   // instant update
  //   setLocalStatus(newStatus);
  //   setLocalFlipCount(newFlipCount);

  //   // debounced backend save
  //   saveFlip(newStatus, newFlipCount);
  // };

  // const handleFlip = () => {
  //   if (!user) return;

  //   const newStatus = !localStatus;
  //   const newFlipCount = localFlipCount + 1;

  //   // 1️⃣ Update local state immediately for UI
  //   setLocalStatus(newStatus);
  //   setLocalFlipCount(newFlipCount);

  //   // 2️⃣ Update global profile optimistically
  //   updateProfileOptimistic({ status: newStatus, flip_count: newFlipCount });

  //   // 3️⃣ Persist to backend (debounced)
  //   saveFlip(newStatus, newFlipCount);
  // };

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
    // if (!userReady || profileLoading || !profile) {
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
      {/* <Feed /> */}
    </main>
  );
}
