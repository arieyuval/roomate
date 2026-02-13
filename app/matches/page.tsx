"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import MatchCard from "@/app/components/MatchCard";
import { MatchWithProfile } from "@/lib/types";
import { Heart } from "lucide-react";

export default function MatchesPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && !profile) {
      router.push("/onboarding");
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    if (user && profile) {
      fetchMatches();
    }
  }, [user, profile]);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    const res = await fetch("/api/matches");
    const data = await res.json();
    setMatches(data.matches || []);
    setLoadingMatches(false);
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

      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h1>

        {loadingMatches ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-uw-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart size={32} />
            </div>
            <p className="text-lg font-medium">No matches yet</p>
            <p className="text-sm mb-4">
              Keep browsing to find your future roommate
            </p>
            <button
              onClick={() => router.push("/browse")}
              className="px-6 py-2 bg-uw-purple text-white rounded-lg font-medium hover:bg-uw-purple-dark transition-colors"
            >
              Browse Profiles
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {matches.length} match{matches.length !== 1 ? "es" : ""} — reach
              out and connect!
            </p>
            {matches.map(
              (match) =>
                match.profile && (
                  <MatchCard
                    key={match.id}
                    profile={match.profile}
                    matchedAt={match.created_at}
                  />
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
