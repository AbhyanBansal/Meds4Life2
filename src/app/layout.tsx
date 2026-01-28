import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediShare - Community Medicine Exchange",
  description: "Connect with neighbors to donate unused medicines or find what you need nearby.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 text-gray-600 selection:bg-emerald-200 selection:text-emerald-900`}>
        {children}
      </body>
    </html>
  );
}
