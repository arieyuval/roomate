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
import { RotateCcw, Heart } from "lucide-react";

type Tab = "browse" | "dismissed";

export default function BrowsePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [dismissedProfiles, setDismissedProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingDismissed, setLoadingDismissed] = useState(false);
  const [tab, setTab] = useState<Tab>("browse");
  const [view, setView] = useState<"grid" | "swipe">("grid");

  // Default to swipe view on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setView("swipe");
    }
  }, []);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [matchedName, setMatchedName] = useState<string | null>(null);
  const [matchedId, setMatchedId] = useState<string | null>(null);
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
    console.log("[BROWSE] auth state:", { loading, user: user?.id, profile: profile?.user_id });
    if (!loading && !user) {
      console.log("[BROWSE] → redirecting to /login (no user)");
      router.push("/login");
    }
    if (!loading && user && !profile) {
      console.log("[BROWSE] → redirecting to /onboarding (no profile)");
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

  const fetchDismissed = useCallback(async () => {
    setLoadingDismissed(true);
    const res = await fetch("/api/swipes/passed");
    const data = await res.json();
    setDismissedProfiles(data.profiles || []);
    setLoadingDismissed(false);
  }, []);

  useEffect(() => {
    if (user && profile) {
      fetchProfiles();
    }
  }, [user, profile, fetchProfiles]);

  // Fetch dismissed profiles when switching to that tab
  useEffect(() => {
    if (tab === "dismissed" && user && profile) {
      fetchDismissed();
    }
  }, [tab, user, profile, fetchDismissed]);

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
      setMatchedId(data.match_id || null);
    }

    // Remove swiped profile from list
    setProfiles((prev) => prev.filter((p) => p.user_id !== profileId));
    return data.matched || false;
  };

  const handleUndoDismiss = async (dismissedProfile: Profile) => {
    // Delete the pass swipe
    await fetch("/api/swipes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swiped_id: dismissedProfile.user_id }),
    });

    // Now express interest
    const res = await fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        swiped_id: dismissedProfile.user_id,
        action: "interested",
      }),
    });
    const data = await res.json();

    if (data.matched) {
      setMatchedName(dismissedProfile.name || "someone");
    }

    // Remove from dismissed list
    setDismissedProfiles((prev) =>
      prev.filter((p) => p.user_id !== dismissedProfile.user_id)
    );
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

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTab("browse")}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                tab === "browse"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setTab("dismissed")}
              className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 ${
                tab === "dismissed"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <RotateCcw size={14} />
              Dismissed
            </button>
            <button
              onClick={() => router.push("/matches")}
              className="px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              <Heart size={14} />
              Matches
            </button>
          </div>
          {tab === "browse" && <ViewToggle view={view} onChange={setView} />}
        </div>

        {tab === "browse" ? (
          <>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
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
          </>
        ) : (
          <>
            {/* Dismissed tab */}
            <p className="text-sm text-gray-500 mb-4">
              Profiles you passed on. Tap &quot;Interested&quot; to reconsider.
            </p>

            {loadingDismissed ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-uw-purple border-t-transparent rounded-full animate-spin" />
              </div>
            ) : dismissedProfiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RotateCcw size={40} className="mb-4" />
                <p className="text-lg font-medium">No dismissed profiles</p>
                <p className="text-sm">
                  Profiles you pass on will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {dismissedProfiles.map((p) => (
                  <ProfileCard
                    key={p.id}
                    profile={p}
                    onClick={() => setSelectedProfile(p)}
                    dismissed
                    onUndoDismiss={() => handleUndoDismiss(p)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Expanded profile modal */}
      {selectedProfile && (
        <ProfileCardExpanded
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onInterested={async () => {
            if (tab === "dismissed") {
              await handleUndoDismiss(selectedProfile);
            } else {
              await handleSwipe(selectedProfile.user_id, "interested");
            }
            setSelectedProfile(null);
          }}
          onPass={
            tab === "browse"
              ? async () => {
                  await handleSwipe(selectedProfile.user_id, "pass");
                  setSelectedProfile(null);
                }
              : undefined
          }
        />
      )}

      {/* Match modal */}
      {matchedName && (
        <MatchModal
          matchName={matchedName}
          matchId={matchedId || undefined}
          onClose={() => {
            setMatchedName(null);
            setMatchedId(null);
          }}
        />
      )}
    </div>
  );
}
