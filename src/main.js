import "./style.css";
import { homeNodes, homeClusters } from "./data.js";
import { addTask, cipherGlyph, clamp, decode, reducedMotion } from "./engine.js";
import { dossiers, hasDossier } from "./projects.js";
import { createDossier } from "./dossier.js";
import { apps, windowFor } from "./apps.js";
import { gizaScene, ikusScene, initArchives } from "./archives.js";

const NAME = "Eneko Sarasola";
const EMAIL = "enekos@duck.com";

const node = (label) => homeNodes.find((n) => n.label === label);
const inCluster = (name) => homeNodes.filter((n) => n.clusterName === name);
const why = node("why").lines;
const socials = inCluster("signal");

const arrow = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>`;
const out = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5"/></svg>`;

const mark = `<img class="mark" src="/giraffe.png" alt="" width="36" height="36">`;

const app = document.querySelector("#app");

app.innerHTML = `
<a class="skip" href="#main">Skip to content</a>
<div class="prog" aria-hidden="true"></div>

<header class="nav" id="nav">
  <div class="wrap">
    <a class="brand" href="#top" aria-label="${NAME}, top of page">${mark}<span>Eneko Sarasola</span></a>
    <nav class="nav-links" aria-label="Sections">
      <a href="#apps">Apps</a><a href="#archives">Archives</a><a href="#contact">Contact</a>
    </nav>
    <a class="btn btn-ink btn-sm" href="#apps">Mac apps</a>
  </div>
</header>

<main id="main">

<section class="hero" id="top">
  <canvas class="field" id="field" aria-hidden="true"></canvas>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="whisper">web / ai / natural language developer · barcelona</p>
      <h1 class="name" id="name" aria-label="${NAME}"></h1>
      <p class="lede">${node("eneko").lines[0]} And three native Mac apps for the work in between.</p>
      <div class="cta-row">
        <a class="btn btn-ink" href="#apps">See the Mac apps ${arrow}</a>
        <a class="btn btn-ghost" href="#archives">Read the archives</a>
      </div>
      <p class="readout" aria-hidden="true"><span data-vec>vec ⟨0.00, 0.00⟩</span><span data-cluster>cluster self</span></p>
    </div>

    <div class="dock" aria-label="Mac apps">
      <p class="dock-k">New · native macOS</p>
      ${apps.map((a, i) => `
      <a class="dock-app" href="#app-${a.slug}" style="--i:${i}">
        ${a.icon}
        <span class="dock-app__t"><b>${a.name}</b><span>${a.kind}</span></span>
        <span class="dock-app__p">${a.price}<small>once</small></span>
      </a>`).join("")}
    </div>
  </div>
  <a class="scroll-cue" href="#apps" aria-label="Scroll to the apps"><span></span></a>
</section>

<section class="apps" id="apps" aria-labelledby="apps-h">
  <div class="wrap">
    <div class="head" data-reveal>
      <span class="eyebrow">Mac apps</span>
      <h2 id="apps-h">Three native tools. Paid once, yours to keep.</h2>
      <p class="lede">Swift, no Electron, no account, no telemetry. Each one replaces a slow app, a browser tab or a subscription you already resent.</p>
    </div>
  </div>

  <div class="show">
      <div class="steps">
        ${apps.map((a, i) => `
        <article class="step${i === 0 ? " on" : ""}" id="app-${a.slug}" data-app="${a.slug}">
          <div class="step-id">${a.icon}<div><h3 class="step-name">${a.name}</h3><span class="tag">${a.kind}</span></div>
            <span class="step-n">0${i + 1} / 0${apps.length}</span></div>
          <p class="step-head">${a.headline}</p>
          <p class="step-lede">${a.lede}</p>
          <div class="win win--inline" aria-hidden="true">${windowFor(a.slug)}</div>
          <ul class="points">
            ${a.points.map(([k, v]) => `<li><b>${k}</b><span>${v}</span></li>`).join("")}
          </ul>
          <dl class="facts">
            <div><dt>Price</dt><dd>${a.price} once</dd></div>
            <div><dt>Runs on</dt><dd>${a.requires}</dd></div>
            <div><dt>Instead of</dt><dd>${a.replaces}</dd></div>
          </dl>
          <div class="cta-row">
            <a class="btn btn-ink" href="/?early=${a.slug}" data-early="${a.slug}">Request early access</a>
            <a class="btn btn-ghost" href="${a.href}">Full tour ${arrow}</a>
          </div>
          <p class="etym">${a.etym}</p>
        </article>`).join("")}
      </div>

      <div class="stage" aria-hidden="true">
        <div class="stage-glow"></div>
        ${apps.map((a, i) => `<div class="win win--stage${i === 0 ? " on" : ""}" data-win="${a.slug}">${windowFor(a.slug)}</div>`).join("")}
        <div class="stage-dots">${apps.map((a, i) => `<i class="${i === 0 ? "on" : ""}" data-dot="${a.slug}"></i>`).join("")}</div>
      </div>
  </div>

  <div class="terms">
    <div class="wrap">
      <div class="terms-grid" data-stagger>
        <div data-reveal><b>Pay once</b><span>No subscription, no renewal. Every future update is included.</span></div>
        <div data-reveal><b>Three Macs</b><span>One licence runs on three of your machines at a time.</span></div>
        <div data-reveal><b>No account</b><span>The licence key arrives by email. The key is the whole account.</span></div>
        <div data-reveal><b>14-day refund</b><span>No trial build to expire on you. If it is not for you, write and get your money back.</span></div>
      </div>
    </div>
  </div>
</section>

<section class="archives" id="archives" aria-labelledby="archives-h">
  <div class="wrap">
    <div class="head" data-reveal>
      <span class="eyebrow">Archives</span>
      <h2 id="archives-h">Two encyclopedias, written and kept by one person.</h2>
      <p class="lede">A language without reference works loses arguments it should win. These are the work with readers, not just repositories.</p>
    </div>

    <article class="arch arch--giza" style="--hue:${node("gizapedia").hue}">
      <div class="arch-copy" data-reveal>
        <p class="arch-k"><span class="live"></span>live · in Basque</p>
        <h3>gizapedia</h3>
        <p class="arch-tag">${dossiers.gizapedia.tagline}</p>
        <p class="arch-p">Philosophy, politics, economics, sociology and statistics: long-form, cited articles and a dictionary that grows every day. Hugo builds the site; a Rust pass lints and transforms 21,000 pages before it does.</p>
        <div class="stats">
          <div><b class="count" data-to="8099">8,099</b><span>articles</span></div>
          <div><b class="count" data-to="11012">11,012</b><span>dictionary entries</span></div>
          <div><b class="count" data-to="21000">21,000</b><span>pages built</span></div>
        </div>
        <div class="cta-row">
          <a class="btn btn-ink" href="https://gizapedia.org" target="_blank" rel="noreferrer">gizapedia.org ${out}</a>
          <a class="btn btn-ghost" href="#p/gizapedia">How it is built</a>
        </div>
      </div>

      <div class="arch-visual">${gizaScene()}</div>
    </article>

    <article class="arch arch--ikus" style="--hue:${node("ikusmira").hue}">
      <div class="arch-copy" data-reveal>
        <p class="arch-k"><span class="live"></span>live · in Spanish</p>
        <h3>ikusmira</h3>
        <p class="arch-tag">${dossiers.ikusmira.tagline}</p>
        <p class="arch-p">An educational archive with study routes, ten-minute book cards and a reading a day. Every article is classified in your own browser by a wasm rule engine: no inference call, no backend, nothing about what you read leaves the page.</p>
        <div class="stats">
          <div><b class="count" data-to="4429">4,429</b><span>articles</span></div>
          <div><b class="count" data-to="25">25</b><span>study routes</span></div>
          <div><b class="count" data-to="104">104</b><span>essential books</span></div>
          <div><b>0</b><span>inference calls</span></div>
        </div>
        <div class="cta-row">
          <a class="btn btn-ink" href="https://ikusmira.org" target="_blank" rel="noreferrer">ikusmira.org ${out}</a>
          <a class="btn btn-ghost" href="#p/ikusmira">How it is built</a>
        </div>
      </div>

      <div class="arch-visual">${ikusScene()}</div>
    </article>
  </div>
</section>

<section class="why" id="why" aria-labelledby="why-h">
  <div class="wrap">
    <span class="eyebrow" id="why-h">Why it is built this way</span>
    <div class="why-lines">
      ${why.map((l) => {
    const [head, ...rest] = l.split(", because ");
    return `<p class="why-line">${`<b>${head},</b> because ${rest.join(", because ")}`
      .split(" ").map((w) => `<span class="w">${w}</span>`).join(" ")}</p>`;
  }).join("")}
    </div>
  </div>
</section>

<section class="contact" id="contact" aria-labelledby="contact-h">
  <div class="wrap contact-grid">
    <div data-reveal>
      <span class="eyebrow">About</span>
      <h2 id="contact-h">Reach out. I answer.</h2>
      <p class="lede">${node("barcelona").lines[0]} ${node("analog").lines[0]}</p>
    </div>
    <div class="contact-card" data-reveal>
      <p class="contact-k">email</p>
      <p class="contact-mail">enekos <span>[at]</span> duck.com</p>
      <button class="btn btn-ink" type="button" id="copy">Copy address</button>
      <ul class="socials">
        ${socials.map((n) => `<li><a href="${n.href}" target="_blank" rel="noreferrer"><b>${n.label}</b><span>${n.lines[0]}</span>${out}</a></li>`).join("")}
      </ul>
    </div>
  </div>
</section>
</main>

<footer class="site">
  <div class="wrap">
    <span>${mark} Eneko Sarasola · Barcelona</span>
    <span class="foot-apps">${apps.map((a) => `<a href="${a.href}">${a.name}</a>`).join("")}<a href="https://gizapedia.org" target="_blank" rel="noreferrer">gizapedia</a><a href="https://ikusmira.org" target="_blank" rel="noreferrer">ikusmira</a></span>
  </div>
</footer>
`;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const vh = () => window.innerHeight;

