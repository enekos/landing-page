// ----------------------------------------------------------------------------
//  The dossier — what you get when you stop moving.
//
//  Every other surface here is a camera problem. This one is a reading problem,
//  so it is a scroll: one column, flat, quiet, tinted with the hue of whatever
//  cluster the project belongs to so it still feels like part of the same space.
//
//  One element, re-rendered per slug. Nine static copies of this markup would
//  all rot separately.
// ----------------------------------------------------------------------------

import { homeNodes } from "./data.js";
import { dossiers, dossierOrder } from "./projects.js";
import { reducedMotion } from "./engine.js";

const BASE_TITLE = document.title;

const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  // textContent throughout: the code samples are full of <, & and ${}.
  if (text != null) node.textContent = text;
  return node;
};

// The field already knows the colour and the cluster of every project; the
// dossier borrows them rather than keeping a second copy that can disagree.
const nodeFor = (slug) => homeNodes.find((n) => n.label === slug);

export function createDossier({ onOpen, onClose }) {
  const root = el("div", "sheet dossier");
  root.id = "dossier";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.hidden = true;

  const inner = el("div", "sheet-inner dossier-inner");
  root.appendChild(inner);
  document.body.appendChild(root);

  let slug = null;

  function section(title) {
    const s = el("section", "dossier-block");
    s.appendChild(el("h2", null, title));
    return s;
  }

  function render(next) {
    const d = dossiers[next];
    if (!d) return false;

    const node = nodeFor(next);
    const hue = node ? node.hue : 220;
    const cluster = node ? node.clusterName : "project";

    slug = next;
    // On the root, not the inner column — the page's own background wash reads
    // it too.
    root.style.setProperty("--hue", hue);
    inner.textContent = "";

    // --- head ---------------------------------------------------------------
    const head = el("header", "sheet-head");
    head.appendChild(el("span", "sheet-title", next));
    head.appendChild(el("span", "sheet-sub", `${cluster} · dossier`));
    const close = el("button", "sheet-close", "✕");
    close.type = "button";
    close.setAttribute("aria-label", "Close dossier");
    close.addEventListener("click", () => hide());
    head.appendChild(close);
    inner.appendChild(head);

    root.setAttribute("aria-label", `${next} — ${d.tagline}`);

    // --- masthead -----------------------------------------------------------
    inner.appendChild(el("p", "dossier-tagline", d.tagline));
    if (d.etym) inner.appendChild(el("p", "dossier-etym", d.etym));

    if (d.meta?.length) {
      const dl = el("dl", "dossier-meta");
      for (const [k, v] of d.meta) {
        dl.appendChild(el("dt", null, k));
        dl.appendChild(el("dd", null, v));
      }
      inner.appendChild(dl);
    }

    // --- links, up top where a visitor from a README will look --------------
    if (d.links?.length) {
      const nav = el("nav", "dossier-links");
      nav.setAttribute("aria-label", "External links");
      for (const l of d.links) {
        const a = el("a", "entry-link", `${l.label} ↗`);
        a.href = l.href;
        a.target = "_blank";
        a.rel = "noreferrer";
        nav.appendChild(a);
      }
      inner.appendChild(nav);
    }

    // --- prose --------------------------------------------------------------
    const what = section("what it is");
    what.appendChild(el("p", "dossier-p", d.what));
    inner.appendChild(what);

    const why = section("why it exists");
    why.appendChild(el("p", "dossier-p", d.why));
    inner.appendChild(why);

    if (d.how?.length) {
      const how = section("how it works");
      const ul = el("ul", "dossier-points");
      for (const [k, v] of d.how) {
        const li = el("li");
        li.appendChild(el("h3", null, k));
        li.appendChild(el("p", null, v));
        ul.appendChild(li);
      }
      how.appendChild(ul);
      inner.appendChild(how);
    }

    if (d.usage) {
      const use = section(d.usage.label || "usage");
      const pre = el("pre", "dossier-code");
      pre.appendChild(el("code", null, d.usage.code));
      use.appendChild(pre);
      inner.appendChild(use);
    }

    // --- neighbours ---------------------------------------------------------
    const near = (d.related || []).filter((r) => dossiers[r]);
    if (near.length) {
      const rel = section("nearby");
      const row = el("div", "dossier-related");
      for (const r of near) {
        const n = nodeFor(r);
        const b = el("button", "dossier-chip", r);
        b.type = "button";
        if (n) b.style.setProperty("--hue", n.hue);
        b.addEventListener("click", () => go(r));
        row.appendChild(b);
      }
      rel.appendChild(row);
      inner.appendChild(rel);
    }

    // --- thread -------------------------------------------------------------
    const i = dossierOrder.indexOf(next);
    const prev = dossierOrder[(i - 1 + dossierOrder.length) % dossierOrder.length];
    const after = dossierOrder[(i + 1) % dossierOrder.length];

    const thread = el("nav", "dossier-thread");
    thread.setAttribute("aria-label", "Other dossiers");
    const step = (target, glyph, side) => {
      const b = el("button", `dossier-step dossier-step--${side}`);
      b.type = "button";
      b.appendChild(el("span", "dossier-step__g", glyph));
      b.appendChild(el("span", "dossier-step__n", target));
      b.addEventListener("click", () => go(target));
      return b;
    };
    thread.appendChild(step(prev, "◂", "prev"));
    thread.appendChild(step(after, "▸", "next"));
    inner.appendChild(thread);

    document.title = `${next} — ${BASE_TITLE}`;
    return true;
  }

  // Navigating between dossiers re-renders in place and scrolls back to the
  // top; it is a new page, not a continuation of the one you were reading.
  function go(next) {
    if (!render(next)) return;
    root.scrollTop = 0;
    onOpen?.(next);
  }

  function show(next) {
    if (!dossiers[next]) return false;
    const wasOpen = !root.hidden;
    if (!render(next)) return false;
    root.scrollTop = 0;
    if (!wasOpen) {
      root.hidden = false;
      requestAnimationFrame(() => root.classList.add("is-open"));
    }
    inner.querySelector(".sheet-close")?.focus();
    return true;
  }

  function hide() {
    if (root.hidden) return;
    root.classList.remove("is-open");
    document.title = BASE_TITLE;
    const done = () => {
      root.hidden = true;
      root.removeEventListener("transitionend", done);
    };
    if (reducedMotion) done();
    else root.addEventListener("transitionend", done);
    const was = slug;
    slug = null;
    onClose?.(was);
  }

  root.addEventListener("click", (e) => { if (e.target === root) hide(); });

  return {
    el: root,
    open: show,
    close: hide,
    isOpen: () => !root.hidden,
    current: () => slug,
  };
}
