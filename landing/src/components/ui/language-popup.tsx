"use client";

import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { flag: "🇬🇧", name: "English" },
  { flag: "🇹🇷", name: "Turkish" },
  { flag: "🇫🇷", name: "French" },
  { flag: "🇩🇪", name: "German" },
  { flag: "🇪🇸", name: "Spanish" },
  { flag: "🇧🇷", name: "Portuguese" },
  { flag: "🇮🇹", name: "Italian" },
  { flag: "🇳🇱", name: "Dutch" },
  { flag: "🇵🇱", name: "Polish" },
  { flag: "🇨🇿", name: "Czech" },
  { flag: "🇷🇴", name: "Romanian" },
  { flag: "🇭🇺", name: "Hungarian" },
  { flag: "🇸🇪", name: "Swedish" },
  { flag: "🇳🇴", name: "Norwegian" },
  { flag: "🇩🇰", name: "Danish" },
  { flag: "🇫🇮", name: "Finnish" },
  { flag: "🇷🇺", name: "Russian" },
  { flag: "🇺🇦", name: "Ukrainian" },
  { flag: "🇷🇸", name: "Serbian" },
  { flag: "🇬🇷", name: "Greek" },
  { flag: "🇸🇦", name: "Arabic" },
  { flag: "🇮🇱", name: "Hebrew" },
  { flag: "🇮🇳", name: "Hindi" },
  { flag: "🇧🇩", name: "Bengali" },
  { flag: "🇮🇳", name: "Tamil" },
  { flag: "🇮🇳", name: "Telugu" },
  { flag: "🇮🇳", name: "Kannada" },
  { flag: "🇮🇳", name: "Malayalam" },
  { flag: "🇮🇳", name: "Gujarati" },
  { flag: "🇹🇭", name: "Thai" },
  { flag: "🇻🇳", name: "Vietnamese" },
  { flag: "🇮🇩", name: "Indonesian" },
  { flag: "🇯🇵", name: "Japanese" },
  { flag: "🇰🇷", name: "Korean" },
  { flag: "🇨🇳", name: "Chinese" },
];

export function LanguagePopup({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline cursor-pointer underline decoration-dotted underline-offset-4 decoration-[#1d9bf0]/50 hover:decoration-[#1d9bf0] transition-colors"
      >
        {children}
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 w-[340px] sm:w-[420px] animate-[fadeInUp_0.2s_ease-out]">
          <div className="rounded-2xl border border-white/10 bg-[#111827]/95 backdrop-blur-xl p-5 shadow-2xl shadow-black/40">
            <p className="text-xs font-medium uppercase tracking-wider text-[#1d9bf0] mb-3">
              35 Supported Languages
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
              {LANGUAGES.map((l) => (
                <span key={l.name} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <span className="text-base leading-none">{l.flag}</span>
                  {l.name}
                </span>
              ))}
            </div>
            <p className="mt-3 pt-3 border-t border-white/5 text-xs text-[var(--muted)]">
              All other languages are read with an English voice.
            </p>
          </div>
          <div className="mx-auto w-3 h-3 -mt-1.5 rotate-45 bg-[#111827]/95 border-b border-r border-white/10" />
        </div>
      )}
    </span>
  );
}