const canvas = $("#field");
const ctx = canvas.getContext("2d");
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
const dust = Array.from({ length: 70 }, (_, i) => ({
  x: (Math.sin(i * 91.7) * 0.5 + 0.5) * 1800 - 900,
  y: (Math.sin(i * 47.3 + 2) * 0.5 + 0.5) * 1500 - 750,
  r: 0.8 + (i % 3) * 0.5,
  hue: homeNodes[i % homeNodes.length].hue,
}));
let fw = 0;
let fh = 0;
let dpr = 1;
let heroOut = 0;

function sizeField() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  fw = canvas.clientWidth;
  fh = canvas.clientHeight;
  canvas.width = fw * dpr;
  canvas.height = fh * dpr;
}

function drawField(now) {
  if (heroOut >= 1) return;
  const t = reducedMotion ? 0 : now * 0.00012;
  pointer.x += (pointer.tx - pointer.x) * 0.05;
  pointer.y += (pointer.ty - pointer.y) * 0.05;

  const wide = fw > 900;
  const s = Math.min(fw / (wide ? 2300 : 1500), fh / 1700);
  const cx = fw * (wide ? 0.66 : 0.5) - pointer.x * 30;
  const cy = fh * 0.5 - pointer.y * 24;
  const spread = 1 + heroOut * 0.9;

  const at = (n, i) => {
    const wob = reducedMotion ? 0 : 14;
    const x = n.x + Math.sin(t * 7 + i * 1.3) * wob;
    const y = n.y + Math.cos(t * 6 + i * 0.9) * wob;
    return [cx + x * s * spread, cy + y * s * spread];
  };

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, fw, fh);
  ctx.globalAlpha = 1 - heroOut;

  for (const d of dust) {
    const [x, y] = at(d, d.r * 10);
    ctx.fillStyle = `hsla(${d.hue} 50% 45% / .25)`;
    ctx.beginPath();
    ctx.arc(x, y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }

  const pos = homeNodes.map(at);
  ctx.lineWidth = 1;
  homeNodes.forEach((n, i) => {
    for (const nb of n.neighbors) {
      const [x2, y2] = pos[nb.node.i];
      ctx.strokeStyle = `hsla(${n.hue} 45% 45% / ${0.08 + nb.sim * 0.14})`;
      ctx.beginPath();
      ctx.moveTo(pos[i][0], pos[i][1]);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  });

  ctx.font = `500 11px "JetBrains Mono", monospace`;
  homeNodes.forEach((n, i) => {
    const [x, y] = pos[i];
    const r = n.flagship ? 5 : n.kind === "entry" ? 3.4 : 2.6;
    ctx.fillStyle = `hsla(${n.hue} 60% 50% / .14)`;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsl(${n.hue} 55% 44%)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    if (fw > 700) {
      ctx.fillStyle = `hsla(${n.hue} 30% 30% / .55)`;
      ctx.fillText(n.label, x + r + 6, y + 4);
    }
  });
  ctx.globalAlpha = 1;
}

sizeField();
addTask(drawField);

const readVec = $("[data-vec]");
const readCluster = $("[data-cluster]");
window.addEventListener("pointermove", (e) => {
  pointer.tx = e.clientX / window.innerWidth - 0.5;
  pointer.ty = e.clientY / window.innerHeight - 0.5;
  if (heroOut > 0.6) return;
  const x = pointer.tx * 2;
  const y = pointer.ty * 2;
  readVec.textContent = `vec ⟨${x.toFixed(2)}, ${y.toFixed(2)}⟩`;
  let best = homeClusters.self;
  let bd = Infinity;
  for (const c of Object.values(homeClusters)) {
    const d = Math.hypot(c.c[0] / 700 - x, c.c[1] / 700 - y);
    if (d < bd) { bd = d; best = c; }
  }
  readCluster.textContent = `cluster ${best.name}`;
}, { passive: true });

const nameEl = $("#name");
const chars = NAME.split(" ").flatMap((word) => {
  const w = document.createElement("span");
  w.className = "name-word";
  nameEl.appendChild(w);
  nameEl.appendChild(document.createTextNode(" "));
  return [...word].map((ch) => {
    const span = document.createElement("span");
    span.className = "name-char";
    span.textContent = ch;
    w.appendChild(span);
    return { span, ch, until: 0 };
  });
});
let drift = 0;

function startName() {
  if (reducedMotion) return;
  const movable = chars;
  decode(movable.map((c, i) => ({ el: c.span, text: c.ch, delay: 90 + i * 55 })));

  let next = 0;
  addTask((now) => {
    for (const c of chars) {
      if (c.until && now > c.until) {
        c.until = 0;
        c.span.textContent = c.ch;
        c.span.classList.remove("slipped");
      }
    }
    if (now < next) return;
    next = now + 400 + Math.random() * 1100;
    if (Math.random() > 0.05 + drift * 0.5) return;
    const c = movable[(Math.random() * movable.length) | 0];
    if (c.until) return;
    c.span.textContent = cipherGlyph();
    c.span.classList.add("slipped");
    c.until = now + 90 + Math.random() * 220;
  });
}

if (document.fonts?.ready) document.fonts.ready.then(() => { sizeField(); startName(); });
else window.addEventListener("load", startName);

const prog = $(".prog");
const nav = $("#nav");
const hero = $(".hero");
const whyLines = $(".why-lines");
const whyWords = $$(".why .w");
const archScroll = initArchives($("#archives"));

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - vh();
  prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  nav.classList.toggle("stuck", y > 8);

  heroOut = clamp(y / (hero.offsetHeight * 0.9), 0, 1);
  hero.style.setProperty("--out", heroOut.toFixed(3));
  drift = clamp(y / (vh() * 3), 0, 1);

  archScroll(vh());

  const r = whyLines.getBoundingClientRect();
  const wp = reducedMotion ? 1 : clamp((vh() * 0.8 - r.top) / (r.height + vh() * 0.1), 0, 1);
  const lit = Math.round(wp * whyWords.length);
  whyWords.forEach((w, i) => w.classList.toggle("lit", i < lit));
}

