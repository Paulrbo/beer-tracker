(() => {
  "use strict";

  /* ---------------- STORAGE ---------------- */
  const LS_ENTRIES = "beerEntries";
  const LS_CUSTOM_BEERS = "customBeers";

  const loadJSON = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  };
  const saveJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  let entries = loadJSON(LS_ENTRIES, []);
  let customBeers = loadJSON(LS_CUSTOM_BEERS, []);

  const allBeers = () => [...customBeers, ...BEERS_DB];

  const saveEntries = () => saveJSON(LS_ENTRIES, entries);
  const saveCustomBeers = () => saveJSON(LS_CUSTOM_BEERS, customBeers);

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------------- NAVIGATION (TABS) ---------------- */
  const screens = {
    home: document.getElementById("screen-home"),
    history: document.getElementById("screen-history"),
    stats: document.getElementById("screen-stats"),
  };
  const pageTitle = document.getElementById("page-title");
  const titles = { home: "Le Compteur", history: "Historique", stats: "Stats" };

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => switchScreen(tab.dataset.screen));
  });

  function switchScreen(name) {
    Object.entries(screens).forEach(([k, el]) => el.classList.toggle("active", k === name));
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.screen === name));
    pageTitle.textContent = titles[name];
    if (name === "history") renderHistory();
    if (name === "stats") renderStats();
    if (name === "home") renderHome();
  }

  /* ---------------- HOME ---------------- */
  function renderHome() {
    const today = new Date();
    const todayCount = entries.filter(e => isSameDay(new Date(e.ts), today)).length;
    document.getElementById("today-strip").innerHTML =
      todayCount > 0
        ? `Aujourd'hui : <strong>${todayCount} bière${todayCount > 1 ? "s" : ""}</strong>`
        : `Aucune bière aujourd'hui... pour l'instant`;

    const last = getLastEntry();
    const sisterBtn = document.getElementById("btn-sister");
    const sisterLabel = document.getElementById("sister-label");
    const lastDrinkEl = document.getElementById("last-drink");

    if (last) {
      sisterBtn.disabled = false;
      sisterLabel.textContent = `La p'tite sœur (${last.brand})`;
      lastDrinkEl.innerHTML = `Dernière : <strong>${escapeHTML(last.brand)}</strong> · ${formatVolume(last.volume)} · ${formatRelative(new Date(last.ts))}`;
    } else {
      sisterBtn.disabled = true;
      sisterLabel.textContent = "La p'tite sœur";
      lastDrinkEl.textContent = "";
    }
  }

  function getLastEntry() {
    if (entries.length === 0) return null;
    return [...entries].sort((a, b) => b.ts - a.ts)[0];
  }

  document.getElementById("btn-sister").addEventListener("click", () => {
    const last = getLastEntry();
    if (!last) return;
    addEntry({ brand: last.brand, style: last.style, abv: last.abv, volume: last.volume });
    showToast(`Ajoutée : ${last.brand} · ${formatVolume(last.volume)}`);
  });

  /* ---------------- ADD FLOW (SHEET) ---------------- */
  const backdrop = document.getElementById("sheet-backdrop");
  const steps = {
    brand: document.getElementById("step-brand"),
    newbrand: document.getElementById("step-newbrand"),
    qty: document.getElementById("step-qty"),
  };

  let draft = { brand: null, style: null, abv: null, volume: null };

  function openSheet() {
    draft = { brand: null, style: null, abv: null, volume: null };
    goToStep("brand");
    document.getElementById("brand-search").value = "";
    renderBrandList("");
    backdrop.classList.add("open");
    setTimeout(() => document.getElementById("brand-search").focus({ preventScroll: true }), 250);
  }
  function closeSheet() {
    backdrop.classList.remove("open");
  }
  function goToStep(name) {
    Object.entries(steps).forEach(([k, el]) => el.classList.toggle("active", k === name));
  }

  document.getElementById("btn-add").addEventListener("click", openSheet);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeSheet(); });

  // --- brand step ---
  const brandSearch = document.getElementById("brand-search");
  const brandList = document.getElementById("brand-list");

  brandSearch.addEventListener("input", () => renderBrandList(brandSearch.value));

  function renderBrandList(filter) {
    const f = filter.trim().toLowerCase();
    const results = allBeers().filter(b => b.name.toLowerCase().includes(f)).slice(0, 40);
    if (results.length === 0) {
      brandList.innerHTML = `<div class="brand-list-empty">Aucune marque trouvée</div>`;
      return;
    }
    brandList.innerHTML = results.map(b => `
      <button class="brand-item" data-name="${escapeAttr(b.name)}">
        <span class="brand-item-name">${escapeHTML(b.name)}</span>
        <span class="brand-item-meta">${b.style ? escapeHTML(b.style) : ""}${b.abv ? " · " + b.abv + "%" : ""}</span>
      </button>
    `).join("");
    brandList.querySelectorAll(".brand-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const beer = allBeers().find(b => b.name === btn.dataset.name);
        selectBrand(beer);
      });
    });
  }

  function selectBrand(beer) {
    draft.brand = beer.name;
    draft.style = beer.style || null;
    draft.abv = beer.abv ?? null;
    document.getElementById("qty-subtitle").textContent = beer.name;
    resetQtyStep();
    goToStep("qty");
  }

  document.getElementById("btn-new-brand").addEventListener("click", () => {
    document.getElementById("new-brand-name").value = brandSearch.value.trim();
    document.getElementById("new-brand-style").value = "";
    document.getElementById("new-brand-abv").value = "";
    goToStep("newbrand");
  });
  document.getElementById("btn-newbrand-back").addEventListener("click", () => goToStep("brand"));
  document.getElementById("btn-newbrand-next").addEventListener("click", () => {
    const name = document.getElementById("new-brand-name").value.trim();
    if (!name) { document.getElementById("new-brand-name").focus(); return; }
    const style = document.getElementById("new-brand-style").value.trim() || null;
    const abvRaw = document.getElementById("new-brand-abv").value;
    const abv = abvRaw ? parseFloat(abvRaw) : null;

    if (!customBeers.some(b => b.name.toLowerCase() === name.toLowerCase()) &&
        !BEERS_DB.some(b => b.name.toLowerCase() === name.toLowerCase())) {
      customBeers.unshift({ name, style, abv });
      saveCustomBeers();
    }
    selectBrand({ name, style, abv });
  });

  // --- qty step ---
  const qtyOptions = document.querySelectorAll(".qty-option");
  const qtyCustomWrap = document.getElementById("qty-custom-wrap");
  const qtyCustomInput = document.getElementById("qty-custom-input");
  const btnQtyConfirm = document.getElementById("btn-qty-confirm");

  function resetQtyStep() {
    qtyOptions.forEach(b => b.classList.remove("selected"));
    qtyCustomWrap.classList.remove("show");
    qtyCustomInput.value = "";
    btnQtyConfirm.disabled = true;
    draft.volume = null;
  }

  qtyOptions.forEach(btn => {
    btn.addEventListener("click", () => {
      qtyOptions.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      if (btn.dataset.qty === "custom") {
        qtyCustomWrap.classList.add("show");
        draft.volume = null;
        btnQtyConfirm.disabled = true;
        qtyCustomInput.focus();
      } else {
        qtyCustomWrap.classList.remove("show");
        draft.volume = parseInt(btn.dataset.qty, 10);
        btnQtyConfirm.disabled = false;
      }
    });
  });
  qtyCustomInput.addEventListener("input", () => {
    const v = parseInt(qtyCustomInput.value, 10);
    if (v > 0 && v <= 500) {
      draft.volume = v;
      btnQtyConfirm.disabled = false;
    } else {
      draft.volume = null;
      btnQtyConfirm.disabled = true;
    }
  });

  document.getElementById("btn-qty-back").addEventListener("click", () => goToStep("brand"));
  btnQtyConfirm.addEventListener("click", () => {
    if (!draft.volume) return;
    addEntry({ brand: draft.brand, style: draft.style, abv: draft.abv, volume: draft.volume });
    showToast(`Ajoutée : ${draft.brand} · ${formatVolume(draft.volume)}`);
    closeSheet();
  });

  /* ---------------- ENTRIES ---------------- */
  function addEntry({ brand, style, abv, volume }) {
    entries.unshift({ id: uid(), brand, style, abv, volume, ts: Date.now() });
    saveEntries();
    renderHome();
  }

  function deleteEntry(id) {
    entries = entries.filter(e => e.id !== id);
    saveEntries();
    renderHistory();
    renderHome();
  }

  function updateEntry(id, patch) {
    entries = entries.map(e => e.id === id ? { ...e, ...patch } : e);
    saveEntries();
    renderHistory();
    renderHome();
  }

  /* ---------------- HISTORY ---------------- */
  let editingId = null;

  function renderHistory() {
    const container = document.getElementById("history-list");
    if (entries.length === 0) {
      container.innerHTML = `<div class="empty-state"><span class="empty-state-emoji">🍺</span>Rien enregistré pour l'instant.<br>Direction l'accueil pour la première !</div>`;
      return;
    }
    const sorted = [...entries].sort((a, b) => b.ts - a.ts);
    const groups = [];
    let currentKey = null, currentGroup = null;
    sorted.forEach(e => {
      const d = new Date(e.ts);
      const key = d.toDateString();
      if (key !== currentKey) {
        currentKey = key;
        currentGroup = { label: formatDayLabel(d), items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(e);
    });

    container.innerHTML = groups.map(g => `
      <div class="history-day-label">${g.label}</div>
      ${g.items.map(e => entryRowHTML(e)).join("")}
    `).join("");

    // wire actions
    container.querySelectorAll("[data-edit]").forEach(btn =>
      btn.addEventListener("click", () => { editingId = btn.dataset.edit; renderHistory(); }));
    container.querySelectorAll("[data-delete]").forEach(btn =>
      btn.addEventListener("click", () => {
        if (confirm("Supprimer cette bière de l'historique ?")) deleteEntry(btn.dataset.delete);
      }));
    container.querySelectorAll("[data-cancel-edit]").forEach(btn =>
      btn.addEventListener("click", () => { editingId = null; renderHistory(); }));
    container.querySelectorAll("[data-qty-edit]").forEach(btn =>
      btn.addEventListener("click", () => {
        container.querySelectorAll(`.edit-qty-grid button`).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        btn.closest(".edit-row").dataset.volume = btn.dataset.qtyEdit;
      }));
    container.querySelectorAll("[data-save-edit]").forEach(btn =>
      btn.addEventListener("click", () => {
        const row = btn.closest(".edit-row");
        const vol = parseInt(row.dataset.volume, 10);
        if (vol > 0) {
          updateEntry(btn.dataset.saveEdit, { volume: vol });
          editingId = null;
        }
      }));
  }

  function entryRowHTML(e) {
    if (editingId === e.id) {
      const standard = [25, 33, 50];
      const isStandard = standard.includes(e.volume);
      return `
        <div class="edit-row" data-volume="${e.volume}">
          <div class="edit-row-title">${escapeHTML(e.brand)}</div>
          <div class="edit-qty-grid">
            ${standard.map(v => `<button data-qty-edit="${v}" class="${e.volume === v ? "selected" : ""}">${v} cl</button>`).join("")}
            <button data-qty-edit="${e.volume}" class="${!isStandard ? "selected" : ""}">${!isStandard ? e.volume + " cl" : "Autre"}</button>
          </div>
          <div class="edit-row-actions">
            <button class="btn-cancel" data-cancel-edit="${e.id}">Annuler</button>
            <button class="btn-delete" data-delete="${e.id}">Supprimer</button>
            <button class="btn-save" data-save-edit="${e.id}">Enregistrer</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="history-row">
        <span class="history-row-icon">🍺</span>
        <div class="history-row-main">
          <div class="history-row-name">${escapeHTML(e.brand)}</div>
          <div class="history-row-sub">${formatVolume(e.volume)}${e.abv ? " · " + e.abv + "%" : ""}</div>
        </div>
        <div class="history-row-time">${formatTime(new Date(e.ts))}</div>
        <div class="history-row-actions">
          <button class="icon-button" data-edit="${e.id}">✏️</button>
          <button class="icon-button" data-delete="${e.id}">🗑️</button>
        </div>
      </div>
    `;
  }

  /* ---------------- STATS ---------------- */
  function renderStats() {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const weekEntries = entries.filter(e => e.ts >= startOfWeek.getTime());
    const monthEntries = entries.filter(e => e.ts >= startOfMonth.getTime());
    const yearEntries = entries.filter(e => e.ts >= startOfYear.getTime());

    document.getElementById("stats-cards").innerHTML = [
      statCard(weekEntries.length, "cette\u00a0semaine"),
      statCard(monthEntries.length, "ce\u00a0mois-ci"),
      statCard(yearEntries.length, "cette\u00a0ann\u00e9e"),
    ].join("");

    renderWeeklyTally();
    renderTopBrands(yearEntries.length ? yearEntries : entries);
  }

  function statCard(count, label) {
    return `<div class="stat-card"><div class="num">${count}</div><div class="unit">bière${count !== 1 ? "s" : ""}</div><div class="label">${label}</div></div>`;
  }

  function renderWeeklyTally() {
    const weeks = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const weekStart = getStartOfWeek(new Date(now.getTime() - i * 7 * 86400000));
      const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);
      const count = entries.filter(e => e.ts >= weekStart.getTime() && e.ts < weekEnd.getTime()).length;
      weeks.push({ count, label: `${weekStart.getDate()}/${weekStart.getMonth() + 1}` });
    }
    const max = Math.max(1, ...weeks.map(w => w.count));
    document.getElementById("chart-weeks").innerHTML = `
      <div class="tally-week">
        ${weeks.map(w => `
          <div class="tally-col">
            <div class="tally-marks">${tallySVG(w.count, max)}</div>
            <div class="tally-count">${w.count}</div>
            <div class="tally-wk">${w.label}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // Draws chalkboard-style tally marks (bundles of 5, 4 verticals + 1 diagonal strike)
  function tallySVG(count, max) {
    if (count === 0) {
      return `<svg width="20" height="4"><line x1="2" y1="2" x2="18" y2="2" stroke="#5c4a38" stroke-width="2" stroke-linecap="round" opacity="0.4"/></svg>`;
    }
    const bundles = Math.floor(count / 5);
    const remainder = count % 5;
    const groupW = 22, strokeH = 82, gap = 6;
    const totalGroups = bundles + (remainder > 0 ? 1 : 0);
    const w = totalGroups * groupW + Math.max(0, totalGroups - 1) * gap;
    let x = 2;
    let marks = "";
    for (let b = 0; b < bundles; b++) {
      marks += tallyGroup(x, strokeH, 5);
      x += groupW + gap;
    }
    if (remainder > 0) {
      marks += tallyGroup(x, strokeH, remainder);
      x += groupW + gap;
    }
    return `<svg width="${w}" height="${strokeH + 4}" viewBox="0 0 ${w} ${strokeH + 4}">${marks}</svg>`;
  }

  function tallyGroup(x0, h, n) {
    const color = "#E8B84B";
    let s = "";
    const spacing = 5;
    for (let i = 0; i < Math.min(n, 4); i++) {
      const x = x0 + i * spacing;
      s += `<line x1="${x}" y1="${h + 4}" x2="${x}" y2="4" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    if (n === 5) {
      s += `<line x1="${x0 - 2}" y1="${h}" x2="${x0 + 3 * spacing + 2}" y2="4" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    return s;
  }

  function renderTopBrands(sourceEntries) {
    const counts = {};
    sourceEntries.forEach(e => { counts[e.brand] = (counts[e.brand] || 0) + 1; });
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const el = document.getElementById("top-brands");
    if (ranked.length === 0) {
      el.innerHTML = `<div class="brand-list-empty" style="color:var(--text-muted)">Pas encore de données</div>`;
      return;
    }
    el.innerHTML = ranked.map(([name, count], i) => `
      <div class="brand-rank-row">
        <span class="brand-rank-pos">${i + 1}</span>
        <span class="brand-rank-name">${escapeHTML(name)}</span>
        <span class="brand-rank-count">${count}×</span>
      </div>
    `).join("");
  }

  /* ---------------- HELPERS ---------------- */
  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function getStartOfWeek(d) {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = (date.getDay() + 6) % 7; // Monday = 0
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  function formatVolume(cl) { return cl >= 100 ? (cl / 100).toFixed(cl % 100 === 0 ? 0 : 1) + " L" : cl + " cl"; }
  function formatTime(d) { return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
  function formatDayLabel(d) {
    const today = new Date(); const yesterday = new Date(today.getTime() - 86400000);
    if (isSameDay(d, today)) return "Aujourd'hui";
    if (isSameDay(d, yesterday)) return "Hier";
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  }
  function formatRelative(d) {
    const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
    if (diffMin < 1) return "à l'instant";
    if (diffMin < 60) return `il y a ${diffMin} min`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `il y a ${diffH} h`;
    return formatDayLabel(d).toLowerCase();
  }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])); }
  function escapeAttr(s) { return escapeHTML(s); }

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---------------- INIT ---------------- */
  renderHome();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
  }
})();
