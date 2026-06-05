"use client";
// ============================================================
// FILE: src/components/Sidebar.tsx
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  TrendingUp,
  Users,
  Megaphone,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard",           href: "/dashboard" },
  { icon: Search,          label: "Search",              href: "/search" },
  { icon: TrendingUp,      label: "Budget Optimization", href: "/budget" },
  { icon: Users,           label: "Fake Followers",      href: "/fake-followers" },
  { icon: Megaphone,       label: "Manage Campaign",     href: "/campaigns" },
  { icon: DollarSign,      label: "Payment",             href: "/payment" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-col bg-sky-950 transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      {/* <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        {!collapsed && (
          <span className="text-white text-2xl font-bold tracking-tight whitespace-nowrap">
            Fluensy
          </span>
        )}
      </div> */}

{/* Logo */}
<div className="flex items-center gap-3 px-4 py-6">
  {/* 1. Ikon Logo Puzzle */}
  <div className="w-10 h-10 shrink-0 flex items-center justify-center">
    <img 
      src="/logo.svg" 
      alt="Fluensy Icon" 
      className="w-full h-full object-contain"
    />
  </div>
  
  {/* 2. Gambar Teks Logo (Hanya muncul jika tidak collapsed) */}
  {!collapsed && (
    <div className="h-6 shrink-0 flex items-center">
      <img 
        src="/text-logo.svg" // Memanggil file gambar teks Anda
        alt="Fluensy Text" 
        className="h-full w-auto object-contain"
      />
    </div>
  )}
</div>




      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-7 z-10 w-8 h-8 bg-white border border-sky-950 rounded-md shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-sky-950" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-sky-950" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 mt-2 flex-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all duration-200 ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon
                className="w-5 h-5 text-white shrink-0"
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              {!collapsed && (
                <span
                  className={`text-white text-lg whitespace-nowrap ${
                    isActive ? "font-semibold" : "font-normal"
                  }`}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
