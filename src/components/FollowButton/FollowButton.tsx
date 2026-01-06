"use client";

import { useEffect, useRef, useState } from "react";
import "./follow-button.css";

type FollowButtonProps = {
  is_following: boolean;
  username: string;
  onFollow: () => Promise<void> | void;
  onUnfollow: () => Promise<void> | void;
  confirmTimeoutMs?: number;
};

export default function FollowButton({
  is_following,
  username,
  onFollow,
  onUnfollow,
  confirmTimeoutMs = 4000,
}: FollowButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const reset = () => {
    setConfirming(false);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => reset();
  }, []);

  const startConfirm = () => {
    if (loading) return;

    setConfirming(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      reset();
    }, confirmTimeoutMs);
  };

  const handleFollow = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await onFollow();
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUnfollow = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await onUnfollow();
    } finally {
      setLoading(false);
      reset();
    }
  };

  if (!is_following) {
    return (
      <button
        className="feed-follow-button"
        onClick={handleFollow}
        disabled={loading}
        aria-label={`Follow ${username}`}
        aria-busy={loading}
      >
        {loading ? "Following…" : "Follow"}
      </button>
    );
  }

  return (
    <button
      className={`feed-following-badge ${
        confirming ? "is-confirming" : ""
      } ${loading ? "is-loading" : ""}`}
      onClick={confirming ? handleConfirmUnfollow : startConfirm}
      onBlur={reset}
      disabled={loading}
      aria-busy={loading}
      aria-label={
        loading
          ? `Updating follow state for ${username}`
          : confirming
          ? `Confirm unfollow ${username}`
          : `Following ${username}. Click to unfollow`
      }
    >
      {loading
        ? confirming
          ? "Unfollowing…"
          : "Following…"
        : confirming
        ? "Unfollow?"
        : "Following"}
    </button>
  );
}