import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "100KDEV - The dev who starts at $1,000",
  description:
    "A developer with an unconventional pricing model. The counter starts at $1,000 and goes up every second. Lock your price now.",
  keywords: ["developer", "freelance", "pricing", "counter", "100kdev"],
  authors: [{ name: "100KDEV" }],
  openGraph: {
    title: "100KDEV - The dev who starts at $1,000",
    description: "Lock your price before it goes up.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="antialiased">
        <Providers>
          <div className="grain-overlay" />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
