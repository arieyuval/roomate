"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  GraduationCap,
  Clock,
  Briefcase,
  Calendar,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { Profile, Message } from "@/lib/types";

interface MatchCardProps {
  matchId: string;
  profile: Profile;
  matchedAt: string;
  lastMessage: Message | null;
  myMessageCount: number;
  currentUserId: string;
}

export default function MatchCard({
  matchId,
  profile,
  matchedAt,
  lastMessage,
  myMessageCount,
  currentUserId,
}: MatchCardProps) {
  const hasPhoto = profile.photo_urls && profile.photo_urls.length > 0;
  const matchDate = new Date(matchedAt);
  const timeAgo = getTimeAgo(matchDate);
  const hasStartedChat = lastMessage !== null;

  return (
    <Link
      href={`/matches/${matchId}`}
      className="block bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg hover:border-uw-purple/30 transition-all"
    >
      <div className="flex">
        {/* Photo */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 bg-gradient-to-br from-uw-purple to-uw-purple-light">
          {hasPhoto ? (
            <Image
              src={profile.photo_urls[0]}
              alt={profile.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🐺</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 min-w-0 flex flex-col">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {profile.name}, {profile.age}
            </h3>
            <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0 ml-2">
              <Clock size={12} />
              {timeAgo}
            </span>
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

          <div className="flex flex-wrap gap-1.5 mb-2">
            {profile.job_type && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-uw-purple/10 text-uw-purple text-xs font-medium">
                <Briefcase size={10} />
                {profile.job_type === "internship" ? "Intern" : "Full-time"}
              </span>
            )}
            {profile.move_in_date && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-uw-spirit-gold/20 text-uw-purple-dark text-xs font-medium">
                <Calendar size={10} />
                {new Date(profile.move_in_date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            {hasStartedChat && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                {10 - myMessageCount} msgs left
              </span>
            )}
          </div>

          {/* Message preview or CTA */}
          <div className="mt-auto flex items-center justify-between">
            {hasStartedChat ? (
              <p className="text-sm text-gray-500 truncate flex-1 mr-2">
                <MessageCircle
                  size={12}
                  className="inline mr-1 -mt-0.5"
                />
                {lastMessage.sender_id === currentUserId ? "You: " : ""}
                {lastMessage.content}
              </p>
            ) : (
              <p className="text-sm text-uw-spirit-gold font-medium">
                Start chatting!
              </p>
            )}
            <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
