// ============================
// Types for AturPengeluaran
// ============================

export type CheckInStatus = "safe" | "warning" | "danger" | "emergency" | null;

export interface DayRecord {
  date: string; // ISO date string YYYY-MM-DD
  status: CheckInStatus;
  dayNumber: number; // 1-indexed from start date
  note?: string; // Optional note for micro-journaling
  spent?: number; // Real amount spent
}

export interface AppData {
  targetAmount: number; // Total budget in IDR
  durationMonths: number; // 1-12
  startDate: string; // ISO date string
  checkIns: DayRecord[];
  createdAt: string;
}

export interface DashboardStats {
  totalDays: number;
  daysElapsed: number;
  daysRemaining: number;
  dailyBudget: number; // Base daily budget
  todayBudget: number; // Dynamic daily budget for today
  totalSpent: number; // Total amount spent so far
  remainingBudget: number; // Total budget left for the rest of the period
  percentageUsed: number; // days elapsed / total days
  streakCount: number;
  streakType: "safe" | "warning" | "danger" | "emergency" | "none";
  todayStatus: CheckInStatus;
  todayRecord: DayRecord | null;
  overallPerformance: "excellent" | "good" | "caution" | "poor";
}

export const STATUS_CONFIG: Record<
  NonNullable<CheckInStatus>,
  {
    label: string;
    emoji: string;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  safe: {
    label: "Safe Today",
    emoji: "✅",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.4)",
    description: "Your spending is under control today!",
  },
  warning: {
    label: "Slightly Over",
    emoji: "⚠️",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.4)",
    description: "A bit wasteful, but manageable.",
  },
  danger: {
    label: "Overspent",
    emoji: "❌",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.4)",
    description: "Spending exceeded today's limit.",
  },
  emergency: {
    label: "Emergency",
    emoji: "🟠",
    color: "#F97316",
    bgColor: "rgba(249, 115, 22, 0.1)",
    borderColor: "rgba(249, 115, 22, 0.4)",
    description: "Unexpected emergency expenses today.",
  },
};