let scrollQueued = false;
const queue = () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => { scrollQueued = false; onScroll(); });
};
window.addEventListener("scroll", queue, { passive: true });
onScroll();

const stage = $(".stage");
const steps = $$(".step");
const wins = $$("[data-win]");
const stageDots = $$("[data-dot]");
const setApp = (slug) => {
  steps.forEach((s) => s.classList.toggle("on", s.dataset.app === slug));
  wins.forEach((w) => w.classList.toggle("on", w.dataset.win === slug));
  stageDots.forEach((d) => d.classList.toggle("on", d.dataset.dot === slug));
  stage.dataset.app = slug;
};
const stepIO = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) setApp(e.target.dataset.app);
}, { rootMargin: "-45% 0px -45% 0px" });
steps.forEach((s) => stepIO.observe(s));
setApp(apps[0].slug);

const fmt = new Intl.NumberFormat("en-US");
function count(el) {
  const to = Number(el.dataset.to);
  if (reducedMotion) return;
  const t0 = performance.now();
  const stop = addTask((now) => {
    const p = clamp((now - t0) / 1400, 0, 1);
    el.textContent = fmt.format(Math.round(to * (1 - (1 - p) ** 4)));
    if (p >= 1) stop();
  });
}

const revealIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add("in");
    $$(".count", e.target).forEach(count);
    revealIO.unobserve(e.target);
  }
}, { rootMargin: "0px 0px -12% 0px" });
$$("[data-reveal], .arch-visual, .step").forEach((el) => revealIO.observe(el));
$$("[data-stagger]").forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty("--d", `${i * 90}ms`)));

