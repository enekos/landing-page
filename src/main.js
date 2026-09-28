import "./style.css";
import {
  homeNodes,
  homeClusters,
  manifestoNodes,
  origin,
  flatText,
} from "./data.js";
import {
  addTask,
  cipherGlyph,
  clamp,
  createField,
  decode,
  reducedMotion,
} from "./engine.js";
import { dossiers, hasDossier } from "./projects.js";
import { createDossier } from "./dossier.js";

const NAME = "Eneko Sarasola";

const app = document.querySelector("#app");

const pad2 = (n) => String(n).padStart(2, "0");

app.innerHTML = `
  <canvas id="home-canvas" aria-hidden="true"></canvas>
  <div class="grain" aria-hidden="true"></div>
  <div class="veil" aria-hidden="true"></div>
  <div class="veil-card" aria-hidden="true"></div>

  <main class="field" id="home">
    <header class="latent-hud latent-hud--top">
      <p class="whisper">web / ai / natural language developer</p>
      <h1 class="name" id="name" aria-label="${NAME}"></h1>
      <div class="latent-readout" aria-hidden="true">
        <span data-home="vec">vec ⟨0.00, 0.00⟩</span>
        <span data-home="cluster">cluster —</span>
        <span data-home="idx">node 01 / ${pad2(homeNodes.length)}</span>
      </div>

      <nav class="corner-nav" aria-label="Views">
        <button type="button" data-open="index">index</button>
        <span class="corner-nav__sep" aria-hidden="true">/</span>
        <button type="button" data-open="manifesto">manifesto</button>
      </nav>
    </header>

    <article class="latent-card" id="home-card" aria-live="polite">
      <p class="latent-card__tag" aria-hidden="true"></p>
      <div class="latent-card__body"></div>
      <p class="latent-card__near" aria-hidden="true"></p>
    </article>

    <nav class="latent-nav" aria-label="Move through the index">
      <button data-home-nav="prev" type="button" aria-label="Previous point">◂</button>
      <span class="latent-nav__thread" aria-hidden="true">follow the thread</span>
      <button data-home-nav="next" type="button" aria-label="Next point">▸</button>
    </nav>

    <canvas class="latent-map" id="home-map" aria-hidden="true"></canvas>

    <p class="latent-hint" aria-hidden="true">
      drag to drift · <kbd>⏎</kbd> open · <kbd>space</kbd> re-project
    </p>
  </main>

  <div class="sr-only">
    <p>${NAME} — software engineer and natural language processing enthusiast, Barcelona. Maintainer of gizapedia.org, an open encyclopedia of the human and social sciences in Basque, and of ikusmira.org, a Spanish-language educational archive. Email: enekos [at] duck.com.</p>
    <ul>
      ${homeNodes
    .filter((n) => n.href)
    .map((n) => `<li><a href="${n.href}">${n.label}</a> — ${flatText(n.lines)}</li>`)
    .join("")}
    </ul>
    ${Object.entries(dossiers)
    .map(([slug, d]) => `
      <section>
        <h2><a href="#p/${slug}">${slug}</a></h2>
        <p>${d.tagline}</p>
        <p>${d.what}</p>
        <p>${d.why}</p>
      </section>`)
    .join("")}
  </div>

  <div id="index-sheet" class="sheet" role="dialog" aria-modal="true" aria-label="Index" hidden>
    <div class="sheet-inner">
      <header class="sheet-head">
        <span class="sheet-title">index</span>
        <span class="sheet-sub">the same space, flattened</span>
        <button class="sheet-close" type="button" aria-label="Close index">✕</button>
      </header>
      <div class="sheet-body">
        ${Object.values(homeClusters)
    .map((cl) => {
      const items = homeNodes.filter((n) => n.clusterName === cl.name);
      if (!items.length) return "";
      return `
            <section class="sheet-group" style="--hue:${cl.hue}">
              <h2>${cl.name}</h2>
              <ul>
                ${items
          .map((n) => {
            const inner = `<span class="sheet-key">${n.label}</span><span class="sheet-val">${flatText(n.lines)}</span>`;
            if (n.kind === "portal") return `<li><a class="sheet-row" href="#manifesto">${inner}</a></li>`;
            // Anything with a dossier keeps you inside the site; the outbound
            // link lives on the dossier, one level in.
            if (hasDossier(n.label)) {
              return `<li><a class="sheet-row sheet-row--in" href="#p/${n.label}">${inner}</a></li>`;
            }
            return n.href
              ? `<li><a class="sheet-row" href="${n.href}" target="_blank" rel="noreferrer">${inner}</a></li>`
              : `<li><span class="sheet-row">${inner}</span></li>`;
          })
          .join("")}
              </ul>
            </section>`;
    })
    .join("")}
      </div>
    </div>
  </div>

  <div id="manifesto-overlay" class="latent" role="dialog" aria-modal="true"
    aria-label="Manifesto — a latent space of fragments" hidden>
    <canvas id="latent-canvas" aria-hidden="true"></canvas>
    <div class="latent-grain" aria-hidden="true"></div>
    <div class="latent-card-glow" aria-hidden="true"></div>

    <header class="latent-hud latent-hud--top">
      <div class="latent-title">
        <span class="latent-title__k">manifesto</span>
        <span class="latent-title__v">on mind &amp; substrate</span>
      </div>
      <div class="latent-readout" aria-hidden="true">
        <span data-readout="vec">vec ⟨0.00, 0.00⟩</span>
        <span data-readout="cluster">cluster —</span>
        <span data-readout="idx">node 00 / ${pad2(manifestoNodes.length)}</span>
      </div>
    </header>

    <button class="latent-close" type="button" aria-label="Close manifesto">✕</button>

    <article class="latent-card" aria-live="polite">
      <p class="latent-card__tag" aria-hidden="true"></p>
      <div class="latent-card__body"></div>
      <p class="latent-card__near" aria-hidden="true"></p>
    </article>

    <nav class="latent-nav" aria-label="Navigate fragments">
      <button data-nav="prev" type="button" aria-label="Previous fragment">◂</button>
      <span class="latent-nav__thread" aria-hidden="true">follow the thread</span>
      <button data-nav="next" type="button" aria-label="Next fragment">▸</button>
    </nav>

    <canvas id="latent-map" class="latent-map" aria-hidden="true"></canvas>

    <p class="latent-hint" aria-hidden="true">drag to drift · scroll to zoom · <kbd>◂</kbd> <kbd>▸</kbd> follow the thread</p>

    <div class="sr-only">
      ${manifestoNodes.map((f) => flatText(f.lines)).join(" ")}
    </div>
  </div>
`;

