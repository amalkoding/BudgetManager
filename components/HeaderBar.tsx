"use client";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AppData } from "../app/types";

interface HeaderBarProps {
  data: AppData;
  onReset: () => void;
  onImport: (data: string) => void;
}

function formatIDR(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export default function HeaderBar({ data, onReset, onImport }: HeaderBarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const startDate = new Date(data.startDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const endDate = new Date(
    new Date(data.startDate).getTime() + data.durationMonths * 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `atur-pengeluaran-backup-${new Date().toISOString().split("T")[0]}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("BudgetManager Report", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Budget Target: Rp ${formatIDR(data.targetAmount)}`, 14, 32);
    doc.text(`Period: ${startDate} - ${endDate}`, 14, 40);

    // Prepare table data
    const tableBody = data.checkIns.map((record) => {
      let statusLabel = record.status;
      if (record.status === 'safe') statusLabel = 'Safe';
      if (record.status === 'warning') statusLabel = 'Warning';
      if (record.status === 'danger') statusLabel = 'Danger';
      if (record.status === 'emergency') statusLabel = 'Emergency';

      return [
        `Day ${record.dayNumber}`,
        record.date,
        statusLabel,
        record.spent ? `Rp ${formatIDR(record.spent)}` : "-",
        record.note || "-"
      ];
    });

    autoTable(doc, {
      startY: 48,
      head: [['Day', 'Date', 'Status', 'Amount', 'Note']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save(`Laporan-Pengeluaran-${new Date().toISOString().split("T")[0]}.pdf`);
    setShowMenu(false);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === "string") {
          onImport(content);
          setShowMenu(false);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center text-sm glow-primary">
              💰
            </div>
            <div>
              <h1 className="text-text-main font-black text-base leading-none">
                Budget<span className="text-gradient">Manager</span>
              </h1>
              <p className="text-text-secondary text-[10px] leading-none mt-0.5">
                {data.durationMonths} months • {data.durationMonths * 30} days
              </p>
            </div>
          </div>

          {/* Menu button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}>
          <div
            className="absolute right-4 top-[60px] w-64 glass-card rounded-2xl shadow-2xl border border-border p-3 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Info Section */}
            <div className="px-3 py-3 mb-2 bg-surface-2/50 rounded-xl">
              <p className="text-text-secondary text-xs font-medium mb-1">Target Details</p>
              <p className="text-text-main font-bold text-sm">
                Rp {formatIDR(data.targetAmount)}
              </p>
              <p className="text-text-secondary text-xs mt-0.5">
                {startDate} – {endDate}
              </p>
            </div>

            {/* Export/Import buttons */}
            <div className="flex flex-col gap-2 mb-2">
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-white text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 transition-all duration-150 shadow-lg shadow-emerald-500/20"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF Report
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleExportJSON}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-primary text-xs font-semibold bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all duration-150"
                  title="Backup Data (JSON)"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Backup
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-text-secondary text-xs font-semibold bg-surface-2 border border-border hover:text-text-main transition-all duration-150"
                  title="Pulihkan Data (JSON)"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Restore
                </button>
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                setShowConfirmReset(true);
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-danger text-sm font-semibold hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset & Restart
            </button>
          </div>
        </div>
      )}

      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/70 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-card rounded-3xl p-6 shadow-2xl border border-border animate-scale-in">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-danger/10 border border-danger/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗑️</span>
              </div>
              <h3 className="text-text-main font-bold text-lg mb-2">Reset Data?</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                All check-in data and targets will be deleted. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-3 rounded-xl bg-surface-2 border border-border text-text-secondary font-semibold text-sm hover:border-primary hover:text-primary transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onReset();
                }}
                className="flex-1 py-3 rounded-xl bg-danger text-white font-bold text-sm hover:bg-red-600 transition-all duration-150"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
