import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X Flow Teller — Read X Posts Aloud",
  description:
    "Listen to your X (Twitter) feed hands-free. X Flow Teller reads posts aloud with multi-language support — offline, zero-cost, no cloud API.",
  openGraph: {
    title: "X Flow Teller — Read X Posts Aloud",
    description:
      "Listen to your X feed hands-free. Multi-language TTS, infinite scroll, one-time $5.",
    url: "https://xflowteller.com",
    siteName: "X Flow Teller",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "X Flow Teller",
    description: "Read your X feed aloud — $5 lifetime.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
