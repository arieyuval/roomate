"use client";

import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { MAX_PHOTOS } from "@/lib/constants";

interface PhotoUploadProps {
  userId: string;
  photos: string[];
  onChange: (photos: string[]) => void;
}

export default function PhotoUpload({
  userId,
  photos,
  onChange,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createBrowserSupabaseClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || photos.length >= MAX_PHOTOS) return;

    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      const fileName = `${userId}/${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, compressed, { contentType: "image/webp" });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-photos").getPublicUrl(fileName);

      onChange([...photos, publicUrl]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = async (index: number) => {
    const url = photos[index];
    // Extract path from URL
    const path = url.split("/profile-photos/")[1];
    if (path) {
      await supabase.storage.from("profile-photos").remove([path]);
    }
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photos (optional, up to {MAX_PHOTOS})
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group"
          >
            <Image
              src={url}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-uw-purple hover:text-uw-purple transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-uw-purple border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Camera size={24} />
                <span className="text-xs">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
