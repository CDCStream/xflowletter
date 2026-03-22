/**
 * MV3 service worker: routes TTS messages to the offscreen document
 * and handles Polar.sh license key activation/validation.
 */

console.log("[XFT bg] Service worker started");

// ── Polar.sh config ──
// Replace with your real Organization ID after creating the product on Polar.sh
const POLAR_ORG_ID = "e2a74371-0002-4c1d-a0c4-374cc0525439";
const POLAR_API = "https://api.polar.sh/v1/customer-portal/license-keys";

const FREE_DAILY_LIMIT = 10;

let offscreenReady = false;
let readyResolvers = [];

async function ensureOffscreen() {
  console.log("[XFT bg] ensureOffscreen called, offscreenReady=" + offscreenReady);

  if (chrome.runtime.getContexts) {
    const contexts = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
    });
    console.log("[XFT bg] existing offscreen contexts:", contexts.length);
    if (contexts.length > 0) {
      offscreenReady = true;
      return;
    }
  }

  offscreenReady = false;
  try {
    console.log("[XFT bg] Creating offscreen document…");
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Local Piper TTS synthesis and playback for X Flow Teller",
    });
    console.log("[XFT bg] Offscreen document created");
  } catch (e) {
    const m = String(e && e.message);
    console.warn("[XFT bg] createDocument error:", m);
    if (!/already exists|Only a single offscreen/i.test(m)) throw e;
  }

  if (offscreenReady) {
    console.log("[XFT bg] Already ready (OFFSCREEN_READY arrived during create)");
    return;
  }

  console.log("[XFT bg] Waiting for OFFSCREEN_READY…");
  await new Promise((resolve) => {
    if (offscreenReady) { resolve(); return; }
    readyResolvers.push(resolve);
    setTimeout(() => {
      console.log("[XFT bg] Ready timeout (3s fallback)");
      offscreenReady = true;
      flushReady();
    }, 3000);
  });
}

