"use client";

import { Heart, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface MatchModalProps {
  matchName: string;
  onClose: () => void;
}

export default function MatchModal({ matchName, onClose }: MatchModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl p-8 max-w-sm mx-4 text-center animate-pop-in shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="mb-4">
          <div className="w-20 h-20 mx-auto bg-uw-spirit-gold rounded-full flex items-center justify-center mb-4">
            <Heart size={40} className="text-uw-purple-dark" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            It&apos;s a Match! 🎉
          </h2>
          <p className="text-gray-500">
            You and <span className="font-semibold text-uw-purple">{matchName}</span> are both interested!
          </p>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Head to your matches to see their contact info
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Keep Browsing
          </button>
          <button
            onClick={() => router.push("/matches")}
            className="flex-1 px-4 py-3 rounded-lg bg-uw-purple text-white font-medium hover:bg-uw-purple-dark transition-colors"
          >
            View Matches
          </button>
        </div>
      </div>
    </div>
  );
}
