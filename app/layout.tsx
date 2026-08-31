import type { Metadata } from "next";
import { Space_Grotesk, Newsreader, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const description =
  "Sourced, computed data on human outcomes. Every number traces to a file you can open and check.";

export const metadata: Metadata = {
  metadataBase: new URL("https://denominator.fyi"),
  title: {
    default: "Denominator",
    template: "%s — Denominator",
  },
  description,
  openGraph: {
    title: "Denominator",
    description,
    url: "https://denominator.fyi",
    siteName: "Denominator",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Denominator",
    description,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body className="font-body text-[17px] leading-[1.58] text-ink bg-paper antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
