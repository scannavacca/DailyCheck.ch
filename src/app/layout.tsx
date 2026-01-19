import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import OpenAIHealthBanner from "@/components/OpenAIHealthBanner";

export const metadata: Metadata = {
  title: "DailyCheck – Clinician Dictation App",
  description: "Dictate or upload session audio. Get a structured clinical draft in your preferred templates.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3924944891411406"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-[color:var(--background)] text-black">
        <LanguageProvider>
          <TopNav />
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
          <Footer />
          <OpenAIHealthBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
