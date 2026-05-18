"use client";
import { useState, useEffect, useCallback } from "react";
import type { AppData, DayRecord, CheckInStatus, DashboardStats } from "../app/types";

const STORAGE_KEY = "atur-pengeluaran-data";

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function getDaysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function computeStats(data: AppData): DashboardStats {
  const today = getTodayString();
  const totalDays = data.durationMonths * 30;
  const daysElapsed = Math.min(getDaysBetween(data.startDate, today) + 1, totalDays);
  const daysRemaining = Math.max(totalDays - daysElapsed, 0);
  const dailyBudget = Math.floor(data.targetAmount / totalDays);
  const todayDayNumber = daysElapsed;

  const todayRecord = data.checkIns.find((r) => r.date === today) ?? null;
  const todayStatus = todayRecord?.status ?? null;

  // Calculate streak
  let streakCount = 0;
  let streakType: DashboardStats["streakType"] = "none";

  const sortedCheckIns = [...data.checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedCheckIns.length > 0) {
    const lastStatus = sortedCheckIns[0].status;
    if (lastStatus === "safe") {
      streakType = "safe";
      for (const record of sortedCheckIns) {
        if (record.status === "safe") {
          streakCount++;
        } else {
          break;
        }
      }
    } else if (lastStatus === "danger") {
      streakType = "danger";
      for (const record of sortedCheckIns) {
        if (record.status === "danger") {
          streakCount++;
        } else {
          break;
        }
      }
    }
  }

  // Overall performance based on safe % in check-ins
  const safeCount = data.checkIns.filter((r) => r.status === "safe").length;
  const warningCount = data.checkIns.filter((r) => r.status === "warning").length;
  const dangerCount = data.checkIns.filter((r) => r.status === "danger").length;
  const totalChecked = data.checkIns.length;

  let overallPerformance: DashboardStats["overallPerformance"] = "excellent";
  if (totalChecked > 0) {
    const safeRatio = (safeCount + warningCount * 0.5) / totalChecked;
    if (safeRatio >= 0.8) overallPerformance = "excellent";
    else if (safeRatio >= 0.6) overallPerformance = "good";
    else if (safeRatio >= 0.4) overallPerformance = "caution";
    else overallPerformance = "poor";
  }

  const percentageUsed = Math.min((daysElapsed / totalDays) * 100, 100);

  let totalSpent = 0;
  for (const r of data.checkIns) {
    if (r.spent !== undefined) {
      totalSpent += r.spent;
    } else {
      totalSpent += dailyBudget; // Fallback for old data
    }
  }
  const remainingBudget = Math.max(data.targetAmount - totalSpent, 0);
  
  let todayBudget = dailyBudget;
  const uncheckedDaysLeft = totalDays - data.checkIns.length;
  if (uncheckedDaysLeft > 0) {
    todayBudget = Math.floor(remainingBudget / uncheckedDaysLeft);
  } else if (uncheckedDaysLeft === 0 && !todayRecord) {
    todayBudget = remainingBudget;
  }

  return {
    totalDays,
    daysElapsed,
    daysRemaining,
    dailyBudget,
    todayBudget,
    totalSpent,
    remainingBudget,
    percentageUsed,
    streakCount,
    streakType,
    todayStatus,
    todayRecord,
    overallPerformance,
  };
}

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AppData = JSON.parse(raw);
        setData(parsed);
        setStats(computeStats(parsed));
      }
    } catch (e) {
      console.error("Failed to load data:", e);
    }
    setIsLoaded(true);
  }, []);

  const saveData = useCallback((newData: AppData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
      setStats(computeStats(newData));
    } catch (e) {
      console.error("Failed to save data:", e);
    }
  }, []);

  const initializeData = useCallback(
    (targetAmount: number, durationMonths: number) => {
      const newData: AppData = {
        targetAmount,
        durationMonths,
        startDate: getTodayString(),
        checkIns: [],
        createdAt: new Date().toISOString(),
      };
      saveData(newData);
    },
    [saveData]
  );

  const checkIn = useCallback(
    (status: NonNullable<CheckInStatus>, note?: string, spent?: number) => {
      if (!data) return;
      const today = getTodayString();
      const totalDays = data.durationMonths * 30;
      const daysElapsed = Math.min(
        getDaysBetween(data.startDate, today) + 1,
        totalDays
      );

      const newRecord: DayRecord = {
        date: today,
        status,
        dayNumber: daysElapsed,
        note,
        spent,
      };

      const existingIndex = data.checkIns.findIndex((r) => r.date === today);
      let updatedCheckIns: DayRecord[];
      if (existingIndex >= 0) {
        updatedCheckIns = [...data.checkIns];
        updatedCheckIns[existingIndex] = newRecord;
      } else {
        updatedCheckIns = [...data.checkIns, newRecord];
      }

      saveData({ ...data, checkIns: updatedCheckIns });
    },
    [data, saveData]
  );

  const resetData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setData(null);
      setStats(null);
    } catch (e) {
      console.error("Failed to reset data:", e);
    }
  }, []);

  const importData = useCallback(
    (jsonData: string) => {
      try {
        const parsed: AppData = JSON.parse(jsonData);
        // Add basic validation
        if (parsed.targetAmount && parsed.durationMonths && parsed.startDate && Array.isArray(parsed.checkIns)) {
          saveData(parsed);
          return true;
        }
        return false;
      } catch (e) {
        console.error("Failed to parse import data:", e);
        return false;
      }
    },
    [saveData]
  );

  return { data, stats, isLoaded, initializeData, checkIn, resetData, importData };
}
