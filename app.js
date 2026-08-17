(() => {
  "use strict";

  // iOS Safari suppresses :active feedback app-wide unless a touchstart
  // listener exists somewhere on the page. This unlocks it globally.
  document.addEventListener("touchstart", () => {}, { passive: true });

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
  let customBeers = loadJSON(LS_CUSTOM_BEERS, []); // flat [{name, style, abv}]

  // Normalize BEERS_DB ({brand, variants:[{label, style, abv}]}) into the
  // {shortName, fullName, style, abv} shape used throughout the UI.
  const BEERS_NORM = BEERS_DB.map(g => ({
    brand: g.brand,
    variants: g.variants.map(v => ({
      shortName: v.label || g.brand,
      fullName: v.label ? `${g.brand} ${v.label}` : g.brand,
      style: v.style,
      abv: v.abv,
    })),
  }));

  const saveEntries = () => saveJSON(LS_ENTRIES, entries);
  const saveCustomBeers = () => saveJSON(LS_CUSTOM_BEERS, customBeers);

  // Brands from BEERS_DB + each custom addition treated as its own single-variant brand.
  function getAllBrands() {
    const custom = customBeers.map(b => ({
      brand: b.name,
      variants: [{ shortName: b.name, fullName: b.name, style: b.style, abv: b.abv }],
    }));
    return [...BEERS_NORM, ...custom]
      .slice()
      .sort((a, b) => a.brand.localeCompare(b.brand, "fr", { sensitivity: "base" }));
  }

  function findVariantByFullName(fullName) {
    for (const b of getAllBrands()) {
      const v = b.variants.find(v => v.fullName === fullName);
      if (v) return { brand: b.brand, ...v };
    }
    return null;
  }

  function getTopBeers(limit) {
    const counts = {};
    entries.forEach(e => { counts[e.brand] = (counts[e.brand] || 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([fullName, count]) => ({ ...findVariantByFullName(fullName), count }))
      .filter(x => x.fullName);
  }

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------------- NAVIGATION (TABS) ---------------- */
  const screens = {
    home: document.getElementById("screen-home"),
    history: document.getElementById("screen-history"),
    stats: document.getElementById("screen-stats"),
    achievements: document.getElementById("screen-achievements"),
  };
  const pageTitle = document.getElementById("page-title");
  const titles = { home: "Le Compteur", history: "Historique", stats: "Stats", achievements: "Succès" };

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
    if (name === "achievements") renderAchievements();
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
  });

  /* ---------------- ADD FLOW (SHEET) ---------------- */
  const backdrop = document.getElementById("sheet-backdrop");
  const steps = {
    brand: document.getElementById("step-brand"),
    variant: document.getElementById("step-variant"),
    newbrand: document.getElementById("step-newbrand"),
    qty: document.getElementById("step-qty"),
  };

  let draft = { brand: null, style: null, abv: null, volume: null };
  let currentBrandGroup = null; // the brand object currently open in the variant step

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

  // Real button-press feel: press down immediately, spring back on release.
  const capButton = document.getElementById("btn-add");
  const PRESS_MIN_MS = 110;
  let pressStartedAt = 0;
  const pressCap = () => {
    pressStartedAt = performance.now();
    capButton.classList.add("pressed");
  };
  const releaseCap = () => {
    const elapsed = performance.now() - pressStartedAt;
    setTimeout(() => capButton.classList.remove("pressed"), Math.max(0, PRESS_MIN_MS - elapsed));
  };
  capButton.addEventListener("pointerdown", pressCap);
  ["pointerup", "pointerleave", "pointercancel"].forEach(evt => capButton.addEventListener(evt, releaseCap));

  // --- brand step ---
  const brandSearch = document.getElementById("brand-search");
  const brandList = document.getElementById("brand-list");

  brandSearch.addEventListener("input", () => renderBrandList(brandSearch.value));

  function variantRowHTML(v, brandLabel) {
    const metaBits = [v.style, v.abv ? v.abv + "%" : null].filter(Boolean).join(" · ");
    const showBrand = brandLabel && brandLabel !== v.shortName;
    return `
      <button class="brand-item" data-fullname="${escapeAttr(v.fullName)}">
        <span class="brand-item-text">
          <span class="brand-item-name">${escapeHTML(showBrand ? brandLabel + " — " + v.shortName : v.shortName)}</span>
          <span class="brand-item-meta">${metaBits}</span>
        </span>
      </button>
    `;
  }

  function renderBrandList(filter) {
    const f = filter.trim().toLowerCase();

    // --- SEARCH MODE: flat list of matching variants across all brands ---
    if (f) {
      const matches = [];
      getAllBrands().forEach(b => {
        b.variants.forEach(v => {
          if (b.brand.toLowerCase().includes(f) || v.shortName.toLowerCase().includes(f) || v.fullName.toLowerCase().includes(f)) {
            matches.push({ ...v, brand: b.brand, multiVariant: b.variants.length > 1 });
          }
        });
      });
      matches.sort((a, b) => a.fullName.localeCompare(b.fullName, "fr", { sensitivity: "base" }));
      if (matches.length === 0) {
        brandList.innerHTML = `<div class="brand-list-empty">Aucune bière trouvée</div>`;
        return;
      }
      brandList.innerHTML = matches.slice(0, 50).map(v => variantRowHTML(v, v.multiVariant ? v.brand : null)).join("");
      wireVariantRows(brandList, (v) => selectVariant(v));
      return;
    }

    // --- BROWSE MODE: favorites pinned on top, then brands A-Z ---
    const top = getTopBeers(3);
    const brands = getAllBrands();
    let html = "";

    if (top.length > 0) {
      html += `<div class="brand-list-section-label">★ Tes habituelles</div>`;
      html += top.map(v => variantRowHTML(v, v.brand)).join("");
    }

    html += `<div class="brand-list-section-label">Toutes les marques</div>`;
    html += brands.map(b => {
      const single = b.variants.length === 1;
      const meta = single ? [b.variants[0].style, b.variants[0].abv ? b.variants[0].abv + "%" : null].filter(Boolean).join(" · ") : `${b.variants.length} déclinaisons`;
      return `
        <button class="brand-item" data-brand="${escapeAttr(b.brand)}">
          <span class="brand-item-text">
            <span class="brand-item-name">${escapeHTML(b.brand)}</span>
            <span class="brand-item-meta">${meta}</span>
          </span>
          ${single ? "" : `<span class="brand-item-chevron">›</span>`}
        </button>
      `;
    }).join("");

    brandList.innerHTML = html;

    // favorites (data-fullname) select immediately
    wireVariantRows(brandList, (v) => selectVariant(v));

    // brand rows (data-brand) either select directly (single variant) or open sub-menu
    brandList.querySelectorAll("[data-brand]").forEach(btn => {
      btn.addEventListener("click", () => {
        const group = getAllBrands().find(b => b.brand === btn.dataset.brand);
        if (!group) return;
        if (group.variants.length === 1) {
          selectVariant({ ...group.variants[0], brand: group.brand });
        } else {
          openVariantStep(group);
        }
      });
    });
  }

  function wireVariantRows(container, onSelect) {
    container.querySelectorAll("[data-fullname]").forEach(btn => {
      btn.addEventListener("click", () => {
        const v = findVariantByFullName(btn.dataset.fullname);
        if (v) onSelect(v);
      });
    });
  }

  function openVariantStep(group) {
    currentBrandGroup = group;
    document.getElementById("variant-title").textContent = group.brand;
    document.getElementById("variant-list").innerHTML = group.variants
      .slice()
      .sort((a, b) => a.shortName.localeCompare(b.shortName, "fr", { sensitivity: "base" }))
      .map(v => variantRowHTML(v, null))
      .join("");
    wireVariantRows(document.getElementById("variant-list"), (v) => selectVariant({ ...v, brand: group.brand }));
    goToStep("variant");
  }

  document.getElementById("btn-variant-back").addEventListener("click", () => goToStep("brand"));

  function selectVariant(v) {
    draft.brand = v.fullName;
    draft.style = v.style || null;
    draft.abv = v.abv ?? null;
    document.getElementById("qty-subtitle").textContent = v.fullName;
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
        !BEERS_NORM.some(b => b.brand.toLowerCase() === name.toLowerCase())) {
      customBeers.unshift({ name, style, abv });
      saveCustomBeers();
    }
    selectVariant({ brand: name, label: null, style, abv, fullName: name });
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
    closeSheet();
  });

  /* ---------------- ENTRIES ---------------- */
  function addEntry({ brand, style, abv, volume }) {
    entries.unshift({ id: uid(), brand, style, abv, volume, ts: Date.now() });
    saveEntries();
    renderHome();
    showAddConfirm(brand, volume, () => checkNewAchievements());
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

  /* ---------------- ACHIEVEMENTS ---------------- */
  const NORTH_BRANDS = ["Tandem", "Jenlain", "3 Monts", "Ch'ti", "Anosteké", "La Choulette", "Thiriez", "Pelforth"];

  function computeAchievementStats() {
    const totalCount = entries.length;
    const totalVolumeL = entries.reduce((s, e) => s + e.volume, 0) / 100;

    const dayMap = {};
    entries.forEach(e => {
      const key = new Date(e.ts).toDateString();
      dayMap[key] = (dayMap[key] || 0) + 1;
    });
    const days = Object.keys(dayMap).map(s => new Date(s)).sort((a, b) => a - b);
    let longestStreak = 0, run = 0, prev = null;
    days.forEach(d => {
      run = (prev && (d - prev) / 86400000 === 1) ? run + 1 : 1;
      longestStreak = Math.max(longestStreak, run);
      prev = d;
    });
    const maxInOneDay = Math.max(0, ...Object.values(dayMap));

    const brandRoots = new Set();
    const tandemVariants = new Set();
    let tandemCount = 0;
    const northTried = new Set();
    let hasApero = false, hasNight = false;

    entries.forEach(e => {
      const leaf = findVariantByFullName(e.brand);
      const root = leaf ? leaf.brand : e.brand;
      brandRoots.add(root);
      if (root === "Tandem") { tandemCount++; tandemVariants.add(e.brand); }
      if (NORTH_BRANDS.includes(root)) northTried.add(root);
      const h = new Date(e.ts).getHours();
      if (h < 12) hasApero = true;
      if (h < 6) hasNight = true;
    });

    const tandemGroup = BEERS_DB.find(b => b.brand === "Tandem");
    const tandemTotalVariants = tandemGroup ? tandemGroup.variants.length : 9;

    return {
      totalCount, totalVolumeL, longestStreak, maxInOneDay,
      distinctBrands: brandRoots.size,
      tandemVariantsTried: tandemVariants.size, tandemTotalVariants, tandemCount,
      northTried: northTried.size,
      hasApero, hasNight,
    };
  }

  function buildAchievementDefs(stats) {
    const milestone = (id, emoji, target, current, unit, colorA, colorB, category, description, exactLabel) => ({
      id, emoji, target, current,
      unlocked: current >= target,
      value: exactLabel || String(target),
      label: unit, colorA, colorB, category, description,
    });

    return [
      // --- Total bières ---
      milestone("t10", "🍺", 10, stats.totalCount, "bières", "#E8B84B", "#B5651D", "Total bières",
        "Tu commences à connaître le chemin du frigo."),
      milestone("t50", "🙌", 50, stats.totalCount, "bières", "#EAC15B", "#AD6218", "Total bières",
        "Le pote qui a toujours une bière sous la main."),
      milestone("t100", "🏅", 100, stats.totalCount, "bières", "#F0C868", "#A55D14", "Total bières",
        "Centurion. Le Nord te salue."),
      milestone("t200", "🏆", 200, stats.totalCount, "bières", "#F5CE70", "#9C5710", "Total bières",
        "T'as ton tabouret attitré au bar, maintenant."),
      milestone("t500", "💎", 500, stats.totalCount, "bières", "#FBDD8E", "#8F4C0B", "Total bières",
        "Le barman connaît ta commande avant que tu l'ouvres."),
      milestone("t1000", "🐐", 1000, stats.totalCount, "bières", "#FFE9A8", "#7A3E06", "Total bières",
        "Roi des pochetrons. Longue vie au roi. 👑"),

      // --- Volume total ---
      milestone("v10", "💧", 10, Math.floor(stats.totalVolumeL), "litres", "#6FD3E8", "#1E6E7D", "Volume total",
        "Un petit fût, à toi tout seul."),
      milestone("v50", "🌊", 50, Math.floor(stats.totalVolumeL), "litres", "#5FC3DC", "#1A6070", "Volume total",
        "T'as bu ton poids en bière. Ou presque."),
      milestone("v100", "🛁", 100, Math.floor(stats.totalVolumeL), "litres", "#50B3D2", "#155263", "Volume total",
        "Une baignoire entière. Respect."),
      milestone("v500", "🛢️", 500, Math.floor(stats.totalVolumeL), "litres", "#41A3C8", "#0F4556", "Volume total",
        "Tu commences à peser sur le cours du houblon."),
      milestone("v1000", "🚚", 1000, Math.floor(stats.totalVolumeL), "litres", "#3293BE", "#0A3849", "Volume total",
        "Un camion-citerne rien que pour toi."),

      // --- Séries ---
      milestone("s3", "🔥", 3, stats.longestStreak, "jours d'affilée", "#FF9142", "#C1552B", "Séries",
        "3 jours de suite. Ton foie commence à te connaître par cœur."),
      milestone("s7", "⭐", 7, stats.longestStreak, "jours d'affilée", "#FF7A4D", "#B8451F", "Séries",
        "Une semaine complète. Discipline ou dépendance, on ne juge pas."),
      milestone("s30", "🌋", 30, stats.longestStreak, "jours d'affilée", "#FF6357", "#A83616", "Séries",
        "Un mois entier. T'es plus un buveur, t'es un mode de vie."),

      // --- Record du jour ---
      milestone("r5", "😅", 5, stats.maxInOneDay, "bières / jour", "#FF8FA3", "#B5294A", "Record du jour",
        "Grosse soirée, hein ?"),
      milestone("r10", "🤯", 10, stats.maxInOneDay, "bières / jour", "#FF7796", "#9E1F3F", "Record du jour",
        "Alerte : capacité maximale du foie atteinte."),

      // --- Variété ---
      milestone("m10", "🗺️", 10, stats.distinctBrands, "marques", "#C9A4F0", "#6B3FA0", "Variété",
        "Tu collectionnes les étiquettes plus que les timbres."),
      milestone("m25", "🌍", 25, stats.distinctBrands, "marques", "#BC91EC", "#5E3391", "Variété",
        "Sommelier de la bière, ça existe. Et c'est toi."),

      // --- Spécial Nord ---
      milestone("n_tandem_full", "🎖️", stats.tandemTotalVariants, stats.tandemVariantsTried, "Tandem au complet",
        "#FFD873", "#C9971F", "Spécial Nord",
        "Toute la gamme Tandem à ton actif. Wambrechies te doit une statue.",
        `${stats.tandemVariantsTried}/${stats.tandemTotalVariants}`),
      milestone("n_tandem20", "🏭", 20, stats.tandemCount, "bières Tandem", "#FCD265", "#C08B1A", "Spécial Nord",
        "T'es limite actionnaire de la brasserie."),
      milestone("n_ambassador", "⚜️", 5, stats.northTried, "brasseries du Nord", "#F5C94E", "#B87F12", "Spécial Nord",
        "Ambassadeur officieux du patrimoine brassicole ch'ti."),

      // --- Insolite ---
      {
        id: "x_apero", emoji: "☀️", target: 1, current: stats.hasApero ? 1 : 0,
        unlocked: stats.hasApero, value: null, label: "Bière avant midi",
        colorA: "#FFE066", colorB: "#E0A700", category: "Insolite",
        description: "Bah alors, on se la coule douce aujourd'hui ?",
      },
      {
        id: "x_night", emoji: "🦉", target: 1, current: stats.hasNight ? 1 : 0,
        unlocked: stats.hasNight, value: null, label: "Après minuit",
        colorA: "#7C8CE8", colorB: "#2A3470", category: "Insolite",
        description: "Chouette, une bière de hibou. Rentre bien.",
      },
    ];
  }

  function renderAchievements() {
    const stats = computeAchievementStats();
    const defs = buildAchievementDefs(stats);
    lastAchievementDefs = defs;

    const byCategory = [];
    defs.forEach(d => {
      let group = byCategory.find(g => g.category === d.category);
      if (!group) { group = { category: d.category, items: [] }; byCategory.push(group); }
      group.items.push(d);
    });

    const unlockedCount = defs.filter(d => d.unlocked).length;

    const container = document.getElementById("achievements-list");
    container.innerHTML = `
      <div class="today-strip" style="margin-bottom:22px;">
        <strong>${unlockedCount}</strong> / ${defs.length} débloqués
      </div>
      ${byCategory.map(g => `
        <div class="ach-section-label">${escapeHTML(g.category)}</div>
        <div class="ach-grid">
          ${g.items.map(achCardHTML).join("")}
        </div>
      `).join("")}
    `;

    container.querySelectorAll(".ach-card.unlocked[data-ach-id]").forEach(card => {
      card.addEventListener("click", () => {
        const a = lastAchievementDefs.find(d => d.id === card.dataset.achId);
        if (a) openAchModal(a, false);
      });
    });
  }

  function achCardHTML(a) {
    if (!a.unlocked) {
      return `
        <div class="ach-card locked">
          <span class="ach-lock-badge">🔒</span>
          <span class="ach-lock-mark">?</span>
        </div>
      `;
    }
    return `
      <div class="ach-card unlocked" data-ach-id="${escapeAttr(a.id)}" style="background: linear-gradient(155deg, ${a.colorA}, ${a.colorB});">
        <span class="ach-check">✓</span>
        <span class="ach-emoji">${a.emoji}</span>
        ${a.value ? `<span class="ach-value">${escapeHTML(a.value)}</span>` : ""}
        <span class="ach-label">${escapeHTML(a.label)}</span>
      </div>
    `;
  }

  /* ---------------- ADD CONFIRMATION (centered popup) ---------------- */
  const addConfirmBackdrop = document.getElementById("add-confirm-backdrop");
  let addConfirmTimer = null;

  function showAddConfirm(name, volume, onDone) {
    document.getElementById("add-confirm-name").textContent = name;
    document.getElementById("add-confirm-qty").textContent = formatVolume(volume);

    // Retrigger the checkmark pop animation every time (it only plays once per DOM element otherwise).
    const checkEl = document.querySelector("#add-confirm-backdrop .add-confirm-check");
    checkEl.classList.remove("pop");
    void checkEl.offsetWidth; // force reflow
    checkEl.classList.add("pop");

    addConfirmBackdrop.classList.add("open");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(addConfirmTimer);
      addConfirmBackdrop.classList.remove("open");
      addConfirmBackdrop.removeEventListener("click", finish);
      // small delay so the close transition isn't cut off by an achievement modal opening
      setTimeout(() => onDone && onDone(), 260);
    };
    addConfirmBackdrop.addEventListener("click", finish);
    addConfirmTimer = setTimeout(finish, 1600);
  }

  /* ---------------- ACHIEVEMENT MODAL (celebration + detail view) ---------------- */
  const achBackdrop = document.getElementById("ach-modal-backdrop");
  const achCard = document.getElementById("ach-modal-card");
  const achContent = document.getElementById("ach-modal-content");
  let achQueue = [];

  function openAchModal(a, celebratory) {
    achCard.style.background = `linear-gradient(155deg, ${a.colorA}, ${a.colorB})`;
    achContent.innerHTML = `
      ${celebratory ? `<div class="ach-modal-eyebrow">🎉 Succès débloqué</div>` : ""}
      <div class="ach-modal-emoji">${a.emoji}</div>
      ${a.value ? `<div class="ach-modal-value">${escapeHTML(a.value)}</div>` : ""}
      <div class="ach-modal-label">${escapeHTML(a.label)}</div>
      <div class="ach-modal-desc">${escapeHTML(a.description)}</div>
    `;
    achBackdrop.classList.add("open");
  }
  function closeAchModal() {
    achBackdrop.classList.remove("open");
    if (achQueue.length > 0) {
      setTimeout(() => openAchModal(achQueue.shift(), true), 320);
    }
  }
  document.getElementById("ach-modal-close").addEventListener("click", closeAchModal);
  achBackdrop.addEventListener("click", (e) => { if (e.target === achBackdrop) closeAchModal(); });

  const LS_SEEN_ACH = "seenAchievements";
  let lastAchievementDefs = [];

  // First time this feature runs, baseline whatever's already unlocked as "seen"
  // so existing progress doesn't trigger a wall of celebration popups retroactively.
  if (loadJSON(LS_SEEN_ACH, null) === null) {
    const baselineDefs = buildAchievementDefs(computeAchievementStats());
    saveJSON(LS_SEEN_ACH, baselineDefs.filter(d => d.unlocked).map(d => d.id));
  }

  // Compares freshly-unlocked achievements against what's already been celebrated,
  // and queues up the celebration popup for any new ones.
  function checkNewAchievements() {
    const stats = computeAchievementStats();
    const defs = buildAchievementDefs(stats);
    const seen = new Set(loadJSON(LS_SEEN_ACH, []));
    const freshlyUnlocked = defs.filter(d => d.unlocked && !seen.has(d.id));
    if (freshlyUnlocked.length === 0) return;
    freshlyUnlocked.forEach(d => seen.add(d.id));
    saveJSON(LS_SEEN_ACH, [...seen]);
    achQueue = freshlyUnlocked.slice(1);
    openAchModal(freshlyUnlocked[0], true);
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

  /* ---------------- INIT ---------------- */
  renderHome();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
  }
})();
