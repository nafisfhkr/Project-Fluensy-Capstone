"use client";
// ============================================================
// FILE: src/components/CreatorCard.tsx
// Card kreator lengkap: avatar, stats, konten grid, tombol aksi
// ============================================================

import { useState } from "react";
import { Bookmark, Play } from "lucide-react";
import type { Creator } from "@/types";

interface CreatorCardProps {
  creator: Creator;
  onToggleSave: (id: number) => void;
}

// Platform icon badge
function PlatformBadge({ platform }: { platform: string }) {
  const map: Record<string, { bg: string; label: string }> = {
    yt: { bg: "bg-red-500",    label: "YT" },
    ig: { bg: "bg-pink-500",   label: "IG" },
    tt: { bg: "bg-gray-900",   label: "TT" },
  };
  const item = map[platform] ?? { bg: "bg-gray-400", label: platform.toUpperCase() };
  return (
    <span className={`${item.bg} text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full`}>
      {item.label}
    </span>
  );
}

// Verified checkmark
function Verified() {
  return (
    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

export default function CreatorCard({ creator, onToggleSave }: CreatorCardProps) {
  const [saved, setSaved] = useState<boolean>(creator.saved ?? false);

  const handleSave = () => {
    setSaved(!saved);
    onToggleSave(creator.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* ── Top: Creator Info + Stats + Actions ── */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-4">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-gray-900 whitespace-nowrap">
                {creator.name}
              </span>
              <Verified />
            </div>
            <span className="text-xs text-gray-500">{creator.handle}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">{creator.location}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full inline-block" />
              <span className="text-xs text-gray-500">{creator.category}</span>
            </div>
            {/* Platform icons */}
            <div className="flex items-center gap-1 mt-0.5">
              {creator.platformIcons.map((p) => (
                <PlatformBadge key={p} platform={p} />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 ml-4">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs text-gray-500 font-medium">Followers</span>
            <span className="text-lg font-bold text-sky-950">{creator.followers}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs text-gray-500 font-medium">Engagement</span>
            <span className="text-lg font-bold text-sky-950">{creator.engagement}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs text-gray-500 font-medium">Avg Views</span>
            <span className="text-lg font-bold text-sky-950">{creator.avgViews}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap">
            Lihat Rate Card
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border transition-all whitespace-nowrap ${
              saved
                ? "bg-blue-50 border-blue-600 text-blue-600"
                : "bg-white border-gray-300 text-gray-600 hover:border-blue-400"
            }`}
          >
            {saved ? "Tersimpan" : "Simpan"}
          </button>
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={saved}
            onChange={handleSave}
            className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
          />
        </div>
      </div>

      {/* ── Bottom: Content Grid ── */}
      <div className="grid grid-cols-4 gap-1 px-1 pb-1">
        {creator.recentContent.map((post) => (
          <div key={post.id} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group">
            <img
              src={post.imageUrl}
              alt="konten kreator"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Video badge */}
            {post.type === "video" && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-md flex items-center justify-center">
                <Play className="w-3 h-3 text-gray-700 fill-gray-700" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}