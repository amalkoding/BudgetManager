import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import PwaRegister from "../components/PwaRegister";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://bumager.vercel.app"),
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon-192.png",
  },
  verification: {
    google: "sNuQMPPzNm5Pu7nY1tiCt8VBGRhgITiD7zrmE4JARks",
  },
  openGraph: {
    title: "BudgetManager",
    description: "Manage your spending, make your money last longer",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "BudgetManager Logo",
      },
    ],
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
