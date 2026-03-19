import type { Metadata, Viewport } from "next";

import PwaClient from "@/components/pwa/PwaClient";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: "MediShare",
  title: "MediShare - Community Medicine Exchange",
  description: "Connect with neighbors to donate unused medicines or find what you need nearby.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MediShare",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-50">
      <body className="min-h-[100dvh] bg-slate-50 text-gray-600 antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <PwaClient />
        {children}
      </body>
    </html>
  );
}
