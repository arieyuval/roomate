"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  MapPin,
  DollarSign,
  GraduationCap,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Profile } from "@/lib/types";
import InterestButtons from "./InterestButtons";

interface SwipeViewProps {
  profiles: Profile[];
  onInterested: (profileId: string) => Promise<boolean>;
  onPass: (profileId: string) => Promise<void>;
}

export default function SwipeView({
  profiles,
  onInterested,
  onPass,
}: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState<"left" | "right" | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const [dragX, setDragX] = useState(0);

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-6xl mb-4">🐺</span>
        <p className="text-lg font-medium">No more profiles to show</p>
        <p className="text-sm">Check back later or adjust your filters</p>
      </div>
    );
  }

  const advance = () => {
    setCurrentIndex((i) => i + 1);
    setPhotoIndex(0);
    setAnimating(null);
  };

  const handleInterested = async () => {
    setAnimating("right");
    const matched = await onInterested(currentProfile.user_id);
    setTimeout(advance, 400);
    return matched;
  };

  const handlePass = async () => {
    setAnimating("left");
    await onPass(currentProfile.user_id);
    setTimeout(advance, 400);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    setDragX(touchDeltaX.current);
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > 100) {
      handleInterested();
    } else if (touchDeltaX.current < -100) {
      handlePass();
    }
    setDragX(0);
    touchDeltaX.current = 0;
  };

  const hasPhotos =
    currentProfile.photo_urls && currentProfile.photo_urls.length > 0;
  const multiplePhotos =
    currentProfile.photo_urls && currentProfile.photo_urls.length > 1;

  const genderPrefLabel =
    currentProfile.same_gender_pref === "yes"
      ? "Same gender only"
      : currentProfile.same_gender_pref === "no"
      ? "Any gender"
      : "No preference";

  return (
    <div className="max-w-md mx-auto">
      {/* Counter */}
      <p className="text-center text-sm text-gray-400 mb-3">
        {currentIndex + 1} of {profiles.length}
      </p>

      {/* Card */}
      <div
        className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 ${
          animating === "right"
            ? "animate-slide-right"
            : animating === "left"
            ? "animate-slide-left"
            : ""
        }`}
        style={
          !animating && dragX !== 0
            ? {
                transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
              }
            : undefined
        }
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Photo */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-uw-purple to-uw-purple-light">
          {hasPhotos ? (
            <>
              <Image
                src={currentProfile.photo_urls[photoIndex]}
                alt={currentProfile.name}
                fill
                className="object-cover"
              />
              {multiplePhotos && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoIndex((i) =>
                        i === 0
                          ? currentProfile.photo_urls.length - 1
                          : i - 1
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoIndex((i) =>
                        i === currentProfile.photo_urls.length - 1
                          ? 0
                          : i + 1
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {currentProfile.photo_urls.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === photoIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl">🐺</span>
            </div>
          )}

          {/* Swipe indicators */}
          {dragX > 50 && (
            <div className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg rotate-[-15deg]">
              INTERESTED
            </div>
          )}
          {dragX < -50 && (
            <div className="absolute top-8 right-8 bg-red-400 text-white px-4 py-2 rounded-lg font-bold text-lg rotate-[15deg]">
              PASS
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentProfile.name}, {currentProfile.age}
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {currentProfile.major && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-purple/10 text-uw-purple text-sm font-medium">
                <GraduationCap size={14} />
                {currentProfile.major}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-purple/10 text-uw-purple text-sm font-medium">
              <MapPin size={14} />
              {currentProfile.location}
            </span>
            {currentProfile.max_price && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-spirit-gold/20 text-uw-purple-dark text-sm font-medium">
                <DollarSign size={14} />
                ${currentProfile.max_price}/mo
              </span>
            )}
            {currentProfile.job_type && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-purple/10 text-uw-purple text-sm font-medium">
                <Briefcase size={14} />
                {currentProfile.job_type === "internship" ? "Intern" : "Full-time"}
              </span>
            )}
            {currentProfile.move_in_date && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-spirit-gold/20 text-uw-purple-dark text-sm font-medium">
                <Calendar size={14} />
                {new Date(currentProfile.move_in_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            )}
          </div>

          {currentProfile.bio && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-2">
              {currentProfile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6">
        <InterestButtons
          onInterested={async () => {
            await handleInterested();
          }}
          onPass={handlePass}
        />
      </div>
    </div>
  );
}
