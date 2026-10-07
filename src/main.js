import "./style.css";
import { homeNodes, basqueNames } from "./data.js";
import { addTask, cipherGlyph, clamp, decode, reducedMotion } from "./engine.js";
import { dossiers, hasDossier } from "./projects.js";
import { createDossier } from "./dossier.js";
import { apps, windowFor } from "./apps.js";
import { gizaScene, ikusScene, initArchives } from "./archives.js";
import { bikoteHTML, bikoteCasesHTML, initBikote, initBikoteCases } from "./bikote.js";
import { docsHTML, initDocs } from "./docs.js";

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
      <a href="#apps">Apps</a><a href="#bikote">bikote</a><a href="#archives">Archives</a><a href="#docs">Docs</a><a href="#contact">Contact</a><a href="https://github.com/enekos" target="_blank" rel="noopener">GitHub</a>
    </nav>
    <a class="btn btn-ink btn-sm" href="/?early=" data-early="">Early access</a>
  </div>
</header>

<main id="main">

<section class="hero" id="top">
  <canvas class="field" id="field" aria-hidden="true"></canvas>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="whisper">web / ai / natural language developer · barcelona</p>
      <h1 class="name" id="name" aria-label="${NAME}"></h1>
      <p class="lede">${node("eneko").lines[0]}</p>
      <div class="cta-row">
        <a class="btn btn-ink" href="#apps">See the apps ${arrow}</a>
        <a class="btn btn-ghost" href="#archives">Read the archives</a>
      </div>
      <p class="readout"><span>Every project here has a Basque name.</span><span data-word aria-hidden="true">lemazain · helmsman</span></p>
    </div>
  </div>
  <a class="scroll-cue" href="#apps" aria-label="Scroll to the apps"><span></span></a>
</section>

<section class="apps" id="apps" aria-labelledby="apps-h">
  <div class="wrap">
    <div class="head" data-reveal>
      <span class="eyebrow">Apps</span>
      <h2 id="apps-h">A few Mac apps I made because I wanted them.</h2>
      <p class="lede">Written in Swift, with no account and no tracking. Three cost a one-off price and are yours to keep; bidali is free.</p>
    </div>

    <ul class="lineup" data-stagger>
      ${apps.map((a) => `
      <li data-reveal>
        <a class="pick${a.free ? " pick--free" : ""}" href="#app-${a.slug}" data-pick="${a.slug}">
          ${a.icon}
          <span class="pick-t"><b>${a.name}</b><span>${a.kind}</span></span>
          <span class="pick-p">${a.free ? "Free" : `${a.price}<small>once</small>`}</span>
          <span class="pick-r">similar to ${a.replaces}</span>
        </a>
      </li>`).join("")}
    </ul>
  </div>

  <div class="show">
      <div class="steps">
        ${apps.map((a, i) => `
        <article class="step${i === 0 ? " on" : ""}" id="app-${a.slug}" data-app="${a.slug}">
          <div class="step-id">${a.icon}<div><h3 class="step-name">${a.name}${a.free ? `<span class="free">Free</span>` : ""}</h3><span class="tag">${a.kind}</span></div>
            <span class="step-n">0${i + 1} / 0${apps.length}</span></div>
          <p class="step-head">${a.headline}</p>
          <p class="step-lede">${a.lede}</p>
          <div class="win win--inline" aria-hidden="true" data-win="${a.slug}">${windowFor(a.slug)}</div>
          <ol class="tour" aria-label="${a.name}, a tour of ${a.tour.length} views">
            ${a.tour.map((t, j) => `
            <li class="tour-i${j === 0 ? " on" : ""}" data-state="${t.state}">
              <button type="button" class="tour-b" aria-expanded="${j === 0}" aria-controls="tour-${a.slug}-${t.state}">
                <span class="tour-n">${String(j + 1).padStart(2, "0")}</span>
                <span class="tour-k">${t.tag}</span>
                <span class="tour-h">${t.head}</span>
              </button>
              <p class="tour-p" id="tour-${a.slug}-${t.state}">${t.body}</p>
              <i class="tour-bar" aria-hidden="true"></i>
            </li>`).join("")}
          </ol>
          <dl class="facts">
            <div><dt>Price</dt><dd>${a.free ? "Free" : `${a.price} once`}</dd></div>
            <div><dt>Runs on</dt><dd>${a.requires}</dd></div>
            <div><dt>Similar to</dt><dd>${a.replaces}</dd></div>
          </dl>
          <div class="cta-row">
            <a class="btn btn-ink" href="/?early=${a.slug}" data-early="${a.slug}">${a.free ? "Get it free when it's ready" : "Ask for early access"}</a>
            ${a.href ? `<a class="btn btn-ghost" href="${a.href}">Full tour ${arrow}</a>` : ""}
          </div>
          <p class="etym">${a.etym}</p>
        </article>`).join("")}
      </div>

      <div class="stage" aria-hidden="true">
        <div class="stage-glow"></div>
        ${apps.map((a, i) => `<div class="win win--stage${i === 0 ? " on" : ""}" data-win="${a.slug}">${windowFor(a.slug)}</div>`).join("")}
        <p class="stage-cap"><b data-cap-k></b><span data-cap-n></span></p>
        <div class="stage-dots">${apps.map((a, i) => `<i class="${i === 0 ? "on" : ""}" data-dot="${a.slug}"></i>`).join("")}</div>
      </div>
  </div>

  <div class="terms">
    <div class="wrap">
      <div class="terms-grid" data-stagger>
        <div data-reveal><b>Pay once</b><span>No subscription. You pay once and get every update. bidali is free.</span></div>
        <div data-reveal><b>Three Macs</b><span>One licence works on up to three of your Macs.</span></div>
        <div data-reveal><b>No account</b><span>Your licence key comes by email, and that's all you need. No sign-up.</span></div>
        <div data-reveal><b>14-day refund</b><span>There's no trial, so if it's not for you, write to me within 14 days and I'll refund you.</span></div>
      </div>
    </div>
  </div>
