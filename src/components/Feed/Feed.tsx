"use client";

import React, { useEffect, useRef, useState } from "react";
import "./feed.css";
import "@/styles/globals.css";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/providers/UserProvider";
import FollowButton from "../FollowButton/FollowButton";
import { Appearance } from "@/types/appearance";
import BitDisplay from "../BitDisplay/BitDisplay";

type FeedProfile = {
  id: string;
  username: string;
  display_name: string | null;
  status: boolean;
  flip_count: number;
  last_flip_at: string | null;
  appearance: Appearance | null;
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

  type StatusFilter = "all" | "true" | "false";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [profiles, setProfiles] = useState<FeedProfile[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [onlyFollowing, setOnlyFollowing] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("last_flip_desc");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingSortKey, setPendingSortKey] = useState<SortKey>(sortKey);
  const [pendingStatusFilter, setPendingStatusFilter] =
    useState<StatusFilter>(statusFilter);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const commitSearch = () => {
    const trimmed = searchInput.trim();
    setSearchQuery((prev) =>
      prev === (trimmed || null) ? prev : trimmed || null
    );
  };

  const applyMobileSortFilter = () => {
    setSortKey(pendingSortKey);
    setStatusFilter(pendingStatusFilter);
    setIsMobileMenuOpen(false);
  };

  const mobileCommitSearch = () => {
    commitSearch();
    setIsMobileMenuOpen(false);
  };

  const clearFilters = () => {
    setOnlyFollowing(false);
    setStatusFilter("all");
  };

const fetchFeedPage = async (from: number, to: number) => {
  if (!user) return [];

  // 1. Optional search step → collect matching profile IDs
  let searchIds: string[] | null = null;

  // if (searchQuery) {
  //   const searchQueryBuilder = supabase
  //     .from("profile_search")
  //     .select("id");

  //   const { data, error } = isEmail(searchQuery)
  //     ? await searchQueryBuilder.eq("email", searchQuery)
  //     : await searchQueryBuilder.ilike(
  //         "username",
  //         `%${searchQuery.toLowerCase()}%`
  //       );

  //   if (error || !data || data.length === 0) return [];

  //   searchIds = data.map((row) => row.id);
  // }
  if (searchQuery) {
  const { data, error } = await supabase
    .rpc("search_profiles", { search: searchQuery });

  if (error || !data || data.length === 0) return [];

  searchIds = data.map((row) => row.id);
}

  // 2. Main feed query (profiles table ONLY)
  let query = supabase.from("profiles").select(`
    id,
    username,
    display_name,
    status,
    flip_count,
    last_flip_at,
    appearance
  `);

  // 3. Sorting
  switch (sortKey) {
    case "last_flip_desc":
      query = query.order("last_flip_at", { ascending: false });
      break;
    case "last_flip_asc":
      query = query.order("last_flip_at", { ascending: true });
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

  // 4. Exclude current user
  if (profile?.username) {
    query = query.neq("username", profile.username);
  }

  // 5. Following filter
  if (onlyFollowing) {
    if (followingIds.size === 0) return [];
    query = query.in("id", Array.from(followingIds));
  }

  // 6. Status filter
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter === "true");
  }

  // 7. Apply search results
  if (searchIds) {
    query = query.in("id", searchIds);
  }

  // 8. Pagination
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
  }, [
    userLoading,
    user,
    profile?.username,
    onlyFollowing,
    sortKey,
    statusFilter,
    searchQuery,
  ]);

  const loadMore = async () => {
    if (searchQuery) return;
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
          {/* Always visible */}
          <label className="only-following">
            <input
              type="checkbox"
              checked={onlyFollowing}
              onChange={(e) => setOnlyFollowing(e.target.checked)}
            />
            Only show people I'm following
          </label>

          {/* Desktop controls */}
          <div className="desktop-controls">
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">All statuses</option>
              <option value="true">Status = 1</option>
              <option value="false">Status = 0</option>
            </select>

            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search username or email"
                value={searchInput}
                ref={searchInputRef}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitSearch();
                  }
                }}
              />

              {searchInput && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchInput("");
                    setSearchQuery(null);
                    searchInputRef.current?.focus();
                  }}
                >
                  ×
                </button>
              )}

              <button type="button" onClick={commitSearch}>
                Search
              </button>
            </div>
          </div>

          {/* Mobile slider button */}
          <button
            className="mobile-sliders-btn"
            aria-label="Open sort and filter menu"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <img
              src="/assets/sliders.svg"
              alt="sort, filter, and search options"
            />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            className="mobile-sheet-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="mobile-sheet"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <p>Search for a username</p>

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitSearch()}
              />

              <button onClick={mobileCommitSearch}>Search</button>

              <div className="sheet-section">
                <label>Sort by:</label>
                <select
                  value={pendingSortKey}
                  onChange={(e) => setPendingSortKey(e.target.value as SortKey)}
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

                <label>Filter by:</label>
                <select
                  value={pendingStatusFilter}
                  onChange={(e) =>
                    setPendingStatusFilter(e.target.value as StatusFilter)
                  }
                >
                  <option value="all">All statuses</option>
                  <option value="true">Status = 1</option>
                  <option value="false">Status = 0</option>
                </select>
              </div>

              <button onClick={applyMobileSortFilter}>
                Apply sort / filter
              </button>
              <button onClick={() => setIsMobileMenuOpen(false)}>Cancel</button>
            </div>
          </div>
        )}

        {loading && <p>Loading feed…</p>}
        {error && <p>{error}</p>}

        {!loading && profiles.length === 0 && searchQuery && (
          <p className="feed-hint">
            {onlyFollowing && statusFilter !== "all"
              ? "Try expanding your search"
              : onlyFollowing && statusFilter === "all"
              ? "Try expanding your search to users you don't follow"
              : !onlyFollowing && statusFilter !== "all"
              ? "Try clearing the filter"
              : "Nothing flipping here"}
          </p>
        )}

        <div className="feed-clear-controls">
          {searchQuery && (
            <button
              type="button"
              className="feed-clear-search"
              onClick={() => {
                setSearchInput("");
                setSearchQuery(null);
              }}
            >
              Clear search
            </button>
          )}
          {(onlyFollowing || statusFilter !== "all") && (
            <button
              type="button"
              className="feed-clear-filters"
              onClick={() => {
                setOnlyFollowing(false);
                setStatusFilter("all");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="feed-cards-wrapper">
          {profiles.map((person) => (
            <article className="feed-card" key={person.id}>
              <div className="feed-bit">
                {person.appearance && (
                  <BitDisplay
                    value={person.status ? "1" : "0"}
                    appearance={person.appearance}
                    scaleFactor={0.2}
                  />
                )}
              </div>

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

        {hasMore && !searchQuery && (
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