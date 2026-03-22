import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — X Flow Teller",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Last updated: March 22, 2026
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-[var(--muted)]">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            Overview
          </h2>
          <p>
            X Flow Teller is a Chrome extension that reads X (Twitter) posts
            aloud using your browser&apos;s built-in text-to-speech engine. We are
            committed to protecting your privacy. This policy explains what data
            we collect and how we use it.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            Data We Collect
          </h2>
          <p>
            <strong className="text-[var(--text)]">We do not collect, store, or transmit any personal data.</strong>
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              No browsing history, tweets, or page content is sent to any server.
            </li>
            <li>
              All text-to-speech processing happens locally in your browser
              using the Web SpeechSynthesis API.
            </li>
            <li>
              No analytics, tracking pixels, or third-party scripts are included
              in the extension.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            License Key Storage
          </h2>
          <p>
            If you purchase a license, your license key is stored in
            Chrome&apos;s sync storage (tied to your Google account) so you
            don&apos;t have to re-enter it after reinstalling. The key is
            validated against Polar.sh&apos;s API. No other data is sent during
            this process.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            Daily Usage Counter
          </h2>
          <p>
            Free-tier users have a daily read limit. The counter is stored in
            Chrome&apos;s sync storage and never leaves your browser. It is not
            sent to any external server.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            Permissions
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-[var(--text)]">activeTab / host permissions (x.com, twitter.com):</strong>{" "}
              Required to read tweet text from the page so it can be spoken
              aloud.
            </li>
            <li>
              <strong className="text-[var(--text)]">storage:</strong>{" "}
              Used to persist your license key and daily usage counter.
            </li>
            <li>
              <strong className="text-[var(--text)]">offscreen:</strong>{" "}
              Used to run the SpeechSynthesis API in a background document.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            Third-Party Services
          </h2>
          <p>
            The only external service contacted is{" "}
            <a
              href="https://polar.sh"
              className="text-[#1d9bf0] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Polar.sh
            </a>{" "}
            for license key activation and validation. No personal data beyond
            the license key itself is transmitted.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            Changes to This Policy
          </h2>
          <p>
            If we make material changes, we will update this page and the
            &quot;Last updated&quot; date above.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            Contact
          </h2>
          <p>
            Questions? Reach us at{" "}
            <a
              href="mailto:support@xflowteller.com"
              className="text-[#1d9bf0] hover:underline"
            >
              support@xflowteller.com
            </a>
          </p>
        </div>
      </section>

      <footer className="mt-16 border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--muted)]">
        <a href="/" className="transition hover:text-[#1d9bf0]">
          &larr; Back to xflowteller.com
        </a>
      </footer>
    </main>
  );
}
