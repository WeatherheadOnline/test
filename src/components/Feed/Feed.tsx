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
  last_flip_at: string | null;
  isFollowing: boolean;
};

type SortKey =
  | "last_flip_desc"
  | "last_flip_asc"
  | "status_asc"
  | "status_desc"
  | "username_asc"
  | "username_desc"
  | "flip_asc"
  | "flip_desc";

export default function Feed() {
  const PAGE_SIZE = 4;

  const {
    user,
    profile,
    loading: userLoading,
    followingIds,
    optimisticallyFollow,
    optimisticallyUnfollow,
  } = useUser();

  const [profiles, setProfiles] = useState<FeedProfile[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [onlyFollowing, setOnlyFollowing] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("last_flip_desc");

  const fetchFeedPage = async (from: number, to: number) => {
    if (!user) return [];

    let query = supabase.from("profiles").select(`
        id,
        username,
        display_name,
        status,
        flip_count,
        last_flip_at
      `);

    switch (sortKey) {
      case "last_flip_desc":
        query = query.order("last_flip_at", {
          ascending: false,
        });
        break;
      case "last_flip_asc":
        query = query.order("last_flip_at", {
          ascending: true,
        });
        break;
      case "status_asc":
        query = query.order("status", { ascending: true });
        break;
      case "status_desc":
        query = query.order("status", { ascending: false });
        break;
      case "username_asc":
        query = query.order("username", { ascending: true });
        break;
      case "username_desc":
        query = query.order("username", { ascending: false });
        break;
      case "flip_asc":
        query = query.order("flip_count", { ascending: true });
        break;
      case "flip_desc":
        query = query.order("flip_count", { ascending: false });
        break;
    }

    if (profile?.username) {
      query = query.neq("username", profile.username);
    }

    if (onlyFollowing) {
      if (followingIds.size === 0) return [];
      query = query.in("id", Array.from(followingIds));
    }

    const { data, error } = await query.range(from, to);
    if (error || !data) throw error;

    return data.map((p) => ({
      ...p,
      isFollowing: followingIds.has(p.id),
    }));
  };

  useEffect(() => {
    if (userLoading || !user) return;

    setProfiles([]);
    setOffset(0);
    setHasMore(true);

    (async () => {
      try {
        setLoading(true);
        const data = await fetchFeedPage(0, PAGE_SIZE - 1);
        setProfiles(data);
        setOffset(PAGE_SIZE);
        setHasMore(data.length === PAGE_SIZE);
      } catch {
        setError("Failed to load feed");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [userLoading, user, profile?.username, onlyFollowing, sortKey]);

  const loadMore = async () => {
    if (loading || !hasMore || !user) return;

    setLoading(true);
    try {
      const data = await fetchFeedPage(offset, offset + PAGE_SIZE - 1);
      setProfiles((prev) => [...prev, ...data]);
      setOffset((prev) => prev + PAGE_SIZE);
      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

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

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="last_flip_desc">Recently flipped</option>
            <option value="last_flip_asc">Least recently flipped</option>
            <option value="username_asc">Username A–Z</option>
            <option value="username_desc">Username Z–A</option>
            <option value="status_asc">Status 0 → 1</option>
            <option value="status_desc">Status 1 → 0</option>
            <option value="flip_asc">Flip count ↑</option>
            <option value="flip_desc">Flip count ↓</option>
          </select>
        </div>

        {loading && <p>Loading feed…</p>}
        {error && <p>{error}</p>}

        <div className="feed-cards-wrapper">
          {profiles.map((person) => (
            <article className="feed-card" key={person.id}>
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
                  optimisticallyFollow(person.id);
                  setProfiles((prev) =>
                    prev.map((p) =>
                      p.id === person.id ? { ...p, isFollowing: true } : p
                    )
                  );
                  const { error } = await supabase.from("followers").insert({
                    follower_id: user.id,
                    following_id: person.id,
                  });
                  if (error) {
                    optimisticallyUnfollow(person.id);
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === person.id ? { ...p, isFollowing: false } : p
                      )
                    );
                  }
                }}
                onUnfollow={async () => {
                  if (!user) return;
                  optimisticallyUnfollow(person.id);
                  const { error } = await supabase
                    .from("followers")
                    .delete()
                    .eq("follower_id", user.id)
                    .eq("following_id", person.id);
                  if (error) optimisticallyFollow(person.id);
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
