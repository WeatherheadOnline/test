"use client";

import React, { useEffect, useRef, useState } from "react";
import "./feed.css";
import "@/styles/globals.css";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/providers/UserProvider";
import FollowButton from "../FollowButton/FollowButton";
import BitDisplay from "../BitDisplay/BitDisplay";

type FeedProfile = {
  id: string;
  username: string;
  display_name: string | null;
  status: boolean;
  flip_count: number;
  last_flip_at: string | null;
  is_following: boolean;
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
    userReady,
    followingIds,
    optimisticallyFollow,
    optimisticallyUnfollow,
  } = useUser();

  type StatusFilter = "all" | "true" | "false";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [profiles, setProfiles] = useState<FeedProfile[]>([]);
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
const [cursor, setCursor] = useState<{ lastFlipAt: string | null; lastId: string | null }>({
  lastFlipAt: null,
  lastId: null,
});
const [queryKey, setQueryKey] = useState<string>("");

  const searchInputRef = useRef<HTMLInputElement>(null);

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

const fetchFeedPage = async (cursor: { lastFlipAt: string | null; lastId: string | null }) => {
  if (!user) return [];

  // Optional search step → collect matching profile IDs
  let searchIds: string[] | null = null;
  if (searchQuery) {
    const { data, error } = await supabase.rpc("search_profiles", {
      search: searchQuery,
    });

    if (error || !data || data.length === 0) return [];
    searchIds = data.map((row) => row.id);
  }

  // Call the RPC
  const { data, error } = await supabase.rpc("get_feed_page", {
    p_user_id: user.id,
    p_limit: PAGE_SIZE + 1, // fetch one extra to detect hasMore
    p_last_flip_at: cursor.lastFlipAt,
    p_last_id: cursor.lastId,
    p_only_following: onlyFollowing,
    p_status_filter: statusFilter === "all" ? null : statusFilter === "true",
    p_search_ids: searchIds,
    p_sort: sortKey, // passes your selected sort
  });

  if (error) throw error;

  // Slice to PAGE_SIZE for display, detect hasMore
  const pageData = data.slice(0, PAGE_SIZE);
  setHasMore(data.length > PAGE_SIZE);

  return pageData;
};

useEffect(() => {
  if (!userReady || !user) return;

  // Reset feed for new query
  setProfiles([]);
  setCursor({ lastFlipAt: null, lastId: null });
  setHasMore(true);

  (async () => {
    try {
      setLoading(true);
      const data = await fetchFeedPage({ lastFlipAt: null, lastId: null });
      setProfiles(data);

      if (data.length > 0) {
        const last = data[data.length - 1];
        setCursor({ lastFlipAt: last.last_flip_at, lastId: last.id });
      }
    } catch {
      setError("Failed to load feed");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  })();
}, [userReady, user, queryKey]);

useEffect(() => {
  const key = JSON.stringify({
    onlyFollowing,
    statusFilter,
    sortKey,
    searchQuery,
  });
  setQueryKey(key);
}, [onlyFollowing, statusFilter, sortKey, searchQuery]);

const loadMore = async () => {
  if (searchQuery) return;
  if (loading || !hasMore || !user) return;

  setLoading(true);
  try {
    const data = await fetchFeedPage(cursor);
    setProfiles((prev) => [...prev, ...data]);

    if (data.length > 0) {
      const last = data[data.length - 1];
      setCursor({ lastFlipAt: last.last_flip_at, lastId: last.id });
    }
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
                <BitDisplay
                  value={person.status ? "1" : "0"}
                  scaleFactor={0.2}
                />
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
                is_following={person.is_following}
                username={person.username}
                onFollow={async () => {
                  if (!user || person.is_following) return; // ← skip if already following

                  setProfiles((prev) =>
                    prev.map((p) =>
                      p.id === person.id ? { ...p, is_following: true } : p
                    )
                  );

                  const { error } = await supabase.from("followers").insert({
                    follower_id: user.id,
                    following_id: person.id,
                  });

                  if (error && error.code !== "23505") {
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === person.id ? { ...p, is_following: false } : p
                      )
                    );
                  }
                }}
                onUnfollow={async () => {
                  if (!user) return;

                  // Optimistically update UI
                  setProfiles((prev) =>
                    prev.map((p) =>
                      p.id === person.id ? { ...p, is_following: false } : p
                    )
                  );

                  const { error } = await supabase
                    .from("followers")
                    .delete()
                    .eq("follower_id", user.id)
                    .eq("following_id", person.id);

                  // Roll back if another error occurs
                  if (error) {
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === person.id ? { ...p, is_following: true } : p
                      )
                    );
                  }
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
