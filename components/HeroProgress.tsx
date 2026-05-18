"use client";
import { useEffect, useState, useRef } from "react";
import type { DashboardStats } from "../app/types";

interface HeroProgressProps {
  stats: DashboardStats;
}

const PERFORMANCE_COLORS: Record<DashboardStats["overallPerformance"], string> = {
  excellent: "#10B981",
  good: "#34D399",
  caution: "#F59E0B",
  poor: "#EF4444",
};

const PERFORMANCE_LABELS: Record<DashboardStats["overallPerformance"], string> = {
  excellent: "Excellent 🔥",
  good: "Good 👍",
  caution: "Needs Attention ⚠️",
  poor: "Needs Improvement 💪",
};

export default function HeroProgress({ stats }: HeroProgressProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const target = stats.percentageUsed;
    let current = 0;
    const step = target / 60;
    const animate = () => {
      current = Math.min(current + step, target);
      setAnimatedPercent(Math.round(current));
      if (current < target) {
        animationRef.current = setTimeout(animate, 16);
      }
    };
    animationRef.current = setTimeout(animate, 300);
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [stats.percentageUsed]);

  const perfColor = PERFORMANCE_COLORS[stats.overallPerformance];
  const perfLabel = PERFORMANCE_LABELS[stats.overallPerformance];

  // Circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  const badges = [];
  if (stats.streakCount >= 3 && stats.streakType === "safe") badges.push({ icon: "🥉", label: "Streak 3x" });
  if (stats.streakCount >= 7 && stats.streakType === "safe") badges.push({ icon: "🥈", label: "Spartan" });
  if (stats.streakCount >= 14 && stats.streakType === "safe") badges.push({ icon: "🥇", label: "Konsisten" });
  if (stats.percentageUsed >= 50 && stats.overallPerformance === "excellent") badges.push({ icon: "⭐", label: "Disiplin" });
  if (stats.percentageUsed >= 100 && stats.overallPerformance === "excellent") badges.push({ icon: "👑", label: "Raja Hemat" });

  return (
    <div className="glass-card rounded-3xl p-6 mb-5 shadow-xl">
      {/* Performance badge */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-text-main text-xl font-bold">Your Progress</h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Day {stats.daysElapsed} of {stats.totalDays} days
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-bold border"
          style={{
            color: perfColor,
            borderColor: `${perfColor}40`,
            backgroundColor: `${perfColor}15`,
          }}
        >
          {perfLabel}
        </div>
      </div>

      {/* Circular + Stats Row */}
      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" className="-rotate-90">
            {/* Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="rgba(45, 62, 80, 0.6)"
              strokeWidth="12"
            />
            {/* Progress */}
            {mounted && (
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={perfColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: "stroke-dashoffset 0.05s linear, stroke 0.5s ease",
                  filter: `drop-shadow(0 0 8px ${perfColor}60)`,
                }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-black tabular-nums"
              style={{ color: perfColor }}
            >
              {animatedPercent}%
            </span>
            <span className="text-text-secondary text-xs font-medium">days passed</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <StatItem
            label="Days Left"
            value={`${stats.daysRemaining}`}
            suffix="days"
            icon="📅"
            color="#94A3B8"
          />
          <StatItem
            label="Today's Budget"
            value={`Rp ${formatCompact(stats.todayBudget)}`}
            icon="💵"
            color="#10B981"
          />
          <StatItem
            label="Remaining Budget"
            value={`Rp ${formatCompact(stats.remainingBudget)}`}
            icon="🎯"
            color="#94A3B8"
          />
          <StatItem
            label="Check-in"
            value={`${stats.totalDays - (stats.daysRemaining)}`}
            suffix="days"
            icon="✅"
            color="#34D399"
          />
        </div>
      </div>

      {/* Streak Bar */}
      {stats.streakCount > 0 && (
        <div
          className="mt-5 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border animate-fade-in"
          style={{
            backgroundColor:
              stats.streakType === "safe"
                ? "rgba(16, 185, 129, 0.08)"
                : "rgba(239, 68, 68, 0.08)",
            borderColor:
              stats.streakType === "safe"
                ? "rgba(16, 185, 129, 0.25)"
                : "rgba(239, 68, 68, 0.25)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{stats.streakType === "safe" ? "🔥" : "💸"}</span>
            <div>
              <p
                className="font-bold text-sm"
                style={{
                  color: stats.streakType === "safe" ? "#10B981" : "#EF4444",
                }}
              >
                {stats.streakCount} days{" "}
                {stats.streakType === "safe" ? "safe in a row!" : "overspent in a row"}
              </p>
              <p className="text-text-secondary text-xs">
                {stats.streakType === "safe"
                  ? "Keep it up! You're doing great 💪"
                  : "Let's start reducing expenses 👊"}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              const totalSpentStr = new Intl.NumberFormat("id-ID").format(stats.totalSpent);
              const perfText = stats.overallPerformance === "excellent" ? "Sangat Baik" : stats.overallPerformance === "good" ? "Baik" : stats.overallPerformance === "caution" ? "Perlu Perhatian" : "Butuh Perbaikan";
              const streakText = stats.streakCount > 0 ? `\n*Streak:* _${stats.streakCount} hari ${stats.streakType === "safe" ? "aman" : "boros"} berturut-turut!_` : "";
              const text = `*BudgetManager - Financial Challenge*\n\n_Hari ke-${stats.daysElapsed} dari ${stats.totalDays}_\n*Total Pengeluaran:* Rp ${totalSpentStr}\n*Status Saat Ini:* _${perfText}_${streakText}\n\nIkutan atur pengeluaranmu juga di sini:\n${window.location.origin}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shrink-0"
            title="Share to WhatsApp"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="text-xs font-bold whitespace-nowrap">Share WA</span>
          </button>
        </div>
      )}

      {/* Badges System */}
      {badges.length > 0 && (
        <div className="mt-5">
          <p className="text-text-secondary text-xs font-semibold mb-2 uppercase tracking-wider">
            Your Achievements
          </p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-border rounded-xl animate-scale-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-lg drop-shadow-md">{badge.icon}</span>
                <span className="text-xs font-bold text-text-main">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linear Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Start</span>
          <span>End</span>
        </div>
        <div className="h-2.5 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${animatedPercent}%`,
              background: `linear-gradient(90deg, ${perfColor}aa, ${perfColor})`,
              boxShadow: `0 0 12px ${perfColor}60`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  suffix,
  icon,
  color,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-surface-2/50 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-text-secondary text-xs font-medium">{label}</span>
      </div>
      <p className="font-bold text-sm" style={{ color }}>
        {value}
        {suffix && (
          <span className="text-text-secondary font-normal ml-1 text-xs">{suffix}</span>
        )}
      </p>
    </div>
  );
}

function formatCompact(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}jt`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}rb`;
  }
  return num.toString();
}
