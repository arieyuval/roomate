"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Trash2 } from "lucide-react";
import ProfileForm from "@/app/components/ProfileForm";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import NavBar from "@/app/components/NavBar";

export default function EditProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [deactivating, setDeactivating] = useState(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && !profile) {
      router.push("/onboarding");
    }
  }, [user, profile, loading, router]);

  const toggleActive = async () => {
    if (!profile) return;
    setDeactivating(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, is_active: !profile.is_active }),
    });
    await refreshProfile();
    setDeactivating(false);
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
      <div className="max-w-lg mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-uw-purple hover:underline mb-4 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Profile
          </h1>
          <ProfileForm userId={user.id} initialData={profile} />

          {/* Profile visibility toggle */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={toggleActive}
              disabled={deactivating}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {profile.is_active ? (
                <>
                  <EyeOff size={16} />
                  Hide my profile from browse
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Show my profile in browse
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
