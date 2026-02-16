"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Users, Heart, MapPin } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen gradient-purple">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Roomate"
            width={120}
            height={120}
            className="mx-auto rounded-full"
            priority
          />
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 leading-tight">
          Find your Husky
          <br />
          <span className="text-uw-spirit-gold">roomate</span>
        </h1>
        <p className="text-xl text-uw-gold-light/80 max-w-lg mx-auto mb-10">
          The easiest way for UW students to find compatible roomates.
          No Facebook. No Reddit. Just Huskies helping Huskies.
        </p>

        <button
          onClick={() => router.push("/login")}
          className="inline-flex items-center gap-2 bg-uw-spirit-gold hover:bg-yellow-400 text-uw-purple-dark font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          Get Started
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Feature cards */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-uw-spirit-gold/20 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-uw-spirit-gold" />
            </div>
            <h3 className="text-white font-bold mb-2">Create Your Profile</h3>
            <p className="text-white/60 text-sm">
              Share your budget, location preferences, and what makes you a great roomate
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-uw-spirit-gold/20 rounded-xl flex items-center justify-center">
              <MapPin size={24} className="text-uw-spirit-gold" />
            </div>
            <h3 className="text-white font-bold mb-2">Browse & Filter</h3>
            <p className="text-white/60 text-sm">
              Find Huskies heading to the same area with compatible lifestyles and budgets
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-uw-spirit-gold/20 rounded-xl flex items-center justify-center">
              <Heart size={24} className="text-uw-spirit-gold" />
            </div>
            <h3 className="text-white font-bold mb-2">Match & Connect</h3>
            <p className="text-white/60 text-sm">
              When you both express interest, contact info is shared so you can connect
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-white/30 text-sm">
          Made for Huskies, by Huskies
        </p>
      </div>
    </div>
  );
}
