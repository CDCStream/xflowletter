import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-560S234T81";

export const metadata: Metadata = {
  title: "X Flow Teller — Read X Posts Aloud",
  description:
    "Listen to your X (Twitter) feed hands-free. X Flow Teller reads posts aloud with multi-language support — offline, zero-cost, no cloud API.",
  verification: {
    google: "eypqi9p_AYWrLARYN3hndxrQT8DBfc3SZArzvNdNjPY",
  },
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
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
