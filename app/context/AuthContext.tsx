"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Profile } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  const fetchProfile = async (userId: string) => {
    console.log("[AUTH] fetchProfile start", userId);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      console.log("[AUTH] fetchProfile result", { data: !!data, error });
      setProfile(data);
    } catch (err) {
      console.error("[AUTH] fetchProfile threw", err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    console.log("[AUTH] useEffect running, starting getUser...");

    const getUser = async () => {
      try {
        console.log("[AUTH] getUser: calling supabase.auth.getUser()...");
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        console.log("[AUTH] getUser: result", { userId: user?.id, error });
        setUser(user);
        if (user) {
          await fetchProfile(user.id);
        }
      } catch (err) {
        console.error("[AUTH] getUser threw", err);
        setUser(null);
        setProfile(null);
      } finally {
        console.log("[AUTH] getUser: setLoading(false)");
        setLoading(false);
      }
    };

    getUser();

    console.log("[AUTH] registering onAuthStateChange...");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("[AUTH] onAuthStateChange fired", { event: _event, userId: session?.user?.id });
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      console.log("[AUTH] onAuthStateChange: setLoading(false)");
      setLoading(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
