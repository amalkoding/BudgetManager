"use client";
import { useState } from "react";
import type { CheckInStatus, DashboardStats } from "../app/types";
import { STATUS_CONFIG } from "../app/types";

interface CheckInCardProps {
  stats: DashboardStats;
  onCheckIn: (status: NonNullable<CheckInStatus>, note?: string, spent?: number) => void;
}

export default function CheckInCard({ stats, onCheckIn }: CheckInCardProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [note, setNote] = useState(stats.todayRecord?.note || "");
  const [spent, setSpent] = useState<string>(stats.todayRecord?.spent?.toString() || "");

  const calculateStatus = (spentAmount: number, budget: number): NonNullable<CheckInStatus> => {
    if (spentAmount <= budget) return "safe";
    if (spentAmount <= budget * 1.5) return "warning";
    if (spentAmount <= budget * 2.5) return "danger";
    return "emergency";
  };

  const handleSubmit = async () => {
    const spentVal = spent ? parseInt(spent, 10) : 0;
    const status = calculateStatus(spentVal, stats.todayBudget);
    
    onCheckIn(status, note, spentVal);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const alreadyChecked = stats.todayStatus !== null;
  const todayStatus = stats.todayStatus as NonNullable<CheckInStatus> | null;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="glass-card rounded-3xl p-6 mb-5 shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              Today
            </span>
          </div>
          <h2 className="text-text-main text-xl font-bold">Daily Check-in</h2>
          <p className="text-text-secondary text-sm mt-0.5">{today}</p>
        </div>

        {/* Daily Budget Badge */}
        <div className="text-right">
          <p className="text-text-secondary text-xs font-medium mb-0.5">Budget</p>
          <p className="text-primary text-2xl font-black">
            Rp {formatIDR(stats.todayBudget)}
          </p>
          <p className="text-text-secondary text-xs">per day</p>
        </div>
      </div>

      {/* Success message */}
      {showSuccess && todayStatus && (
        <div
          className="mb-4 rounded-2xl px-4 py-3 border animate-scale-in flex items-center gap-3"
          style={{
            backgroundColor: STATUS_CONFIG[todayStatus].bgColor,
            borderColor: STATUS_CONFIG[todayStatus].borderColor,
          }}
        >
          <span className="text-xl">{STATUS_CONFIG[todayStatus].emoji}</span>
          <div>
            <p
              className="font-bold text-sm"
              style={{ color: STATUS_CONFIG[todayStatus].color }}
            >
              {STATUS_CONFIG[todayStatus].label}
            </p>
            <p className="text-text-secondary text-xs">
              {STATUS_CONFIG[todayStatus].description}
            </p>
          </div>
        </div>
      )}

      {/* Already checked indicator */}
      {alreadyChecked && !showSuccess && todayStatus && (
        <div
          className="mb-4 rounded-2xl px-4 py-2.5 border flex items-center gap-2"
          style={{
            backgroundColor: STATUS_CONFIG[todayStatus].bgColor,
            borderColor: STATUS_CONFIG[todayStatus].borderColor,
          }}
        >
          <span>{STATUS_CONFIG[todayStatus].emoji}</span>
          <p
            className="text-xs font-semibold"
            style={{ color: STATUS_CONFIG[todayStatus].color }}
          >
            Today&apos;s status: {STATUS_CONFIG[todayStatus].label}
          </p>
          <span className="ml-auto text-text-secondary text-xs">Refill to change</span>
        </div>
      )}

      {/* Form Input */}
      <div className="mt-2 flex flex-col gap-3">
        <p className="text-text-main font-semibold mb-1">
          How much did you spend today? 💭
        </p>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold">Rp</span>
          <input
            type="number"
            placeholder="0"
            value={spent}
            onChange={(e) => setSpent(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl pl-12 pr-4 py-3 text-lg font-bold text-text-main focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add an optional note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={handleSubmit}
            className="bg-primary text-background px-5 py-3 rounded-xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            Save
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-5 bg-surface-2/40 rounded-xl px-3 py-2.5">
        <p className="text-text-secondary text-xs text-center leading-relaxed">
          💡 Status (Safe/Warning/Danger/Emergency) will be calculated automatically based on your daily budget.
        </p>
      </div>
    </div>
  );
}

function formatIDR(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}
