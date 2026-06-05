"use client";
// ============================================================
// FILE: src/components/PerformanceChart.tsx
// ============================================================

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type Period = "7 Days" | "30 Days" | "3 Months";

interface DataPoint {
  day: string;
  value: number;
}

const PERIODS: Period[] = ["7 Days", "30 Days", "3 Months"];

const DATA_MAP: Record<Period, DataPoint[]> = {
  "7 Days": [
    { day: "Mon", value: 6.2 }, { day: "Tue", value: 7.1 },
    { day: "Wed", value: 8.4 }, { day: "Thu", value: 9.0 },
    { day: "Fri", value: 8.7 }, { day: "Sat", value: 7.8 },
    { day: "Sun", value: 3.9 },
  ],
  "30 Days": [
    { day: "Mon", value: 5.5 }, { day: "Tue", value: 6.8 },
    { day: "Wed", value: 7.2 }, { day: "Thu", value: 8.1 },
    { day: "Fri", value: 7.5 }, { day: "Sat", value: 6.9 },
    { day: "Sun", value: 5.0 },
  ],
  "3 Months": [
    { day: "Mon", value: 4.8 }, { day: "Tue", value: 5.5 },
    { day: "Wed", value: 6.2 }, { day: "Thu", value: 7.0 },
    { day: "Fri", value: 6.8 }, { day: "Sat", value: 5.9 },
    { day: "Sun", value: 4.2 },
  ],
};

export default function PerformanceChart() {
  const [activePeriod, setActivePeriod] = useState<Period>("7 Days");

  return (
    <div className="flex-1 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Performance Analytics</h3>
          <div className="mt-1 flex items-center">
            <div className="w-7 h-0.5 bg-cyan-400" />
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <span>Engagement</span>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`px-2 py-[3px] rounded text-[10px] transition-colors ${
              activePeriod === p
                ? "bg-blue-600 text-white"
                : "bg-white border border-blue-600 text-blue-600"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={DATA_MAP[activePeriod]} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} domain={[0, 10]} ticks={[0,2,4,6,8,10]} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Engagement"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fill="url(#engGrad)"
            dot={{ r: 4, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}