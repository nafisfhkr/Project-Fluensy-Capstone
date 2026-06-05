"use client";
// ============================================================
// FILE: src/components/Topbar.tsx
// ============================================================

import { Bell, ChevronDown } from "lucide-react";

export default function Topbar() {
  return (
    // Ditambahkan: sticky top-0 z-30 agar mengunci di atas dan berada di layer atas konten
    <header className="sticky top-0 z-30 h-16 px-6 bg-white flex items-center justify-end gap-3 border-b border-gray-100 shrink-0 w-full">
      {/* Coins */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
        <div className="w-4 h-4 rounded-full bg-sky-950 flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">$</span>
        </div>
        <span className="text-sky-950 text-sm font-medium">1,250 Coins</span>
      </div>

      {/* Bell */}
      <div className="relative w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center cursor-pointer">
        <Bell className="w-5 h-5 text-sky-950" />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </div>

      {/* User */}
      <div className="flex flex-col items-center cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-neutral-400 flex items-center justify-center">
          <span className="text-white text-xs font-medium">U</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-sky-950 text-xs">User</span>
          <ChevronDown className="w-3 h-3 text-sky-950" />
        </div>
      </div>
    </header>
  );
}
