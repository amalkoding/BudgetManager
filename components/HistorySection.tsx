"use client";
import type { DayRecord, AppData } from "../app/types";
import { STATUS_CONFIG } from "../app/types";

interface HistorySectionProps {
  data: AppData;
}

const STATUS_EMOJI: Record<string, string> = {
  safe: "✅",
  warning: "⚠️",
  danger: "❌",
  emergency: "🟠",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function getDayNumber(startDate: string, date: string): number {
  const s = new Date(startDate);
  const d = new Date(date);
  return Math.floor((d.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export default function HistorySection({ data }: HistorySectionProps) {
  const sorted = [...data.checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const daysElapsed = Math.max(1, getDayNumber(data.startDate, new Date().toISOString().split("T")[0]));
  const calendarDays = Array.from({ length: daysElapsed }).map((_, i) => {
    const d = new Date(data.startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    return {
      date: dateStr,
      record: data.checkIns.find(r => r.date === dateStr)
    };
  });

  const totalDays = data.durationMonths * 30;
  const safeCount = data.checkIns.filter((r) => r.status === "safe").length;
  const warningCount = data.checkIns.filter((r) => r.status === "warning").length;
  const dangerCount = data.checkIns.filter((r) => r.status === "danger").length;
  const emergencyCount = data.checkIns.filter((r) => r.status === "emergency").length;

  if (sorted.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-6 mb-5 shadow-xl">
        <h2 className="text-text-main text-xl font-bold mb-2">History</h2>
        <div className="text-center py-10">
          <span className="text-5xl mb-4 block">📋</span>
          <p className="text-text-secondary text-sm">
            No check-in history yet.
            <br />
            Start your check-in today!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 mb-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-text-main text-xl font-bold">History</h2>
          <p className="text-text-secondary text-sm mt-0.5">
            {sorted.length} of {totalDays} days
          </p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {safeCount > 0 && (
          <SummaryChip count={safeCount} label="Safe" color="#10B981" emoji="✅" />
        )}
        {warningCount > 0 && (
          <SummaryChip count={warningCount} label="Warning" color="#F59E0B" emoji="⚠️" />
        )}
        {dangerCount > 0 && (
          <SummaryChip count={dangerCount} label="Danger" color="#EF4444" emoji="❌" />
        )}
        {emergencyCount > 0 && (
          <SummaryChip count={emergencyCount} label="Emergency" color="#F97316" emoji="🟠" />
        )}
      </div>

      {/* Grid of days (Heatmap) */}
      <div className="grid grid-cols-7 gap-1.5 mb-5">
        {calendarDays.map(({ date, record }) => (
          <DayCell key={date} date={date} record={record} startDate={data.startDate} />
        ))}
      </div>

      {/* List view */}
      <div className="space-y-2">
        {sorted.slice(0, 10).map((record) => (
          <HistoryRow key={record.date} record={record} startDate={data.startDate} />
        ))}
        {sorted.length > 10 && (
          <p className="text-text-secondary text-xs text-center py-2">
            + {sorted.length - 10} more days
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryChip({
  count,
  label,
  color,
  emoji,
}: {
  count: number;
  label: string;
  color: string;
  emoji: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold"
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}10`,
      }}
    >
      <span>{emoji}</span>
      <span>{count}x</span>
      <span className="text-text-secondary font-normal">{label}</span>
    </div>
  );
}

function DayCell({ date, record, startDate }: { date: string; record?: DayRecord; startDate: string }) {
  const dayNum = getDayNumber(startDate, date);

  if (!record || !record.status) {
    return (
      <div
        className="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 border cursor-default bg-surface-2/30 border-border/50"
        title={`Day ${dayNum}: No data yet - ${formatDate(date)}`}
      >
        <span className="text-[9px] font-bold text-text-secondary/50">{dayNum}</span>
      </div>
    );
  }

  const config = STATUS_CONFIG[record.status];

  return (
    <div
      className="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 border cursor-default hover:scale-110 transition-transform duration-150"
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
      title={`Day ${dayNum}: ${config.label} - ${formatDate(record.date)}${record.note ? `\nNote: ${record.note}` : ""}`}
    >
      <span className="text-sm">{STATUS_EMOJI[record.status]}</span>
      <span className="text-[9px] font-bold" style={{ color: config.color }}>
        {dayNum}
      </span>
    </div>
  );
}

function HistoryRow({
  record,
  startDate,
}: {
  record: DayRecord;
  startDate: string;
}) {
  if (!record.status) return null;
  const config = STATUS_CONFIG[record.status];
  const dayNum = getDayNumber(startDate, record.date);

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all duration-150 hover:scale-[1.01]"
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
        style={{ backgroundColor: `${config.color}20` }}
      >
        {config.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-text-main">
          Day {dayNum}
        </p>
        <p className="text-text-secondary text-xs">
          {formatDay(record.date)}, {formatDate(record.date)}
        </p>
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="font-bold text-xs" style={{ color: config.color }}>
          {config.label}
        </span>
        {record.note && (
          <span className="text-xs text-text-secondary mt-1 max-w-[120px] truncate" title={record.note}>
            📝 {record.note}
          </span>
        )}
      </div>
    </div>
  );
}
