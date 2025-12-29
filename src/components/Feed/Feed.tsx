"use client";

import React, { useEffect, useState } from "react";
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

  const { user, profile, loading: userLoading } = useUser();

  const [profiles, setProfiles] = useState<FeedProfile[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [onlyFollowing, setOnlyFollowing] = useState(false);

  /* -----------------------------------------
     Data fetching
  ------------------------------------------*/

const fetchFeedPage = async (
  from: number,
  to: number
): Promise<FeedProfile[]> => {
  if (!user) return [];

  // 1. Fetch following ids ONCE per page load
  const { data: followingRows, error: followErr } = await supabase
    .from("followers")
    .select("following_id")
    .eq("follower_id", user.id);

  if (followErr) throw followErr;

  const followingIds = new Set(
    (followingRows ?? []).map((f) => f.following_id)
  );

  // 2. Build base profiles query
  let query = supabase
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
    .order("created_at", { ascending: false });

  // 3. Exclude current user at query level
  if (profile?.username) {
    query = query.neq("username", profile.username);
  }

  // 4. Server-side "only following"
  if (onlyFollowing) {
    if (followingIds.size === 0) {
      return [];
    }

    query = query.in("id", Array.from(followingIds));
  }

  // 5. Pagination LAST
  const { data, error } = await query.range(from, to);

  if (error || !data) throw error;

  // 6. Attach follow state
  return data.map((p) => ({
    ...p,
    isFollowing: followingIds.has(p.id),
  }));
};

  /* -----------------------------------------
     Initial load
  ------------------------------------------*/

  const loadInitialPage = async () => {
    if (!user || userLoading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchFeedPage(0, PAGE_SIZE - 1);

      const filtered =
        profile?.username != null
          ? data.filter((p) => p.username !== profile.username)
          : data;

      setProfiles(filtered);
      setOffset(PAGE_SIZE);
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      setError("Failed to load feed");
      setProfiles([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLoading) return;
    loadInitialPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, profile?.username]);

  /* -----------------------------------------
     Reload when filter changes
  ------------------------------------------*/

  useEffect(() => {
    if (userLoading) return;

    setProfiles([]);
    setOffset(0);
    setHasMore(true);

    loadInitialPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyFollowing]);

  /* -----------------------------------------
     Pagination
  ------------------------------------------*/

  const loadMore = async () => {
    if (loading || !hasMore || !user) return;

    setLoading(true);

    const from = offset;
    const to = from + PAGE_SIZE - 1;

    try {
      const data = await fetchFeedPage(from, to);

      const filtered =
        profile?.username != null
          ? data.filter((p) => p.username !== profile.username)
          : data;

      setProfiles((prev) => [...prev, ...filtered]);
      setOffset((prev) => prev + PAGE_SIZE);

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

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
          {profiles.map((person) => (
            <article
              className="feed-card"
              key={person.id}
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
    onlyFollowing
      ? prev.filter((p) => p.id !== person.id)
      : prev.map((p) =>
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