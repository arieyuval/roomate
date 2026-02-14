"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  MapPin,
  DollarSign,
  GraduationCap,
  User,
  Users,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Profile } from "@/lib/types";
import InterestButtons from "./InterestButtons";

interface ProfileCardExpandedProps {
  profile: Profile;
  onClose: () => void;
  onInterested: () => Promise<void>;
  onPass?: () => Promise<void>;
  alreadySwiped?: boolean;
}

export default function ProfileCardExpanded({
  profile,
  onClose,
  onInterested,
  onPass,
  alreadySwiped = false,
}: ProfileCardExpandedProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const hasPhotos = profile.photo_urls && profile.photo_urls.length > 0;
  const multiplePhotos = profile.photo_urls && profile.photo_urls.length > 1;

  const prevPhoto = () => {
    setPhotoIndex((i) =>
      i === 0 ? profile.photo_urls.length - 1 : i - 1
    );
  };

  const nextPhoto = () => {
    setPhotoIndex((i) =>
      i === profile.photo_urls.length - 1 ? 0 : i + 1
    );
  };

  const genderPrefLabel =
    profile.same_gender_pref === "yes"
      ? "Same gender only"
      : profile.same_gender_pref === "no"
      ? "Any gender"
      : "No preference";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-pop-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Photo carousel */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-uw-purple to-uw-purple-light">
          {hasPhotos ? (
            <>
              <Image
                src={profile.photo_urls[photoIndex]}
                alt={profile.name}
                fill
                className="object-cover"
              />
              {multiplePhotos && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 hover:bg-black/50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 hover:bg-black/50"
                  >
                    <ChevronRight size={20} />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {profile.photo_urls.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === photoIndex
                            ? "bg-white scale-110"
                            : "bg-white/50"
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
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.name}, {profile.age}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.major && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-purple/10 text-uw-purple text-sm font-medium">
                <GraduationCap size={14} />
                {profile.major}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-purple/10 text-uw-purple text-sm font-medium">
              <MapPin size={14} />
              {profile.location}
            </span>
            {profile.max_price && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-spirit-gold/20 text-uw-purple-dark text-sm font-medium">
                <DollarSign size={14} />
                Up to ${profile.max_price}/mo
              </span>
            )}
            {profile.gender && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                <User size={14} />
                {profile.gender.charAt(0).toUpperCase() +
                  profile.gender.slice(1)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
              <Users size={14} />
              {genderPrefLabel}
            </span>
            {profile.job_type && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-purple/10 text-uw-purple text-sm font-medium">
                <Briefcase size={14} />
                {profile.job_type === "internship" ? "Internship (summer)" : "Full-time"}
              </span>
            )}
            {profile.move_in_date && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-uw-spirit-gold/20 text-uw-purple-dark text-sm font-medium">
                <Calendar size={14} />
                Moving {new Date(profile.move_in_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                About
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Action buttons */}
          {!alreadySwiped && onPass && (
            <div className="pt-2">
              <InterestButtons
                onInterested={onInterested}
                onPass={onPass}
              />
            </div>
          )}
          {!alreadySwiped && !onPass && (
            <div className="pt-2">
              <button
                onClick={onInterested}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-uw-spirit-gold hover:bg-yellow-400 text-uw-purple-dark font-bold transition-colors"
              >
                <Heart size={20} fill="currentColor" />
                Interested
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
