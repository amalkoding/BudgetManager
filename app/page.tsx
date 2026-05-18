"use client";
import { useEffect, useRef } from "react";
import { useAppData } from "../hooks/useAppData";
import { useConfetti } from "../hooks/useConfetti";
import type { CheckInStatus } from "./types";
import Onboarding from "../components/Onboarding";
import HeaderBar from "../components/HeaderBar";
import HeroProgress from "../components/HeroProgress";
import CheckInCard from "../components/CheckInCard";
import HistorySection from "../components/HistorySection";
import MotivationCard from "../components/MotivationCard";

export default function Home() {
  const { data, stats, isLoaded, initializeData, checkIn, resetData, importData } = useAppData();
  const { fireSuccess, fireStreak } = useConfetti();
  const prevStreakRef = useRef(0);

  const streakCount = stats?.streakCount;
  const streakType = stats?.streakType;

  // Fire confetti on streak milestones
  useEffect(() => {
    if (streakCount === undefined || streakType === undefined) return;
    const prev = prevStreakRef.current;
    const curr = streakCount;

    if (curr > prev && streakType === "safe") {
      if (curr >= 3) {
        fireStreak(curr);
      } else if (curr === 1) {
        fireSuccess();
      }
    }
    prevStreakRef.current = curr;
  }, [streakCount, streakType, fireSuccess, fireStreak]);

  const handleCheckIn = (status: NonNullable<CheckInStatus>, note?: string, spent?: number) => {
    checkIn(status, note, spent);
    if (status === "safe") {
      setTimeout(fireSuccess, 300);
    }
  };

  // Not loaded yet — show loading skeleton
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 animate-pulse flex items-center justify-center overflow-hidden">
            <img src="/icon-192.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <p className="text-text-secondary text-sm animate-pulse">Loading data...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if no data
  if (!data || !stats) {
    return <Onboarding onComplete={initializeData} />;
  }

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <HeaderBar data={data} onReset={resetData} onImport={importData} />

      {/* Main content */}
      <main className="max-w-md mx-auto px-4 pt-5 pb-20 relative">
        {/* Hero Progress */}
        <HeroProgress stats={stats} />

        {/* Check-in Card */}
        <CheckInCard stats={stats} onCheckIn={handleCheckIn} />

        {/* Motivation */}
        <MotivationCard stats={stats} />

        {/* History */}
        <HistorySection data={data} />

        {/* Footer */}
        <div className="text-center pt-4 pb-2">
          <p className="text-text-secondary text-xs">
            BudgetManager • Data stored on your device 🔒
          </p>
        </div>
      </main>
    </div>
  );
}