</section>

<section class="bk" id="bikote" aria-labelledby="bk-h">
  <div class="wrap">
    <div class="bk-top">
      <div class="head" data-reveal>
        <span class="eyebrow">New · in beta</span>
        <h2 id="bk-h" class="bk-title">bikote</h2>
        <p class="lede">A data workspace for people who don't write code. Make a table, drop in a spreadsheet, let AI fill in the tedious columns, ask questions in plain words, and share a dashboard or a form with your team.</p>
      </div>
      <form class="bk-lead" data-early-form="bikote" data-reveal novalidate>
        <p class="bk-lead-k">Private beta</p>
        <h3>Try it before everyone else</h3>
        <p>Leave your email and I'll send you an invite as soon as there's a spot.</p>
        <div class="bk-lead-row">
          <label class="sr" for="bk-email">Email</label>
          <input id="bk-email" type="email" name="email" autocomplete="email" required placeholder="you@company.com">
          <button type="submit">Get an invite</button>
        </div>
        <label class="ea-hp" aria-hidden="true">Company <input type="text" name="company" tabindex="-1" autocomplete="off"></label>
        <p class="bk-lead-msg" role="status" aria-live="polite">One email when your invite is ready. No newsletter.</p>
      </form>
    </div>
    ${bikoteHTML()}
    ${bikoteCasesHTML()}
  </div>
</section>

