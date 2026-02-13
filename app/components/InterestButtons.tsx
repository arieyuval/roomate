"use client";

import { useState } from "react";
import { Heart, X, Loader2 } from "lucide-react";

interface InterestButtonsProps {
  onInterested: () => Promise<void>;
  onPass: () => Promise<void>;
  size?: "sm" | "lg";
}

export default function InterestButtons({
  onInterested,
  onPass,
  size = "lg",
}: InterestButtonsProps) {
  const [loading, setLoading] = useState<"interested" | "pass" | null>(null);

  const handleInterested = async () => {
    setLoading("interested");
    await onInterested();
    setLoading(null);
  };

  const handlePass = async () => {
    setLoading("pass");
    await onPass();
    setLoading(null);
  };

  const isLarge = size === "lg";

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={handlePass}
        disabled={loading !== null}
        className={`rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all flex items-center justify-center disabled:opacity-50 ${
          isLarge ? "w-16 h-16" : "w-12 h-12"
        }`}
        title="Pass"
      >
        {loading === "pass" ? (
          <Loader2 size={isLarge ? 24 : 18} className="animate-spin" />
        ) : (
          <X size={isLarge ? 28 : 20} />
        )}
      </button>

      <button
        onClick={handleInterested}
        disabled={loading !== null}
        className={`rounded-full bg-uw-spirit-gold hover:bg-yellow-400 text-uw-purple-dark transition-all flex items-center justify-center disabled:opacity-50 shadow-lg hover:shadow-xl ${
          isLarge ? "w-20 h-20" : "w-14 h-14"
        }`}
        title="Interested"
      >
        {loading === "interested" ? (
          <Loader2 size={isLarge ? 28 : 20} className="animate-spin" />
        ) : (
          <Heart size={isLarge ? 32 : 22} fill="currentColor" />
        )}
      </button>
    </div>
  );
}