function flushReady() {
  const list = readyResolvers.splice(0);
  for (const r of list) r();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.target === "offscreen") return;

  console.log("[XFT bg] onMessage:", msg.type, msg);

  if (msg.type === "OFFSCREEN_READY") {
    console.log("[XFT bg] Offscreen is READY");
    offscreenReady = true;
    flushReady();
    return false;
  }

  if (msg.type === "SPEAK") {
    const tabId = sender.tab && sender.tab.id;
    console.log("[XFT bg] SPEAK from tab", tabId, "text:", (msg.text || "").slice(0, 60));
    if (tabId == null) {
      console.warn("[XFT bg] SPEAK: no tabId, ignoring");
      return;
    }
    ensureOffscreen().then(() => {
      console.log("[XFT bg] Sending OFFSCREEN_SPEAK…");
      chrome.runtime.sendMessage({
        target: "offscreen",
        type: "OFFSCREEN_SPEAK",
        text: msg.text,
        id: msg.id,
        tabId,
        lang: msg.lang,
      }).then(() => {
        console.log("[XFT bg] OFFSCREEN_SPEAK sent OK");
      }).catch((e) => {
        console.error("[XFT bg] OFFSCREEN_SPEAK send FAILED:", e);
        chrome.tabs.sendMessage(tabId, {
          type: "TTS_ERROR",
          id: msg.id,
          tabId,
          message: "Offscreen not reachable: " + (e && e.message ? e.message : String(e)),
        }).catch(() => {});
      });
    }).catch((e) => {
      console.error("[XFT bg] ensureOffscreen FAILED:", e);
    });
    return false;
  }

  if (msg.type === "TTS_DONE" && msg.tabId != null) {
    console.log("[XFT bg] TTS_DONE, forwarding to tab", msg.tabId);
    chrome.tabs.sendMessage(msg.tabId, msg).catch(() => {});
    return false;
  }

  if (msg.type === "TTS_ERROR" && msg.tabId != null) {
    console.error("[XFT bg] TTS_ERROR:", msg.message);
    chrome.tabs.sendMessage(msg.tabId, msg).catch(() => {});
    return false;
  }

  if (msg.type === "TTS_PHASE" && msg.tabId != null) {
    chrome.tabs.sendMessage(msg.tabId, msg).catch(() => {});
    return false;
  }

  const offscreenControls = {
    PAUSE: "OFFSCREEN_PAUSE",
    RESUME: "OFFSCREEN_RESUME",
    STOP: "OFFSCREEN_STOP",
    SKIP_CURRENT: "OFFSCREEN_SKIP_CURRENT",
  };
  const oc = offscreenControls[msg.type];
  if (oc) {
    ensureOffscreen().then(() => {
      chrome.runtime.sendMessage({ target: "offscreen", type: oc }).catch(() => {});
    });
    return false;
  }

  // ── License activation ──
  if (msg.type === "ACTIVATE_LICENSE") {
    (async () => {
      try {
        const res = await fetch(POLAR_API + "/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: msg.key,
            organization_id: POLAR_ORG_ID,
            label: "xft-chrome-ext",
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const detail = err.detail || err.message || "Invalid license key";
          sendResponse({ ok: false, error: String(detail) });
          return;
        }
        const data = await res.json();
        await chrome.storage.sync.set({
          xft_license_key: msg.key,
          xft_activation_id: data.id,
          xft_licensed: true,
          xft_validated_at: Date.now(),
        });
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: e.message || "Network error" });
      }
    })();
    return true;
  }

  // ── License validation (periodic) ──
  if (msg.type === "VALIDATE_LICENSE") {
    (async () => {
      try {
        const store = await chrome.storage.sync.get(["xft_license_key", "xft_activation_id"]);
        if (!store.xft_license_key) {
          sendResponse({ ok: false, licensed: false });
          return;
        }
        const body = {
          key: store.xft_license_key,
          organization_id: POLAR_ORG_ID,
        };
        if (store.xft_activation_id) body.activation_id = store.xft_activation_id;
        const res = await fetch(POLAR_API + "/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          await chrome.storage.sync.set({ xft_licensed: false });
          sendResponse({ ok: true, licensed: false });
          return;
        }
        await chrome.storage.sync.set({ xft_licensed: true, xft_validated_at: Date.now() });
        sendResponse({ ok: true, licensed: true });
      } catch (e) {
        sendResponse({ ok: true, licensed: true });
      }
    })();
    return true;
  }

  // ── Daily usage tracking ──
  if (msg.type === "CHECK_USAGE") {
    (async () => {
      const store = await chrome.storage.sync.get(["xft_licensed", "xft_daily_count", "xft_daily_date"]);
      if (store.xft_licensed) {
        sendResponse({ allowed: true, licensed: true, remaining: Infinity });
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      let count = store.xft_daily_count || 0;
      if (store.xft_daily_date !== today) count = 0;
      sendResponse({ allowed: count < FREE_DAILY_LIMIT, licensed: false, remaining: FREE_DAILY_LIMIT - count });
    })();
    return true;
  }

  if (msg.type === "INCREMENT_USAGE") {
    (async () => {
      const store = await chrome.storage.sync.get(["xft_licensed", "xft_daily_count", "xft_daily_date"]);
      if (store.xft_licensed) { sendResponse({ ok: true }); return; }
      const today = new Date().toISOString().slice(0, 10);
      let count = store.xft_daily_count || 0;
      if (store.xft_daily_date !== today) count = 0;
      count++;
      await chrome.storage.sync.set({ xft_daily_count: count, xft_daily_date: today });
      sendResponse({ ok: true, remaining: FREE_DAILY_LIMIT - count });
    })();
    return true;
  }

  // ── Deactivate license ──
  if (msg.type === "DEACTIVATE_LICENSE") {
    chrome.storage.sync.remove(["xft_license_key", "xft_activation_id", "xft_licensed", "xft_validated_at"]);
    sendResponse({ ok: true });
    return true;
  }

  return false;
});