<section class="archives" id="archives" aria-labelledby="archives-h">
  <div class="wrap">
    <div class="head" data-reveal>
      <span class="eyebrow">Archives</span>
      <h2 id="archives-h">Two encyclopedias I write and look after.</h2>
      <p class="lede">These are the projects people actually read, and the ones I care about most.</p>
    </div>

    <article class="arch arch--giza" style="--hue:${node("gizapedia").hue}">
      <div class="arch-copy" data-reveal>
        <p class="arch-k"><span class="live"></span>live · in Basque</p>
        <h3>gizapedia</h3>
        <p class="arch-tag">${dossiers.gizapedia.tagline}</p>
        <p class="arch-p">Philosophy, politics, economics, sociology and statistics: long, cited articles, plus a dictionary that grows a little every day. Hugo builds the site, and a small Rust tool checks and tidies all 21,000 pages first.</p>
        <div class="stats">
          <div><b class="count" data-to="8099">8,099</b><span>articles</span></div>
          <div><b class="count" data-to="11012">11,012</b><span>dictionary entries</span></div>
          <div><b class="count" data-to="21000">21,000</b><span>pages built</span></div>
        </div>
        <div class="cta-row">
          <a class="btn btn-ink" href="https://gizapedia.org" target="_blank" rel="noreferrer">gizapedia.org ${out}</a>
          <a class="btn btn-ghost" href="#p/gizapedia">How I built it</a>
        </div>
      </div>

      <div class="arch-visual">${gizaScene()}</div>
    </article>

    <article class="arch arch--ikus" style="--hue:${node("ikusmira").hue}">
      <div class="arch-copy" data-reveal>
        <p class="arch-k"><span class="live"></span>live · in Spanish</p>
        <h3>ikusmira</h3>
        <p class="arch-tag">${dossiers.ikusmira.tagline}</p>
        <p class="arch-p">Study routes, ten-minute book summaries and a reading for each day. Articles are sorted into topics right in your browser by a small rule engine, so there's no server and no AI call, and nothing about what you read leaves the page.</p>
        <div class="stats">
          <div><b class="count" data-to="4429">4,429</b><span>articles</span></div>
          <div><b class="count" data-to="25">25</b><span>study routes</span></div>
          <div><b class="count" data-to="104">104</b><span>essential books</span></div>
          <div><b>0</b><span>inference calls</span></div>
        </div>
        <div class="cta-row">
          <a class="btn btn-ink" href="https://ikusmira.org" target="_blank" rel="noreferrer">ikusmira.org ${out}</a>
          <a class="btn btn-ghost" href="#p/ikusmira">How I built it</a>
        </div>
      </div>

      <div class="arch-visual">${ikusScene()}</div>
    </article>
  </div>
</section>

<section class="docs" id="docs" aria-labelledby="docs-h">
  <div class="wrap">
    <div class="head" data-reveal>
      <span class="eyebrow">Docs</span>
      <h2 id="docs-h">What each project is for, and how to start.</h2>
      <p class="lede">Pick one. Each has real situations it helps with, the commands to get going, and what's under the hood.</p>
    </div>
    ${docsHTML()}
  </div>
</section>

