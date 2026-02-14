"use client";

import { UserX } from "lucide-react";

interface UnmatchDialogProps {
  matchName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function UnmatchDialog({
  matchName,
  onConfirm,
  onCancel,
  loading,
}: UnmatchDialogProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-pop-in">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
          <UserX size={28} className="text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Unmatch with {matchName}?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          This will delete all messages and cannot be undone. You won&apos;t see
          each other in browse again.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Unmatch"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
