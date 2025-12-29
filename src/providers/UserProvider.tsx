"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

type UserContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  followingIds: Set<string>;
  refreshFollowing: () => Promise<void>;
};

type DashboardProfile = {
  status: boolean;
  flip_count: number;
  appearance: any;
  unlocks: string[];

  // future
  background_pattern?: string | null;
  background_color?: string | null;
  accessories?: any;
};

type Profile = {
  username: string | null;
  display_name: string | null;
} & Partial<DashboardProfile>;

type FollowingContext = {
  followingIds: Set<string>;
  refreshFollowing: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

const loadFollowing = async (userId: string) => {
const { data, error } = await supabase
.from("followers")
.select("following_id")
.eq("follower_id", userId);

if (!error && data) {
setFollowingIds(new Set(data.map((f) => f.following_id)));
} else {
setFollowingIds(new Set());
}
};
  useEffect(() => {
    let mounted = true;


    const loadInitialSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(data.session);
      setUser(data.session?.user ?? null);

if (data.session?.user) {
  await loadProfile(data.session.user.id);
  await loadFollowing(data.session.user.id);
}

      setLoading(false);
    };

    const loadProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
            username,
            display_name,
            status,
            flip_count,
            appearance,
            unlocks,
            background_pattern,
            background_color,
            accessories
            `
        )
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    };

    loadInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

if (session?.user) {
  await loadProfile(session.user.id);
  await loadFollowing(session.user.id);
} else {
  setProfile(null);
  setFollowingIds(new Set());
}
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
<UserContext.Provider
  value={{
    user,
    session,
    profile,
    loading,
    followingIds,
    refreshFollowing: async () => {
      if (user) await loadFollowing(user.id);
    },
  }}
>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return ctx;
}