// ---------------------------------------------------------------------------
//  Cards
//
//  Both fields render the same card in the middle of the screen; only the
//  typography of the body changes with the kind of point you are standing on.
// ---------------------------------------------------------------------------

function makeCard(root) {
  const tagEl = root.querySelector(".latent-card__tag");
  const bodyEl = root.querySelector(".latent-card__body");
  const nearEl = root.querySelector(".latent-card__near");
  let cancel = () => {};

  return function render(node, build) {
    cancel();

    tagEl.textContent = `${node.clusterName} · ⟨${(node.x / 700).toFixed(2)}, ${(node.y / 700).toFixed(2)}⟩`;
    tagEl.style.setProperty("--hue", node.hue);

    bodyEl.className = `latent-card__body k-${node.kind}`;
    bodyEl.style.setProperty("--hue", node.hue);
    bodyEl.textContent = "";

    const queue = [];
    const line = (text, tag = "span", cls = "") => {
      const el = document.createElement(tag);
      el.className = `lx${cls ? ` ${cls}` : ""}`;
      el.textContent = text;
      queue.push({ el, text });
      return el;
    };

    build(bodyEl, line, node);

    queue.forEach((q, i) => { q.delay = i * 110; });
    cancel = decode(queue);

    nearEl.innerHTML = node.neighbors
      .map((nb) => `<span class="near-sim">${nb.sim.toFixed(2)}</span>`)
      .join('<span class="near-dot">·</span>');

    root.classList.remove("in");
    void root.offsetWidth; // restart the entrance
    root.classList.add("in");
  };
}

