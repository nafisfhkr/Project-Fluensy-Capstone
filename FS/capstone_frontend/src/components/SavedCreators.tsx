// ============================================================
// FILE: src/components/SavedCreators.tsx
// Dashboard widget — mini list. Klik "Lihat Semua" → /saved-creators
// ============================================================

import Link from "next/link";
import type { Creator } from "@/types";

interface SavedCreatorsProps {
  creators: Creator[];
  loading: boolean;
  error: string | null;
}

export default function SavedCreators({ creators, loading, error }: SavedCreatorsProps) {
  return (
    <div className="w-full lg:w-80 xl:w-96 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
      <h3 className="text-lg font-bold text-black px-1">Kreator yang di Simpan</h3>

      <div className="flex flex-col gap-2.5 bg-white rounded-2xl p-3">
        {loading && [1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}

        {error && (
          <p className="text-center py-4 text-red-500 text-sm">{error}</p>
        )}

        {!loading && !error && creators.slice(0, 3).map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2.5">
              <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex flex-col gap-[3px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-black">{c.name}</span>
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{c.handle}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{c.location}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full inline-block" />
                  <span className="text-xs text-gray-500">{c.category}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5 w-20">
              <span className="text-xs font-medium text-slate-500">Followers</span>
              <span className="text-lg font-semibold text-sky-950">{c.followers}</span>
            </div>
          </div>
        ))}

        {!loading && !error && (
          <div className="flex justify-center mt-1">
            <Link
              href="/saved-creators"
              className="px-5 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Semua
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}