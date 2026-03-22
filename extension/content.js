(function () {
  const READ_CAP = 2000;
  const readOrder = [];
  const readIds = new Set();
  const skippedIds = new Set();

  let playing = false;
  let paused = false;
  let scrollWaitTimer = null;
  let awaitingTts = false;
  let currentReadId = null;

  const PANEL_ID = "xflow-teller-panel";
  let currentArticle = null;
  let isLicensed = false;
  let dailyRemaining = 10;

  // ── Scroll & Highlight ──

  function scrollToArticle(article) {
    if (!article || !article.isConnected) return;
    article.style.scrollMarginTop = "80px";
    article.style.scrollMarginBottom = "220px";
    article.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function highlightArticle(article) {
    if (currentArticle && currentArticle !== article) {
      currentArticle.classList.remove("xft-reading");
    }
    currentArticle = article;
    if (article && article.isConnected) {
      article.classList.add("xft-reading");
    }
  }

  function clearHighlight() {
    if (currentArticle) {
      currentArticle.classList.remove("xft-reading");
      currentArticle = null;
    }
  }

  // ── Read tracking ──

  function markRead(id) {
    readIds.add(id);
    readOrder.push(id);
    while (readOrder.length > READ_CAP) {
      const old = readOrder.shift();
      readIds.delete(old);
    }
  }

  // ── DOM helpers ──

  function getTweetId(article) {
    if (!article) return null;
    const links = article.querySelectorAll("a[href]");
    for (const a of links) {
      const href = a.getAttribute("href") || "";
      const m = href.match(/\/status\/(\d+)/);
      if (m) return m[1];
    }
    const time = article.querySelector("time");
    if (time) {
      const pa = time.closest("a");
      if (pa) {
        const href = pa.getAttribute("href") || "";
        const m = href.match(/\/status\/(\d+)/);
        if (m) return m[1];
      }
    }
    return null;
  }

  function isPromoted(article) {
    return false;
  }

  function articleFromTextEl(textEl) {
    return (
      textEl.closest("article") ||
      textEl.closest('[data-testid="tweet"]') ||
      textEl.closest('[role="article"]')
    );
  }

  function queryTweetTextElements() {
    const found = document.querySelectorAll('[data-testid="tweetText"]');
    if (found.length) return Array.from(found);
    const legacy = [];
    document.querySelectorAll('[data-testid="cellInnerDiv"]').forEach((cell) => {
      const t = cell.querySelector('[data-testid="tweetText"]');
      if (t) legacy.push(t);
    });
    return legacy;
  }

  // ── Find the next visible unread post directly from the DOM ──

  function findNextVisiblePost() {
    const textEls = queryTweetTextElements();
    for (const textEl of textEls) {
      const article = articleFromTextEl(textEl);
      if (!article || !article.isConnected) continue;
      const id = getTweetId(article);
      if (!id) continue;
      if (readIds.has(id) || skippedIds.has(id)) continue;
      if (isPromoted(article)) continue;
      const text = (textEl.innerText || "").trim();
      if (!text) continue;

      const rect = article.getBoundingClientRect();
      if (rect.bottom <= 0) continue;

      return { id, text, article };
    }
    return null;
  }

  // ── Skip buttons ──

  function ensureSkipButton(article) {
    if (!article || article.querySelector(".xft-skip-btn")) return;
    const id = getTweetId(article);
    if (!id) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "xft-skip-btn";
    btn.textContent = "Skip";
    btn.title = "Skip this post";
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      skippedIds.add(id);
      article.style.opacity = "0.3";
      btn.disabled = true;
    });
    article.style.position = article.style.position || "relative";
    article.appendChild(btn);
  }

  function scanInjectButtons() {
    const seen = new WeakSet();
    for (const textEl of queryTweetTextElements()) {
      const article = articleFromTextEl(textEl);
      if (!article || seen.has(article)) continue;
      seen.add(article);
      ensureSkipButton(article);
    }
  }

  // ── Status ──

  function setStatus(t) {
    const el = document.getElementById(PANEL_ID);
    if (!el) return;
    const s = el.querySelector(".xft-status");
    if (s) s.textContent = t;
  }

  // ── Core playback ──

  function playNext() {
    if (!playing || paused) return;

    const next = findNextVisiblePost();

    if (next) {
      currentReadId = next.id;
      markRead(next.id);

      chrome.runtime.sendMessage({ type: "CHECK_USAGE" }, (res) => {
        if (chrome.runtime.lastError || !res) { doSpeak(next); return; }
        isLicensed = res.licensed;
        dailyRemaining = res.remaining;
        if (!res.allowed) {
          playing = false;
          setStatus("Daily limit reached");
          showUpgradePrompt();
          return;
        }
        doSpeak(next);
      });
      return;
    }

    // No unread posts in DOM — scroll to load more
    setStatus("Scrolling…");
    window.scrollBy({ top: 400, behavior: "smooth" });
    if (scrollWaitTimer) clearTimeout(scrollWaitTimer);
    scrollWaitTimer = setTimeout(() => {
      scrollWaitTimer = null;
      if (findNextVisiblePost()) {
        playNext();
      } else {
        setStatus("No posts found — scroll or wait");
      }
    }, 2000);
  }

  function doSpeak(next) {
    awaitingTts = true;

    scrollToArticle(next.article);
    highlightArticle(next.article);

    const lang =
      typeof globalThis.XFlowDetectLang === "function"
        ? globalThis.XFlowDetectLang(next.text)
        : "en";

    chrome.runtime.sendMessage({
      type: "SPEAK",
      text: next.text,
      id: next.id,
      lang,
    }).catch(() => {
      awaitingTts = false;
      setStatus("Error: message failed — reload extension");
    });

    chrome.runtime.sendMessage({ type: "INCREMENT_USAGE" }, (res) => {
      if (res && typeof res.remaining === "number") dailyRemaining = res.remaining;
    });

    const suffix = isLicensed ? "" : " [" + dailyRemaining + " left]";
    setStatus("Playing… (" + String(lang).toUpperCase() + ")" + suffix);
  }

  // ── TTS callbacks ──

  function onTtsDone(msg) {
    awaitingTts = false;
    if (!playing) return;
    setStatus("Ready");
    playNext();
  }

  function onTtsError(msg) {
    awaitingTts = false;
    setStatus("Error: " + (msg.message || "TTS"));
    playNext();
  }

  // ── License UI ──

  function showUpgradePrompt() {
    const el = document.getElementById(PANEL_ID);
    if (!el) return;
    const existing = el.querySelector(".xft-upgrade");
    if (existing) { existing.style.display = "block"; return; }
    const div = document.createElement("div");
    div.className = "xft-upgrade";
    div.innerHTML = `
      <p>Daily free limit reached.</p>
      <a href="https://xflowteller.com" target="_blank" rel="noopener noreferrer" class="xft-upgrade-btn">Get Unlimited — $5</a>
      <button type="button" class="xft-activate-link">I have a key</button>
    `;
    const inner = el.querySelector(".xft-inner");
    if (inner) inner.appendChild(div);
    div.querySelector(".xft-activate-link").addEventListener("click", () => showLicenseModal());
  }

  function showLicenseModal() {
    const el = document.getElementById(PANEL_ID);
    if (!el) return;
    let modal = el.querySelector(".xft-license-modal");
    if (modal) { modal.style.display = "flex"; return; }
    modal = document.createElement("div");
    modal.className = "xft-license-modal";
    modal.innerHTML = `
      <div class="xft-license-box">
        <div class="xft-license-title">Enter License Key</div>
        <input type="text" class="xft-license-input" placeholder="XFT_XXXX-XXXX-XXXX" spellcheck="false" autocomplete="off" />
        <div class="xft-license-msg"></div>
        <div class="xft-license-actions">
          <button type="button" class="xft-license-ok">Activate</button>
          <button type="button" class="xft-license-cancel">Cancel</button>
        </div>
      </div>
    `;
    el.appendChild(modal);

    const input = modal.querySelector(".xft-license-input");
    const msgEl = modal.querySelector(".xft-license-msg");
    const okBtn = modal.querySelector(".xft-license-ok");
    const cancelBtn = modal.querySelector(".xft-license-cancel");

    cancelBtn.addEventListener("click", () => { modal.style.display = "none"; });

    okBtn.addEventListener("click", () => {
      const key = input.value.trim();
      if (!key) { msgEl.textContent = "Please enter your key"; return; }
      msgEl.textContent = "Activating…";
      okBtn.disabled = true;
      chrome.runtime.sendMessage({ type: "ACTIVATE_LICENSE", key }, (res) => {
        okBtn.disabled = false;
        if (chrome.runtime.lastError) {
          msgEl.textContent = "Connection error — try again";
          return;
        }
        if (res && res.ok) {
          isLicensed = true;
          msgEl.textContent = "";
          modal.style.display = "none";
          setStatus("License activated — unlimited reads!");
          const upg = el.querySelector(".xft-upgrade");
          if (upg) upg.style.display = "none";
          updateLicenseBadge();
        } else {
          msgEl.textContent = (res && res.error) || "Invalid key";
        }
      });
    });
  }

  function updateLicenseBadge() {
    const el = document.getElementById(PANEL_ID);
    if (!el) return;
    const badge = el.querySelector(".xft-license-badge");
    if (!badge) return;
    if (isLicensed) {
      badge.textContent = "PRO";
      badge.classList.add("xft-pro");
      badge.title = "Licensed — unlimited reads";
    } else {
      badge.textContent = "FREE";
      badge.classList.remove("xft-pro");
      badge.title = "Free tier — click to enter license key";
    }
  }

  // ── Panel ──

  function buildPanel() {
    if (document.getElementById(PANEL_ID)) return;
    const root = document.createElement("div");
    root.id = PANEL_ID;
    const logoUrl = chrome.runtime.getURL("icons/logo-panel.png");
    root.innerHTML = `
      <button type="button" class="xft-toggle" title="Show / Hide panel">
        <img src="${logoUrl}" width="24" height="24" alt="" style="border-radius:6px" />
      </button>
      <div class="xft-inner">
        <button type="button" class="xft-hide" title="Hide panel">&times;</button>
        <span class="xft-license-badge" title="Free tier">FREE</span>
        <div class="xft-logo-wrap">
          <img class="xft-logo" src="${logoUrl}" alt="" />
        </div>
        <div class="xft-btns">
          <button type="button" data-act="play" title="Play">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button type="button" data-act="pause" title="Pause">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </button>
          <button type="button" data-act="stop" title="Stop">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
          </button>
          <button type="button" data-act="skip" title="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
        <div class="xft-status">Ready</div>
        <a class="xft-site" href="https://xflowteller.com" target="_blank" rel="noopener">xflowteller.com</a>
      </div>
    `;
    document.body.appendChild(root);

    root.querySelector(".xft-toggle").addEventListener("click", () => {
      root.classList.remove("xft-collapsed");
    });
    root.querySelector(".xft-hide").addEventListener("click", () => {
      root.classList.add("xft-collapsed");
    });
    root.querySelector(".xft-license-badge").addEventListener("click", () => {
      showLicenseModal();
    });

    chrome.runtime.sendMessage({ type: "CHECK_USAGE" }, (res) => {
      if (chrome.runtime.lastError || !res) return;
      isLicensed = res.licensed;
      dailyRemaining = res.remaining;
      updateLicenseBadge();
    });
    chrome.runtime.sendMessage({ type: "VALIDATE_LICENSE" }, () => {});

    const playBtn = root.querySelector('[data-act="play"]');
    const updatePlayBtn = () => {
      if (playing && !paused) {
        playBtn.classList.add("xft-disabled");
      } else {
        playBtn.classList.remove("xft-disabled");
      }
    };

    playBtn.addEventListener("click", () => {
      if (playing && !paused) return;
      paused = false;
      playing = true;
      updatePlayBtn();
      playNext();
    });
    root.querySelector('[data-act="pause"]').addEventListener("click", () => {
      paused = true;
      chrome.runtime.sendMessage({ type: "PAUSE" });
      updatePlayBtn();
      setStatus("Paused");
    });
    root.querySelector('[data-act="stop"]').addEventListener("click", () => {
      playing = false;
      paused = false;
      awaitingTts = false;
      if (scrollWaitTimer) {
        clearTimeout(scrollWaitTimer);
        scrollWaitTimer = null;
      }
      clearHighlight();
      chrome.runtime.sendMessage({ type: "STOP" });
      updatePlayBtn();
      setStatus("Stopped");
    });
    root.querySelector('[data-act="skip"]').addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "SKIP_CURRENT" });
    });
  }

  // ── Message listener ──

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TTS_DONE") {
      onTtsDone(msg);
    } else if (msg.type === "TTS_ERROR") {
      onTtsError(msg);
    } else if (msg.type === "TTS_PHASE") {
      const u = String(msg.lang || "en").toUpperCase();
      if (msg.phase === "engine") {
        setStatus("Loading TTS engine… (" + u + ")");
      } else if (msg.phase === "synth") {
        setStatus("Generating speech… (" + u + ")");
      } else if (msg.phase === "play") {
        setStatus("Playing… (" + u + ")");
      }
    }
  });

  // ── MutationObserver for skip buttons ──

  const mo = new MutationObserver(() => { scanInjectButtons(); });
  mo.observe(document.body, { childList: true, subtree: true });

  buildPanel();
  scanInjectButtons();
})();
