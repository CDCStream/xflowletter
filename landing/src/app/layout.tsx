import type { Metadata } from "next";
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
      <body>
        {children}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
          }}
        />
        <script
          async
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="euGCCJjNf72DZ3107nu3WA"
        />
      </body>
    </html>
  );
}
