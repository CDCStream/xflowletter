/**
 * Offscreen document: handles TTS via the browser's built-in SpeechSynthesis API.
 * No WASM, no external downloads — works immediately with Chrome's system voices.
 */
(function () {
  console.log("[XFT offscreen] Script loaded — using SpeechSynthesis API");

  let currentSpeakId = null;
  let currentTabId = null;
  let aborted = false;

  // Signal readiness immediately
  chrome.runtime.sendMessage({ type: "OFFSCREEN_READY" }).catch(() => {});

  // --- Voice selection ---

  const LANG_MAP = {
    en: "en",  tr: "tr",  fr: "fr",  de: "de",  es: "es",
    pt: "pt",  it: "it",  nl: "nl",  pl: "pl",  cs: "cs",
    ro: "ro",  hu: "hu",  sv: "sv",  no: "nb",  da: "da",
    fi: "fi",  el: "el",  ru: "ru",  uk: "uk",  sr: "sr",
    ar: "ar",  he: "he",  hi: "hi",  bn: "bn",  ta: "ta",
    te: "te",  kn: "kn",  ml: "ml",  gu: "gu",  th: "th",
    vi: "vi",  id: "id",  ja: "ja",  ko: "ko",  zh: "zh",
  };

  function pickVoice(langCode) {
    const voices = speechSynthesis.getVoices();
    const tag = LANG_MAP[langCode] || "en";

    let match = voices.find((v) => v.lang.toLowerCase().startsWith(tag) && v.localService === false);
    if (!match) match = voices.find((v) => v.lang.toLowerCase().startsWith(tag));
    if (!match && tag !== "en") match = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
    return match || null;
  }

  // Preload voices (Chrome loads them asynchronously)
  speechSynthesis.getVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      const voices = speechSynthesis.getVoices();
      console.log("[XFT offscreen] Voices loaded:", voices.length);
    };
  }

  // --- Notify content script of phase changes ---

  function notifyPhase(tabId, phase, lang) {
    if (tabId == null) return;
    chrome.runtime.sendMessage({ type: "TTS_PHASE", tabId, phase, lang: lang || "en" }).catch(() => {});
  }

  // --- Core speak function ---

  function doSpeak({ text, id, tabId, lang }) {
    aborted = false;
    currentSpeakId = id;
    currentTabId = tabId;

    const langCode = String(lang || "en").toLowerCase();
    const prepared = (text || "").replace(/\s+/g, " ").trim();

    if (!prepared) {
      chrome.runtime.sendMessage({ type: "TTS_DONE", id, tabId, skipped: true }).catch(() => {});
      return;
    }

    console.log("[XFT offscreen] doSpeak lang=" + langCode + " text=" + JSON.stringify(prepared.slice(0, 80)));
    notifyPhase(tabId, "synth", langCode);

    const utterance = new SpeechSynthesisUtterance(prepared);
    utterance.lang = langCode;

    const voice = pickVoice(langCode);
    if (voice) {
      utterance.voice = voice;
      console.log("[XFT offscreen] Using voice:", voice.name, voice.lang);
    } else {
      console.warn("[XFT offscreen] No voice found for", langCode, "— using default");
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      console.log("[XFT offscreen] Speech started");
      notifyPhase(tabId, "play", langCode);
    };

    utterance.onend = () => {
      console.log("[XFT offscreen] Speech ended");
      if (!aborted) {
        chrome.runtime.sendMessage({ type: "TTS_DONE", id, tabId, skipped: false }).catch(() => {});
      }
    };

    utterance.onerror = (ev) => {
      if (aborted || ev.error === "canceled" || ev.error === "interrupted") {
        console.log("[XFT offscreen] Speech canceled/interrupted");
        return;
      }
      console.error("[XFT offscreen] Speech error:", ev.error);
      chrome.runtime.sendMessage({
        type: "TTS_ERROR",
        id,
        tabId,
        message: "SpeechSynthesis error: " + ev.error,
      }).catch(() => {});
    };

    speechSynthesis.speak(utterance);
  }

  // --- Message listener ---

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.target !== "offscreen") return;
    console.log("[XFT offscreen] Received:", msg.type);

    if (msg.type === "OFFSCREEN_SPEAK") {
      doSpeak(msg);
      return;
    }

    if (msg.type === "OFFSCREEN_STOP") {
      aborted = true;
      speechSynthesis.cancel();
      return;
    }

    if (msg.type === "OFFSCREEN_SKIP_CURRENT") {
      aborted = true;
      speechSynthesis.cancel();
      if (currentSpeakId != null && currentTabId != null) {
        chrome.runtime.sendMessage({
          type: "TTS_DONE",
          id: currentSpeakId,
          tabId: currentTabId,
          skipped: true,
        }).catch(() => {});
      }
      return;
    }

    if (msg.type === "OFFSCREEN_PAUSE") {
      speechSynthesis.pause();
      return;
    }

    if (msg.type === "OFFSCREEN_RESUME") {
      speechSynthesis.resume();
      return;
    }
  });
})();
