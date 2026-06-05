// ============================================================
// FILE: src/components/StatCard.tsx
// ============================================================

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex-1 min-w-[140px] p-5 bg-blue-600 rounded-2xl shadow-[0px_10px_40px_0px_rgba(0,0,0,0.08)] flex flex-col gap-2">
      <span className="text-white/80 text-xs font-semibold">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-white text-lg font-semibold leading-tight">{value}</span>
      </div>
    </div>
  );
}