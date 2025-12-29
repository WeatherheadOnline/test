"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./feed.css";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/providers/UserProvider";
import FollowButton from "../FollowButton/FollowButton";

type FeedProfile = {
  id: string;
  username: string;
  display_name: string | null;
  status: boolean;
  flip_count: number;
  isFollowing: boolean;
};

export default function Feed() {
  const PAGE_SIZE = 4;
  const UNFOLLOW_CONFIRM_TIMEOUT = 4000;

  const { user, profile, loading: userLoading } = useUser();

  const [profiles, setProfiles] = useState<FeedProfile[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [onlyFollowing, setOnlyFollowing] = useState(false);

  /* -----------------------------------------
     Helpers
  ------------------------------------------*/

  const fetchFollowingIds = async (): Promise<Set<string>> => {
    if (!user) return new Set();

    const { data } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", user.id);

    return new Set((data ?? []).map((f) => f.following_id));
  };

  /* -----------------------------------------
     Initial page load
  ------------------------------------------*/

  const loadInitialPage = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        username,
        display_name,
        status,
        flip_count
      `
      )
      .order("created_at", { ascending: false })
      .range(0, PAGE_SIZE - 1);

    if (error || !data) {
      setError("Failed to load feed");
      setProfiles([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    const followingIds = await fetchFollowingIds();

    const filtered = profile?.username
      ? data.filter((p) => p.username !== profile.username)
      : data;

    const merged: FeedProfile[] = filtered.map((p) => ({
      ...p,
      isFollowing: followingIds.has(p.id),
    }));

    setProfiles(merged);
    setOffset(PAGE_SIZE);
    setHasMore(data.length === PAGE_SIZE);
    setLoading(false);
  };

  useEffect(() => {
    if (userLoading) return;
    loadInitialPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, profile?.username]);

  /* -----------------------------------------
     Pagination
  ------------------------------------------*/

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const from = offset;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        username,
        display_name,
        status,
        flip_count
      `
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error || !data) {
      setError("Failed to load feed");
      setLoading(false);
      return;
    }

    const followingIds = await fetchFollowingIds();

    const filtered = profile?.username
      ? data.filter((p) => p.username !== profile.username)
      : data;

    const merged: FeedProfile[] = filtered.map((p) => ({
      ...p,
      isFollowing: followingIds.has(p.id),
    }));

    setProfiles((prev) => [...prev, ...merged]);
    setOffset((prev) => prev + PAGE_SIZE);

    if (data.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setLoading(false);
  };

  /* -----------------------------------------
     Follow / unfollow
  ------------------------------------------*/

  const confirmUnfollow = async (person: FeedProfile) => {
    if (!user) return;

    await supabase
      .from("followers")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", person.id);

    setProfiles((prev) =>
      prev.map((p) => (p.id === person.id ? { ...p, isFollowing: false } : p))
    );

    resetPendingUnfollow();
  };

  const handleFollowClick = async (person: FeedProfile) => {
    if (!user) return;

    await supabase.from("followers").insert({
      follower_id: user.id,
      following_id: person.id,
    });

    setProfiles((prev) =>
      prev.map((p) => (p.id === person.id ? { ...p, isFollowing: true } : p))
    );
  };

  /* -----------------------------------------
     Client-side filter
  ------------------------------------------*/

  const visibleProfiles = useMemo(() => {
    if (!onlyFollowing) return profiles;
    return profiles.filter((p) => p.isFollowing);
  }, [profiles, onlyFollowing]);

  /* -----------------------------------------
     Render
  ------------------------------------------*/

  return (
    <section className="page-section">
      <div className="section-wrapper">
        <h2>What people are flipping</h2>

        <div className="feed-controls">
          <label>
            <input
              type="checkbox"
              checked={onlyFollowing}
              onChange={(e) => setOnlyFollowing(e.target.checked)}
            />
            Only show people I'm following
          </label>
        </div>

        {loading && <p>Loading feed…</p>}
        {error && <p>{error}</p>}

        <div className="feed-cards-wrapper">
          {visibleProfiles.map((person) => (
            <article
              className="feed-card"
              key={person.username}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="feed-bit">{person.status ? "1" : "0"}</p>

              <div className="feed-text">
                <p className="feed-username">
                  {person.display_name ?? person.username}
                </p>
                <p className="feed-flip-count">
                  Flipped {person.flip_count} bits
                </p>
              </div>

              <FollowButton
                isFollowing={person.isFollowing}
                username={person.username}
                onFollow={async () => {
                  if (!user) return;

                  await supabase.from("followers").insert({
                    follower_id: user.id,
                    following_id: person.id,
                  });

                  setProfiles((prev) =>
                    prev.map((p) =>
                      p.id === person.id ? { ...p, isFollowing: true } : p
                    )
                  );
                }}
                onUnfollow={async () => {
                  if (!user) return;

                  await supabase
                    .from("followers")
                    .delete()
                    .eq("follower_id", user.id)
                    .eq("following_id", person.id);

                  setProfiles((prev) =>
                    prev.map((p) =>
                      p.id === person.id ? { ...p, isFollowing: false } : p
                    )
                  );
                }}
              />
            </article>
          ))}
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="feed-load-more"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        )}
      </div>
    </section>
  );
}
