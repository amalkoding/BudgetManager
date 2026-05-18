import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import PwaRegister from "../components/PwaRegister";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BudgetManager – Manage your spending, make your money last longer",
  description:
    "A gamified personal finance app to help you control your daily expenses in a fun and motivating way.",
  keywords: [
    "expense tracker",
    "personal finance",
    "budget",
    "save money",
    "financial gamification",
  ],
  authors: [{ name: "BudgetManager" }],
  robots: "index, follow",
  openGraph: {
    title: "BudgetManager",
    description: "Manage your spending, make your money last longer",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
