"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { Profile } from "@/lib/types";
import {
  GENDER_OPTIONS,
  SAME_GENDER_PREF_OPTIONS,
  JOB_TYPE_OPTIONS,
  POPULAR_MAJORS,
  REGION_OPTIONS,
} from "@/lib/constants";
import PhotoUpload from "./PhotoUpload";

interface ProfileFormProps {
  userId: string;
  initialData?: Partial<Profile>;
  isOnboarding?: boolean;
  onSaved?: () => Promise<void>;
}

export default function ProfileForm({
  userId,
  initialData,
  isOnboarding = false,
  onSaved,
}: ProfileFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: initialData?.name || "",
    age: initialData?.age || "",
    major: initialData?.major || "",
    gender: initialData?.gender || "",
    location: initialData?.location || "",
    region: initialData?.region || "",
    same_gender_pref: initialData?.same_gender_pref || "no_preference",
    max_price: initialData?.max_price || "",
    move_in_date: initialData?.move_in_date?.slice(0, 7) || "",
    job_type: initialData?.job_type || "",
    bio: initialData?.bio || "",
    contact_info: initialData?.contact_info || "",
    photo_urls: initialData?.photo_urls || [],
  });

  const updateField = (field: string, value: string | number | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          max_price: form.max_price ? Number(form.max_price) : null,
          move_in_date: form.move_in_date || null,
          job_type: form.job_type || null,
          region: form.region || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      if (onSaved) {
        await onSaved();
      }
      router.push("/browse");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photos */}
      <PhotoUpload
        userId={userId}
        photos={form.photo_urls as string[]}
        onChange={(photos) => updateField("photo_urls", photos)}
      />

      {/* Name & Age */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your name"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age *
          </label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => updateField("age", e.target.value)}
            placeholder="20"
            required
            min={16}
            max={99}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Major */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Major
        </label>
        <input
          type="text"
          value={form.major}
          onChange={(e) => updateField("major", e.target.value)}
          placeholder="e.g. Computer Science"
          list="majors-list"
          autoComplete="off"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-list-button]:hidden"
        />
        <datalist id="majors-list">
          {POPULAR_MAJORS.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          value={form.gender}
          onChange={(e) => updateField("gender", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none bg-white"
        >
          <option value="">Prefer not to say</option>
          {GENDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What city are you looking to live in *
        </label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          placeholder="e.g. Seattle, WA"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
        />
      </div>

      {/* Region / Metro Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What general Metropolitain area are you looking to live in? (Select) *
        </label>
        <input
          type="text"
          value={REGION_OPTIONS.find((o) => o.value === form.region)?.label || form.region}
          onChange={(e) => {
            const match = REGION_OPTIONS.find((o) => o.label === e.target.value);
            updateField("region", match ? match.value : e.target.value);
          }}
          onBlur={(e) => {
            const match = REGION_OPTIONS.find((o) => o.label === e.target.value);
            if (!match) updateField("region", "");
          }}
          placeholder="Search for a metro area..."
          required
          list="regions-list"
          autoComplete="off"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-list-button]:hidden"
        />
        <datalist id="regions-list">
          {REGION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.label} />
          ))}
        </datalist>
        <p className="text-xs text-gray-400 mt-1">
          People in the same metro area will see each other
        </p>
      </div>

      {/* Same gender preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roommate gender preference
        </label>
        <div className="flex flex-wrap gap-2">
          {SAME_GENDER_PREF_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField("same_gender_pref", opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                form.same_gender_pref === opt.value
                  ? "bg-uw-purple text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max monthly budget ($)
        </label>
        <input
          type="number"
          value={form.max_price}
          onChange={(e) => updateField("max_price", e.target.value)}
          placeholder="e.g. 1200"
          min={0}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
        />
      </div>

      {/* Move-in Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          When are you looking to move in?
        </label>
        <input
          type="month"
          value={form.move_in_date}
          onChange={(e) => updateField("move_in_date", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
        />
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What brings you there?
        </label>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                updateField(
                  "job_type",
                  form.job_type === opt.value ? "" : opt.value
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                form.job_type === opt.value
                  ? "bg-uw-purple text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About you
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Write a short bio so potential roommates can get to know you
        </p>
        <textarea
          value={form.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          placeholder="Tell potential roommates about yourself — your habits, hobbies, what you're looking for..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none resize-none"
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {(form.bio || "").length}/500
        </p>
      </div>

      {/* Contact Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact info (shown only to matches)
        </label>
        <input
          type="text"
          value={form.contact_info}
          onChange={(e) => updateField("contact_info", e.target.value)}
          placeholder="e.g. Instagram: @yourhandle, or email"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          This is only visible to people you match with
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-uw-spirit-gold hover:bg-yellow-500 text-uw-purple-dark font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            <Save size={18} />
            {isOnboarding ? "Create Profile & Start Browsing" : "Save Changes"}
          </>
        )}
      </button>
    </form>
  );
}
