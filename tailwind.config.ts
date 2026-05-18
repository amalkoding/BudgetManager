import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
        "primary-dark": "#059669",
        "primary-light": "#34D399",
        background: "#0F172A",
        surface: "#1E2937",
        "surface-2": "#253344",
        "text-main": "#F8FAFC",
        "text-secondary": "#94A3B8",
        safe: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        emergency: "#F97316",
        border: "#2D3E50",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-soft": "bounceSoft 0.6s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "glow-green": "glowGreen 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceSoft: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(0.94)" },
          "60%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowGreen: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(16,185,129,0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(16,185,129,0.6)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-surface":
          "linear-gradient(135deg, #1E2937 0%, #253344 100%)",
        "gradient-primary":
          "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