// --- manifesto bodies (unchanged shapes) -----------------------------------
function manifestoBody(body, line, node) {
  if (node.kind === "couplets") {
    for (const pair of node.lines) {
      const row = document.createElement("p");
      row.className = "cx-row";
      row.appendChild(line(pair[0], "span", "cx-a"));
      row.appendChild(line(pair[1], "span", "cx-b"));
      body.appendChild(row);
    }
    return;
  }
  const cls = node.kind === "stack" ? "sx-row" : "px-row";
  for (const l of node.lines) {
    const p = document.createElement("p");
    p.className = cls;
    p.appendChild(line(l));
    body.appendChild(p);
  }
}

// --- home bodies ------------------------------------------------------------
let copyTimer = 0;

function homeBody(body, line, node) {
  if (node.kind === "entry") {
    if (node.eyebrow) {
      const brow = document.createElement("p");
      brow.className = "entry-eyebrow";
      brow.appendChild(line(node.eyebrow));
      body.appendChild(brow);
    }

    const name = document.createElement("p");
    name.className = "entry-name";
    name.appendChild(line(node.label));
    body.appendChild(name);

    const desc = document.createElement("p");
    desc.className = "entry-desc";
    desc.appendChild(line(node.lines[0]));
    body.appendChild(desc);

    const actions = document.createElement("p");
    actions.className = "entry-actions";

    // A project reads its own dossier first; the repo is one step further out.
    // A social handle has nothing to read, so its link is the only action.
    if (hasDossier(node.label)) {
      const read = document.createElement("button");
      read.type = "button";
      read.className = "entry-link";
      read.textContent = "read the dossier";
      read.addEventListener("click", () => openDossier(node.label));
      actions.appendChild(read);
    }

    const a = document.createElement("a");
    a.className = "entry-link entry-link--quiet";
    a.href = node.href;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = `${node.href.replace(/^https?:\/\//, "")} ↗`;
    actions.appendChild(a);

    body.appendChild(actions);
    return;
  }

  if (node.kind === "contact") {
    const addr = document.createElement("p");
    addr.className = "entry-name entry-mail";
    addr.appendChild(line(node.lines[0]));
    body.appendChild(addr);

    const note = document.createElement("p");
    note.className = "entry-desc";
    note.appendChild(line(node.note));
    body.appendChild(note);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "entry-link";
    btn.textContent = "copy address";
    btn.addEventListener("click", () => {
      navigator.clipboard?.writeText("enekos@duck.com").then(() => {
        btn.textContent = "copied";
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => { btn.textContent = "copy address"; }, 1800);
      }).catch(() => { btn.textContent = "enekos@duck.com"; });
    });
    body.appendChild(btn);
    return;
  }

  if (node.kind === "portal") {
    const title = document.createElement("p");
    title.className = "portal-name";
    title.appendChild(line("manifesto"));
    body.appendChild(title);

    const sub = document.createElement("p");
    sub.className = "entry-desc";
    sub.appendChild(line(node.lines[0]));
    body.appendChild(sub);

    const note = document.createElement("p");
    note.className = "portal-note";
    note.appendChild(line(node.note));
    body.appendChild(note);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "entry-link";
    btn.textContent = "enter ↗";
    btn.addEventListener("click", openManifesto);
    body.appendChild(btn);
    return;
  }

  const cls = node.kind === "stack" ? "sx-row" : "px-row";
  for (const l of node.lines) {
    const p = document.createElement("p");
    p.className = cls;
    p.appendChild(line(l));
    body.appendChild(p);
  }
}

