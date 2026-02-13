"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { GENDER_OPTIONS, JOB_TYPE_OPTIONS } from "@/lib/constants";

export interface Filters {
  location: string;
  gender: string;
  max_price: string;
  major: string;
  same_gender_pref: string;
  job_type: string;
  move_in_date: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const emptyFilters: Filters = {
  location: "",
  gender: "",
  max_price: "",
  major: "",
  same_gender_pref: "",
  job_type: "",
  move_in_date: "",
};

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const clearFilters = () => onChange(emptyFilters);

  const updateFilter = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      {/* Toggle bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span className="bg-uw-purple text-white text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFilters();
            }}
            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </button>

      {/* Filter fields */}
      {expanded && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 border-t border-gray-100 pt-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              placeholder="Any"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => updateFilter("gender", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none bg-white"
            >
              <option value="">Any</option>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Max Budget
            </label>
            <input
              type="number"
              value={filters.max_price}
              onChange={(e) => updateFilter("max_price", e.target.value)}
              placeholder="Any"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Major
            </label>
            <input
              type="text"
              value={filters.major}
              onChange={(e) => updateFilter("major", e.target.value)}
              placeholder="Any"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Gender Pref
            </label>
            <select
              value={filters.same_gender_pref}
              onChange={(e) =>
                updateFilter("same_gender_pref", e.target.value)
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none bg-white"
            >
              <option value="">Any</option>
              <option value="yes">Same gender only</option>
              <option value="no">Any gender</option>
              <option value="no_preference">No preference</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Job Type
            </label>
            <select
              value={filters.job_type}
              onChange={(e) => updateFilter("job_type", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none bg-white"
            >
              <option value="">Any</option>
              {JOB_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Move-in Date
            </label>
            <input
              type="month"
              value={filters.move_in_date}
              onChange={(e) => updateFilter("move_in_date", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
