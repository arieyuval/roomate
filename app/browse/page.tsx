"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/types";
import NavBar from "@/app/components/NavBar";
import ProfileCard from "@/app/components/ProfileCard";
import ProfileCardExpanded from "@/app/components/ProfileCardExpanded";
import SwipeView from "@/app/components/SwipeView";
import FilterBar, { Filters } from "@/app/components/FilterBar";
import ViewToggle from "@/app/components/ViewToggle";
import MatchModal from "@/app/components/MatchModal";

export default function BrowsePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [view, setView] = useState<"grid" | "swipe">("grid");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [matchedName, setMatchedName] = useState<string | null>(null);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    region: "",
    gender: "",
    max_price: "",
    major: "",
    same_gender_pref: "",
    job_type: "",
    move_in_date: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && !profile) {
      router.push("/onboarding");
    }
  }, [user, profile, loading, router]);

  // Auto-tailor: seed filters from user's profile on first load
  useEffect(() => {
    if (profile && !filtersInitialized) {
      setFilters((prev) => ({
        ...prev,
        region: profile.region || "",
        job_type: profile.job_type || "",
      }));
      setFiltersInitialized(true);
    }
  }, [profile, filtersInitialized]);

  const fetchProfiles = useCallback(async () => {
    setLoadingProfiles(true);
    const params = new URLSearchParams();
    if (filters.region) params.set("region", filters.region);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.major) params.set("major", filters.major);
    if (filters.same_gender_pref)
      params.set("same_gender_pref", filters.same_gender_pref);
    if (filters.job_type) params.set("job_type", filters.job_type);
    if (filters.move_in_date) params.set("move_in_date", filters.move_in_date);

    const res = await fetch(`/api/profiles?${params.toString()}`);
    const data = await res.json();
    setProfiles(data.profiles || []);
    setLoadingProfiles(false);
  }, [filters]);

  useEffect(() => {
    if (user && profile) {
      fetchProfiles();
    }
  }, [user, profile, fetchProfiles]);

  const handleSwipe = async (
    profileId: string,
    action: "interested" | "pass"
  ) => {
    const res = await fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swiped_id: profileId, action }),
    });
    const data = await res.json();

    if (action === "interested" && data.matched) {
      const matchedProfile = profiles.find((p) => p.user_id === profileId);
      setMatchedName(matchedProfile?.name || "someone");
    }

    // Remove swiped profile from list
    setProfiles((prev) => prev.filter((p) => p.user_id !== profileId));
    return data.matched || false;
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-uw-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Browse Huskies</h1>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Content */}
        {loadingProfiles ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-uw-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-6xl mb-4">🐺</span>
            <p className="text-lg font-medium">No profiles found</p>
            <p className="text-sm">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {profiles.map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                onClick={() => setSelectedProfile(p)}
              />
            ))}
          </div>
        ) : (
          <SwipeView
            profiles={profiles}
            onInterested={(id) => handleSwipe(id, "interested")}
            onPass={(id) => handleSwipe(id, "pass").then(() => {})}
          />
        )}
      </div>

      {/* Expanded profile modal */}
      {selectedProfile && (
        <ProfileCardExpanded
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onInterested={async () => {
            await handleSwipe(selectedProfile.user_id, "interested");
            setSelectedProfile(null);
          }}
          onPass={async () => {
            await handleSwipe(selectedProfile.user_id, "pass");
            setSelectedProfile(null);
          }}
        />
      )}

      {/* Match modal */}
      {matchedName && (
        <MatchModal
          matchName={matchedName}
          onClose={() => setMatchedName(null)}
        />
      )}
    </div>
  );
}