// ---------------------------------------------------------------------------
//  Home field
// ---------------------------------------------------------------------------

const homeCardEl = document.querySelector("#home-card");
const renderHomeCard = makeCard(homeCardEl);
const homeVec = document.querySelector('[data-home="vec"]');
const homeCluster = document.querySelector('[data-home="cluster"]');
const homeIdx = document.querySelector('[data-home="idx"]');
const nameEl = document.querySelector("#name");

const WIDE = "(min-width: 900px)";

const home = createField({
  canvas: document.querySelector("#home-canvas"),
  map: document.querySelector("#home-map"),
  cardEl: homeCardEl,
  nodes: homeNodes,
  labels: true,
  reprojectable: true,
  openZoom: 0.3,
  focusZoom: 0.66,
  measure: () => [window.innerWidth, window.innerHeight],
  // Wide: the point sits left of centre and the card reads to its right.
  // Narrow: the point rides above the card instead. Either way the light and
  // the prose never share the same pixels.
  anchor: () => (window.matchMedia(WIDE).matches ? [0.32, 0.5] : [0.5, 0.27]),
  onFocus(node) {
    renderHomeCard(node, homeBody);
    homeCluster.textContent = `cluster ${node.clusterName}`;
    homeIdx.textContent = `node ${pad2(node.i + 1)} / ${pad2(homeNodes.length)}`;
    nameEl.style.setProperty("--hue", node.hue);
  },
  onActivate(node) {
    if (hasDossier(node.label)) openDossier(node.label);
    else if (node.href) window.open(node.href, "_blank", "noreferrer");
    else if (node.kind === "portal") openManifesto();
  },
  onReadout(x, y) {
    const vec = `vec ⟨${x.toFixed(2)}, ${y.toFixed(2)}⟩`;
    if (homeVec.textContent !== vec) homeVec.textContent = vec;
  },
  onAnneal() {
    renderHomeCard(home.current(), homeBody);
  },
});

// ---------------------------------------------------------------------------
//  Manifesto field — same engine, same numbers, same look.
// ---------------------------------------------------------------------------

const overlay = document.querySelector("#manifesto-overlay");
const renderFragment = makeCard(overlay.querySelector(".latent-card"));
const readVec = overlay.querySelector('[data-readout="vec"]');
const readCluster = overlay.querySelector('[data-readout="cluster"]');
const readIdx = overlay.querySelector('[data-readout="idx"]');

const manifesto = createField({
  canvas: document.querySelector("#latent-canvas"),
  map: document.querySelector("#latent-map"),
  nodes: manifestoNodes,
  measure: () => [overlay.clientWidth, overlay.clientHeight],
  onFocus(node) {
    renderFragment(node, manifestoBody);
    readCluster.textContent = `cluster ${node.clusterName}`;
    readIdx.textContent = `node ${pad2(node.i + 1)} / ${pad2(manifestoNodes.length)}`;
  },
  onReadout(x, y) {
    const vec = `vec ⟨${x.toFixed(2)}, ${y.toFixed(2)}⟩`;
    if (readVec.textContent !== vec) readVec.textContent = vec;
  },
});

const manifestoOpen = () => !overlay.hidden;

function openManifesto() {
  if (manifestoOpen()) return;
  overlay.hidden = false;
  home.stop(); // fully occluded — nothing behind the overlay is worth a frame
  manifesto.start(0);
  requestAnimationFrame(() => overlay.classList.add("is-open"));
  overlay.querySelector(".latent-close").focus();
  setHash("manifesto");
}

function closeManifesto() {
  if (!manifestoOpen()) return;
  overlay.classList.remove("is-open");
  setHash("");
  const done = () => {
    overlay.hidden = true;
    manifesto.stop();
    overlay.removeEventListener("transitionend", done);
  };
  if (reducedMotion) done();
  else overlay.addEventListener("transitionend", done);
  home.start(home.view.focus, true);
  document.querySelector('[data-open="manifesto"]').focus();
}

