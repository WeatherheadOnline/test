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
  const { profile, loading: userLoading } = useUser();

  const [profiles, setProfiles] = useState<FeedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;

    const loadFeed = async () => {
      setLoading(true);

      const { data, error } = await supabase.from("profiles").select(`
        username,
        display_name,
        status,
        flip_count
      `);

      if (error) {
        setError("Failed to load feed");
        setProfiles([]);
      } else if (data) {
        const filtered = profile?.username
          ? data.filter((p) => p.username !== profile.username)
          : data;

        setProfiles(filtered);
      }

      setLoading(false);
    };

    loadFeed();
  }, [userLoading, profile?.username]);

  //   const cardsToDisplay = following.map((person) => {
  //     return (
  //       <article className="feed-card" key={person.username}>
  //         <p className="feed-bit">{person.status ? "1" : "0"}</p>
  //         <div className="feed-text">
  //           <p className="feed-username">{person.username}</p>
  //           <p className="feed-flip-count">Flipped {person.flip_count} bits</p>
  //         </div>
  //       </article>
  //     );
  //   });

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
      </div>
    </section>
  );
}