const copyBtn = $("#copy");
let copyTimer = 0;
copyBtn.addEventListener("click", () => {
  navigator.clipboard?.writeText(EMAIL).then(() => {
    copyBtn.textContent = "Copied";
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyBtn.textContent = "Copy address"; }, 1800);
  }).catch(() => { copyBtn.textContent = EMAIL; });
});

let returnFocus = null;
const dossier = createDossier({
  onOpen: (slug) => setHash(`p/${slug}`),
  onClose: () => {
    if (location.hash.slice(1).startsWith("p/")) setHash("");
    document.documentElement.classList.remove("locked");
    returnFocus?.focus({ preventScroll: true });
  },
});

function openDossier(slug) {
  if (!hasDossier(slug)) return;
  if (!dossier.isOpen()) returnFocus = document.activeElement;
  if (!dossier.open(slug)) return;
  document.documentElement.classList.add("locked");
  setHash(`p/${slug}`);
}

function setHash(value) {
  if (location.hash.slice(1) === value) return;
  history.replaceState(null, "", value ? `#${value}` : location.pathname + location.search);
}

function applyHash() {
  const h = location.hash.slice(1);
  if (h.startsWith("p/") && hasDossier(h.slice(2))) openDossier(h.slice(2));
  else if (dossier.isOpen()) dossier.close();
}

document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#p/"]');
  if (!a) return;
  e.preventDefault();
  openDossier(a.getAttribute("href").slice(3));
});
window.addEventListener("hashchange", applyHash);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dossier.isOpen()) dossier.close();
});

let lastW = window.innerWidth;
window.addEventListener("resize", () => {
  if (window.innerWidth === lastW) return;
  lastW = window.innerWidth;
  sizeField();
  onScroll();
});

if (location.hash) applyHash();
