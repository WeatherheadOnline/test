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

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadInitialSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await loadProfile(data.session.user.id);
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
      } else {
        setProfile(null);
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
