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
import { DEFAULT_APPEARANCE } from "@/lib/defaultAppearance";

type UserContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  authLoading: boolean;
  profileLoading: boolean;
  followingLoading: boolean;
  userReady: boolean;
  followingIds: Set<string>;
  refreshProfile: () => Promise<void>;
  refreshFollowing: () => Promise<void>;
  optimisticallyFollow: (userId: string) => void;
  optimisticallyUnfollow: (userId: string) => void;
};

type DashboardProfile = {
  status: boolean;
  flip_count: number;
  appearance?: any;

  // future
  background_color?: string | null;
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
  const [authLoading, setAuthLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [profileLoading, setProfileLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  const userReady = !authLoading && !profileLoading && !followingLoading;

  const loadFollowing = async (userId: string) => {
    setFollowingLoading(true);

    const { data, error } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", userId);

    if (!error && data) {
      setFollowingIds(new Set(data.map((f) => f.following_id)));
    } else {
      setFollowingIds(new Set());
    }

    setFollowingLoading(false);
  };

  const optimisticallyFollow = (userId: string) => {
    setFollowingIds((prev) => new Set(prev).add(userId));
  };

  const optimisticallyUnfollow = (userId: string) => {
    setFollowingIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  const loadProfile = async (userId: string) => {
    setProfileLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
      username,
      display_name,
      status,
      flip_count,
      appearance
      `,
      )
      .eq("id", userId)
      .maybeSingle(); // 👈 important

    // if (error) {
    //   setProfile(null);
    // } else {
    //   setProfile(data);
    // }
    if (error || !data) {
      setProfile(null);
    } else {
      // Merge backend appearance with defaults
      const appearance = { ...DEFAULT_APPEARANCE, ...data.appearance };
      setProfile({
        ...data,
        appearance,
      });
    }

    setProfileLoading(false);
  };

  const refreshProfile = async () => {
    if (!user) return;
    await loadProfile(user.id);
  };

  useEffect(() => {
    let mounted = true;

    const loadInitialSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(data.session);
      setUser(data.session?.user ?? null);

      // 🔑 AUTH READY — routing may proceed
      setAuthLoading(false);

      if (data.session?.user) {
        loadProfile(data.session.user.id);
        loadFollowing(data.session.user.id);
      }
    };

    loadInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);

      if (session?.user) {
        loadProfile(session.user.id);
        loadFollowing(session.user.id);
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
        authLoading,
        profileLoading,
        followingLoading,
        followingIds,
        userReady,
        refreshProfile,
        refreshFollowing: async () => {
          if (user) await loadFollowing(user.id);
        },
        optimisticallyFollow,
        optimisticallyUnfollow,
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
