"use client";

import Image from "next/image";
import { MapPin, DollarSign, GraduationCap, Briefcase, Calendar, Heart } from "lucide-react";
import { Profile } from "@/lib/types";

interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
  dismissed?: boolean;
  onUndoDismiss?: () => void;
}

export default function ProfileCard({ profile, onClick, dismissed, onUndoDismiss }: ProfileCardProps) {
  const hasPhoto = profile.photo_urls && profile.photo_urls.length > 0;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group cursor-pointer border border-gray-100 hover:border-uw-purple/30"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-uw-purple to-uw-purple-light overflow-hidden">
        {hasPhoto ? (
          <Image
            src={profile.photo_urls[0]}
            alt={profile.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🐺</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {profile.name}, {profile.age}
          </h3>
        </div>

        {profile.major && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
            <GraduationCap size={14} />
            <span className="truncate">{profile.major}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
          <MapPin size={14} />
          <span className="truncate">{profile.location}</span>
        </div>

        {profile.max_price && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <DollarSign size={14} />
            <span>Up to ${profile.max_price}/mo</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-2">
          {profile.job_type && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-uw-purple/10 text-uw-purple text-xs font-medium">
              <Briefcase size={10} />
              {profile.job_type === "internship" ? "Intern" : "Full-time"}
            </span>
          )}
          {profile.move_in_date && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-uw-spirit-gold/20 text-uw-purple-dark text-xs font-medium">
              <Calendar size={10} />
              {new Date(profile.move_in_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          )}
        </div>

        {dismissed && onUndoDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUndoDismiss();
            }}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-uw-spirit-gold hover:bg-yellow-400 text-uw-purple-dark text-sm font-semibold transition-colors"
          >
            <Heart size={14} fill="currentColor" />
            Interested
          </button>
        )}
      </div>
    </button>
  );
}
