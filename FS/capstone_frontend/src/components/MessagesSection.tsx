// ============================================================
// FILE: src/components/MessagesSection.tsx
// ============================================================

import type { Message } from "@/types";

interface MessagesSectionProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export default function MessagesSection({ messages, loading, error }: MessagesSectionProps) {
  return (
    <div className="w-full p-7 bg-blue-600 rounded-2xl shadow-[0px_10px_40px_0px_rgba(0,0,0,0.25)] flex flex-col gap-2.5">
      <div className="px-2.5 py-2">
        <h3 className="text-white text-lg font-semibold">
          You have {messages.length} new messages
        </h3>
      </div>

      {loading && <div className="bg-white rounded-2xl p-4 animate-pulse h-24" />}
      {error && <div className="bg-white rounded-2xl p-4 text-red-500 text-sm text-center">{error}</div>}

      {!loading && !error && messages.map((msg) => (
        <div key={msg.id} className="px-1.5 py-3.5 bg-white rounded-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <img src={msg.avatar} alt={msg.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-bold text-black">{msg.name}</span>
                <p className="text-xs text-zinc-600 leading-4 line-clamp-2">{msg.preview}</p>
              </div>
            </div>
            <button className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-white text-xs font-semibold hover:bg-blue-700 transition-colors ml-4">
              Open Chat
              <svg className="w-3.5 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}