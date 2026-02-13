"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileForm from "@/app/components/ProfileForm";

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && profile) {
      router.push("/browse");
    }
  }, [user, profile, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-uw-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-purple py-8 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, Husky! 🐺
          </h1>
          <p className="text-uw-gold-light">
            Let&apos;s set up your profile so other students can find you
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto px-4 py-8 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ProfileForm userId={user.id} isOnboarding />
        </div>
      </div>
    </div>
  );
}
