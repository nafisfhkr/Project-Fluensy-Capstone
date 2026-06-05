"use client";
// ============================================================
// FILE: src/app/saved-creators/page.tsx
// Halaman "Kreator yang Disimpan" — pixel-perfect sesuai Figma
// Axios + try/catch + loading skeleton + error UI
// ============================================================

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import CreatorCard from "@/components/CreatorCard";
import { fetchSavedCreators } from "@/services/dashboardService";
import type { Creator } from "@/types";

// Skeleton for one creator card
function CreatorCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
            {/* Header */}
            <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded-full w-32" />
                    <div className="h-3 bg-gray-200 rounded-full w-24" />
                    <div className="h-3 bg-gray-200 rounded-full w-40" />
                </div>
                <div className="flex gap-6 ml-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className="h-3 bg-gray-200 rounded-full w-14" />
                            <div className="h-5 bg-gray-200 rounded-full w-12" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 ml-auto">
                    <div className="h-9 bg-gray-200 rounded-full w-32" />
                    <div className="h-9 bg-gray-200 rounded-full w-20" />
                </div>
            </div>
            {/* Image grid */}
            <div className="grid grid-cols-4 gap-1 px-1 pb-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-video bg-gray-200 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

export default function SavedCreatorsPage() {
    const router = useRouter();

    // ── State ──────────────────────────────────────────────
    const [creators, setCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ── Fetch dengan try/catch ──────────────────────────────
    const loadCreators = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSavedCreators();
            setCreators(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Gagal memuat kreator";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCreators();
    }, []);

    // ── Toggle save state ────────────────────────────────────
    const handleToggleSave = (id: number): void => {
        setCreators((prev) =>
            prev.map((c) => (c.id === id ? { ...c, saved: !c.saved } : c))
        );
    };

    // ── Error full-screen ────────────────────────────────────
    const renderError = () => (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">📡</div>
            <h2 className="text-xl font-bold text-gray-800">Koneksi Gagal</h2>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
                onClick={loadCreators}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                Coba Lagi
            </button>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 font-['Inter']">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar />

                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    {/* Page Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Kembali"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Kreator yang Disimpan</h1>
                    </div>

                    {/* Content */}
                    {error ? (
                        renderError()
                    ) : (
                        <div className="flex flex-col gap-4">
                            {loading ? (
                                // Skeleton
                                [1, 2, 3].map((i) => <CreatorCardSkeleton key={i} />)
                            ) : creators.length === 0 ? (
                                // Empty state
                                <div className="text-center py-24">
                                    <div className="text-5xl mb-4">🔖</div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                                        Belum ada kreator tersimpan
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Temukan kreator dan klik tombol Simpan untuk menyimpannya di sini.
                                    </p>
                                </div>
                            ) : (
                                // Creator cards
                                creators.map((creator) => (
                                    <CreatorCard
                                        key={creator.id}
                                        creator={creator}
                                        onToggleSave={handleToggleSave}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}