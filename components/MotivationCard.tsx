"use client";
import type { DashboardStats } from "../app/types";

interface MotivationCardProps {
  stats: DashboardStats;
}

function getMotivationMessage(stats: DashboardStats): {
  title: string;
  message: string;
  emoji: string;
  color: string;
} {
  const { streakCount, streakType, overallPerformance, daysRemaining } = stats;

  if (streakCount >= 7 && streakType === "safe") {
    return {
      title: "Incredible! 🏆",
      message: `${streakCount} safe days in a row! You've proven yourself as a finance master.`,
      emoji: "🏆",
      color: "#F59E0B",
    };
  }
  if (streakCount >= 3 && streakType === "safe") {
    return {
      title: "Awesome! 🔥",
      message: `${streakCount} safe days in a row! Keep up this great rhythm.`,
      emoji: "🔥",
      color: "#10B981",
    };
  }
  if (streakCount >= 2 && streakType === "danger") {
    return {
      title: "Let's get back on track! 💪",
      message: `${streakCount} overspent days. Tomorrow is a new chance to do better!`,
      emoji: "💪",
      color: "#F97316",
    };
  }
  if (overallPerformance === "excellent") {
    return {
      title: "Excellent Performance! ⭐",
      message: "You are managing your finances very well. Keep it up!",
      emoji: "⭐",
      color: "#10B981",
    };
  }
  if (daysRemaining <= 7 && daysRemaining > 0) {
    return {
      title: "Almost there! 🎯",
      message: `Only ${daysRemaining} days left. Keep pushing until the end!`,
      emoji: "🎯",
      color: "#10B981",
    };
  }
  if (daysRemaining === 0) {
    return {
      title: "Congratulations! You did it! 🎉",
      message: "You have completed the budgeting challenge!",
      emoji: "🎉",
      color: "#10B981",
    };
  }

  return {
    title: "Keep it up! 💚",
    message: "Every day is a new opportunity to manage your finances better.",
    emoji: "💚",
    color: "#10B981",
  };
}

const TIPS = [
  "💡 Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
  "🛒 Make a shopping list before going out to avoid impulse buying",
  "☕ Cut down on daily coffee shop runs — you can save hundreds a month!",
  "📱 Turn off promotional notifications from e-commerce apps",
  "🍱 Weekly meal prep can significantly reduce food expenses",
  "💳 Avoid using credit cards for non-urgent purchases",
];

function getTodayTip(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return TIPS[dayOfYear % TIPS.length];
}

export default function MotivationCard({ stats }: MotivationCardProps) {
  const motivation = getMotivationMessage(stats);
  const tip = getTodayTip();

  return (
    <div className="space-y-3 mb-5">
      {/* Motivation card */}
      <div
        className="rounded-2xl p-4 border"
        style={{
          backgroundColor: `${motivation.color}08`,
          borderColor: `${motivation.color}25`,
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{motivation.emoji}</span>
          <div>
            <p className="font-bold text-sm text-text-main mb-0.5">{motivation.title}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{motivation.message}</p>
          </div>
        </div>
      </div>

      {/* Daily tip */}
      <div className="rounded-2xl p-4 border border-border/50 bg-surface-2/30">
        <p className="text-text-secondary text-xs leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}
