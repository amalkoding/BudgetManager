"use client";
import { useState } from "react";

interface OnboardingProps {
  onComplete: (amount: number, months: number) => void;
}

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function formatIDR(value: string): string {
  const numeric = value.replace(/\D/g, "");
  if (!numeric) return "";
  return new Intl.NumberFormat("en-US").format(parseInt(numeric));
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [rawAmount, setRawAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [months, setMonths] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setRawAmount(raw);
    setDisplayAmount(formatIDR(e.target.value));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    const amount = parseInt(rawAmount);
    if (!amount || amount < 10000) {
      setError("Please enter a minimum of Rp 10.000");
      return;
    }
    if (!months) {
      setError("Please select a duration");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onComplete(amount, months);
  };

  const isValid = parseInt(rawAmount) >= 10000 && months !== null;

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-5 glow-primary overflow-hidden">
            <img src="/icon-192.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-black text-text-main mb-2 tracking-tight">
            Budget<span className="text-gradient">Manager</span>
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Manage your budget,{" "}
            <span className="text-primary font-medium">make your money last longer</span>
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          {/* Amount Input */}
          <div className="mb-7">
            <label className="block text-text-secondary text-sm font-semibold uppercase tracking-widest mb-3">
              Total Budget
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="500.000"
                className="w-full bg-surface-2 border border-border rounded-2xl py-4 pl-12 pr-4 text-text-main text-2xl font-bold placeholder-text-secondary/30 transition-all duration-200 focus:border-primary focus:bg-background"
              />
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              The total budget you want to manage
            </p>
          </div>

          {/* Duration Selection */}
          <div className="mb-7">
            <label className="block text-text-secondary text-sm font-semibold uppercase tracking-widest mb-3">
              Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMonths(m);
                    if (error) setError("");
                  }}
                  className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 btn-press ${
                    months === m
                      ? "bg-gradient-primary text-white shadow-lg glow-primary scale-105"
                      : "bg-surface-2 border border-border text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {m}mo
                </button>
              ))}
            </div>
            {months && (
              <div className="mt-3 flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 animate-fade-in">
                <span className="text-primary text-sm">📅</span>
                <p className="text-primary text-xs font-medium">
                  Duration {months} months = {months * 30} days
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          {isValid && (
            <div className="mb-7 animate-scale-in">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4">
                <p className="text-text-secondary text-xs font-medium mb-1">
                  Your daily budget
                </p>
                <p className="text-primary text-3xl font-black">
                  Rp{" "}
                  {new Intl.NumberFormat("en-US").format(
                    Math.floor(parseInt(rawAmount) / (months! * 30))
                  )}
                </p>
                <p className="text-text-secondary text-xs mt-1">per day</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 bg-danger/10 border border-danger/30 rounded-xl px-4 py-3 animate-shake">
              <p className="text-danger text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 btn-press ${
              isValid && !isSubmitting
                ? "bg-gradient-primary glow-primary-intense hover:scale-105 active:scale-95"
                : "bg-surface-2 border border-border text-text-secondary cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Preparing...
              </span>
            ) : (
              "🚀 Start Budgeting Now"
            )}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-text-secondary text-xs mt-6 leading-relaxed">
          Data stored on your device 🔒
          <br />
          No account needed
        </p>
      </div>
    </div>
  );
}