// ---------------------------------------------------------------------------
//  Index sheet — the same content, flattened into a list for anyone who would
//  rather read than travel.
// ---------------------------------------------------------------------------

const sheet = document.querySelector("#index-sheet");
const sheetOpen = () => !sheet.hidden;

function openIndex() {
  if (sheetOpen()) return;
  sheet.hidden = false;
  requestAnimationFrame(() => sheet.classList.add("is-open"));
  sheet.querySelector(".sheet-close").focus();
  setHash("index");
}

function closeIndex() {
  if (!sheetOpen()) return;
  sheet.classList.remove("is-open");
  setHash("");
  const done = () => {
    sheet.hidden = true;
    sheet.removeEventListener("transitionend", done);
  };
  if (reducedMotion) done();
  else sheet.addEventListener("transitionend", done);
  document.querySelector('[data-open="index"]').focus();
}

// ---------------------------------------------------------------------------
//  Dossiers — one addressable page per project, at /#p/<slug>.
//
//  These exist so a repository's README can point at something that explains
//  the project without asking the reader to fly a camera around first.
// ---------------------------------------------------------------------------

const dossier = createDossier({
  onOpen: (slug) => setHash(`p/${slug}`),
  onClose: () => {
    // Only clear the hash if it still points here — closing on the way to
    // another view must not undo the hash that view has already set.
    if (location.hash.slice(1).startsWith("p/")) setHash("");
    // The field was left exactly where it was; pick the loop back up rather
    // than flying the camera home.
    home.resume();
    // Hand focus back to whatever is standing in for the dossier out here.
    const back = homeCardEl.querySelector("button.entry-link")
      || document.querySelector('[data-open="index"]');
    back?.focus();
  },
});

function openDossier(slug) {
  if (!hasDossier(slug)) return;
  closeIndex();
  closeManifesto();
  const wasClosed = !dossier.isOpen();
  if (!dossier.open(slug)) return;
  // Fully occluded by an opaque sheet, and a dossier is a minutes-long read —
  // not worth a frame.
  if (wasClosed) home.stop();
  setHash(`p/${slug}`);
}

function closeDossier() {
  dossier.close();
}

// ---------------------------------------------------------------------------
//  The name
//
//  It resolves out of cipher on arrival, and afterwards it holds — until you
//  drift. The further the camera travels from the self cluster, the more often
//  a character slips back into noise. The identity in the corner is only as
//  stable as your distance from it.
// ---------------------------------------------------------------------------

const chars = [...NAME].map((ch) => {
  const span = document.createElement("span");
  span.className = "name-char";
  span.textContent = ch === " " ? " " : ch;
  nameEl.appendChild(span);
  return { span, ch, until: 0 };
});

function startName() {
  if (reducedMotion) return; // the name simply is what it is

  const movable = chars.filter((c) => c.ch !== " ");
  decode(movable.map((c, i) => ({ el: c.span, text: c.ch, delay: 90 + i * 55 })));

  let next = 0;
  addTask((now) => {
    // distance from the origin of the self cluster, normalised
    const dx = home.cam.x - origin[0];
    const dy = home.cam.y - origin[1];
    const drift = clamp(Math.hypot(dx, dy) / 1500, 0, 1);
    nameEl.style.setProperty("--drift", drift.toFixed(2));

    for (const c of chars) {
      if (c.until && now > c.until) {
        c.until = 0;
        c.span.textContent = c.ch;
        c.span.classList.remove("slipped");
      }
    }

    if (now < next) return;
    next = now + 400 + Math.random() * 1100;
    if (Math.random() > 0.05 + drift * 0.4) return;

    const c = movable[(Math.random() * movable.length) | 0];
    if (c.until) return;
    c.span.textContent = cipherGlyph();
    c.span.classList.add("slipped");
    c.until = now + 90 + Math.random() * 220;
  });
}

