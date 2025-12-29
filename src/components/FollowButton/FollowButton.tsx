"use client";

import { useEffect, useRef, useState } from "react";
import "./follow-button.css";

type FollowButtonProps = {
  isFollowing: boolean;
  username: string;
  onFollow: () => Promise<void> | void;
  onUnfollow: () => Promise<void> | void;
  confirmTimeoutMs?: number;
};

export default function FollowButton({
  isFollowing,
  username,
  onFollow,
  onUnfollow,
  confirmTimeoutMs = 4000,
}: FollowButtonProps) {
  const [confirming, setConfirming] = useState(false);
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

  const handleFollowingClick = () => {
    setConfirming(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      reset();
    }, confirmTimeoutMs);
  };

  const handleConfirmUnfollow = async () => {
    await onUnfollow();
    reset();
  };

  if (!isFollowing) {
    return (
      <button
        className="feed-follow-button"
        onClick={onFollow}
        aria-label={`Follow ${username}`}
      >
        Follow
      </button>
    );
  }

  return (
    <button
      className={`feed-following-badge ${
        confirming ? "is-confirming" : ""
      }`}
      aria-label={
        confirming
          ? `Confirm unfollow ${username}`
          : `Following ${username}. Click to unfollow`
      }
      onClick={confirming ? handleConfirmUnfollow : handleFollowingClick}
      onBlur={reset}
    >
      {confirming ? "Unfollow?" : "Following"}
    </button>
  );
}