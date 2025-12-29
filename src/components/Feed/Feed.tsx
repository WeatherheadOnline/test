"use client";

import React, { useEffect, useState } from "react";
import "./feed.css";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/providers/UserProvider";

type FeedProfile = {
  username: string;
  display_name: string | null;
  status: boolean;
  flip_count: number;
};

export default function Feed() {
  const PAGE_SIZE = 4;

  const { profile, loading: userLoading } = useUser();

  const [profiles, setProfiles] = useState<FeedProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    // Reset feed when user/profile changes
    setProfiles([]);
    setHasMore(true);

    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, profile?.username]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const from = profiles.length;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
    username,
    display_name,
    status,
    flip_count
  `
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      setError("Failed to load feed");
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const filtered = profile?.username
      ? data.filter((p) => p.username !== profile.username)
      : data;

    setProfiles((prev) => [...prev, ...filtered]);

    if (data.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setLoading(false);
  };

  const cardsToDisplay = profiles.map((person) => (
    <article className="feed-card" key={person.username}>
      <p className="feed-bit">{person.status ? "1" : "0"}</p>
      <div className="feed-text">
        <p className="feed-username">
          {person.display_name ?? person.username}
        </p>
        <p className="feed-flip-count">Flipped {person.flip_count} bits</p>
      </div>
    </article>
  ));

  const sortAndFilter = () => {};

  // The return statement

  return (
    <section className="page-section">
      <div className="section-wrapper">
        <h2>What people are flipping</h2>
        <div className="feed-controls">
          <label>
            <input type="checkbox"></input>
            Only show people I'm following
          </label>
          <form onSubmit={sortAndFilter}>
            <label htmlFor="sortOptions">Sort by:</label>
            <div className="dropdowns-wrapper">
              <select name="sortOptions" id="sortOptions">
                <option value="">Please select...</option>
                <option value="bitAscending">Bit (0 - 1)</option>
                <option value="bitDescending">Bit (1 - 0)</option>
                <option value="usernameAscending">Username (A - Z)</option>
                <option value="usernameDescending">Username (Z - A)</option>
                <option value="flipsDescending">Most flips</option>
                <option value="flipsAscending">Least flips</option>
              </select>
            </div>
            <button>Sort</button>
            <p>(Add a filter)</p>
            <button>Filter</button>
          </form>
        </div>
        {loading && <p>Loading feed…</p>}
        {error && <p>{error}</p>}
        <div className="feed-cards-wrapper">{cardsToDisplay}</div>

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
