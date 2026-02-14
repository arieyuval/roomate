"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
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
  const profileFetchedFor = useRef<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      profileFetchedFor.current = null;
      await fetchProfile(user.id);
      profileFetchedFor.current = user.id;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      try {
        // Step 1: Fast local check — reads JWT from cookie, no network call
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (cancelled) return;

        if (!session) {
          // No session cookie at all — user is not signed in
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        // Step 2: Validate session with server — handles token refresh if expired
        const {
          data: { user: validatedUser },
          error,
        } = await supabase.auth.getUser();
        if (cancelled) return;

        if (error || !validatedUser) {
          // Session expired and couldn't refresh — treat as signed out
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        // Step 3: Session is valid — fetch profile
        setUser(validatedUser);
        profileFetchedFor.current = validatedUser.id;
        await fetchProfile(validatedUser.id);
      } catch {
        if (!cancelled) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initSession();

    // Safety net: if loading hasn't resolved after 8s, force it
    // (e.g. network offline). Does NOT clear user state.
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setLoading(false);
      }
    }, 8000);

    // Listen for auth changes after initial load
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION" || cancelled) return;

      const currentUser = session?.user ?? null;

      if (event === "SIGNED_IN") {
        // User just signed in — set loading so destination pages show spinner
        // while we fetch their profile
        setLoading(true);
        setUser(currentUser);
        if (currentUser) {
          profileFetchedFor.current = currentUser.id;
          await fetchProfile(currentUser.id);
        }
        if (!cancelled) setLoading(false);
        return;
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        profileFetchedFor.current = null;
        return;
      }

      if (event === "TOKEN_REFRESHED") {
        // Token was silently refreshed — update user, re-fetch profile
        // if it wasn't loaded (e.g. previous fetch failed with expired token)
        setUser(currentUser);
        if (currentUser && profileFetchedFor.current !== currentUser.id) {
          profileFetchedFor.current = currentUser.id;
          await fetchProfile(currentUser.id);
        }
        return;
      }

      // Default handler for other events
      setUser(currentUser);
      if (currentUser) {
        if (profileFetchedFor.current !== currentUser.id) {
          profileFetchedFor.current = currentUser.id;
          await fetchProfile(currentUser.id);
        }
      } else {
        profileFetchedFor.current = null;
        setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    profileFetchedFor.current = null;
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
