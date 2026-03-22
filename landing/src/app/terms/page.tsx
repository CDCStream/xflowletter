import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — X Flow Teller",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Last updated: March 22, 2026
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-[var(--muted)]">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            1. Acceptance of Terms
          </h2>
          <p>
            By installing or using the X Flow Teller Chrome extension
            (&quot;Extension&quot;) or visiting xflowteller.com (&quot;Site&quot;),
            you agree to these Terms of Service. If you do not agree, do not use
            the Extension or Site.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            2. Description of Service
          </h2>
          <p>
            X Flow Teller is a browser extension that reads X (Twitter) posts
            aloud using your browser&apos;s built-in text-to-speech engine. All
            processing happens locally on your device.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            3. Free Tier &amp; Paid License
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-[var(--text)]">Free tier:</strong> 10
              reads per day, no account required.
            </li>
            <li>
              <strong className="text-[var(--text)]">Lifetime license:</strong>{" "}
              A one-time $5 payment grants unlimited reads with no recurring
              fees. Payments are processed by{" "}
              <a
                href="https://polar.sh"
                className="text-[#1d9bf0] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Polar.sh
              </a>
              , our Merchant of Record.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            4. License Key
          </h2>
          <p>
            Your license key is personal and non-transferable. It is stored in
            Chrome&apos;s sync storage and tied to your Google account. Sharing
            or reselling license keys is prohibited.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            5. Refund Policy
          </h2>
          <p>
            Since the Extension offers a free tier for evaluation, all sales are
            final. If you experience a technical issue that prevents the
            Extension from working, contact us and we will do our best to
            resolve it.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            6. Intellectual Property
          </h2>
          <p>
            All code, design, and branding of X Flow Teller are owned by the
            developer. You may not copy, modify, or redistribute the Extension
            or any part of it without written permission.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            7. Disclaimer of Warranties
          </h2>
          <p>
            The Extension is provided &quot;as is&quot; without warranties of
            any kind. We do not guarantee uninterrupted or error-free operation.
            The Extension depends on your browser&apos;s SpeechSynthesis API and
            available system voices.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            8. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, X Flow Teller and its
            developer shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of the Extension.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            9. Changes to Terms
          </h2>
          <p>
            We may update these terms at any time. Changes take effect when
            posted on this page. Continued use of the Extension after changes
            constitutes acceptance.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
            10. Contact
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
