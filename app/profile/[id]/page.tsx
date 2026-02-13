"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { useAuth } from "@/app/context/AuthContext";
import { Profile } from "@/lib/types";
import NavBar from "@/app/components/NavBar";
import ProfileCardExpanded from "@/app/components/ProfileCardExpanded";

export default function ViewProfilePage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user && id) {
      fetchProfile();
    }
  }, [user, loading, id]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", id)
      .single();
    setProfile(data);
    setLoadingProfile(false);
  };

  const handleSwipe = async (action: "interested" | "pass") => {
    await fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swiped_id: id, action }),
    });
    router.push("/browse");
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-uw-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-6xl mb-4">🐺</span>
          <p className="text-lg font-medium">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileCardExpanded
      profile={profile}
      onClose={() => router.back()}
      onInterested={() => handleSwipe("interested")}
      onPass={() => handleSwipe("pass")}
    />
  );
}
