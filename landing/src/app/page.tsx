import Image from "next/image";
import { WaveHero } from "@/components/ui/wave-hero";
import { MockTweet } from "@/components/ui/mock-tweet";
import { LanguagePopup } from "@/components/ui/language-popup";

const CHECKOUT_URL = "/api/checkout?products=ff357f59-bae0-4fb6-be8b-9bb670669e4e";

const features = [
  {
    icon: "🎧",
    title: "Hands-Free Listening",
    desc: "Hit Play and your feed is read aloud, post by post. Scroll happens automatically.",
  },
  {
    icon: "🌍",
    title: "35 Native Voices",
    desc: "Auto-detects 35 languages with native-speaker voices. Posts in other languages are read with an English voice so nothing is skipped.",
  },
  {
    icon: "⏭️",
    title: "Smart Skip",
    desc: "Skip any post with one click. Ads and video-only posts are filtered out.",
  },
  {
    icon: "🔒",
    title: "100% Local & Private",
    desc: "No cloud API, no data sent anywhere. Everything runs in your browser.",
  },
  {
    icon: "♾️",
    title: "Infinite Scroll",
    desc: "When visible posts run out, the page scrolls automatically to load more.",
  },
  {
    icon: "💰",
    title: "One-Time Payment",
    desc: "Pay once, use forever. No subscriptions, no hidden fees.",
  },
];

const steps = [
  {
    num: "1",
    title: "Install Extension",
    desc: "Add X Flow Teller to Chrome from the Chrome Web Store.",
  },
  {
    num: "2",
    title: "Enter License Key",
    desc: "Paste the key you receive after purchase to unlock unlimited reads.",
  },
  {
    num: "3",
    title: "Press Play",
    desc: "Open X, hit Play, and listen to your feed while you do other things.",
  },
];

const faqs = [
  {
    q: "Which languages are supported?",
    a: "35 languages are natively supported with native-speaker voices: English, Turkish, French, German, Spanish, Portuguese, Italian, Dutch, Polish, Czech, Romanian, Hungarian, Swedish, Norwegian, Danish, Finnish, Russian, Ukrainian, Serbian, Greek, Arabic, Hebrew, Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Thai, Vietnamese, Indonesian, Japanese, Korean, and Chinese. Posts in any other language are read with an English voice so you never miss a post.",
  },
  {
    q: "Does it work offline?",
    a: "Yes — the TTS engine runs entirely in your browser. No internet required for speech synthesis.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! You get 10 free reads per day without a license key. Upgrade for unlimited.",
  },
  {
    q: "Can I get a refund?",
    a: "Absolutely. If you're not happy, contact us within 14 days for a full refund.",
  },
  {
    q: "Does it read images or videos?",
    a: "No — only text content is read. Video-only posts are automatically skipped.",
  },
  {
    q: "Will it work on Twitter.com?",
    a: "Yes, both x.com and twitter.com are supported.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <WaveHero />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center animate-[fadeInUp_1s_ease-out]">
          <div className="mb-8 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="X Flow Teller"
              width={64}
              height={64}
              className="rounded-2xl"
              priority
            />
          </div>

          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-[#1d9bf0]/70">
            Listen to the flow of your feed
          </p>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl leading-[0.95]">
            <span className="block">READ YOUR</span>
            <span className="block text-[#1d9bf0] drop-shadow-[0_0_40px_rgba(29,155,240,0.3)]">
              X FEED
            </span>
            <span className="block">ALOUD</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-base text-[var(--muted)] sm:text-lg">
            A Chrome extension that reads every post on X out loud —{" "}
            <LanguagePopup>
              <span className="text-white font-semibold">35 languages with native voices</span>
            </LanguagePopup>,
            all others read with an English voice. Hands-free, 100% local, no cloud API.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={CHECKOUT_URL}
              className="rounded-full bg-[#1d9bf0] px-10 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(29,155,240,0.25)] transition-all hover:bg-[#1a8cd8] hover:shadow-[0_0_50px_rgba(29,155,240,0.4)] hover:scale-105"
            >
              Get It Now — $5
            </a>
            <span className="text-sm text-[var(--muted)]">
              One-time payment &middot; Lifetime access
            </span>
          </div>

          <div className="mt-14 animate-[fadeInUp_1.4s_ease-out]">
            <MockTweet />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--muted)] opacity-40">
            <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-14 text-center text-3xl font-bold">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1d9bf0]/15 text-xl font-bold text-[#1d9bf0]">
                {s.num}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-[var(--muted)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[var(--surface)] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-14 text-center text-3xl font-bold">Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6"
              >
                <div className="mb-3 text-2xl">{f.icon}</div>
                <h3 className="mb-1 font-semibold">{f.title}</h3>
                <p className="text-sm text-[var(--muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold">Simple Pricing</h2>
        <p className="mb-10 text-[var(--muted)]">
          No subscriptions. No hidden fees. Pay once, use forever.
        </p>
        <div className="rounded-2xl border border-[#1d9bf0]/30 bg-[var(--surface)] p-8 shadow-lg shadow-[#1d9bf0]/5">
          <div className="mb-1 text-sm font-medium uppercase tracking-wider text-[#1d9bf0]">
            Lifetime License
          </div>
          <div className="mb-6 text-5xl font-extrabold">
            $5
          </div>
          <ul className="mb-8 space-y-3 text-left text-sm text-[var(--muted)]">
            {[
              "Unlimited reads per day",
              "All supported languages",
              "Automatic updates",
              "Priority support",
              "14-day money-back guarantee",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-[#1d9bf0]">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={CHECKOUT_URL}
            className="block w-full rounded-full bg-[#1d9bf0] py-3 text-center font-bold text-white transition hover:bg-[#1a8cd8]"
          >
            Buy Now — $5
          </a>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Secure checkout by Polar.sh
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[var(--surface)] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-14 text-center text-3xl font-bold">FAQ</h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-[var(--border)] bg-[var(--bg)] px-6 py-4"
              >
                <summary className="cursor-pointer list-none font-semibold [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between">
                    {f.q}
                    <span className="ml-2 text-[var(--muted)] transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] py-10 text-center text-sm text-[var(--muted)]">
        <p>
          &copy; {new Date().getFullYear()} X Flow Teller &middot;{" "}
          <a
            href="https://xflowteller.com"
            className="transition hover:text-[#1d9bf0]"
          >
            xflowteller.com
          </a>
        </p>
      </footer>
    </main>
  );
}