if (document.fonts?.ready) document.fonts.ready.then(startName);
else window.addEventListener("load", startName);

// ---------------------------------------------------------------------------
//  Wiring
// ---------------------------------------------------------------------------

document.querySelector('[data-open="index"]').addEventListener("click", openIndex);
document.querySelector('[data-open="manifesto"]').addEventListener("click", openManifesto);
sheet.querySelector(".sheet-close").addEventListener("click", closeIndex);
sheet.addEventListener("click", (e) => { if (e.target === sheet) closeIndex(); });
overlay.querySelector(".latent-close").addEventListener("click", closeManifesto);

overlay.querySelector('[data-nav="prev"]').addEventListener("click", () => manifesto.prev());
overlay.querySelector('[data-nav="next"]').addEventListener("click", () => manifesto.next());
document.querySelector('[data-home-nav="prev"]').addEventListener("click", () => home.prev());
document.querySelector('[data-home-nav="next"]').addEventListener("click", () => home.next());

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (dossier.isOpen()) closeDossier();
    else if (sheetOpen()) closeIndex();
    else if (manifestoOpen()) closeManifesto();
    return;
  }
  // Both are scrolls, not fields — the arrow keys belong to the page.
  if (sheetOpen() || dossier.isOpen()) return;

  const field = manifestoOpen() ? manifesto : home;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    field.next();
    return;
  }
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    field.prev();
    return;
  }
  if (manifestoOpen()) return;

  const typing = /^(INPUT|TEXTAREA|BUTTON|A)$/.test(document.activeElement?.tagName || "");
  if (e.code === "Space" && !typing) {
    e.preventDefault();
    home.reproject();
  } else if (e.key === "Enter" && !typing) {
    // Opening a view hands focus to its close button, and Enter's own default
    // action would then click it — the dossier would open and shut in a frame.
    e.preventDefault();
    // Same rule as a click: a project reads its dossier first, and only a point
    // with nothing to read here sends you off the site.
    const n = home.current();
    if (hasDossier(n.label)) openDossier(n.label);
    else if (n.href) window.open(n.href, "_blank", "noreferrer");
    else if (n.kind === "portal") openManifesto();
  } else if (e.key === "i") {
    openIndex();
  }
});

// Mobile browsers fire resize every time the URL bar slides. Rebuilding both
// canvases and every label sprite for a 60px height change is pure jank, so
// only a real change in the viewport counts.
let lastW = window.innerWidth;
let lastH = window.innerHeight;
let resizePending = false;

window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w === lastW && Math.abs(h - lastH) < 120) return;
  lastW = w;
  lastH = h;
  if (resizePending) return;
  resizePending = true;
  requestAnimationFrame(() => {
    resizePending = false;
    home.resize();
    if (manifestoOpen()) manifesto.resize();
  });
});

// Labels are measured in a font that may not have arrived yet.
document.fonts?.ready.then(() => home.resize());

// Both regions are linkable: /#manifesto lands straight in the cloud.
let hashLock = false;

function setHash(value) {
  const next = value ? `#${value}` : " ";
  if (location.hash.slice(1) === value) return;
  hashLock = true;
  history.replaceState(null, "", value ? next : location.pathname + location.search);
  hashLock = false;
}

function applyHash() {
  if (hashLock) return;
  const h = location.hash.slice(1);

  // /#p/<slug> is the linkable form a repo README points at.
  if (h.startsWith("p/")) {
    const slug = h.slice(2);
    if (hasDossier(slug)) { openDossier(slug); return; }
  }

  closeDossier();
  if (h === "manifesto") { closeIndex(); openManifesto(); }
  else if (h === "index") { closeManifesto(); openIndex(); }
  else { closeIndex(); closeManifesto(); }
}

window.addEventListener("hashchange", applyHash);

// Arrive wide on the whole projection, then fall towards the self cluster.
home.start(0);
if (location.hash) applyHash();
