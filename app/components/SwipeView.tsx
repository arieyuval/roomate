"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  MapPin,
  DollarSign,
  GraduationCap,
  Briefcase,
  Calendar,
  ThumbsDown,
  Heart,
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
  const touchStartY = useRef(0);
  const touchDeltaX = useRef(0);
  const isHorizontalSwipe = useRef(false);
  const swipeLocked = useRef(false);
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

  const hasPhotos =
    currentProfile.photo_urls && currentProfile.photo_urls.length > 0;
  const multiplePhotos =
    currentProfile.photo_urls && currentProfile.photo_urls.length > 1;

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

  // Swipe gestures — only on the info section, NOT the photo area
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = false;
    swipeLocked.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // Lock direction on first significant movement
    if (!swipeLocked.current && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
      swipeLocked.current = true;
    }

    if (isHorizontalSwipe.current) {
      touchDeltaX.current = dx;
      setDragX(dx);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current) {
      if (touchDeltaX.current > 120) {
        handleInterested();
      } else if (touchDeltaX.current < -120) {
        handlePass();
      }
    }
    setDragX(0);
    touchDeltaX.current = 0;
    isHorizontalSwipe.current = false;
    swipeLocked.current = false;
  };

  // Photo tap navigation — tap left/right halves of photo
  const handlePhotoTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!multiplePhotos) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    if (tapX < rect.width / 2) {
      setPhotoIndex((i) =>
        i === 0 ? currentProfile.photo_urls.length - 1 : i - 1
      );
    } else {
      setPhotoIndex((i) =>
        i === currentProfile.photo_urls.length - 1 ? 0 : i + 1
      );
    }
  };

  // Drag intensity for visual feedback (0 to 1)
  const dragIntensity = Math.min(Math.abs(dragX) / 120, 1);

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
      >
        {/* Photo — tap to navigate, NO swipe here */}
        <div
          className="relative aspect-[3/4] max-h-[60vh] sm:max-h-none overflow-hidden bg-gradient-to-br from-uw-purple to-uw-purple-light cursor-pointer"
          onClick={handlePhotoTap}
        >
          {hasPhotos ? (
            <>
              <Image
                src={currentProfile.photo_urls[photoIndex]}
                alt={currentProfile.name}
                fill
                className="object-cover object-center"
              />
              {/* Photo progress bars at top (like Tinder/Hinge) */}
              {multiplePhotos && (
                <div className="absolute top-2 left-3 right-3 flex gap-1 z-10">
                  {currentProfile.photo_urls.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full overflow-hidden bg-white/30"
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-200 ${
                          i <= photoIndex ? "bg-white w-full" : "w-0"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}
              {/* Tap hint on first photo if multiple */}
              {multiplePhotos && photoIndex === 0 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white/90 text-xs px-3 py-1 rounded-full pointer-events-none">
                  Tap photo to see more
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl">🐺</span>
            </div>
          )}

          {/* Swipe indicators — overlays during drag */}
          {dragX > 30 && (
            <div
              className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none transition-opacity"
              style={{ opacity: dragIntensity }}
            >
              <div className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-xl rotate-[-15deg] shadow-lg">
                INTERESTED
              </div>
            </div>
          )}
          {dragX < -30 && (
            <div
              className="absolute inset-0 bg-red-400/20 flex items-center justify-center pointer-events-none transition-opacity"
              style={{ opacity: dragIntensity }}
            >
              <div className="bg-red-400 text-white px-6 py-3 rounded-xl font-bold text-xl rotate-[15deg] shadow-lg">
                PASS
              </div>
            </div>
          )}
        </div>

        {/* Info — swipe gestures live here */}
        <div
          className="p-5"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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

      {/* Swipe hint */}
      <div className="flex items-center justify-between px-6 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <ThumbsDown size={12} />
          Swipe left to pass
        </span>
        <span className="flex items-center gap-1">
          Swipe right if interested
          <Heart size={12} />
        </span>
      </div>

      {/* Buttons */}
      <div className="mt-4">
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
