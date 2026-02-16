"use client";

import { LayoutGrid, Layers } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "swipe";
  onChange: (view: "grid" | "swipe") => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1">
      <button
        onClick={() => onChange("grid")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
          view === "grid"
            ? "bg-uw-purple text-white shadow-md"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <LayoutGrid size={16} />
        Grid
      </button>
      <button
        onClick={() => onChange("swipe")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
          view === "swipe"
            ? "bg-uw-purple text-white shadow-md"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Layers size={16} />
        Swipe
      </button>
    </div>
  );
}
