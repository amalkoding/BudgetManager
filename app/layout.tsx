import type { Metadata, Viewport } from "next";
import PwaRegister from "../components/PwaRegister";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
