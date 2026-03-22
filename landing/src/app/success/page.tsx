import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Thank You — X Flow Teller",
};

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-8 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="X Flow Teller"
            width={72}
            height={72}
            className="rounded-2xl"
          />
        </div>
        <h1 className="mb-4 text-3xl font-extrabold">Thank you!</h1>
        <p className="mb-6 text-[var(--muted)]">
          Your license key has been sent to your email. Open the X Flow Teller
          panel on X, click the <strong>FREE</strong> badge, and paste your key
          to activate unlimited reads.
        </p>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-left text-sm text-[var(--muted)]">
          <p className="mb-3 font-semibold text-[var(--text)]">Quick Start:</p>
          <ol className="list-inside list-decimal space-y-2">
            <li>Check your email for the license key</li>
            <li>
              Go to{" "}
              <a
                href="https://x.com"
                className="text-[#1d9bf0] hover:underline"
              >
                x.com
              </a>
            </li>
            <li>
              Click the <strong>FREE</strong> badge on the X Flow Teller panel
            </li>
            <li>Paste your key and click Activate</li>
          </ol>
        </div>
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-[var(--muted)] transition hover:text-[#1d9bf0]"
        >
          &larr; Back to home
        </Link>
      </div>
    </main>
  );
}