<section class="why" id="why" aria-labelledby="why-h">
  <div class="wrap">
    <span class="eyebrow" id="why-h">Why I build things this way</span>
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
      <h2 id="contact-h">Say hi. I reply.</h2>
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
    <span class="foot-apps">${apps.map((a) => `<a href="${a.href ?? `#app-${a.slug}`}">${a.name}</a>`).join("")}<a href="#bikote">bikote</a><a href="https://gizapedia.org" target="_blank" rel="noreferrer">gizapedia</a><a href="https://ikusmira.org" target="_blank" rel="noreferrer">ikusmira</a></span>
  </div>
</footer>
`;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const vh = () => window.innerHeight;

const canvas = $("#field");
const ctx = canvas.getContext("2d");
const pointer = { x: 0, y: 0, tx: 0, ty: 0, cx: -1e4, cy: -1e4 };
const dust = Array.from({ length: 70 }, (_, i) => ({
  x: (Math.sin(i * 91.7) * 0.5 + 0.5) * 1800 - 900,
  y: (Math.sin(i * 47.3 + 2) * 0.5 + 0.5) * 1500 - 750,
  r: 0.8 + (i % 3) * 0.5,
  hue: homeNodes[i % homeNodes.length].hue,
}));
const words = basqueNames.map((w, i) => ({ ...w, i, glow: 0, sx: 0, sy: 0 }));
let fw = 0;
let fh = 0;
let dpr = 1;
let heroOut = 0;
let hovered = null;
let featured = 0;
let nextFeature = 0;

function sizeField() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  fw = canvas.clientWidth;
  fh = canvas.clientHeight;
  canvas.width = fw * dpr;
  canvas.height = fh * dpr;
}

const SERIF = '"Instrument Serif", Georgia, serif';
const DISPLAY = '"Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif';
const MONO = '"JetBrains Mono", "SF Mono", Menlo, monospace';

function drawField(now) {
  if (heroOut >= 1) return;
  const t = reducedMotion ? 0 : now * 0.00012;
  pointer.x += (pointer.tx - pointer.x) * 0.05;
  pointer.y += (pointer.ty - pointer.y) * 0.05;

  const wide = fw > 900;
  const s = Math.min(fw / (wide ? 2300 : 1500), fh / 1700);
  const k = clamp(fw / 1440, 0.62, 1.1);
  const cx = fw * (wide ? 0.7 : 0.5) - pointer.x * 30;
  const cy = fh * 0.5 - pointer.y * 24;
  const spread = 1 + heroOut * 0.9;

  const at = (n, i) => {
    const wob = reducedMotion ? 0 : 14;
    const x = n.x + Math.sin(t * 7 + i * 1.3) * wob;
    const y = n.y + Math.cos(t * 6 + i * 0.9) * wob;
    return [cx + x * s * spread, cy + y * s * spread];
  };

  if (!hovered && now > nextFeature) {
    featured = (featured + 1 + Math.floor(Math.random() * (words.length - 1))) % words.length;
    nextFeature = now + 3400;
  }
  const active = hovered ?? words[featured];

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

  if (!wide) { ctx.globalAlpha = 1; return; }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const w of words) {
    [w.sx, w.sy] = at(w, w.i * 2.1);
    w.glow += ((w === active ? 1 : 0) - w.glow) * (reducedMotion ? 1 : 0.08);
    const size = (w.big ? 34 : 23) * k;
    ctx.font = `${w.glow > 0.5 ? 700 : 600} ${size}px ${DISPLAY}`;
    ctx.fillStyle = `hsla(${w.hue} ${30 + w.glow * 30}% ${38 - w.glow * 10}% / ${0.22 + w.glow * 0.73})`;
    ctx.fillText(w.word, w.sx, w.sy);
  }

  if (active.glow > 0.02) {
    const a = active.glow;
    const size = (active.big ? 34 : 23) * k;
    const gy = active.sy + size * 0.62 + 14 * k;
    const gx = clamp(active.sx, 120 * k, fw - 120 * k);
    ctx.fillStyle = `hsla(${active.hue} 45% 32% / ${a})`;
    ctx.font = `italic ${21 * k}px ${SERIF}`;
    ctx.fillText(active.gloss, gx, gy);
    ctx.fillStyle = `hsla(220 10% 45% / ${a * 0.9})`;
    ctx.font = `500 ${11 * Math.max(k, 0.9)}px ${MONO}`;
    ctx.fillText(`→ ${active.what}`, gx, gy + 22 * k);
  }
  ctx.globalAlpha = 1;
}

sizeField();
addTask(drawField);

const readWord = $("[data-word]");
const heroEl = $(".hero");
let shown = null;
addTask(() => {
  const w = hovered ?? words[featured];
  if (w === shown || heroOut > 0.6) return;
  shown = w;
  readWord.textContent = `${w.word} · ${w.gloss}`;
});

window.addEventListener("pointermove", (e) => {
  pointer.tx = e.clientX / window.innerWidth - 0.5;
  pointer.ty = e.clientY / window.innerHeight - 0.5;
  if (heroOut > 0.6 || e.pointerType === "touch") return;
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  let best = null;
  let bd = 70;
  for (const w of words) {
    const d = Math.hypot((w.sx - x) * 0.6, w.sy - y);
    if (d < bd) { bd = d; best = w; }
  }
  if (best && e.target.closest("a, button, h1, .lede")) best = null;
  hovered = best;
  heroEl.style.cursor = best ? "pointer" : "";
}, { passive: true });

heroEl.addEventListener("click", (e) => {
  if (!hovered || e.target.closest("a, button")) return;
  const href = hovered.href;
  if (href.startsWith("#p/") || href.startsWith("#docs/")) location.hash = href.slice(1);
  else document.querySelector(href)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: href.startsWith("#app-") ? "center" : "start" });
});

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
initBikote($("[data-bk]"));
initBikoteCases($(".bk-cases"));
initDocs($(".docs-ui"));

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
const wins = $$(".win--stage");
const stageDots = $$("[data-dot]");
const picks = $$("[data-pick]");
const capK = $("[data-cap-k]");
const capN = $("[data-cap-n]");
let activeApp = apps[0].slug;
let appsInView = false;

const tours = new Map(apps.map((a) => {
  const step = $(`#app-${a.slug}`);
  return [a.slug, { slug: a.slug, tour: a.tour, step, items: $$(".tour-i", step), index: 0, elapsed: 0, dur: 0, hold: 0 }];
}));

