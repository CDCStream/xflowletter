"use client";

import { useEffect, useState } from "react";

const TWEET_TEXT =
  "Just shipped a new feature that lets you listen to your entire timeline while cooking dinner. The future is hands-free. 🚀";

const WORDS = TWEET_TEXT.split(" ");
const WORD_DURATION = 320;
const PAUSE_BEFORE_RESTART = 2000;

export function MockTweet() {
  const [activeWord, setActiveWord] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      setActiveWord((prev) => {
        const next = prev + 1;
        if (next >= WORDS.length) {
          setIsPaused(true);
          timeout = setTimeout(() => {
            setIsPaused(false);
            setActiveWord(-1);
          }, PAUSE_BEFORE_RESTART);
          return prev;
        }
        return next;
      });
    };

    if (!isPaused) {
      timeout = setTimeout(tick, activeWord === -1 ? 800 : WORD_DURATION);
    }

    return () => clearTimeout(timeout);
  }, [activeWord, isPaused]);

  return (
    <div className="mock-tweet">
      {/* Tweet header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d9bf0] to-[#0a66c2] flex items-center justify-center text-white text-sm font-bold shrink-0">
          JD
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-white truncate">Jane Doe</span>
            <svg width="16" height="16" viewBox="0 0 24 24" className="text-[#1d9bf0] shrink-0">
              <path fill="currentColor" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.88 13.43 2 12 2s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.88 9.33 2 10.57 2 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81C9.33 21.12 10.57 22 12 22s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91C21.12 14.67 22 13.43 22 12zm-11.07 4.83-3.54-3.54 1.41-1.41 2.13 2.12 4.24-4.24 1.41 1.42-5.65 5.65z"/>
            </svg>
          </div>
          <span className="text-xs text-[var(--muted)]">@janedoe · 2h</span>
        </div>
      </div>

      {/* Tweet body with reading animation */}
      <p className="text-[15px] leading-relaxed text-[#e7e9ea]">
        {WORDS.map((word, i) => (
          <span
            key={i}
            className={`tweet-word ${i < activeWord ? "read" : ""} ${i === activeWord ? "active" : ""}`}
          >
            {word}{" "}
          </span>
        ))}
      </p>

      {/* Tweet footer */}
      <div className="flex items-center gap-6 mt-4 text-[var(--muted)]">
        <span className="flex items-center gap-1.5 text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          42
        </span>
        <span className="flex items-center gap-1.5 text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          128
        </span>
        <span className="flex items-center gap-1.5 text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          1.2K
        </span>
      </div>

      {/* Reading indicator bar */}
      <div className="reading-bar-track">
        <div
          className="reading-bar-fill"
          style={{ width: `${activeWord < 0 ? 0 : (activeWord / WORDS.length) * 100}%` }}
        />
      </div>

      {/* Speaker icon pulse */}
      <div className={`speaker-badge ${activeWord >= 0 && !isPaused ? "speaking" : ""}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      </div>
    </div>
  );
}