const frameState = (iframe, state) => {
  const host = iframe.contentDocument?.getElementById("stage-win");
  if (host && host.dataset.state !== state) host.dataset.state = state;
};

function showScene(slug, index) {
  const t = tours.get(slug);
  t.index = index;
  t.elapsed = 0;
  const { state, tag, body } = t.tour[index];
  t.dur = clamp(body.split(" ").length * 240, 5200, 9500);
  t.items.forEach((li, i) => {
    li.classList.toggle("on", i === index);
    li.querySelector(".tour-b").setAttribute("aria-expanded", String(i === index));
    li.querySelector(".tour-bar").style.transform = "scaleX(0)";
  });
  $$(`[data-win="${slug}"] iframe`).forEach((f) => frameState(f, state));
  if (slug === activeApp) caption(t, tag);
}

function caption(t, tag = t.tour[t.index].tag) {
  capK.textContent = tag;
  capN.textContent = `${String(t.index + 1).padStart(2, "0")} / ${String(t.tour.length).padStart(2, "0")}`;
}

for (const t of tours.values()) {
  $$(`[data-win="${t.slug}"] iframe`).forEach((f) => f.addEventListener("load", () => frameState(f, t.tour[t.index].state)));
  t.items.forEach((li, i) => li.querySelector(".tour-b").addEventListener("click", () => showScene(t.slug, i)));
  const tourEl = $(".tour", t.step);
  tourEl.addEventListener("pointerenter", () => { t.hold |= 1; });
  tourEl.addEventListener("pointerleave", () => { t.hold &= ~1; });
  tourEl.addEventListener("focusin", () => { t.hold |= 2; });
  tourEl.addEventListener("focusout", (e) => { if (!tourEl.contains(e.relatedTarget)) t.hold &= ~2; });
  showScene(t.slug, 0);
}

let lastTick = 0;
if (!reducedMotion) addTask((now) => {
  const dt = lastTick ? Math.min(now - lastTick, 100) : 0;
  lastTick = now;
  const t = tours.get(activeApp);
  if (!appsInView || !t || t.hold) return;
  t.elapsed += dt;
  t.items[t.index].querySelector(".tour-bar").style.transform = `scaleX(${Math.min(t.elapsed / t.dur, 1)})`;
  if (t.elapsed >= t.dur) showScene(t.slug, (t.index + 1) % t.tour.length);
});

const setApp = (slug) => {
  activeApp = slug;
  steps.forEach((s) => s.classList.toggle("on", s.dataset.app === slug));
  wins.forEach((w) => w.classList.toggle("on", w.dataset.win === slug));
  stageDots.forEach((d) => d.classList.toggle("on", d.dataset.dot === slug));
  picks.forEach((p) => p.classList.toggle("on", p.dataset.pick === slug));
  stage.dataset.app = slug;
  caption(tours.get(slug));
};
const stepIO = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) setApp(e.target.dataset.app);
}, { rootMargin: "-45% 0px -45% 0px" });
steps.forEach((s) => stepIO.observe(s));
new IntersectionObserver(([e]) => { appsInView = e.isIntersecting; }).observe($(".show"));
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
